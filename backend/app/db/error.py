class DatabaseError(Exception):
    """Base class for database-layer errors."""
    pass


class ProjectError(DatabaseError):
    """Base class for project-related errors."""
    pass

class ProjectAlreadyExists(ProjectError):
    """Raised when a project with the same slug or name already exists."""
    pass

class ProjectNotFound(ProjectError):
    """Raised when a Project doesn't exist"""
    pass


class FileError(DatabaseError):
    """Base class for project-related errors."""
    pass

class FileAlreadyExists(FileError):
    """Raised when a file with the same Upload Name exists in that project."""
    pass

class UIDAlreadyExists(FileError):
    """Raised when a file with the same UID already exists."""
    pass
