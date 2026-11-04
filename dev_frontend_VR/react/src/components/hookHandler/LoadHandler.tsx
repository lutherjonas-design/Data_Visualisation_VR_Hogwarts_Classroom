import { useLanguage } from "../../context/LanguageContext";

interface LoadHandlerProps {
    name: string;
    isLoading: boolean;
    error: Error | null;
    children: React.ReactNode;
    errorDecorator?: React.ReactNode;
    loadingDecorator?: React.ReactNode;
    overloadMessage?: boolean;
}

export const LoadHandler: React.FC<LoadHandlerProps> = ({
    name, isLoading, error, children, errorDecorator, loadingDecorator, overloadMessage
}) => {
    const { t } = useLanguage()
    if (error) {
        return (<>
            {errorDecorator}
            {!overloadMessage && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
                ⚠️ {t(name)}  {t("loading.error")}
            </div>}
        </>)
    }
    if (isLoading) {
        return (<>
            {loadingDecorator}
            {!overloadMessage && <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-custom-accent border-t-transparent" />
                <p className="text-sm text-custom-text-muted animate-pulse">{t(name)} {t("loading.loading")}</p>
            </div>}
        </>)
    }
    return <>{children}</>
}