from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from langchain_core.messages import HumanMessage
import logging
from app.core.settings import settings
from app.plan_intake_agent import api as plan_intake_agent_api
from app.core.llm import llm

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Execute startup and shutdown logic.
    """
    # --- STARTUP LOGIC ---
    logger.info("🚀 Starting Application...")
    
    # LLM HEALTH CHECK
    try:
        logger.info("Testing LLM Connectivity...")
        # We send a tiny request to verify Auth + API Status
        # This costs a fraction of a cent but ensures we are online.
        await llm.ainvoke([HumanMessage(content="ping")])
        app.state.llm_status = "healthy"
        logger.info("✅ LLM Connectivity: ONLINE")

    except Exception as e:
        app.state.llm_status = "unhealthy"
        logger.error(f"❌ LLM Connectivity: FAILED. Error: {e}")
        # Optional: raise e # Uncomment if you want the app to CRASH if LLM is down
        
    yield # Application runs here
    
    # --- SHUTDOWN LOGIC ---
    logger.info("🛑 Shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan # Register the lifespan
)

# --- HEALTH ENDPOINT ---
@app.get("/health", tags=["health"])
def health(request: Request):
    """
    Returns the health of the API and its dependencies.
    """
    llm_status = getattr(request.app.state, "llm_status", "unknown")
    
    status_code = 200 if llm_status == "healthy" else 503
    
    return {
        "status": "ok" if status_code == 200 else "degraded",
        "components": {
            "llm": llm_status,
            "db": "connected" # You can add Supabase check here later
        }
    }

# Include Routers
app.include_router(
    router=plan_intake_agent_api.router,
    prefix=f"{settings.API_V1_PREFIX}/plan-intake-agent",
    tags=["plan-intake-agent"]
)