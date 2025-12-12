from supabase import create_client, Client
from app.core.settings import settings

# Initialize Supabase client
# Ensure SUPABASE_URL and SUPABASE_KEY are loaded correctly from settings
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_supabase_client() -> Client:
    """
    Returns the initialized Supabase client instance.
    This can be used as a dependency in FastAPI endpoints.
    """
    return supabase