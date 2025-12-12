from datetime import datetime
from typing import Dict, Any, List, Optional
from app.plan_intake_agent.schemas import UserProfile
from app.plan_intake_agent.constants import DISTANCE_CONFIG

_SUPPORTED_DATE_FORMATS = ("%Y-%m-%d", "%d-%m-%Y")


def _parse_race_date(date_str: str):
    for fmt in _SUPPORTED_DATE_FORMATS:
        try:
            return datetime.strptime(date_str, fmt).date()
        except ValueError:
            continue
    raise ValueError("Invalid race date format. Use YYYY-MM-DD or DD-MM-YYYY.")


def _weeks_until_race(race_date_str: str) -> Optional[float]:
    if not race_date_str:
        return None
    race_date = _parse_race_date(race_date_str)
    today = datetime.today().date()
    delta_days = (race_date - today).days
    if delta_days <= 0:
        raise ValueError("Race date must be in the future.")
    return delta_days / 7


def _apply_completion_flag(profile: UserProfile) -> UserProfile:
    required = [
        profile.distance,
        profile.race_date,
        profile.sessions_per_week,
    ]
    is_complete = all(required)
    if profile.is_complete == is_complete:
        return profile
    return profile.model_copy(update={"is_complete": is_complete})

# --- INTERNAL LOGIC (Private) ---
def _validate_rules(updates: dict, current_dist: str) -> List[str]:
    errors = []
    rules = DISTANCE_CONFIG.get(current_dist)
    
    if not rules:
        return ["Invalid distance. Please select Sprint, Olympic, Half, or Full."]

    # Check Session Counts
    if "sessions_per_week" in updates:
        val = updates["sessions_per_week"]
        if val not in rules["allowed_sessions"]:
            errors.append(
                f"For a {current_dist}, training days must be between "
                f"{min(rules['allowed_sessions'])} and {max(rules['allowed_sessions'])}."
            )
    
    # Check Race Date (simplified for brevity)
    if "race_date" in updates:
        try:
            weeks_out = _weeks_until_race(updates["race_date"])
            if weeks_out is None:
                raise ValueError("Race date is required.")
        except ValueError as exc:
            errors.append(str(exc))
        else:
            min_weeks = rules.get("min_weeks")
            max_weeks = rules.get("max_weeks")
            if min_weeks and weeks_out < min_weeks:
                errors.append(
                    f"Race is only {weeks_out:.1f} weeks away. "
                    f"{current_dist.title()} plans require at least {min_weeks} weeks."
                )
            if max_weeks and weeks_out > max_weeks:
                errors.append(
                    f"Race is {weeks_out:.1f} weeks away. "
                    f"{current_dist.title()} plans support up to {max_weeks} weeks."
                )
        
    return errors

# --- EXTERNAL TOOL (Public) ---
def update_user_profile(tool_args: dict, current_profile: UserProfile) -> Dict[str, Any]:
    """
    Validates and updates the user profile.
    Returns a dict compatible with AgentState updates.
    """
    errors = []
    
    # 1. Identify Distance (The dependency for all other rules)
    dist = tool_args.get("distance") or current_profile.distance
    
    # If distance is missing, we can't validate advanced rules yet
    if not dist:
        if "distance" in tool_args:
            # Just saving the distance for the first time
            new_profile = current_profile.copy(update={"distance": tool_args["distance"]})
            new_profile = _apply_completion_flag(new_profile)
            return {
                "profile": new_profile, 
                "errors": [], 
                "tool_result": f"Distance set to {tool_args['distance']}."
            }
        else:
            return {
                "profile": current_profile,
                "errors": ["Please set the distance first."],
                "tool_result": "Failed: Distance required."
            }

    # 2. Run Validation against Config
    errors = _validate_rules(tool_args, dist)

    if errors:
        # FAIL: Return errors, do NOT update profile
        return {
            "profile": current_profile,
            "errors": errors,
            "tool_result": f"Update Rejected: {'; '.join(errors)}"
        }
    
    # SUCCESS: Update profile
    new_profile = current_profile.model_copy(update=tool_args)
    new_profile = _apply_completion_flag(new_profile)
    return {
        "profile": new_profile,
        "errors": [],
        "tool_result": f"Successfully updated: {tool_args}"
    }
