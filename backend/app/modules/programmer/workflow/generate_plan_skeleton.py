from typing import List, Dict, Optional
from datetime import date, timedelta
from ..schemas import (
    Workout, TrainingDay, TrainingWeek, TriathlonPlan, SchedulerConfig, PlanRequest
)

# --- CONFIGURATION CONSTANTS (From Notebook) ---

DISTANCE_CONFIG = {
    "sprint": { "allowed_sessions": [3, 4, 5, 6, 7], "min_weeks": 6, "max_weeks": 20, "taper_weeks": 1, "long_run_max_minutes": 75, "long_bike_max_minutes": 120 },
    "olympic": { "allowed_sessions": [4, 5, 6, 7, 8], "min_weeks": 8, "max_weeks": 24, "taper_weeks": 2, "long_run_max_minutes": 100, "long_bike_max_minutes": 180 },
    "half": { "allowed_sessions": [5, 6, 7, 8, 9, 10], "min_weeks": 10, "max_weeks": 28, "taper_weeks": 2, "long_run_max_minutes": 130, "long_bike_max_minutes": 240 },
    "full": { "allowed_sessions": [6, 7, 8, 9, 10, 11, 12], "min_weeks": 16, "max_weeks": 32, "taper_weeks": 3, "long_run_max_minutes": 180, "long_bike_max_minutes": 360 }
}

WORKOUT_TYPES = {
  "swim": {
    "S_TECH": { "name": "Technique Drill", "intensity": "recovery", "desc": "Focus on form, drills, short dist." },
    "S_ENDURANCE": { "name": "Endurance Swim", "intensity": "aerobic", "desc": "Continuous swimming, moderate effort." },
    "S_CSS": { "name": "CSS Threshold", "intensity": "hard", "desc": "Intervals at Critical Swim Speed." },
    "S_SPEED": { "name": "Speed/Sprint", "intensity": "very_hard", "desc": "Short, max effort sprints." },
    "S_TAPER": { "name": "Taper Swim", "intensity": "moderate", "desc": "Short intervals to keep feel for water." },
    "S_RACE_PREP": { "name": "Race Prep Swim", "intensity": "moderate", "desc": "Openers and sighting practice." },
    "S_RECOVERY": { "name": "Recovery Swim", "intensity": "recovery", "desc": "Easy swimming." }
  },
  "bike": {
    "B_LONG": { "name": "Long Ride", "intensity": "aerobic", "desc": "Zone 2, duration focus." },
    "B_AEROBIC": { "name": "Aerobic Maintenance", "intensity": "support", "desc": "Standard Z2 ride." },
    "B_SWEETSPOT": { "name": "Sweet Spot", "intensity": "hard", "desc": "Intervals at 88-93% FTP." },
    "B_VO2": { "name": "VO2 Max", "intensity": "very_hard", "desc": "Intervals > 105% FTP." },
    "B_THRESH": { "name": "Threshold", "intensity": "hard", "desc": "Intervals at 100% FTP." },
    "B_RECOVERY": { "name": "Spin Out", "intensity": "recovery", "desc": "Z1 active recovery." },
    "B_TAPER": { "name": "Taper Ride", "intensity": "moderate", "desc": "Short duration, some intensity." },
    "B_RACE_PREP": { "name": "Race Prep Ride", "intensity": "moderate", "desc": "Gear check and openers." },
    "B_CLIMB": { "name": "Hill Repeats", "intensity": "hard", "desc": "Low cadence strength work." }
  },
  "run": {
    "R_LONG": { "name": "Long Run", "intensity": "aerobic", "desc": "Z2, time on feet." },
    "R_BASE": { "name": "Base Run", "intensity": "support", "desc": "Short, easy aerobic run." },
    "R_TEMPO": { "name": "Tempo Run", "intensity": "hard", "desc": "Sustained Z3 effort." },
    "R_HILLS": { "name": "Hill Reps", "intensity": "hard", "desc": "Strength endurance on inclines." },
    "R_INTERVAL": { "name": "Speedwork", "intensity": "very_hard", "desc": "Track or fast intervals." },
    "R_TAPER": { "name": "Taper Run", "intensity": "moderate", "desc": "Reduce volume, keep snap." },
    "R_SHAKEOUT": { "name": "Shakeout Run", "intensity": "recovery", "desc": "Very short, easy jog." },
    "R_RECOVERY": { "name": "Recovery Run", "intensity": "recovery", "desc": "Z1 jog." }
  }
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
    # Week before race week: Keep intensity (intervals), drop the long endurance stuff
    "swim": { "order": ["S_TAPER", "S_SPEED", "S_ENDURANCE"], "filler": "S_TECH" },
    "bike": { "order": ["B_TAPER", "B_THRESH", "B_AEROBIC"], "filler": "B_RECOVERY" },
    "run":  { "order": ["R_TAPER", "R_INTERVAL", "R_BASE"], "filler": "R_BASE" }
  },
  "race_week": {
    # The final 7 days: Specific openers and shakeouts only
    "swim": { "order": ["S_RACE_PREP", "S_TECH"], "filler": "S_TECH" },
    "bike": { "order": ["B_RACE_PREP", "B_RECOVERY"], "filler": "B_RECOVERY" },
    "run":  { "order": ["R_SHAKEOUT", "R_BASE"], "filler": "R_SHAKEOUT" }
  }
}

