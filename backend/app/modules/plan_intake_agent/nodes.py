# app/agent/nodes.py
from langchain_core.messages import ToolMessage, SystemMessage
from app.plan_intake_agent.state import AgentState
from app.plan_intake_agent.schemas import UserProfile
from app.plan_intake_agent.tools import update_user_profile
from app.plan_intake_agent.constants import DISTANCE_CONFIG
from app.core.llm import llm


async def chatbot_node(state: AgentState):
    profile = state.get("profile", UserProfile())
    errors = state.get("errors", [])
    
    # 1. Base Persona
    system_msg = "You are an expert Triathlon Coach."

    # 2. Dynamic Rule Injection
    # If we know the distance, we give the LLM the cheat sheet.
    if profile.distance and profile.distance in DISTANCE_CONFIG:
        rules = DISTANCE_CONFIG[profile.distance]
        system_msg += f"""
        \nCURRENT CONTEXT:
        - Distance: {profile.distance.upper()}
        - Allowed Sessions: {rules['allowed_sessions']}
        - Min Prep Time: {rules['min_weeks']} weeks
        
        INSTRUCTION:
        - Use these rules to check user input BEFORE calling the tool if possible.
        - If the user gives invalid input, explain the rule politely.
        - If input seems valid, call 'UserProfile' to save it.
        """
    else:
        # If no distance, this is the priority
        system_msg += "\nPRIORITY: Ask the user to select a distance (Sprint, Olympic, Half, Full)."

    # 3. Error Handling
    if errors:
        system_msg += f"\nSYSTEM ALERT: The last update failed. Errors: {errors}"

    # 4. Execution
    # We prepend the system message to the history
    llm_with_tools = llm.bind_tools([UserProfile])

    messages = [SystemMessage(content=system_msg)] + state["messages"]
    
    response = await llm_with_tools.ainvoke(messages)
    return {"messages": [response]}


# --- NODE 2: VALIDATOR ---
def validator_node(state: AgentState):
    last_message = state["messages"][-1]
    tool_calls = last_message.tool_calls
    
    current_profile = state.get("profile", UserProfile())
    tool_outputs = []
    
    # Helper to handle logic execution
    for tool_call in tool_calls:
        if tool_call["name"] == "UserProfile":
            
            # Execute Tool Logic
            result = update_user_profile(tool_call["args"], current_profile)
            
            # Update Local Variables
            current_profile = result["profile"]
            
            # Create the "Tool Output" message for the LLM
            # This tells the LLM "Here is what happened when you tried to save"
            tool_outputs.append(
                ToolMessage(
                    content=result["tool_result"],
                    tool_call_id=tool_call["id"]
                )
            )
            
            # Update global errors if any
            errors = result["errors"]

    return {
        "messages": tool_outputs,
        "profile": current_profile,
        "errors": errors
    }
