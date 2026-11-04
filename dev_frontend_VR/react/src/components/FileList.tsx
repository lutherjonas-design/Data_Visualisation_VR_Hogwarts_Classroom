import { FileCardAdvanced } from "./cards/FileCard";
import { type UFile } from "../types/apiProjects";

interface FileListProps<T extends string> {
  files: UFile[];
  onDeleteFile: (name: string) => void;
  isSelectionActive: boolean;
  mode?: T; // Koppelung an T statt 'string'
  colorDict?: Record<T, Record<string, string>>;
}

export const AdvancedFileList = <T extends string>({
  files,
  onDeleteFile,
  isSelectionActive,
  mode,
  colorDict,
}: FileListProps<T>) => { // Hier wird T an das Interface übergeben
  
  // if (files.length === 0) {
  //   return (
  //     <div className="text-center p-8 text-slate-400 border border-dashed rounded-xl">
  //       Keine Dateien hochgeladen.
  //     </div>
  //   );
  // }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {files.map((file) => (
        <FileCardAdvanced
          key={file.name}
          file={file}
          onDelete={onDeleteFile}
          isSelectionActive={isSelectionActive}
          mode={mode}
          colorDict={colorDict}
        />
      ))}
    </div>
  );
};