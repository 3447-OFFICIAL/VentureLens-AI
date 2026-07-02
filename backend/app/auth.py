import os
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
from fastapi import Request, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

SECRET_KEY = settings.JWT_SECRET_KEY

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer(auto_error=False)

class UserContext:
    def __init__(self, user_id: str, email: str, role: str, organization_id: str):
        self.user_id = user_id
        self.email = email
        self.role = role
        self.organization_id = organization_id

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserContext:
    import requests
    token = None
    
    # 1. Check authorization header bearer token
    if credentials:
        token = credentials.credentials
        
    # 2. Check secure HttpOnly cookies (for SSR/Browser sessions)
    if not token:
        token = request.cookies.get("access_token")
        
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # Check if this is a Clerk token (RS256 asymmetric signature)
    try:
        unverified_header = jwt.get_unverified_header(token)
        is_clerk_token = "kid" in unverified_header and unverified_header.get("alg") == "RS256"
    except Exception:
        is_clerk_token = False

    if is_clerk_token:
        try:
            clerk_secret = os.getenv("CLERK_SECRET_KEY", "")
            # If test keys or mock mode is active, decode directly without signature check
            if clerk_secret.startswith("sk_test_") or os.getenv("NEXT_PUBLIC_MOCK_AUTH") == "true":
                payload = jwt.decode(token, options={"verify_signature": False})
            else:
                kid = unverified_header.get("kid")
                unverified_payload = jwt.decode(token, options={"verify_signature": False})
                iss = unverified_payload.get("iss")
                
                # Fetch Clerk JWKS
                jwks_url = f"{iss}/.well-known/jwks.json"
                res = requests.get(jwks_url, timeout=5)
                jwks = res.json()
                
                public_key = None
                for key in jwks.get("keys", []):
                    if key.get("kid") == kid:
                        from jwt.algorithms import RSAAlgorithm
                        public_key = RSAAlgorithm.from_jwk(key)
                        break
                        
                if not public_key:
                    raise HTTPException(status_code=401, detail="Invalid Clerk public key ID")
                    
                payload = jwt.decode(token, public_key, algorithms=["RS256"], audience=clerk_secret)
                
            user_id = payload.get("sub")
            email = payload.get("email") or payload.get("sub")
            public_meta = payload.get("public_metadata", {})
            role = public_meta.get("role", "analyst")
            org_id = payload.get("org_id") or "org_default"
            
            return UserContext(
                user_id=user_id,
                email=email,
                role=role,
                organization_id=org_id
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Clerk verification failed: {str(e)}"
            )

    # Fallback to local HS256 JWT verification
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role", "analyst")
        organization_id: str = payload.get("organization_id")
        
        if not user_id or not organization_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
            )
            
        return UserContext(
            user_id=user_id,
            email=email,
            role=role,
            organization_id=organization_id
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: UserContext = Depends(get_current_user)):
        if current_user.role not in allowed_roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions for this resource",
            )
        return current_user
    return role_checker
