from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    APP_NAME: str = "Tria Planner API"
    API_V1_PREFIX: str = "/api/v1"
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GOOGLE_API_KEY: str
    ANTHROPIC_API_KEY: str | None = None
    OPENAI_API_KEY: str | None = None
    APP_ENV: str = "dev"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
