import React from 'react'

import Icon from '../../styles/icons'
import { type UFile } from '../../types/apiProjects'

interface FileCardProps {
  file: UFile;
  onDelete: (name: string) => void;
  isSelectionActive: boolean
  mode?: string;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete, isSelectionActive }) => {
  return (
    <div
      draggable="false"
      data-filename={file.name}
      className="group relative flex flex-col items-center justify-between rounded-xl border border-slate-800 bg-custom-bg bg-custom-bg p-4 shadow-sm transition-all hover:shadow-md min-h- 140px select-none cursor-pointer"
    >

      {/* Lösch-Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.name);
        }}
        className="absolute right-2 top-2 rounded-full p-1 text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-slate-800 hover:text-slate-200 z-10"
      >
        <span className="text-sm font-bold">✕</span>
      </button>

      {/* Datei-Icon */}
      {/* Wichtig: pointer-events-none bleibt hier, damit das Icon keine Klicks blockiert */}
      <div className="flex flex-grow items-center justify-center text-slate-500 my-2 pointer-events-none">
        <Icon name="file" className="w-12 h-12" />
      </div>

      {/* Dateiname-Abschnitt */}
      <div className="w-full min-w-0 text-center">
        <p className={`w-full truncate rounded bg-transparent text-sm font-medium text-custom-text transition-all duration-150 break-all
          ${!isSelectionActive
            ? 'hover:whitespace-normal hover:bg-custom-bg-soft hover:p-1 hover:shadow-sm'
            : ''
          }`}
        >
          {file.name}
        </p>
      </div>
    </div>
  );
};

interface FileCardProps2<T extends string> {
  file: UFile;
  onDelete: (name: string) => void;
  isSelectionActive: boolean
  mode?: T;
  colorDict?: Record<T, Record<string, string>>;
}

export const FileCardAdvanced = <T extends string>({
  file,
  onDelete,
  isSelectionActive,
  mode,
  colorDict,
}: FileCardProps2<T>) => {
  const dictKey = mode === "type" ? file.FileType : file.FileFormat;
  const colorClass = (mode && dictKey && colorDict?.[mode]?.[dictKey]) || undefined;
  // Wenn eine Farbe definiert ist, nutzen wir die von Tailwind v4 generierte CSS-Variable
  const cssVariable = colorClass ? `var(--color-${colorClass})` : undefined;
  // Tailwind liefert hier NUR noch das strukturelle Layout und Fallbacks
  const cardStyles = colorClass
    ? "border" // Border wird aktiv, Farbe kommt via style
    : "border border-custom-border bg-custom-bg";

  return (
    <div
      draggable="false"
      data-filename={file.name}
      className={`group relative flex flex-col items-center justify-between rounded-xl ${cardStyles} p-4 shadow-sm transition-all hover:shadow-md min-h-[140px] select-none`}
      style={{
        // Setzt die Rahmenfarbe direkt über die CSS-Variable
        borderColor: cssVariable ? cssVariable : undefined,
        // Nutzt color-mix für einen dezenten, 10% deckenden Hintergrund dieser Farbe
        backgroundColor: cssVariable ? `color-mix(in srgb, ${cssVariable} 10%, transparent)` : undefined,
      }}
    >

      {/* Lösch-Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.name);
        }}
        className="absolute right-2 top-2 rounded-full p-1 text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-slate-800 hover:text-slate-200 z-10 cursor-pointer"
      >
        <span className="text-sm font-bold">✕</span>
      </button>

      {/* Icon-Farbe passt sich nun ebenfalls dynamisch an */}
      <div 
        className="flex flex-grow items-center justify-center my-2 pointer-events-none transition-colors"
        style={{ color: cssVariable ? cssVariable : "var(--color-slate-500)" }}
      >
        <Icon name="file" className="w-12 h-12" />
      </div>

      {/* Dateiname-Abschnitt */}
      <div className="w-full min-w-0 text-center">
        <p className={`w-full truncate rounded bg-transparent text-sm font-medium text-custom-text transition-all duration-150 break-all
          ${!isSelectionActive
            ? 'hover:whitespace-normal hover:bg-custom-bg-soft hover:p-1 hover:shadow-sm'
            : ''
          }`}
        >
          {file.name}
        </p>
      </div>
    </div>
  );
};