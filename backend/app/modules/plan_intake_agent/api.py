from typing import Any, Dict, List
from fastapi import APIRouter
from langchain_core.messages import BaseMessage, HumanMessage
from app.plan_intake_agent.graph import app_graph

router = APIRouter()


def _serialize_tool_calls(tool_calls: Any) -> List[Dict[str, Any]]:
    serialized = []
    if not tool_calls:
        return serialized

    for call in tool_calls:
        if isinstance(call, dict):
            name = call.get("name") or call.get("function", {}).get("name")
            args = call.get("args") or call.get("function", {}).get("arguments")
            call_id = call.get("id")
        else:
            name = getattr(call, "name", None)
            call_id = getattr(call, "id", None)
            args = getattr(call, "args", None) or getattr(call, "arguments", None)

        if not isinstance(args, (dict, list, str, int, float, bool)) and args is not None:
            args = str(args)

        serialized.append({"id": call_id, "name": name, "args": args})
    return serialized


def _extract_validation_events(messages: List[BaseMessage]) -> List[Dict[str, Any]]:
    events = []
    for msg in messages:
        if getattr(msg, "type", None) == "tool":
            content = msg.content if isinstance(msg.content, str) else str(msg.content)
            events.append(
                {
                    "tool_call_id": getattr(msg, "tool_call_id", None),
                    "result": content,
                }
            )
    return events[-5:]

@router.post("/chat")
async def chat_endpoint(user_message: str, thread_id: str):
    # 1. Setup Config
    config = {"configurable": {"thread_id": thread_id}}
    
    # 2. Input
    inputs = {"messages": [HumanMessage(content=user_message)]}
    
    # 3. EXECUTE (The clean way)
    # ainvoke runs the steps and returns the FINAL state dictionary
    final_state = await app_graph.ainvoke(inputs, config=config)
    
    # 4. Extract Data
    # Since final_state IS the state, we can access keys directly
    bot_msg = final_state['messages'][-1].content
    
    # Pydantic objects in State are usually converted to dicts, 
    # or access them directly if they are objects
    profile = final_state.get('profile')
    if hasattr(profile, 'model_dump'):
        profile = profile.model_dump()
    elif hasattr(profile, 'dict'):
        profile = profile.dict()

    debug_payload = {
        "errors": final_state.get("errors") or [],
        "last_tool_calls": _serialize_tool_calls(getattr(final_state["messages"][-1], "tool_calls", [])),
        "validation_events": _extract_validation_events(final_state["messages"]),
    }

    return {
        "response": bot_msg,
        "current_profile": profile,
        "debug": debug_payload,
    }

@router.post("/start")
async def start_conversation(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    
    kickoff = [HumanMessage(content="Introduce yourself and ask for distance.")]
    
    # Run using ainvoke
    final_state = await app_graph.ainvoke({"messages": kickoff}, config=config)
    
    bot_msg = final_state['messages'][-1].content
    
    return {"response": bot_msg, "debug": {"errors": [], "last_tool_calls": [], "validation_events": []}}
