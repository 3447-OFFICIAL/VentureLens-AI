from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

class IdempotencyMiddleware(BaseHTTPMiddleware):
    """
    Enterprise Idempotency Middleware.
    Caches responses for state-mutating requests (POST/PUT/PATCH/DELETE) 
    if an 'Idempotency-Key' header is present.
    Requires a Redis client injected into app state.
    """
    async def dispatch(self, request: Request, call_next):
        idem_key = request.headers.get("Idempotency-Key")
        if not idem_key or request.method not in ["POST", "PUT", "PATCH", "DELETE"]:
            return await call_next(request)
            
        # Optional: Use Redis from request.app.state.redis
        # For this scaffold, we'll bypass actual redis connection logic
        # but document the hashing mechanism.
        
        # Hash the key + user_id for multi-tenant safety
        # user_context = getattr(request.state, "user", "anonymous")
        # hash_key = hashlib.sha256(f"{idem_key}:{user_context}".encode()).hexdigest()
        # redis_key = f"idempotency:{hash_key}"
        
        # MOCK: if redis_client.exists(redis_key):
        #    cached_response = redis_client.get(redis_key)
        #    return Response(content=cached_response.body, status_code=cached_response.status, media_type="application/json")
        
        response = await call_next(request)
        
        # MOCK: if response.status_code < 400:
        #    redis_client.setex(redis_key, 86400, serialize(response))
            
        return response
