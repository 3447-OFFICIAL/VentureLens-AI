import os
import json
import jwt
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from jwt import PyJWKClient

# Initialize HTTPBearer
security = HTTPBearer()

# In production, this should be set in environment variables
CLERK_ISSUER = os.getenv("CLERK_ISSUER_URL", "https://clerk.your-domain.com")
CLERK_JWKS_URL = f"{CLERK_ISSUER}/.well-known/jwks.json"

jwk_client = PyJWKClient(CLERK_JWKS_URL)

class UserContext:
    def __init__(self, user_id: str, role: str, tenant_id: str):
        self.user_id = user_id
        self.role = role
        self.tenant_id = tenant_id

async def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserContext:
    token = credentials.credentials
    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={"verify_aud": False}
        )
        
        # Extract custom claims configured in Clerk
        user_id = data.get("sub")
        # Default role to 'investor' if not present
        metadata = data.get("metadata", {})
        role = metadata.get("role", "investor")
        tenant_id = metadata.get("tenant_id", "default_tenant")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: missing subject")
            
        return UserContext(user_id=user_id, role=role, tenant_id=tenant_id)
        
    except jwt.PyJWKClientError as e:
        raise HTTPException(status_code=401, detail="Unable to fetch JWKS")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(required_roles: list[str]):
    def role_checker(user: UserContext = Depends(verify_clerk_token)):
        if user.role not in required_roles and user.role != "admin":
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker
