import type React from "react"

interface styled_buttonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}

export const StyledButton: React.FC<styled_buttonProps> = ({
    children, onClick, disabled
}) => {
    return (
        <button type="button" className="bg-custom-accent text-custom-text rounded-lg px-2 py-1 cursor-pointer"
            onClick={onClick} disabled={disabled}
        >
            {children}
        </button>
    )
}