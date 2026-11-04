import React from "react";

interface TooltipProp{
    text: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProp> = ({ text, children }) => (
    <div className="group relative inline-block">
        {children}
        <div className="pointer-events-none absolute -bottom-8 left-1/2
            -translate-x-1/2 whitespace-nowrap rounded bg-custom-bg-soft
            px-2 py-1 text-custom-text opacity-0 transition-opacity
            group-hover:opacity-100 z-50 shadow-md"
        >
            {text}
        </div>
    </div>
);
