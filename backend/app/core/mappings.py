import app.core.enums as Enums

FILE_TYPE_TO_INT = {
    Enums.FileType.path: 0,
    Enums.FileType.gaze: 1,
    Enums.FileType.path_gaze: 2,
    Enums.FileType.gaze_path: 3,
    Enums.FileType.task: 4,
}

INT_TO_FILE_TYPE = {v: k for k, v in FILE_TYPE_TO_INT.items()}


FILE_FORMAT_TO_INT = {
    Enums.FileFormat.alternating_lines: 0,
    Enums.FileFormat.inline: 1,
}

INT_TO_FILE_FORMAT = {v: k for k, v in FILE_FORMAT_TO_INT.items()}
