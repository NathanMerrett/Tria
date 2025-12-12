from langchain.chat_models import init_chat_model
from app.core.settings import settings

default_model_name = "gpt-4o-mini"

def get_llm():
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not configured.")

    return init_chat_model(
        model=default_model_name,
        temperature=0,
        api_key=settings.OPENAI_API_KEY,
        max_tokens=1024,
    )

llm = get_llm()
