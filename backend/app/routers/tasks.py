from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List, Dict, Any

from ..core.database import get_db
from ..api.deps import get_current_user
from ..models.user import User
from ..models.crm import Task

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Schemas
class TaskCreate(BaseModel):
    title: str
    priority: str = "Medium"
    due: str | None = None
    assignee: str | None = None
    company: str | None = None
    status: str = "todo"

class TaskUpdate(BaseModel):
    title: str | None = None
    priority: str | None = None
    due: str | None = None
    assignee: str | None = None
    company: str | None = None
    status: str | None = None

class TaskResponse(BaseModel):
    id: str
    title: str
    priority: str
    due: str | None = None
    assignee: str | None = None
    company: str | None = None
    status: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[TaskResponse])
async def get_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task))
    tasks = result.scalars().all()
    
    return [
        TaskResponse(
            id=str(t.id),
            title=t.title,
            priority=t.priority,
            due=t.due,
            assignee=t.assignee,
            company=t.company,
            status=t.status
        ) for t in tasks
    ]

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        tenant_id=current_user.tenant_id,
        title=task_in.title,
        priority=task_in.priority,
        due=task_in.due,
        assignee=task_in.assignee,
        company=task_in.company,
        status=task_in.status
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).filter(Task.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task_in.title is not None:
        task.title = task_in.title
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.due is not None:
        task.due = task_in.due
    if task_in.assignee is not None:
        task.assignee = task_in.assignee
    if task_in.company is not None:
        task.company = task_in.company
    if task_in.status is not None:
        task.status = task_in.status
        
    await db.commit()
    await db.refresh(task)
    return task

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).filter(Task.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    await db.delete(task)
    await db.commit()
    return {"status": "success"}
