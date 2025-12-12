from pydantic import BaseModel, Field
from typing import Optional, Dict, Literal

ValidDistance = Literal["sprint", "olympic", "half", "full"]

class DisciplineSplits(BaseModel):
    swim: int
    bike: int
    run: int

class UserProfile(BaseModel):
    distance: Optional[ValidDistance] = Field(None, description="The triathlon distance (sprint, olympic, half, full)")
    race_date: Optional[str] = Field(None, description="The date of the race in DD-MM-YYYY format.")
    sessions_per_week: Optional[int] = Field(None, description="How many days per week the user can train.")
    # splits: Optional[DisciplineSplits] = None
    is_complete: bool = Field(False, description="Set to True only when all fields are valid and confirmed.")