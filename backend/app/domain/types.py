from typing import Literal, TypedDict, Final

RaceType = Literal["sprint", "olympic", "half", "ironman"]
Discipline = Literal["swim", "bike", "run"]
Risk = Literal["green", "amber", "red"]
Phase = Literal["test", "base", "build","peak", "taper"]
Micro = Literal["load", "deload"]
WeekDays = Literal['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
PlanActiveType = Literal ['active','complete','deleted']
