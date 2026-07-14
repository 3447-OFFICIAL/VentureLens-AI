from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import AsyncSessionLocal
from ..models.auth import OrganizationUsers
from ..models.user import User
from ..models.tenant import Tenant
from ..models.schemas import UserCreate, UserLogin, Token
from ..core.security import get_password_hash, verify_password, create_access_token
from ..api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_db_unbound():
    async with AsyncSessionLocal() as session:
        yield session

@router.post("/signup", response_model=Token)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db_unbound)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 1. Create Tenant (Org)
    new_tenant = Tenant(name=user_in.tenant_name)
    db.add(new_tenant)
    await db.flush()
    
    # 2. Create User
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        tenant_id=new_tenant.id
    )
    db.add(new_user)
    await db.flush()
    
    # 3. Create OrgUser mapping
    org_user = OrganizationUsers(user_id=new_user.id, tenant_id=new_tenant.id, role="owner")
    db.add(org_user)
    
    await db.commit()
    
    # 4. Generate Token
    access_token = create_access_token(data={"sub": new_user.email, "tenant_id": str(new_tenant.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db_unbound)):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    from ..models.auth import OrganizationUsers
    org_result = await db.execute(select(OrganizationUsers).filter(OrganizationUsers.user_id == user.id))
    org_mapping = org_result.scalars().first()
    user.tenant_id = org_mapping.tenant_id if org_mapping else None
    
    access_token = create_access_token(data={"sub": user.email, "tenant_id": str(user.tenant_id)})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "tenant_id": str(current_user.tenant_id)
    }

