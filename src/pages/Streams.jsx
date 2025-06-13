import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Users, ExternalLink, Gamepad2, Calendar, Clock } from 'lucide-react';

export default function StreamsPage() {
  const channel = 'loltamu';
  const [isLive, setIsLive] = useState(false); // Set back to false
  const [viewerCount, setViewerCount] = useState(0);

  // Simulate checking if stream is live (you'd replace with actual Twitch API call)
  useEffect(() => {
    // Placeholder for actual stream status check
    setIsLive(false);
    setViewerCount(0);
  }, []);

  // Simulate viewer count fluctuation when live
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 20 - 10));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>

        
        <motion.div 
          className="relative z-10 px-6 py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              className="mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                <span className="text-red-400">TEXAS A&M</span>
                <br />
                <span className="text-white">LEAGUE OF LEGENDS</span>
              </h1>
              <p className="text-xl text-white/80 font-medium">
                Home of the Fighting Aggies Esports Team
              </p>
            </motion.div>
            
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' : 'bg-red-500'}`}></div>
                <span className="font-semibold text-lg">{isLive ? 'LIVE NOW' : 'OFFLINE'}</span>
              </div>
              {isLive && (
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Users size={20} />
                  <span className="text-lg font-medium">{viewerCount.toLocaleString()} viewers</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Stream */}
          <div className="lg:col-span-3">
            <motion.div 
              className="relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-700"
              style={{ aspectRatio: '16/9' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {isLive ? (
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}`}
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/30 flex flex-col items-center justify-center">
                  {/* Animated background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-500/10 to-transparent rounded-full"
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-gradient-to-tl from-red-600/10 to-transparent rounded-full"
                      animate={{ 
                        rotate: -360,
                        scale: [1.2, 1, 1.2]
                      }}
                      transition={{ 
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>

                  <div className="relative z-10 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                      <div className="relative mb-8">
                        <Gamepad2 size={80} className="text-red-400 mx-auto mb-4" />
                        <motion.div
                          className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-4xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Stream Currently Offline
                    </motion.h3>
                    
                    <motion.p 
                      className="text-white/60 mb-8 text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      Check back later for live League of Legends action!
                    </motion.p>
                    
                    <motion.div
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <Button 
                        asChild
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl"
                      >
                        <a
                          href={`https://twitch.tv/${channel}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={20} />
                          Visit Our Twitch
                        </a>
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="lg"
                        className="border-white/30 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 rounded-xl"
                      >
                        <Play size={20} className="mr-2" />
                        Watch Highlights
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Stream Info Bar */}
            <motion.div 
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Stream Status</h4>
                <p className="text-gray-400 text-sm">{isLive ? 'Currently Live' : 'Currently Offline'}</p>
                <p className="text-gray-500 text-xs mt-1">Check back later for updates</p>
              </div>
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h4 className="text-white font-semibold mb-2">Follow Us</h4>
                <p className="text-gray-400 text-sm">Never miss a stream</p>
                <p className="text-red-400 text-xs mt-1 font-semibold">Stay connected</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Twitch Chat */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="text-purple-400" size={20} />
                    {isLive ? 'Live Chat' : 'Chat (Offline)'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 rounded-lg overflow-hidden">
                    {isLive ? (
                      <iframe
                        src={`https://www.twitch.tv/embed/${channel}/chat?parent=${window.location.hostname}&darkpopout`}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-900/50">
                        <div className="text-center">
                          <Users size={32} className="text-gray-500 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Chat unavailable</p>
                          <p className="text-gray-500 text-xs">Stream is offline</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}