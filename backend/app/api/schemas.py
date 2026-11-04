from pydantic import BaseModel, Field
from datetime import datetime

import  app.core.enums as Enums

class DeleteBase(BaseModel):
    key: str

class DeleteReturn(BaseModel):
    slug:str

class allowed_types_files(BaseModel):
    FileType: list[str]
    FileFormat: list[str]

class ProjectBase(BaseModel):
    slug: str
    name: str

class Project(ProjectBase):
    created: datetime
    updated: datetime
    id: int

class ProjectCreate(BaseModel):
    name: str

class FileBase(BaseModel):
    uid: str
    upload_name: str
    status: str

class FileUpload(BaseModel):
    upload_name: str
    project_id: int
    type: Enums.FileType
    format: Enums.FileFormat



class AllowedTypesResponse(BaseModel):
    FileType: list[str]
    FileFormat: list[str]