SESSION_DISTRIBUTION = {
    3: (1, 1, 1),
    4: (1, 2, 1), # Bike bias
    5: (1, 2, 2),
    6: (2, 2, 2), # Balanced
    7: (2, 3, 2), # Bike focus
    8: (3, 3, 2),
    9: (3, 3, 3),
    10: (3, 4, 3)
}

VOLUME_GUIDELINES = {
    "sprint": {
        "beginner": (180, 300), "intermediate": (240, 420), "advanced": (300, 540)
    },
    "olympic": {
        "beginner": (240, 420), "intermediate": (360, 600), "advanced": (480, 720)
    },
    "half": {
        "beginner": (360, 600), "intermediate": (480, 720), "advanced": (600, 900)
    },
    "full": {
        "beginner": (480, 840), "intermediate": (600, 960), "advanced": (720, 1200)
    }
}

DISCIPLINE_SPLIT = { "swim": 0.20, "bike": 0.50, "run":  0.30 }

SESSION_CONSTRAINTS = {
    "sprint": {
        "taper_weeks": 1,
        "run":  { "ramp": (30, 60),   "cap": 75,  "max_ratio": 0.30 },
        "bike": { "ramp": (60, 90),   "cap": 120, "max_ratio": 0.45 },
        "swim": { "ramp": (30, 45),   "cap": 60,  "max_ratio": 0.25 }
    },
    "olympic": {
        "taper_weeks": 2,
        "run":  { "ramp": (45, 90),   "cap": 105, "max_ratio": 0.30 },
        "bike": { "ramp": (90, 150),  "cap": 180, "max_ratio": 0.50 },
        "swim": { "ramp": (45, 60),   "cap": 75,  "max_ratio": 0.25 }
    },
    "half": {
        "taper_weeks": 2,
        "run":  { "ramp": (60, 135),  "cap": 150, "max_ratio": 0.35 },
        "bike": { "ramp": (120, 240), "cap": 270, "max_ratio": 0.50 },
        "swim": { "ramp": (45, 80),   "cap": 90,  "max_ratio": 0.20 }
    },
    "full": {
        "taper_weeks": 3,
        "run":  { "ramp": (90, 150),  "cap": 180, "max_ratio": 0.30 },
        "bike": { "ramp": (180, 330), "cap": 360, "max_ratio": 0.55 },
        "swim": { "ramp": (60, 90),   "cap": 105, "max_ratio": 0.15 }
    }
}

# --- CLASSES ---

