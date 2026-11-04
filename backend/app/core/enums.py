from enum import Enum

class ExtendedEnum(Enum):
    @classmethod
    def values(cls):
        return list(map(lambda c: c.value, cls))

class DataType(str, ExtendedEnum):
    path = "path"
    gaze = "gaze"
    task = "task"
    
class FileType(str, ExtendedEnum):
    path = "path"
    gaze = "gaze"
    path_gaze = "path_gaze"
    gaze_path = "gaze_path"
    task = "task"

class FileFormat(str, ExtendedEnum):
    alternating_lines = "alternating_lines"
    inline = "inline"

class FileStatus(int, ExtendedEnum):
    uploading = 0
    uploaded = 1
    processing = 2
    processed = 3
    failed = 4
    failed_upload = 5