export type Language = "en" | "de";

export const translations = {
  nav: {
    name: { en: "VR analysis", de: "VR Analyse" },
    home: { en: "Home", de: "Start" },
    projects: { en: "Projects", de: "Projekte" },
  },
  project_overview: {
    title: { en: "overview of projects", de: "Projekt Übersicht" },
    name: { en: "projects", de: "Projekte" }
  },
  create_project: {
    title: { en: "create project", de: "Projekt erstellen" },
    input_label: { en: "enter name", de: "Namen eingeben" },
    button: { en: "submit", de: "Absenden" },
    loader: { en: "answer", de: "Antwort" }
  },
  project_detail: {
    title: { en: "uploaded files", de: "Hochgeladene Dateien" },
    settings: { en: "settings", de: "Einstellungen" },
    delete: { en: "delete Project", de: "projekt Löschen" },
    pw: { en: "password", de: "Passwort" },
    tte: {
      en: "More detail and functionality around files (upload, management etc.).",
      de: "Mehr Informationen zu den Datein (Upload, Verwaltung etc.)."
    },
    error_pw: { en: "Wrong password", de: "Falsches Passwort" },
    error_pw_2: { en: "Error, try again later.", de: "Fehler, versuche es später erneut." }
  },
  file: {
    title: { en: "files", de: "Dateien" },
    add: { en: "add File", de: "Datei hinzufügen" },
    expand: { en: "expand", de: "Erweitern" }
  },
  mutation_handler: {
    load: { en: "waiting for response!", de: "Warte auf Antwort!" }
  },
  loading: {
    loading: { en: "are/is loading", de: " werden/wird geladen" },
    error: { en: "failed to load", de: " konnten/konnte nicht geladen werden" }
  },
  buttonBar: {
    type: { en: "file type", de: "Datei Typ" },
    format: { en: "file format", de: "Datei Format" }
  },
  fileDropZone: {
    error: { en: "couldn't reach servers, try again later", de: "Server nicht erreichbar, probiere es später erneut" },
    loading: { en: "trying to retrieve types", de: "Lade Datei Typen" },
    submit: { en: "submit", de: "Absenden" },
    drop: { en: "drag & drop files here", de: "Ziehen Sie die Dateien hier hin"},
    drag: { en: "drop files here", de: "Dateien hier ablegen"},
    sucess: { en: "Files Uploaded", de: "Datein hochgeladen"},
    failure: { en: "something went wrong", de: "Etwas ist schiefgelaufen"},
    back: {en: "back", de: "zurück"},
  },
  fileInfo: {
    info: { en: "file info", de: "Dateidetails"},
    none: { en: "none", de: "nichts" },
    path: { en: "path", de: "Pfad" },
    gaze: { en: "gaze", de: "Blick" },
    path_gaze: { en: "path & gaze", de: "Pfad & Blick" },
    gaze_path: { en: "gaze & path", de: "Blick & Pfad" },
    task: { en: "task", de: "Aufgabe" },
    alternating_lines: { en: "alternating & lines", de: "Wechsellinien" },
    inline: { en: "inline", de: "einzelne Zeile"},
    dupe: { en: "duplicate files detected", de: "Duplikate gefunden" },
    missingAttributes: { en: "some files need attributes", de: "einige Datein brauchen noch Attribute"},
  }
} as const;
// : {en: "", de: ""}