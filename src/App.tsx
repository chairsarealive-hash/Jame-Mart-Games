/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Game } from './types';
import gamesData from './games.json';
import { Search, Play, X, Monitor, Grid, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    // In a real app, this might fetch from an API
    setGames(gamesData);
  }, []);

  const categories = ['All', ...new Set(games.map(g => g.category))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="bg-indigo-500 p-1 rounded-lg overflow-hidden">
              <img 
                src="https://yt3.ggpht.com/8H5bh1h8OZZXBp1ZqowRBtYIHrDCrPx4ZBwgMtR3uXVNbXApyJKO0kfsbWUIqWQqKGfhOHaItQ=s176-c-k-c0x00ffffff-no-rj-mo" 
                alt="Jame Mart Games Logo" 
                className="w-8 h-8 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Jame Mart Games</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search games..." 
                className="bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div 
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col"
            >
              <div className="mb-4 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5 mr-2" />
                  Back to Library
                </button>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">
                    {selectedGame.category}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex-grow flex flex-col relative aspect-video w-full max-h-[80vh]">
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading game...</p>
                  </div>
                </div>
                <iframe 
                  src={selectedGame.iframeUrl} 
                  title={selectedGame.title}
                  className="w-full h-full border-0 relative z-10"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedGame.title}</h2>
                <p className="text-slate-400 max-w-3xl">{selectedGame.description}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Categories */}
              <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Grid */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      layoutId={`game-${game.id}`}
                      className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
                      onClick={() => setSelectedGame(game)}
                      whileHover={{ y: -4 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-900">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold shadow-lg">
                            <Play className="w-3 h-3 mr-1 fill-current" /> Play Now
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{game.title}</h3>
                        </div>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">{game.description}</p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/50">
                          <span className="text-xs font-medium text-slate-500 bg-slate-900/50 px-2 py-1 rounded">{game.category}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-slate-800 inline-flex p-4 rounded-full mb-4">
                    <Search className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">No games found</h3>
                  <p className="text-slate-400">Try adjusting your search or category filter.</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Jame Mart Games. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
