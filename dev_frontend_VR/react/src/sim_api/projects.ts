import { useState, useEffect } from "react"
import { mockData } from "./dataDict"

export function useSimApiCall<T>(goal: string, delay: number, erroring: boolean) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false

    // Setzt den Zustand bei jedem Refetch/Zustandswechsel zurück
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    const timer = setTimeout(() => {
      if (cancelled) return

      if (erroring) {
        setError(new Error(`Simulated error: ${goal}`))
      } else {
        // Dynamischer Zugriff via [goal] statt .goal
        const resolvedData = mockData[goal] ?? { message: `No mock data for ${goal}` }
        setData(resolvedData as T)
      }
      setLoading(false)
    }, delay) // Nutzt das Delay direkt im setTimeout

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [goal, delay, erroring, version])

  const refetch = () => setVersion(v => v + 1)

  return { data, loading, error, refetch }
}

export function useSimApiMutate<T>(goal: string, delay: number, erroring: boolean) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const uploadMultipleFiles = async ({slug, fileItems}) => {
      setLoading(true);
      setError(null);
      setData(null);
      return new Promise((resolve, reject)=>{
        setTimeout(()=>{
          if (erroring) {
            const thrownError = Error("simulation said wrong")
            setError(thrownError);
            setLoading(false);
            reject(thrownError)
          } else {
            const resolvedData = mockData[goal];
            setData(resolvedData);
            setLoading(false)
            resolve(resolvedData)
          }
        }, delay);
      });
  };

  return { uploadMultipleFiles, loading, error, data };
}