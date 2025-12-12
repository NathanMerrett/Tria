from fastapi import APIRouter, Depends
from supabase import Client
from app.core.database import get_supabase_client
from .schemas import PlanRequest, TriathlonPlan, SchedulerConfig
from .services.generate_plan_skeleton import TriathlonPlanGenerator
from .services.generate_workouts import get_engine, BatchWorkoutGenerator
from .repository import PlanRepository

router = APIRouter()

def get_repository(supabase: Client = Depends(get_supabase_client)) -> PlanRepository:
    return PlanRepository(supabase)

@router.post("/generate-plan", response_model=TriathlonPlan)
async def generate_plan(
    request: PlanRequest,
    workout_engine: BatchWorkoutGenerator = Depends(get_engine),
    repository: PlanRepository = Depends(get_repository)
):
    # 1. Create Scheduler Config
    # Default max_doubles to 2 if willing to double, else 0
    max_doubles = 2 if request.willing_to_double else 0
    
    scheduler_config = SchedulerConfig(
        long_run_day=request.long_run_day,
        long_bike_day=request.long_bike_day,
        pool_access_days=request.pool_days,
        training_days=request.train_days,
        allow_doubles=request.willing_to_double,
        max_doubles_per_week=max_doubles
    )

    # 2. Generate Skeleton Plan
    generator = TriathlonPlanGenerator(request, scheduler_config)
    final_plan = generator.build()

    # 3. Generate Detailed Workouts (AI/Mock)
    # This modifies final_plan in-place
    workout_engine.process_plan(final_plan)

    # 4. Save to Supabase
    repository.save_plan(final_plan, request.user_id)

    return final_plan
