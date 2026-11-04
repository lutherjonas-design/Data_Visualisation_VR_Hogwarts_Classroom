import { useEffect, useMemo, useState } from "react";

interface AppendPayload<T extends string> {
    mode: T;
    attribute: string;
}

interface ColorDictProps<T extends string> {
    initialSelections?: AppendPayload<T>[];
    append?: AppendPayload<T>;
}

export const useColorDict = <T extends string>({
    initialSelections = [],
    append,
}: ColorDictProps<T>) => {
    // yes I know it is not used, but because of Tailwind optimization, this is the best way to guarantee that these colors function
    const tailwindSafelistFallback = [
        "bg-custom-list-1", "bg-custom-list-2", "bg-custom-list-3", "bg-custom-list-4",
        "bg-custom-list-5", "bg-custom-list-6", "bg-custom-list-7", "bg-custom-list-8",
        "bg-custom-list-9", "bg-custom-list-10", "bg-custom-list-11", "bg-custom-list-12",
        "bg-custom-list-13", "bg-custom-list-14", "bg-custom-list-15", "bg-custom-list-16",
        "bg-custom-list-17", "bg-custom-list-18", "bg-custom-list-19", "bg-custom-list-20"
    ] as const;
    const [registry, setRegistry] = useState<Set<string>>(() => {
        return new Set(initialSelections.map((s) => `${s.mode}:${s.attribute}`));
    });

    useEffect(() => {
        if (!append) return;

        const uniqueKey = `${append.mode}:${append.attribute}`;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRegistry((prev) => {
            if (!prev.has(uniqueKey)) {
                const next = new Set(prev);
                next.add(uniqueKey);
                return next;
            }
            return prev;
        });
    }, [append]);

    const colorDictionary = useMemo(() => {
        const result: Record<string, Record<string, string>> = {};
        const colorIndexDict: Record<string,number> = {}
        registry.forEach((entry) => {
            const [mode, attribute] = entry.split(":");
            if (!result[mode]) result[mode] = {};
            if (!colorIndexDict[mode]) colorIndexDict[mode] = 0;
            const colorIndex = (colorIndexDict[mode] % 20) + 1;
            result[mode][attribute] = `custom-list-${colorIndex}`;

            colorIndexDict[mode]++;
        });

        return result as Record<T, Record<string, string>>;
    }, [registry]);

    return colorDictionary;
};