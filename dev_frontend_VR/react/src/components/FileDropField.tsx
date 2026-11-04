import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import { type UFile } from "../types/apiProjects";
import { ButtonBar, Dropdown } from "./ButtonSelections";
import { AdvancedFileList } from "./FileList";
import { useFileTypeStatus, useFileUpload } from "../hooks/hookBook";
import { LoadHandler } from "./hookHandler/LoadHandler";
import { useLanguage } from "../context/LanguageContext";
import { StyledButton } from "./button";
import { useColorDict } from "./colorDict";
import { NotificationBanner } from "./Notification";
import { MutationHandler } from "./hookHandler/mutationHandler";

interface FileDropZoneProp {
    files: UFile[];
    lock?: boolean;
    setLock?:(value: boolean)=>void;
}
const MODES = ["type", "format"] as const;
export type Mode = typeof MODES[number];

export const FileDropZone: React.FC<FileDropZoneProp> = ({
    files: existingFiles, lock, setLock
}) => {
    const { t } = useLanguage();
    const { slug } = useParams();
    const [mode, setMode] = useState<Mode>(MODES[0]);
    const [tMode, setTMode] = useState<string>("none");
    const [fMode, setFMode] = useState<string>("none");
    const [dragging, setDragging] = useState<boolean>(false);
    const [uploadFiles, setUploadFiles] = useState<UFile[]>([]);
    const [dupplicateFiles, setDupplicateFiles] = useState<string[]>([]);
    const [lastAttribute, setLastAttribute] = useState<{ mode: Mode; attribute: string } | undefined>();
    const [isGlobalSelecting, setIsGlobalSelecting] = useState<boolean>(false);
    const [lassoBox, setLassoBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const selectionStyling = ['ring-1', 'ring-custom-accent', 'ring-offset-1/2'];
    const [missingAttributes, setMissingAttributes] = useState<[string[], string[]]>([[], []]);

    const zoneRef = useRef<HTMLDivElement>(null);
    const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const { data: allowedModes, loading: allowedModesLoading, error: allowedModesError } = useFileTypeStatus()
    const colorDict = useColorDict<Mode>({ append: lastAttribute });
    const { uploadMultipleFiles, loading: uploadLoading, error: uploadError } = useFileUpload();

    const handleRemoveFromState = (name: string) => {
        setUploadFiles((prevFiles) => prevFiles.filter((file) => file.name !== name))
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('.flex.justify-between')) {
            return;
        }

        if (!zoneRef.current) return;

        setIsGlobalSelecting(true);

        // Stabile und präzise Berechnung des Startpunkts relativ zur Dropzone
        const rect = zoneRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + zoneRef.current.scrollLeft;
        const y = e.clientY - rect.top + zoneRef.current.scrollTop;

        startPos.current = { x, y };

        // Das Lasso startet exakt an der Klick-Position mit einer Breite/Höhe von 0
        setLassoBox({ x, y, w: 0, h: 0 });


    };

    const handleMouseUp = () => {
        if (!isGlobalSelecting || !zoneRef.current || !lassoBox) {
            setIsGlobalSelecting(false);
            setLassoBox(null);
            return;
        }

        // 1. Finde alle DOM-Elemente der FileCards
        // Jede deiner FileCards benötigt dafür das Attribut data-filename={file.name}
        const cardElements = zoneRef.current.querySelectorAll('[data-filename]');
        const hitFileNames = new Set<string>();

        const zoneRect = zoneRef.current.getBoundingClientRect();

        cardElements.forEach((card) => {
            card.classList.remove(...selectionStyling); // Highlight aus
            card.setAttribute('data-selected', 'false');
            const cardRect = card.getBoundingClientRect();
            const fileName = card.getAttribute('data-filename');

            if (!fileName) return;

            // Konvertiere Card-Koordinaten relativ zur DropZone
            const cardLeft = cardRect.left - zoneRect.left + zoneRef.current.scrollLeft;
            const cardTop = cardRect.top - zoneRect.top + zoneRef.current.scrollTop;

            // Kollisionsprüfung (AABB Überlappung) zwischen Lasso und Karte
            const isOverlapping = (
                lassoBox.x < cardLeft + cardRect.width &&
                lassoBox.x + lassoBox.w > cardLeft &&
                lassoBox.y < cardTop + cardRect.height &&
                lassoBox.y + lassoBox.h > cardTop
            );

            if (isOverlapping) {
                hitFileNames.add(fileName);
            }
        });

        // 2. Wende die aktuellen Modi direkt auf die getroffenen Dateien an (Variante A)
        if (hitFileNames.size > 0) {
            const addToDict = mode == "type" ? tMode : fMode
            if (addToDict != "none") {
                setLastAttribute({
                    mode: mode,
                    attribute: addToDict

                })
            }
            setUploadFiles((prev) =>
                prev.map((file) => {
                    if (hitFileNames.has(file.name)) {
                        return {
                            ...file,
                            // Wenn Modus "type" ist, tMode zuweisen, sonst fMode bei "format"
                            FileType: mode === "type" ? tMode : file.FileType,
                            FileFormat: mode === "format" ? fMode : file.FileFormat,
                        };
                    }
                    return file;
                })
            );
        }

        // Reset Lasso
        setIsGlobalSelecting(false);
        setLassoBox(null);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isGlobalSelecting || !zoneRef.current) return;

        const rect = zoneRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left + zoneRef.current.scrollLeft;
        const currentY = e.clientY - rect.top + zoneRef.current.scrollTop;

        // Erlaubt das Ziehen in alle Richtungen (links, rechts, oben, unten)
        const x = Math.min(startPos.current.x, currentX);
        const y = Math.min(startPos.current.y, currentY);
        const w = Math.abs(startPos.current.x - currentX);
        const h = Math.abs(startPos.current.y - currentY);

        setLassoBox({ x, y, w, h });

        const cardElements = zoneRef.current.querySelectorAll('[data-filename]');
        const zoneRect = zoneRef.current.getBoundingClientRect();

        cardElements.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const fileName = card.getAttribute('data-filename');

            if (!fileName) return;

            // Konvertiere Card-Koordinaten relativ zur DropZone
            const cardLeft = cardRect.left - zoneRect.left + zoneRef.current.scrollLeft;
            const cardTop = cardRect.top - zoneRect.top + zoneRef.current.scrollTop;

            // Kollisionsprüfung (AABB Überlappung) zwischen Lasso und Karte
            const isOverlapping = (
                lassoBox.x < cardLeft + cardRect.width &&
                lassoBox.x + lassoBox.w > cardLeft &&
                lassoBox.y < cardTop + cardRect.height &&
                lassoBox.y + lassoBox.h > cardTop
            );

            if (isOverlapping) {
                card.classList.add(...selectionStyling); // Highlight an
                card.setAttribute('data-selected', 'true');
            } else {
                card.classList.remove(...selectionStyling); // Highlight aus
                card.setAttribute('data-selected', 'false');
            }
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isGlobalSelecting) setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const newUploads: UFile[] = [];
        const newDuplicates = new Set<string>();

        droppedFiles.forEach((droppedFile) => {
            const inExistingFiles = existingFiles.some((f) => f.name === droppedFile.name);
            const inUploadFiles = uploadFiles.some((uF) => uF.fileObject?.name === droppedFile.name);

            if (inExistingFiles || inUploadFiles) {
                newDuplicates.add(droppedFile.name);
            } else {
                const mappedUFile: UFile = {
                    name: droppedFile.name,
                    fileObject: droppedFile,
                    FileType: "none",
                    FileFormat: "none",
                    status: "buffered",
                };
                newUploads.push(mappedUFile);
            }
        });

        if (newUploads.length > 0) {
            setUploadFiles((prev) => [...prev, ...newUploads]);
        }

        if (newDuplicates.size > 0) {
            setDupplicateFiles((prev) => {
                const uniqueSet = new Set([...prev, ...newDuplicates])
                return Array.from(uniqueSet)
            });
        }
    };

    const submitCheck = () => {
        const missingTypes = uploadFiles.filter(item => item.FileType==="none").map((item)=>item.name);
        const missingFormats = uploadFiles.filter(item => item.FileType==="none").map((item)=>item.name);
        setMissingAttributes([missingTypes,missingFormats]);
        if(slug && setLock && missingTypes.length===0 && missingFormats.length===0) {
            setLock(true);
            console.log(uploadFiles);
            uploadMultipleFiles(
                {slug: slug, fileItems: uploadFiles}
            )
        };
    }

    useEffect(()=>console.log("uploadFiles: ", uploadFiles),[uploadFiles]);

    const customErrorHandler = <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
        ⚠️ {t("fileDropZone.error")}
    </div>

    const customLoadHandler = <div className="flex flex-col items-center justify-center py-12 space-y-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-custom-accent border-t-transparent" />
        <p className="text-sm text-custom-text-muted animate-pulse">{t("fileDropZone.loading")}</p>
    </div>

    const dupplicateFilesBanner = <NotificationBanner type="warning"
        title={t("fileInfo.dupe")} dismissible={true}
        onDismiss={() => { setDupplicateFiles([]) }}
    >
        {dupplicateFiles.length > 0 && dupplicateFiles.join(", ")}
    </NotificationBanner>

    const missingAttributesBanner = <NotificationBanner type="warning"
        title={t("fileInfo.missingAttributes")} dismissible={true}
        onDismiss={() => { setMissingAttributes([[],[]]) }}
    >
        <div>
            <div className="text-sm">Type: {missingAttributes[0].length > 0 && missingAttributes[0].join(", ")}</div>
            <div className="text-sm">Format: {missingAttributes[1].length > 0 && missingAttributes[1].join(", ")}</div>
        </div>    
    </NotificationBanner>

    if(lock){
        return(
            <MutationHandler 
                isLoading={uploadLoading} error={null} errorMessage={""}
            >
                <div>{uploadError ? t("fileDropZone.failure") : t("fileDropZone.sucess")}</div>
                <StyledButton onClick={()=>{if(setLock)setLock(false);}}>{t("fileDropZone.back")}</StyledButton>
            </MutationHandler>
        )
    }
    return (
        <LoadHandler name={""} isLoading={allowedModesLoading} error={allowedModesError}
            errorDecorator={customErrorHandler} loadingDecorator={customLoadHandler} overloadMessage={true}
        >
            <div
                ref={zoneRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg text-center transition-colors h-full flex flex-col items-center overflow-y-auto
                ${uploadFiles.length == 0 ? "justify-center items-center p-12" : "justify-start text-left p-6"}
                ${dragging
                        ? "border-custom-accent"
                        : "border-custom-border bg-custom-bg-soft hover:border-custom-text-muted"
                    }`}
            >
                {isGlobalSelecting && lassoBox && (
                    <div
                        className="absolute border border-blue-500 bg-blue-500/20 pointer-events-none z-50 rounded"
                        style={{
                            left: `${lassoBox.x}px`,
                            top: `${lassoBox.y}px`,
                            width: `${lassoBox.w}px`,
                            height: `${lassoBox.h}px`,
                        }}
                    />
                )}
                {uploadFiles.length == 0 ? (
                    <div className="text-custom-text-muted select-none">
                        {dragging ? t("fileDropZone.drag") : t("fileDropZone.drop")}
                    </div>
                ) : (
                    <div className="w-full space-y-2">
                        <div className="flex justify-between items-center select-none">
                            <ButtonBar currentMode={mode} setMode={setMode} options={MODES} />
                            {mode === "type" ?
                                <Dropdown currentMode={tMode} setMode={setTMode} options={allowedModes?.FileType ? ["none", ...allowedModes.FileType] : ["none"] as const} />
                                :
                                <Dropdown currentMode={fMode} setMode={setFMode} options={allowedModes?.FileFormat ? ["none", ...allowedModes.FileFormat] : ["none"] as const} />
                            }
                            <StyledButton onClick={submitCheck}>
                                <div className="text-base text-custom-text" >{t("fileDropZone.submit")}</div>
                            </StyledButton>
                        </div>
                        {dupplicateFiles.length > 0 && dupplicateFilesBanner}
                        {(missingAttributes[0].length > 0 || missingAttributes[1].length > 0) && missingAttributesBanner}
                        <AdvancedFileList files={uploadFiles} onDeleteFile={handleRemoveFromState} isSelectionActive={isGlobalSelecting} mode={mode} colorDict={colorDict} />
                    </div>
                )}
            </div>
        </LoadHandler>
    );
}