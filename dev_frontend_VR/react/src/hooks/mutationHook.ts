import { useState, useCallback } from "react"

interface UseMutationState<TData, TVariables> {
    data: TData | null;
    loading: boolean;
    error: APIError | null;
    mutate: (variables: TVariables) => Promise<TData>;
}

export class APIError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'APIError';
        this.status = status;
    }
}

export function useMutation<TData, TVariables = unknown>(
    url: string, 
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
): UseMutationState<TData, TVariables> {
    const [data, setData] = useState<TData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<APIError | null>(null)

    const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
        setLoading(true)
        setError(null)
        
        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(variables),
            })

            if (!res.ok) {
                throw new APIError(`Failed with status ${res.status}`, res.status)
            }

            // Handles both JSON responses and empty/204 No Content responses safely
            const isJson = res.headers.get('content-type')?.includes('application/json')
            const responseData = isJson ? ((await res.json()) as TData) : ({} as TData)

            setData(responseData)
            setLoading(false)
            return responseData

        } catch (e) {
            const finalError = e instanceof APIError 
                ? e 
                : new APIError(e instanceof Error ? e.message : 'Unknown error', 0) // 0 für Netzwerkfehler
            
            setError(finalError)
            setLoading(false)
            throw finalError 
        }
    }, [url, method])

    return { data, loading, error, mutate }
}