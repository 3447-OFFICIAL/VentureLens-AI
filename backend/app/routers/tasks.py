from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db_session
from app.models.models import Task
from app.auth import get_current_user, UserContext

router = APIRouter(prefix="/tasks", tags=["Tasks"])

class TaskResponse(BaseModel):
    id: str
    title: str
    priority: str
    due: Optional[str] = None
    completed: bool

    class Config:
        from_attributes = True

class CreateTaskRequest(BaseModel):
    title: str
    priority: str = "Medium"
    due: Optional[str] = None

@router.get("", response_model=List[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    result = await db.execute(
        select(Task).where(Task.user_id == current_user.user_id).order_by(Task.created_at.desc())
    )
    return result.scalars().all()

@router.post("", response_model=TaskResponse)
async def create_task(
    req: CreateTaskRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    task = Task(
        title=req.title,
        priority=req.priority,
        due=req.due,
        completed=False,
        user_id=current_user.user_id
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

@router.patch("/{id}", response_model=TaskResponse)
async def toggle_task(
    id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserContext = Depends(get_current_user)
):
    result = await db.execute(
        select(Task).where(Task.id == id, Task.user_id == current_user.user_id)
    )
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.completed = not task.completed
    await db.commit()
    await db.refresh(task)
    return task
