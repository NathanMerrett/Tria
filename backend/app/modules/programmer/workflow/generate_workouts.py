import os
import re
from typing import List, Dict, Optional
from ..schemas import (
    WeeklyBatchResponse, DetailedSession, WorkoutStep, WorkoutBlock, 
    StepType, DurationType, TargetType, TriathlonPlan, Workout
)
from .generate_plan_skeleton import WORKOUT_TYPES, PHASE_FOCUS
from langchain.chat_models import init_chat_model
from app.core.settings import settings

class ProgressionState:
    def __init__(self):
        # Maps "WORKOUT_TYPE_ID" -> "Last Main Set Summary"
        self.history = {}

    def get_context(self, type_id: str) -> str:
        return self.history.get(type_id, None)

    def update(self, type_id: str, summary: str):
        self.history[type_id] = summary
        
    def reset(self):
        self.history = {}

class BatchWorkoutGenerator:
    def __init__(self, mode: str = "dev"):
        self.mode = mode
        self.types = WORKOUT_TYPES
        self.phases = PHASE_FOCUS
        self.tracker = ProgressionState()
        
        # Define which sessions are "Key" (Worth spending LLM tokens on)
        self.key_sessions = [
            "S_CSS", "S_SPEED", 
            "B_SWEETSPOT", "B_VO2", "B_THRESH", "B_CLIMB",
            "R_TEMPO", "R_HILLS", "R_INTERVAL"
        ]

        # Initialize Real LLM only if needed
        if self.mode == "prod":
            self.llm = init_chat_model(
                model="gpt-4o-mini",
                temperature=0.2,
                api_key=os.getenv("OPENAI_API_KEY"),
            ).with_structured_output(WeeklyBatchResponse)

    def process_plan(self, plan: TriathlonPlan):
        print(f"⚡ Generating detailed workouts for {plan.name}...")
        
        for week in plan.weeks:
            # 1. Identify Workouts
            week_payload = []
            
            for day in week.days:
                if day.is_rest_day or not day.workouts:
                    continue
                
                for workout in day.workouts:
                    # Map the generic scheduler object to a specific Type ID (e.g. R_INTERVAL)
                    type_id = self._infer_type_id(workout, week.phase)
                    
                    # Store this ID on the workout object for later reference
                    workout.type_id = type_id 
                    
                    # Calculate Timings (Sandwich Logic)
                    wu, main, cd = self._calc_timings(workout.duration_minutes)
                    workout.timings = {"wu": wu, "main": main, "cd": cd}

                    # Decide: Template or AI?
                    if type_id in self.key_sessions:
                        # Prepare context for batching
                        context = self.tracker.get_context(type_id)
                        week_payload.append({
                            "id": workout.id, # Using the unique ID like 'run_interval_01'
                            "type_id": type_id,
                            "discipline": workout.discipline,
                            "duration_total": workout.duration_minutes,
                            "duration_main": main,
                            "history": context
                        })
                    else:
                        # Apply Static Template immediately
                        if not day.detailed_session:
                            day.detailed_session = []
                        day.detailed_session.append(self._create_template(workout, type_id))

            # 2. Batch Call to LLM (if there are key sessions)
            if week_payload:
                print(f"   > Week {week.week_number}: Batching {len(week_payload)} key sessions...")
                batch_results = self._generate_batch(week_payload, week.phase, week.week_number)
                
                # 3. Map results back to days
                self._distribute_results(week, batch_results)

    def _infer_type_id(self, workout: Workout, phase: str) -> str:
        """Guess the WORKOUT_TYPE key based on phase and category."""
        disc = workout.discipline
        cat = workout.category.lower()
        
        # Try to look up in the PHASE_FOCUS map first
        phase_rules = self.phases.get(phase.lower(), {}).get(disc, {})
        # order = phase_rules.get("order", []) # Not used here but good to know
        
        # Heuristics
        if "long" in cat: return f"{disc[0].upper()}_LONG"
        if "recovery" in cat: return f"{disc[0].upper()}_TECH" if disc == "swim" else f"{disc[0].upper()}_RECOVERY"
        
        # Intensity mapping
        if disc == "run":
            if "interval" in cat or "very_hard" in cat: return "R_INTERVAL"
            if "tempo" in cat or "hard" in cat: return "R_TEMPO"
            return "R_BASE"
        elif disc == "bike":
            if "interval" in cat or "very_hard" in cat: return "B_VO2"
            if "hard" in cat: return "B_SWEETSPOT"
            return "B_AEROBIC"
        elif disc == "swim":
            if "hard" in cat: return "S_CSS"
            return "S_ENDURANCE"
            
        return "UNKNOWN"

    def _calc_timings(self, total_mins):
        """Standardizes Warmup/Cooldown to ensure math works."""
        if total_mins < 40: return 5, total_mins - 10, 5
        wu = 15 if total_mins >= 60 else 10
        cd = 10 if total_mins >= 60 else 5
        return wu, total_mins - (wu + cd), cd

    def _generate_batch(self, payload: list, phase: str, week_num: int) -> WeeklyBatchResponse:
        if self.mode == "dev":
            return self._generate_mock(payload)
            
        # Convert payload to a string prompt
        tasks_str = ""
        for item in payload:
            hist_str = f"(Last time: {item['history']})" if item['history'] else "(First session of block)"
            tasks_str += f"""
            - ID: {item['id']}
              Type: {self.types[item['discipline']].get(item['type_id'], {}).get('name', item['type_id'])}
              Main Set Duration: {item['duration_main']} minutes (EXACTLY)
              Context: {hist_str}
            """
            
        prompt = f"""
        Act as an elite Triathlon Coach. Create the MAIN SET details for these sessions in Week {week_num} ({phase} Phase).
        
        Sessions to generate:
        {tasks_str}
        
        Rules:
        1. Only generate the intervals for the 'Main Set'. Warmup/Cooldown is handled separately.
        2. Strict Adherence: The 'Main Set' steps must sum up to the duration provided.
        3. Progression: If context is provided, slightly progress the difficulty (volume or intensity).
        4. Return a list of sessions matching the IDs provided.
        5. IMPORTANT: Use the structured format provided. 
           - For 'step_type', use 'active' for work intervals and 'rest' for rest intervals.
           - For 'duration_type', use 'time' (seconds) or 'distance' (meters).
           - For 'target_type', use 'hr_zone', 'power_zone', 'pace_zone', or 'rpe'.
           - For 'target_value', use simple numbers (e.g. "2" for Z2) or ranges ("200-220").
        """
        
        try:
            return self.llm.invoke(prompt)
        except Exception as e:
            print(f"LLM Error: {e}")
            return self._generate_mock(payload)

    def _generate_mock(self, payload: List[Dict]) -> WeeklyBatchResponse:
        sessions = []
        for item in payload:
            # Create a "Mock" session
            # Mocking a simple main set: 1 block with 1 step
            main_block = WorkoutBlock(
                repeats=1,
                steps=[
                    WorkoutStep(
                        step_type=StepType.ACTIVE,
                        duration_type=DurationType.TIME,
                        duration_value=item['duration_main'] * 60,
                        target_type=TargetType.RPE,
                        target_value="7",
                        description=f"Mock Interval for {item['type_id']}"
                    )
                ]
            )
            
            sessions.append(DetailedSession(
                workout_id=item['id'],
                coach_notes="[DEV MODE] Focus on consistency.",
                blocks=[main_block],
                progression_summary=f"Mock completion of {item['type_id']}"
            ))
        return WeeklyBatchResponse(sessions=sessions)

    def _distribute_results(self, week, batch_response: WeeklyBatchResponse):
        # Create a lookup map
        result_map = {s.workout_id: s for s in batch_response.sessions}
        
        for day in week.days:
            if not day.workouts: continue
            
            # Ensure list exists
            if not day.detailed_session: day.detailed_session = []
            
            for w in day.workouts:
                if w.id in result_map:
                    # 1. Get AI Result
                    ai_res = result_map[w.id]
                    
                    # 2. Update Progression Tracker
                    self.tracker.update(w.type_id, ai_res.progression_summary)
                    
                    # 3. Assemble Sandwich (Python WU + AI Main + Python CD)
                    full_blocks = []
                    
                    # Warmup Block
                    full_blocks.append(WorkoutBlock(
                        repeats=1,
                        steps=[WorkoutStep(
                            step_type=StepType.WARMUP,
                            duration_type=DurationType.TIME,
                            duration_value=w.timings['wu'] * 60,
                            target_type=TargetType.HEART_RATE,
                            target_value="1",
                            description="Gradual build Z1-Z2"
                        )]
                    ))
                    
                    # Main Set (AI) - AI returns a DetailedSession which has 'blocks'
                    # We take those blocks and add them
                    full_blocks.extend(ai_res.blocks)
                    
                    # Cooldown Block
                    full_blocks.append(WorkoutBlock(
                        repeats=1,
                        steps=[WorkoutStep(
                            step_type=StepType.COOLDOWN,
                            duration_type=DurationType.TIME,
                            duration_value=w.timings['cd'] * 60,
                            target_type=TargetType.HEART_RATE,
                            target_value="1",
                            description="Easy spin/jog"
                        )]
                    ))
                    
                    # 4. Attach
                    day.detailed_session.append(DetailedSession(
                        workout_id=w.id,
                        coach_notes=ai_res.coach_notes,
                        blocks=full_blocks,
                        progression_summary=ai_res.progression_summary
                    ))

    def _create_template(self, w: Workout, type_id: str):
        """Zero-cost template for easy sessions."""
        type_def = self.types[w.discipline].get(type_id, {"name": "Aerobic"})
        
        blocks = [
            # Warmup
            WorkoutBlock(repeats=1, steps=[
                WorkoutStep(step_type=StepType.WARMUP, duration_type=DurationType.TIME, duration_value=w.timings['wu']*60, target_type=TargetType.HEART_RATE, target_value="1", description="Easy start")
            ]),
            # Main
            WorkoutBlock(repeats=1, steps=[
                WorkoutStep(step_type=StepType.ACTIVE, duration_type=DurationType.TIME, duration_value=w.timings['main']*60, target_type=TargetType.HEART_RATE, target_value="2", description=f"Steady aerobic effort. {type_def.get('desc','')}")
            ]),
            # Cooldown
            WorkoutBlock(repeats=1, steps=[
                WorkoutStep(step_type=StepType.COOLDOWN, duration_type=DurationType.TIME, duration_value=w.timings['cd']*60, target_type=TargetType.HEART_RATE, target_value="1", description="Relax")
            ])
        ]
        
        return DetailedSession(
            workout_id=w.id,
            coach_notes=f"Focus on form and consistency.",
            blocks=blocks,
            progression_summary="Aerobic Maintenance"
        )

# Dependency Injection Helper
def get_engine():
    env = settings.APP_ENV
    return BatchWorkoutGenerator(mode=env)