import { useLanguage } from "../../context/LanguageContext";

interface MutationHandlerProps {
    isLoading: boolean;
    error: Error | null;
    errorMessage: string;
    children: React.ReactNode;
}

export const MutationHandler: React.FC<MutationHandlerProps> = ({
    isLoading, error, errorMessage, children
}) => {
    const { t } = useLanguage()
    if (error) {
        return (<>
            {children}
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
                ⚠️ {errorMessage}
            </div>
        </>)
    }
    if (isLoading) {
        return (<>
            {children}
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-custom-accent border-t-transparent" />
                <p className="text-sm text-custom-text-muted animate-pulse">{t("mutation_handler.load")}</p>
            </div>
        </>)
    }
    return <>{children}</>
}