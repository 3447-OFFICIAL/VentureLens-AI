from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import SessionLocal # We use standard session for auth (tenant agnostic)
from ..models.auth import OrganizationUser
from ..models.user import User
from ..models.tenant import Tenant
from ..models.schemas import UserCreate, UserLogin, Token
from ..core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db_unbound():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db_unbound)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 1. Create Tenant (Org)
    new_tenant = Tenant(name=user_in.tenant_name)
    db.add(new_tenant)
    db.flush()
    
    # 2. Create User
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        tenant_id=new_tenant.id
    )
    db.add(new_user)
    db.flush()
    
    # 3. Create OrgUser mapping
    org_user = OrganizationUser(user_id=new_user.id, tenant_id=new_tenant.id, role="owner")
    db.add(org_user)
    
    db.commit()
    
    # 4. Generate Token
    access_token = create_access_token(data={"sub": new_user.email, "tenant_id": new_tenant.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db_unbound)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email, "tenant_id": user.tenant_id})
    return {"access_token": access_token, "token_type": "bearer"}
