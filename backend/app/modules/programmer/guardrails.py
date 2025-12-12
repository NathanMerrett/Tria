import os
import json
import logging
from pathlib import Path
from typing import Dict, Any

logger = logging.getLogger(__name__)

# ==========================================
# 1. STATIC CONFIGURATION
# ==========================================

DISTANCE_CONFIG = {
    "sprint": { 
        "allowed_sessions": [3, 4, 5, 6, 7], 
        "min_weeks": 6, "max_weeks": 20, 
        "taper_weeks": 1, 
        "long_run_max_minutes": 75, "long_bike_max_minutes": 120 
    },
    "olympic": { 
        "allowed_sessions": [4, 5, 6, 7, 8], 
        "min_weeks": 8, "max_weeks": 24, 
        "taper_weeks": 2, 
        "long_run_max_minutes": 100, "long_bike_max_minutes": 180 
    },
    "half": { 
        "allowed_sessions": [5, 6, 7, 8, 9, 10], 
        "min_weeks": 10, "max_weeks": 28, 
        "taper_weeks": 2, 
        "long_run_max_minutes": 130, "long_bike_max_minutes": 240 
    },
    "full": { 
        "allowed_sessions": [6, 7, 8, 9, 10, 11, 12], 
        "min_weeks": 16, "max_weeks": 32, 
        "taper_weeks": 3, 
        "long_run_max_minutes": 180, "long_bike_max_minutes": 360 
    }
}

SESSION_DISTRIBUTION = {
    3: (1, 1, 1),
    4: (1, 2, 1), 
    5: (1, 2, 2),
    6: (2, 2, 2), 
    7: (2, 3, 2), 
    8: (3, 3, 2),
    9: (3, 3, 3),
    10: (3, 4, 3)
}

PHASE_FOCUS = {
  "base": {
    "swim": { "order": ["S_TECH", "S_CSS", "S_ENDURANCE"], "filler": "S_TECH" },
    "bike": { "order": ["B_LONG", "B_SWEETSPOT", "B_AEROBIC"], "filler": "B_AEROBIC" },
    "run":  { "order": ["R_LONG", "R_HILLS", "R_BASE"], "filler": "R_BASE" }
  },
  "build": {
    "swim": { "order": ["S_ENDURANCE", "S_SPEED", "S_CSS"], "filler": "S_TECH" },
    "bike": { "order": ["B_LONG", "B_VO2", "B_THRESH"], "filler": "B_AEROBIC" },
    "run":  { "order": ["R_LONG", "R_INTERVAL", "R_TEMPO"], "filler": "R_BASE" }
  },
  "peak": {
    "swim": { "order": ["S_ENDURANCE", "S_CSS", "S_SPEED"], "filler": "S_TECH" },
    "bike": { "order": ["B_LONG", "B_THRESH", "B_AEROBIC"], "filler": "B_RECOVERY" },
    "run":  { "order": ["R_LONG", "R_TEMPO", "R_BASE"], "filler": "R_BASE" }
  },
  "taper": {
    "swim": { "order": ["S_TAPER", "S_SPEED", "S_ENDURANCE"], "filler": "S_TECH" },
    "bike": { "order": ["B_TAPER", "B_THRESH", "B_AEROBIC"], "filler": "B_RECOVERY" },
    "run":  { "order": ["R_TAPER", "R_INTERVAL", "R_BASE"], "filler": "R_BASE" }
  },
  "race_week": {
    "swim": { "order": ["S_RACE_PREP", "S_TECH"], "filler": "S_TECH" },
    "bike": { "order": ["B_RACE_PREP", "B_RECOVERY"], "filler": "B_RECOVERY" },
    "run":  { "order": ["R_SHAKEOUT", "R_BASE"], "filler": "R_SHAKEOUT" }
  }
}

