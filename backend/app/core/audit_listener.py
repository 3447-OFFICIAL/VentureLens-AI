from sqlalchemy import event
from app.models.base import Base
from app.models.audit import AuditLog
from app.core.database import current_tenant_id
# We assume current_user_id is also tracked similarly via ContextVar
# For now, we stub it or assume it's injected if present
from contextvars import ContextVar

current_user_id: ContextVar[str | None] = ContextVar("current_user_id", default=None)

def track_changes(mapper, connection, target):
    """
    SQLAlchemy event listener to track INSERT, UPDATE, DELETE 
    operations and write them to the AuditLog.
    """
    # Exclude tracking the AuditLog table itself to avoid recursion
    if isinstance(target, AuditLog):
        return

    tenant = current_tenant_id.get()
    user = current_user_id.get()
    
    if not tenant or not user:
        return # Cannot securely log without context

    action = "UNKNOWN"
    if hasattr(target, "__mapper__"):
        action = "MODIFIED" # We can refine this based on the event hook (after_insert, after_update)

    resource_type = target.__tablename__
    resource_id = getattr(target, "id", None)
    
    # We would write this to the audit_logs table via the active connection
    # For a full implementation, we queue this or write it efficiently.
    AuditLog(
        tenant_id=tenant,
        actor_id=user,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        payload={}
    )
    # Note: Inserting directly within an event hook requires careful session management.
    # We will log it to stdout as a mock for the Celery/Redis queue in this scaffold.
    print(f"[AUDIT LOG] {action} {resource_type}:{resource_id} by {user}")

# Register listeners for all subclasses of Base
for mapper in Base.registry.mappers:
    event.listen(mapper.class_, 'after_insert', track_changes)
    event.listen(mapper.class_, 'after_update', track_changes)
