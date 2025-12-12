# app/domain/models.py
from __future__ import annotations
from datetime import date
from typing import List, Literal, Optional, Dict, Mapping
from pydantic import BaseModel, Field, computed_field, field_validator
from uuid import UUID, uuid4
from .types import RaceType, WeekDays, PlanActiveType, Phase, Micro


class Workout(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    date: date
    discipline: Literal["swim", "bike", "run", "brick"]
    # breakdown: dict
    notes: Optional[str] = None

class Week(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    plan_ID: UUID
    index: int                     # 0-based
    start_date: date               # Monday
    phase: Phase
    micro: Micro
    total_load_hours: Optional[float] = 0.0
    total_minutes: int
    minutes_swim: int
    minutes_bike: int
    minutes_run: int

class Plan(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    athlete_id: UUID
    distance: RaceType
    start_date: date
    end_date: date
    weeks: List[Week] = Field(default_factory=list)


class PlanInputs(BaseModel):
    athlete_id: UUID
    distance: RaceType
    raceDate: date
    startDate: date
    longCandidates: Optional[List[WeekDays]] = []
    fitness_experience: int
    swim_ability: int
    bike_ability: int
    run_ability: int
    days_available: dict
    weekend_long_ride_day: str
    double_policy: bool
    has_paces: bool

    # Keep ability inputs in a known range (example 1–10)
    @field_validator("swim_ability", "bike_ability", "run_ability")
    @classmethod
    def ability_range(cls, v: int) -> int:
        if not (1 <= v <= 10):
            raise ValueError("Ability must be in 1..10")
        return v
    
    @field_validator("raceDate")
    @classmethod
    def race_after_start(cls, v, info):
        start = info.data.get("startDate")
        if start and v <= start:
            raise ValueError("raceDate must be after startDate")
        return v
    
    @field_validator("startDate")
    @classmethod
    def start_on_monday(cls, v: date):
        if v.weekday() != 0:
            raise ValueError("startDate must be a Monday")
        return v

    @computed_field
    @property
    def overall_ability(self) -> float:
        return (self.swim_ability + self.bike_ability + self.run_ability) / 3

class AthleteAvailability(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    athlete_id: UUID
    day_availability: Mapping[str, bool]
    double_policy: int
    weekend_long_ride_day: str
