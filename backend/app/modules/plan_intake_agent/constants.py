from typing import Dict, List, TypedDict

class DistanceRules(TypedDict):
    plan_lengths_weeks: List[int]
    allowed_sessions: List[int]
    min_weeks: int
    max_weeks: int

DISTANCE_CONFIG: Dict[str, DistanceRules] = {
    "sprint": {
        "plan_lengths_weeks": [8, 12, 16],
        "allowed_sessions": [3, 4, 5, 6, 7],
        "min_weeks": 8,
        "max_weeks": 20
    },
    "olympic": {
        "plan_lengths_weeks": [10, 14, 20],
        "allowed_sessions": [4, 5, 6, 7, 8],
        "min_weeks": 10,
        "max_weeks": 24
    },
    "half": {
        "plan_lengths_weeks": [12, 16, 24],
        "allowed_sessions": [5, 6, 7, 8, 9, 10],
        "min_weeks": 12,
        "max_weeks": 28
    },
    "full": {
        "plan_lengths_weeks": [16, 20, 24, 30],
        "allowed_sessions": [6, 7, 8, 9, 10, 11, 12],
        "min_weeks": 16,
        "max_weeks": 32
    }
}