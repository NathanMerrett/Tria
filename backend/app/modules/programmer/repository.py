import json
from typing import List
from supabase import Client
from ..schemas import TriathlonPlan, TrainingWeek, TrainingDay, Workout, DetailedSession

class PlanRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def save_plan(self, plan: TriathlonPlan, user_id: str) -> str:
        """
        Saves the entire plan hierarchy to Supabase.
        Returns the plan_id.
        """
        # 1. Insert Plan
        plan_data = {
            "user_id": user_id,
            "name": plan.name,
            "distance": "olympic", # TODO: Add distance to TriathlonPlan schema or pass it in
            "user_level": plan.user_level,
            
            "status": "active"
        }
        res = self.supabase.table("plans").insert(plan_data).execute()
        plan_id = res.data[0]["id"]

        # 2. Insert Weeks
        for week in plan.weeks:
            week_id = self._save_week(week, plan_id)
            
            # 3. Insert Days
            for day in week.days:
                day_id = self._save_day(day, week_id)
                
                # 4. Insert Workouts
                for workout in day.workouts:
                    self._save_workout(workout, day_id, day.detailed_session)
        
        return plan_id

    def _save_week(self, week: TrainingWeek, plan_id: str) -> str:
        week_data = {
            "plan_id": plan_id,
            "week_number": week.week_number,
            "phase": week.phase,
            "focus": week.focus,
            "total_volume_minutes": week.total_volume_minutes
        }
        res = self.supabase.table("training_weeks").insert(week_data).execute()
        return res.data[0]["id"]

    def _save_day(self, day: TrainingDay, week_id: str) -> str:
        day_data = {
            "week_id": week_id,
            "date": day.date.isoformat(),
            "day_name": day.day_name,
            "is_rest_day": day.is_rest_day
        }
        res = self.supabase.table("training_days").insert(day_data).execute()
        return res.data[0]["id"]

    def _save_workout(self, workout: Workout, day_id: str, detailed_sessions: List[DetailedSession]):
        # Find the detailed session for this workout if it exists
        details = next((s for s in detailed_sessions if s.workout_id == workout.id), None)
        
        structure_json = None
        if details:
            # Convert Pydantic model to dict/json
            structure_json = details.dict() # or .model_dump() in v2

        workout_data = {
            "day_id": day_id,
            "workout_id_ref": workout.id,
            "discipline": workout.discipline,
            "category": workout.category,
            "duration_minutes": workout.duration_minutes,
            "structure": structure_json
        }
        self.supabase.table("workouts").insert(workout_data).execute()
