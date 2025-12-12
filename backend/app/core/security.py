# app/core/security.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.database import supabase # Assuming you initialized supabase client here

# This tells FastAPI to expect a "Authorization: Bearer <token>" header
security_scheme = HTTPBearer()

def get_current_athlete(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """
    1. Grabs the token from the Header.
    2. Sends it to Supabase Auth to verify.
    3. Returns the User object (uuid, email) or raises 401.
    """
    token = credentials.credentials
    
    try:
        # Supabase validates the signature and expiration for us
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        return user_response.user

    except Exception as e:
        # Catch expiries or malformed tokens
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )