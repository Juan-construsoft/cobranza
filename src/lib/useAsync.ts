import { useCallback, useEffect, useRef, useState } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    reload: () => void;
}

// Carga async con estado repetible. `fn` se re-ejecuta cuando cambian las deps
// o al llamar reload(); las respuestas fuera de orden se descartan.
export function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);
    const callIdRef = useRef(0);

    useEffect(() => {
        const callId = ++callIdRef.current;
        setLoading(true);
        setError(null);
        fn().then(
            result => {
                if (callId === callIdRef.current) {
                    setData(result);
                    setLoading(false);
                }
            },
            err => {
                if (callId === callIdRef.current) {
                    setError(err instanceof Error ? err.message : 'Error inesperado.');
                    setLoading(false);
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, tick]);

    const reload = useCallback(() => setTick(t => t + 1), []);

    return { data, loading, error, reload };
}
