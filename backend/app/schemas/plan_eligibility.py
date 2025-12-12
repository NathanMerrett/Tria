# app/readiness/readiness_schemas.py
from __future__ import annotations

from datetime import date, datetime
from math import ceil
from typing import Dict, Literal, Optional, Annotated

from pydantic import BaseModel, Field, model_validator


RaceType = Literal["sprint", "olympic", "half"]

class ReadinessRequest(BaseModel):
    distance: RaceType
    race_date: date
    swim_ability: int
    bike_ability: int
    run_ability: int

class ReadinessResponse(BaseModel):
    status: str
    message: str
    weeks_available: int
    minimum_plan_length: int
    ideal_plan_length: int
    min_plan_start_date: date
    ideal_plan_start_date: date
    suggested_start_date: date
    suggested_start_mode: str
    earliest_start_date: date
    join_week_index: int