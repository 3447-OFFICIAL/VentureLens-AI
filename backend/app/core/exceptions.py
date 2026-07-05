from fastapi import Request
from fastapi.responses import JSONResponse

class VentureLensException(Exception):
    def __init__(self, code: str, message: str, target: str = None, status_code: int = 400):
        self.code = code
        self.message = message
        self.target = target
        self.status_code = status_code

async def global_exception_handler(request: Request, exc: VentureLensException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "target": exc.target,
                "details": []
            }
        }
    )

async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred.",
                "target": None,
                "details": [str(exc)]
            }
        }
    )