VOLUME_GUIDELINES = {
    "sprint": { "beginner": (180, 300), "intermediate": (240, 420), "advanced": (300, 540) },
    "olympic": { "beginner": (240, 420), "intermediate": (360, 600), "advanced": (480, 720) },
    "half": { "beginner": (360, 600), "intermediate": (480, 720), "advanced": (600, 900) },
    "full": { "beginner": (480, 840), "intermediate": (600, 960), "advanced": (720, 1200) }
}

SESSION_CONSTRAINTS = {
    "sprint": { "taper_weeks": 1, "run":  { "ramp": (30, 60),   "cap": 75 }, "bike": { "ramp": (60, 90),   "cap": 120 }, "swim": { "ramp": (30, 45),   "cap": 60 } },
    "olympic": { "taper_weeks": 2, "run":  { "ramp": (45, 90),   "cap": 105 }, "bike": { "ramp": (90, 150),  "cap": 180 }, "swim": { "ramp": (45, 60),   "cap": 75 } },
    "half": { "taper_weeks": 2, "run":  { "ramp": (60, 135),  "cap": 150 }, "bike": { "ramp": (120, 240), "cap": 270 }, "swim": { "ramp": (45, 80),   "cap": 90 } },
    "full": { "taper_weeks": 3, "run":  { "ramp": (90, 150),  "cap": 180 }, "bike": { "ramp": (180, 330), "cap": 360 }, "swim": { "ramp": (60, 90),   "cap": 105 } }
}

# ==========================================
# 2. DATA LOADING (WORKOUT LIBRARY)
# ==========================================

WORKOUT_LIBRARY: Dict[str, Any] = {}

# Minimal fallback in case file is missing
DEFAULT_LIBRARY = {
  "swim": {
    "S_TECH": { "name": "Technique", "intensity": "recovery", "desc": "Focus on form." },
    "S_ENDURANCE": { "name": "Endurance", "intensity": "aerobic", "desc": "Continuous swim." },
    "S_CSS": { "name": "CSS Intervals", "intensity": "hard", "desc": "Pace work." }
  },
  "bike": {
    "B_LONG": { "name": "Long Ride", "intensity": "aerobic", "desc": "Z2 Duration." },
    "B_AEROBIC": { "name": "Aerobic", "intensity": "support", "desc": "Z2 General." },
    "B_SWEETSPOT": { "name": "Sweet Spot", "intensity": "hard", "desc": "88-93% FTP." }
  },
  "run": {
    "R_LONG": { "name": "Long Run", "intensity": "aerobic", "desc": "Z2 Duration." },
    "R_BASE": { "name": "Base Run", "intensity": "support", "desc": "Easy Z1/Z2." },
    "R_TEMPO": { "name": "Tempo", "intensity": "hard", "desc": "Z3 Sustained." }
  }
}

def load_workout_library():
    """
    Attempts to load the workout library from app/data/workout_library.json
    """
    global WORKOUT_LIBRARY
    
    # We look for the 'app' folder starting from the current execution directory
    base_dir = Path(os.getcwd())
    
    # Target Path: {Current Working Directory}/app/data/workout_library.json
    target_path = base_dir / "app" / "data" / "workout_library.json"

    if target_path.exists():
        try:
            with open(target_path, "r") as f:
                data = json.load(f)
                WORKOUT_LIBRARY.update(data)
                # logger.info(f"✅ Loaded workout library from {target_path}")
                print(f"✅ Loaded workout library from {target_path}")
        except Exception as e:
            # logger.error(f"❌ Error reading JSON: {e}")
            print(f"❌ Error reading JSON: {e}")
            WORKOUT_LIBRARY.update(DEFAULT_LIBRARY)
    else:
        # Warning: File not found
        # logger.warning(f"⚠️  Library not found at {target_path}. Using defaults.")
        print(f"⚠️  Library not found at {target_path}. Using defaults.")
        WORKOUT_LIBRARY.update(DEFAULT_LIBRARY)

# Initialize on import
load_workout_library()