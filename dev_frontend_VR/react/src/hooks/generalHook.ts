import { useEffect, useState, useCallback } from "react"

interface UseDataState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}
// type ProjectResponse = 
//     | Project[]

export function useAPI<T>(url: string): UseDataState<T> {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [version, setVersion] = useState(0)

    const refetch = useCallback(() => {
        setVersion(prev => prev + 1)
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        let isCurrentRequest = true
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch(url, { 
                    signal: controller.signal 
                })
                
                if (!res.ok) {
                    throw new Error(`Failed to load data (${res.status})`)
                }
                const json = (await res.json()) as T
                
                if (isCurrentRequest) {
                    setData(json)
                    setLoading(false)
                }

            } catch (e) {
                if (e instanceof Error && e.name === 'AbortError') {
                    return // Bei Abort tun wir nichts (wichtig!)
                }
                if (isCurrentRequest) {
                    setError(e instanceof Error ? e : new Error('Unknown error'))
                    setLoading(false)
                }
            }
        }
        
        load()
        return () => {
            isCurrentRequest = false
            controller.abort()
        }
    }, [url, version]) // useEffect triggert neu, wenn version sich ändert

    return { data, loading, error, refetch }
}