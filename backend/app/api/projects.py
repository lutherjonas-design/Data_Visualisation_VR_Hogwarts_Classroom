from fastapi import APIRouter, HTTPException, status

from app.core.settings import PASSWORD

import app.db as DB
import app.api.schemas as Schemas
import app.core.services as Services

banned_names = ["allowed_types", "uploads","id", "stats", "dick"]
project_router = APIRouter()

@project_router.get("/id/{slug}",response_model=Schemas.Project)
def get_id_slug(slug: str):
    try:
        id = DB.project.get_id(slug)
    except DB.error.ProjectNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return id

@project_router.delete("/{slug}",response_model=Schemas.DeleteReturn)
def delete_project_slug(slug: str, data: Schemas.DeleteBase):
    project = DB.project.get_id(slug)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    if data.key!=PASSWORD:
        raise HTTPException(status_code=403, detail="Wrong password")
    return Services.delete.project(slug)

@project_router.get("/{slug}",response_model=Schemas.Project)
def get_project_slug(slug: str):
    try:
        project = DB.project.get(slug=slug)
    except DB.error.ProjectNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

@project_router.get("/", response_model=list[Schemas.ProjectBase])
def projects():
    return DB.project.list()

@project_router.post("/", response_model=Schemas.Project,status_code=status.HTTP_201_CREATED)
def create_new_project(data: Schemas.ProjectCreate):
    if data.name in banned_names:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="That project slug is unavailable")
    try:
        slug = DB.project.create(data.name)
    except DB.error.ProjectAlreadyExists as err:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(err))
    return DB.project.get(slug=slug)