class WeeklyScheduler:
    def __init__(self, config: SchedulerConfig):
        self.cfg = config
        self.days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    def schedule(self, week_obj: TrainingWeek, workouts: List[Workout]) -> TrainingWeek:
        """
        Main entry point. Maps a list of workouts to specific days based on config.
        """
        # 1. Initialize Empty Week (Mark Rest Days)
        week_map = self._init_week_map()
        
        # 2. Sort Workouts by Scheduling Difficulty
        # (Anchors First -> Swims -> Others)
        workouts.sort(key=self._get_priority, reverse=True)

        # 3. Placement Loop
        doubles_used = 0
        
        for workout in workouts:
            placed = False
            
            # --- STRATEGY 1: Fixed Anchors ---
            if self._is_anchor(workout):
                target_day = self._get_anchor_target(workout)
                # Force placement (overrides rest day preference if necessary)
                self._place_workout(week_map, target_day, workout, force=True)
                placed = True
                
            # --- STRATEGY 2: Variable Placement ---
            else:
                # Get valid candidates based on constraints
                candidate_days = self._get_candidate_days(workout, week_map)
                
                # Sub-strategy A: Find an EMPTY slot first
                for day in candidate_days:
                    if len(week_map[day].workouts) == 0:
                        self._place_workout(week_map, day, workout)
                        placed = True
                        break
                
                # Sub-strategy B: Find a DOUBLE slot (if allowed)
                if not placed and self.cfg.allow_doubles and doubles_used < self.cfg.max_doubles_per_week:
                    for day in candidate_days:
                        if self._can_double_up(week_map[day], workout):
                            self._place_workout(week_map, day, workout)
                            doubles_used += 1
                            placed = True
                            break

            if not placed:
                print(f"WARNING: Could not schedule {workout.id} ({workout.discipline}). Constraints too tight.")

        for day_name in self.days_order:
            day_obj = week_map[day_name]
            # True if empty, False if has workouts
            day_obj.is_rest_day = (len(day_obj.workouts) == 0)

        # 4. Finalize
        week_obj.days = list(week_map.values())
        return week_obj

    # -------------------------------------------------------------------------
    # Helper Logic
    # -------------------------------------------------------------------------

    def _init_week_map(self) -> Dict[str, TrainingDay]:
        """Creates the 7-day bucket, marking days as Rest based on user input."""
        week_map = {}
        for d in self.days_order:
            # If day is NOT in user's training_days list, it's a rest day.            
            week_map[d] = TrainingDay(
                date=date.today(), # Placeholder, will be updated by caller or later
                day_name=d,
                is_rest_day=False,
                workouts=[]
            )
        return week_map

    def _get_priority(self, w: Workout) -> int:
        """Higher number = Needs to be scheduled earlier."""
        if self._is_anchor(w): return 3   # Highest: Fixed day
        if w.discipline == "swim": return 2 # Medium: Pool constraint
        return 1                          # Low: Flexible

    def _is_anchor(self, w: Workout) -> bool:
        """Checks if workout is a Long Run or Long Bike."""
        return "LONG" in w.id

    def _get_anchor_target(self, w: Workout) -> str:
        if w.discipline == "run": return self.cfg.long_run_day
        if w.discipline == "bike": return self.cfg.long_bike_day
        return "Monday" # Should not happen

    def _get_candidate_days(self, w: Workout, week_map: Dict) -> List[str]:
        """Returns list of day names where this workout is ALLOWED to go."""
        candidates = []
        
        # 1. Filter by Pool Access
        possible_days = self.days_order
        if w.discipline == "swim":
            possible_days = [d for d in possible_days if d in self.cfg.pool_access_days]
            
        # 2. Filter by Rest Days (User Preference)
        # Note: We already handled Anchors, so here we respect rest days.
        for day in possible_days:
            if day in self.cfg.training_days:
                candidates.append(day)
                
        return candidates

    def _can_double_up(self, day_obj: TrainingDay, new_workout: Workout) -> bool:
        """Rules for valid double days."""
        current_load = len(day_obj.workouts)
        
        # Rule 1: Slot must exist (0 or 1 sessions currently)
        if current_load >= 2:
            return False
            
        # Rule 2: Don't double the same discipline (e.g. No Run + Run)
        # (Unless you want to allow that, but usually it's distinct sports)
        for existing in day_obj.workouts:
            if existing.discipline == new_workout.discipline:
                return False
                
        return True

    def _place_workout(self, week_map, day_name, workout, force=False):
        """Actually appends the workout to the day."""
        day_obj = week_map[day_name]
        
        # If forcing (Anchor), we define it as NOT a rest day anymore
        if force and day_obj.is_rest_day:
            day_obj.is_rest_day = False
            
        day_obj.workouts.append(workout)


