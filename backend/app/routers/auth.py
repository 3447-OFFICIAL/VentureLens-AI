from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from app.database import get_db_session
from app.models.models import User, Organization
from app.auth import create_access_token, create_refresh_token, get_current_user, UserContext

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db_session)
):
    # Retrieve user from database
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalars().first()
    
    if not user or user.password_hash != login_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    # Generate tokens
    token_data = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "organization_id": user.organization_id
    }
    
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    # Set secure HttpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600 # 1 hour
    )
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600 * 24 * 7 # 7 days
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role
    )

@router.post("/logout")
async def logout(response: Response, current_user: UserContext = Depends(get_current_user)):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"detail": "Logged out successfully"}

@router.get("/me")
async def get_me(current_user: UserContext = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "email": current_user.email,
        "role": current_user.role,
        "organization_id": current_user.organization_id
    }
