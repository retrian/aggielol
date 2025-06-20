// ───────────────────────────────────────────────────────────
// src/pages/ApiTest.jsx
// A quick front/back connectivity checker
// ───────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';

export default function ApiTest() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [status, setStatus] = useState('Idle…');
  const [payload, setPayload] = useState(null);

  const ping = async () => {
    setStatus('Pinging…');
    try {
      const res = await fetch(`${API_BASE}/api/leaderboard/entries`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPayload(data);
      setStatus('✅ Success');
      console.log('API HEALTH →', data);
    } catch (err) {
      setPayload(null);
      setStatus(`❌ ${err.message}`);
      console.error('API FAIL →', err);
    }
  };

  useEffect(() => {
    ping(); // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-3xl font-bold">API Connectivity Test</h1>

      <div className="space-y-2 text-center">
        <p><strong>API&nbsp;Base&nbsp;URL:</strong> {API_BASE}</p>
        <p><strong>Status:</strong> {status}</p>
        {payload && (
          <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {JSON.stringify(payload, null, 2)}
          </pre>
        )}
      </div>

      <button
        onClick={ping}
        className="px-6 py-2 font-semibold text-white rounded-full bg-[#500000] hover:bg-[#7f0000] transition-colors"
      >
        Ping API
      </button>
    </div>
  );
}
