import app.db as DB
import app.api.schemas as Schemas
import app.storage.core as Storage

def project(slug: str):
    id = DB.project.get_id(slug)
    file_UIDS = list(map(lambda file: file["uid"], DB.file.list_by_id(id)))

    Storage.delete_files(names=file_UIDS)
    DB.file.delete_by_uids(file_UIDS)
    DB.project.delete_by_slug(slug)
    return Schemas.DeleteReturn(slug=slug)

def files(uids: list[str]):
    Storage.delete_files(names=uids)
    DB.file.delete_by_uids(uids)