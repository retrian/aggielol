// src/pages/Streams.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StreamsPage() {
  const channel = 'loltamu';
  const [isLive, setIsLive] = useState(false);
  const [activePrediction, setActivePrediction] = useState({
    question: 'Will the game end before 46:00?',
    yesPct: 0.5049,
    noPct: 0.4951,
    timer: 15,
  });

  // countdown
  useEffect(() => {
    if (!isLive) return;
    const iv = setInterval(() => {
      setActivePrediction(p =>
        p.timer > 0 ? { ...p, timer: p.timer - 1 } : p
      );
    }, 1000);
    return () => clearInterval(iv);
  }, [isLive]);

  // stub: detect live status (you’d hit Twitch API here)
  useEffect(() => {
    // pretend we fetch and find offline
    setIsLive(false);
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen py-12">
      <motion.h1
        className="text-5xl font-black text-center text-[#500000] mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Live Stream & Predictions
      </motion.h1>

      <div className="max-w-7xl mx-auto px-6 flex gap-8">
        {/* === Video Column === */}
        <div className="flex-2 relative rounded-3xl overflow-hidden shadow-2xl" style={{ minHeight: '75vh' }}>
          <iframe
            src={`https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`}
            allowFullScreen
            className="w-full h-full"
          />

          {/* Offline Overlay */}
          {!isLive && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800 mb-4">Offline</span>
              <a
                href={`https://twitch.tv/${channel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#500000] font-semibold hover:underline"
              >
                Visit {channel}’s channel
              </a>
            </div>
          )}

          {/* Prediction Overlay */}
          {isLive && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-lg font-semibold text-gray-800">
                {activePrediction.question}
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  disabled={!isLive}
                  className="bg-[#500000] hover:bg-[#400000] text-white px-4 py-1"
                >
                  Yes {(activePrediction.yesPct * 100).toFixed(1)}%
                </Button>
                <Button variant="outline" disabled={!isLive} className="px-4 py-1">
                  No {(activePrediction.noPct * 100).toFixed(1)}%
                </Button>
              </div>
              <span className="font-mono text-gray-700">{activePrediction.timer}s</span>
            </motion.div>
          )}
        </div>

        {/* === Sidebar === */}
        <div className="flex-1 flex flex-col gap-8" style={{ minHeight: '75vh', position: 'sticky', top: '12vh' }}>
          {/* Active Predictions */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-[#500000]">Active Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLive ? (
                <div className="p-4 bg-white rounded-2xl shadow hover:shadow-lg">
                  <h4 className="font-semibold text-gray-800">{activePrediction.question}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Yes: {(activePrediction.yesPct * 100).toFixed(1)}% &nbsp;|&nbsp;
                    No: {(activePrediction.noPct * 100).toFixed(1)}%
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 italic">No active predictions (stream is offline).</p>
              )}
            </CardContent>
          </Card>

          {/* Twitch Chat */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-[#500000]">Twitch Chat</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <iframe
                src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}`}
                className="w-full h-full"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
