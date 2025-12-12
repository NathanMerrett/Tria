from pydantic import BaseModel, Field
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Optional, Literal
from datetime import date

# Enums for strict control
class StepType(str, Enum):
    WARMUP = "warmup"
    ACTIVE = "active"
    REST = "rest"
    COOLDOWN = "cooldown"

class TargetType(str, Enum):
    HEART_RATE = "hr_zone"
    POWER = "power_zone"
    PACE = "pace_zone"
    RPE = "rpe"
    NONE = "none"

class DurationType(str, Enum):
    TIME = "time"       # Duration in seconds
    DISTANCE = "distance" # Duration in meters
    OPEN = "open"       # Lap button press


# --- Input Models (Request Body) ---
class PlanRequest(BaseModel):
    user_id: str
    plan_name: str
    distance: Literal["sprint", "olympic", "half", "full"]
    user_level: Literal["beginner", "intermediate", "advanced"]
    total_weeks: int
    long_run_day: str
    long_bike_day: str
    pool_days: List[str]
    train_days: List[str]
    willing_to_double: bool = False

class WorkoutStep(BaseModel):
    step_type: StepType
    
    # Duration Logic
    duration_type: DurationType
    duration_value: int = Field(..., description="Seconds for TIME, Meters for DISTANCE")
    
    # Intensity Logic
    target_type: TargetType
    target_min: Optional[int] = None
    target_max: Optional[int] = None
    description: str = Field(..., description="Short human readable instruction")

# --- The Repeat Logic (Crucial for Watches) ---
class WorkoutBlock(BaseModel):
    repeats: int = Field(default=1, description="How many times to loop these steps")
    steps: List[WorkoutStep]

# --- The Full Session ---
class DetailedSession(BaseModel):
    workout_id: str
    coach_notes: str
    # Instead of a flat list of steps, we have a list of Blocks
    blocks: List[WorkoutBlock] 
    progression_summary: str

class WeeklyBatchResponse(BaseModel):
    sessions: List[DetailedSession]

@dataclass
class Workout:
    id: str
    discipline: str
    category: str
    duration_minutes: int
    intensity: str
    # Added for internal tracking
    type_id: Optional[str] = None
    timings: dict = field(default_factory=dict)

@dataclass
class TrainingDay:
    date: date
    day_name: str
    is_rest_day: bool
    workouts: List[Workout] = field(default_factory=list)
    detailed_session: List[DetailedSession] = field(default_factory=list)

@dataclass
class TrainingWeek:
    week_number: int
    phase: str
    total_volume_minutes: int
    focus: str
    load_type: Optional[str] = None
    days: List[TrainingDay] = field(default_factory=list)
    workouts: List[Workout] = field(default_factory=list)

@dataclass
class TriathlonPlan:
    name: str
    user_level: str
    distance: str
    total_weeks: int
    weeks: List[TrainingWeek] = field(default_factory=list)

@dataclass
class SchedulerConfig:
    long_run_day: str
    long_bike_day: str
    pool_access_days: List[str]
    training_days: List[str]
    allow_doubles: bool
    max_doubles_per_week: int