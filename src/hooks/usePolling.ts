import { useEffect, useRef } from "react"

interface PollingOptions<T> {
  id: string | null;               // tempId or submissionId
  isActive: boolean;               // whether polling should start
  onPoll: (id: string) => Promise<T | null>; // API function to call
  onSuccess: (data: T) => void;    // called when result is ready
  onError?: (err: any) => void;    // optional error callback
  timeout?: number;                // ms before giving up (default 10s)
  interval?: number;               // ms between polls (default 500ms)
}

export function usePolling<T>({
  id,
  isActive,
  onPoll,
  onSuccess,
  onError,
  timeout = 10000,
  interval = 500,
}: PollingOptions<T>) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!id || !isActive) return
    const start = Date.now()

    timerRef.current = setInterval(async () => {
      try {
        const result = await onPoll(id)
        if (result) {
          onSuccess(result)
          clearInterval(timerRef.current!)
        } else if (Date.now() - start > timeout) {
          clearInterval(timerRef.current!)
        }
      } catch (err) {
        clearInterval(timerRef.current!)
        onError?.(err)
      }
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [id, isActive, onPoll, onSuccess, onError, timeout, interval])
}
