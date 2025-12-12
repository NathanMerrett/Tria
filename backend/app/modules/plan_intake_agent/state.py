from typing import Annotated, List, Union
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
from app.plan_intake_agent.schemas import UserProfile

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    profile: UserProfile # The building JSON
    errors: List[str]    # Current validation errors to report to user