class VolumeManager:
    def __init__(self, user_inputs: PlanRequest):
        self.level = user_inputs.user_level.lower()
        self.distance = user_inputs.distance.lower()
        self.total_weeks = user_inputs.total_weeks
        
        # Load Configs
        guidelines = VOLUME_GUIDELINES.get(self.distance, {}).get(self.level, (240, 480))
        self.start_min = guidelines[0]
        self.peak_min = guidelines[1]
        
        self.constraints = SESSION_CONSTRAINTS.get(self.distance, SESSION_CONSTRAINTS["half"])
        self.taper_weeks = self.constraints.get("taper_weeks", 2)
        self.peak_week_num = self.total_weeks - self.taper_weeks

    def apply_volume(self, week: TrainingWeek):
        # 1. Calculate Load & Determine Type
        weekly_total_min, load_type = self._calculate_load(week.week_number)
        
        # 2. Tag the week (Source of Truth for Display)
        week.total_volume_minutes = int(weekly_total_min)
        week.load_type = load_type 

        # 3. Standard Distribution...
        splits = DISCIPLINE_SPLIT  
        vol_swim = int(weekly_total_min * splits["swim"])
        vol_bike = int(weekly_total_min * splits["bike"])
        vol_run  = int(weekly_total_min * splits["run"])

        self._fill_discipline_bucket(week, "swim", vol_swim)
        self._fill_discipline_bucket(week, "bike", vol_bike)
        self._fill_discipline_bucket(week, "run",  vol_run)

    def _calculate_load(self, week_num):
        """
        Returns tuple: (minutes, load_type)
        """
        # A. RACE & TAPER
        weeks_remaining = self.total_weeks - week_num
        
        if weeks_remaining == 0: 
            return self.peak_min * 0.40, "Race Week"
            
        if weeks_remaining < self.taper_weeks:
            taper_progress = (self.taper_weeks - weeks_remaining) / self.taper_weeks
            drop_factor = 0.85 - (0.25 * taper_progress)
            return self.peak_min * drop_factor, "Taper"

        # B. CALCULATE BASE LINEAR LOAD
        # We only apply "Periodization" (Ups and Downs) during the Ramp.
        # Before the ramp (Base Hold), it's steady.
        effective_start_week = max(1, self.peak_week_num - 16)
        
        # --- PHASE 1: BASE HOLD (Steady) ---
        if week_num < effective_start_week:
            # No recovery weeks here. Just steady work.
            return self.start_min, "Base Hold"

        # --- PHASE 2: ACTIVE RAMP (Sawtooth) ---
        # Calculate the Linear point
        ramp_duration = self.peak_week_num - effective_start_week
        current_pos = week_num - effective_start_week
        prog_pct = current_pos / max(1, ramp_duration)
        linear_load = self.start_min + ((self.peak_min - self.start_min) * prog_pct)

        # Apply Reverse Sync ONLY in this phase
        weeks_until_taper = self.peak_week_num - week_num
        
        if weeks_until_taper > 0 and weeks_until_taper % 4 == 0:
            return linear_load * 0.70, "Recover"
            
        if weeks_until_taper > 0 and (weeks_until_taper - 1) % 4 == 0:
            return linear_load * 1.05, "Overreach"
            
        return linear_load, "Build"

    def _fill_discipline_bucket(self, week, discipline, total_minutes):
        # (Same bucket logic as previous version...)
        workouts = [w for w in week.workouts if w.discipline == discipline]
        if not workouts: return

        keys = [w for w in workouts if any(k in w.id for k in ['LONG', 'THRESH', 'CSS', 'SWEETSPOT'])]
        support = [w for w in workouts if w not in keys]
        
        rem_mins = total_minutes
        
        for w in keys:
            if "LONG" in w.id:
                # Pass the load_type so the Ramp Calculator knows if it's a recovery week
                dur = self._get_ramp_duration(week.week_number, discipline, week.load_type)
            else:
                dur = self._get_interval_duration(w.id, discipline, total_minutes)
            w.duration_minutes = dur
            rem_mins -= dur
            
        if support:
            avg_duration = max(30, rem_mins / len(support))
            for w in support:
                w.duration_minutes = 5 * round(avg_duration / 5)

    def _get_ramp_duration(self, week_num, discipline, load_type):
        """
        Calculates Key Session duration, respecting the Phase logic.
        """
        config = self.constraints.get(discipline, {"ramp": (60, 90), "cap": 90})
        start_m, peak_m = config["ramp"]
        hard_cap = config["cap"]

        # 1. Ramp Calculation (Same as before)
        effective_start_week = max(1, self.peak_week_num - 16)
        
        if week_num < effective_start_week:
            base_dur = start_m
        elif week_num >= self.peak_week_num:
            base_dur = peak_m
        else:
            ramp_duration = self.peak_week_num - effective_start_week
            current_pos = week_num - effective_start_week
            prog = current_pos / max(1, ramp_duration)
            base_dur = start_m + ((peak_m - start_m) * prog)

        # 2. Modifiers based on load_type tag
        if load_type == "Race Week": base_dur *= 0.40
        elif load_type == "Taper": base_dur *= 0.75
        elif load_type == "Recover": base_dur *= 0.75 # Drop long run in recovery week
        
        final_dur = 5 * round(base_dur / 5)
        return min(final_dur, hard_cap)

    def _get_interval_duration(self, workout_id, discipline, total_weekly_vol):
        # (Same as previous version)
        limits = self.constraints.get(discipline, {"max_mins": 60, "cap": 90})
        target = total_weekly_vol * 0.20
        interval_cap = limits["cap"] * 0.65 
        return max(45, min(interval_cap, 5 * round(target / 5)))


