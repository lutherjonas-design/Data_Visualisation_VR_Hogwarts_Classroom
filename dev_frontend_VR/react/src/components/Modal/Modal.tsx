import React from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  height?: boolean; // True enables bounded height
  lock?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md", 
  height = false,
  lock
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-custom-text/30 p-4"
      onClick={() =>!lock && onClose()}
    >
      <div
        className={`w-full rounded-lg bg-custom-bg p-6 shadow-xl flex flex-col ${sizeClasses[size]} ${
          height ? "h-[80vh]" : "h-auto"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between flex-shrink-0">
          <h1 className="text-lg font-semibold">{title}</h1>
          {!lock && <button onClick={() =>!lock && onClose()} className="text-custom-accent hover:text-custom-accent/50" disabled={lock}>✕</button>}
        </div>
        {/* Body */}
        <div className={`min-h-0 flex-1 flex flex-col ${height ? "overflow-y-auto" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};