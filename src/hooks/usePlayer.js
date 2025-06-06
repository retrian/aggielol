// src/hooks/usePlayer.js
import { useEffect, useState } from 'react';

export default function usePlayer(identifier) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!identifier) return;

    setLoading(true);
    setError(null);

    fetch(`/api/players/${identifier}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [identifier]);

  return { data, loading, error };
}
