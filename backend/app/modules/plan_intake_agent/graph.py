from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.plan_intake_agent.state import AgentState
from app.plan_intake_agent.nodes import chatbot_node, validator_node

# --- ROUTING LOGIC ---
def route_chatbot(state: AgentState):
    """If LLM calls a tool, go to validator. Else, stop and wait for user."""
    if state["messages"][-1].tool_calls:
        return "validator"
    return END

# --- GRAPH CONSTRUCTION ---
workflow = StateGraph(AgentState)

workflow.add_node("chatbot", chatbot_node)
workflow.add_node("validator", validator_node)

workflow.set_entry_point("chatbot")

workflow.add_conditional_edges(
    "chatbot",
    route_chatbot,
    {"validator": "validator", END: END}
)

workflow.add_edge("validator", "chatbot")

# Note: We compile this WITHOUT a checkpointer here. 
# The checkpointer is passed in at runtime in the API, 
# or you can initialize a PostgresSaver/MemorySaver here.
memory = MemorySaver()

app_graph = workflow.compile(checkpointer=memory)