class TriathlonPlanGenerator:
    def __init__(self, input_data: PlanRequest, scheduler_config: SchedulerConfig):
        self.input = input_data
        self.scheduler = WeeklyScheduler(scheduler_config)
        self.volume_manager = VolumeManager(input_data)
        self.total_weeks = input_data.total_weeks
        self.distance = input_data.distance
        self.base_sessions = self._get_base_distribution()
        self.phase_schedule = self._assign_phases()

    def build(self) -> TriathlonPlan:
        plan = TriathlonPlan(
            name=self.input.plan_name,
            user_level=self.input.user_level,
            total_weeks=self.total_weeks
        )

        for week_num in range(1, self.total_weeks + 1):
            week_obj = self._create_week(week_num)
            plan.weeks.append(week_obj)
            
        return plan

    def _create_week(self, week_num: int) -> TrainingWeek:
        phase_name = self.phase_schedule[week_num]
        is_race_week = (week_num == self.total_weeks)
        logic_phase = "race_week" if is_race_week else phase_name
        
        counts = {
            "swim": self._adjust_volume(self.base_sessions["swim"], is_race_week),
            "bike": self._adjust_volume(self.base_sessions["bike"], is_race_week),
            "run":  self._adjust_volume(self.base_sessions["run"],  is_race_week)
        }

        # 1. Generate the Workout Objects
        workouts = []
        workouts.extend(self._get_slots("swim", counts["swim"], logic_phase))
        workouts.extend(self._get_slots("bike", counts["bike"], logic_phase))
        workouts.extend(self._get_slots("run",  counts["run"],  logic_phase))

        # 2. Create Skeleton Week
        week_obj = TrainingWeek(
            week_number=week_num,
            phase=phase_name,
            total_volume_minutes=0, 
            focus="Race Prep" if is_race_week else phase_name,
            days=[], 
            workouts=workouts # Store raw list for debugging
        )

        # Apply Volume Management
        self.volume_manager.apply_volume(week_obj)

        # 3. Schedule them into Days
        finalized_week = self.scheduler.schedule(week_obj, workouts)
        
        return finalized_week

    def _get_slots(self, discipline: str, count: int, phase: str) -> List[Workout]:
        rules = PHASE_FOCUS.get(phase.lower(), {}).get(discipline, {})
        priority_order = rules.get("order", [])
        filler = rules.get("filler", f"{discipline[0].upper()}_RECOVERY")
        
        selected_sessions = []
        for i in range(count):
            s_id = priority_order[i] if i < len(priority_order) else filler
            details = WORKOUT_TYPES[discipline].get(s_id, {})
            wk = Workout(
                id=s_id,
                discipline=discipline,
                category=details.get("intensity", "aerobic"),
                duration_minutes=0,
                intensity=details.get("intensity", "aerobic")
            )
            selected_sessions.append(wk)
        return selected_sessions

    def _adjust_volume(self, base_count: int, is_race_week: bool) -> int:
        if is_race_week: return max(1, base_count - 1)
        return base_count

    def _assign_phases(self) -> Dict[int, str]:
        phases = {}
        taper_len = DISTANCE_CONFIG[self.distance.lower()]["taper_weeks"]
        peak_len = 2 if self.total_weeks < 12 else 3
        remaining = self.total_weeks - taper_len - peak_len
        
        if remaining < 4:
            build_len = remaining
            base_len = 0
        else:
            build_len = int(remaining * 0.6)
            base_len = remaining - build_len

        current_week = 1
        for _ in range(base_len): phases[current_week] = "Base"; current_week += 1
        for _ in range(build_len): phases[current_week] = "Build"; current_week += 1
        for _ in range(peak_len): phases[current_week] = "Peak"; current_week += 1
        for _ in range(taper_len): phases[current_week] = "Taper"; current_week += 1
        return phases

    def _get_base_distribution(self) -> Dict[str, int]:
        # Estimate sessions available based on training days + doubles
        # This is a simplification from the notebook which took total_sessions_available as input
        # We'll infer it or use a default logic
        total_days = len(self.input.train_days)
        doubles = self.input.willing_to_double
        
        # Simple heuristic: if willing to double, assume +1 or +2 capacity
        total = total_days + (2 if doubles else 0)
        
        # Cap at 10 for the distribution map
        total = min(10, max(3, total))
        
        dist = SESSION_DISTRIBUTION.get(total, (2, 2, 2))
        return {"swim": dist[0], "bike": dist[1], "run": dist[2]}
