from fastapi import APIRouter

from app.api.projects import project_router
from app.api.files import files_router

api_router = APIRouter()

# projects routes
api_router.include_router(project_router, prefix="/projects", tags=["projects"])
api_router.include_router(files_router, prefix="/files", tags=["files"])

@api_router.get("/health", tags=["health"])
def health():
    return {"status": "ok"}

