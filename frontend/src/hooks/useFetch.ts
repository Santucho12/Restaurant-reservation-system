import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface FetchOptions extends RequestInit {
    skip?: boolean;
}

export function useFetch<T>(url: string, options: FetchOptions = {}) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const optionsKey = JSON.stringify(options);

    const fetchData = useCallback(async () => {
        if (options.skip) return;

        setLoading(true);
        setError(null);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string>),
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                const text = await response.text();
                const errData = text ? JSON.parse(text) : {};
                throw new Error(errData.message || `Error ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const result = text ? JSON.parse(text) : {};
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, token, optionsKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
