
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Heart, Zap, Trophy, MapPin, Diamond, Rocket, ArrowUpCircle, Shield, Activity, PlusCircle, Play } from 'lucide-react';
import { useStore } from '../../store';
import { GameStatus, GEMINI_COLORS, ShopItem, RUN_SPEED_BASE } from '../../types';
import { audio } from '../System/Audio';

const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'DOUBLE_JUMP',
        name: 'DOUBLE JUMP',
        description: 'Jump again in mid-air.',
        cost: 1000,
        icon: ArrowUpCircle,
        oneTime: true
    },
    {
        id: 'MAX_LIFE',
        name: 'MAX LIFE UP',
        description: 'Adds a heart slot and heals.',
        cost: 1500,
        icon: Activity
    },
    {
        id: 'HEAL',
        name: 'REPAIR KIT',
        description: 'Restores 1 Life point.',
        cost: 1000,
        icon: PlusCircle
    },
    {
        id: 'IMMORTAL',
        name: 'IMMORTALITY',
        description: 'Active: Press Space or Tap to be invincible.',
        cost: 3000,
        icon: Shield,
        oneTime: true
    }
];

const ShopScreen: React.FC = () => {
    const { score, buyItem, closeShop, hasDoubleJump, hasImmortality } = useStore();
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        let pool = SHOP_ITEMS.filter(item => {
            if (item.id === 'DOUBLE_JUMP' && hasDoubleJump) return false;
            if (item.id === 'IMMORTAL' && hasImmortality) return false;
            return true;
        });
        pool = pool.sort(() => 0.5 - Math.random());
        setItems(pool.slice(0, 3));
    }, [hasDoubleJump, hasImmortality]);

    return (
        <div className="absolute inset-0 bg-black/90 z-[100] text-white pointer-events-auto backdrop-blur-md overflow-y-auto overflow-x-hidden">
             <div className="flex flex-col items-center justify-start min-h-full py-10 px-6">
                 <h2 className="text-3xl md:text-5xl font-black text-cyan-400 mb-2 font-cyber tracking-widest text-center">SHOP</h2>
                 <div className="flex items-center text-yellow-400 mb-8">
                     <span className="text-sm md:text-lg mr-2 font-mono">CREDITS:</span>
                     <span className="text-2xl md:text-3xl font-bold font-cyber">{score.toLocaleString()}</span>
                 </div>

                 <div className="flex flex-col md:grid md:grid-cols-3 gap-6 max-w-4xl w-full mb-10">
                     {items.map(item => {
                         const Icon = item.icon;
                         const canAfford = score >= item.cost;
                         return (
                             <div key={item.id} className="bg-gray-900/80 border border-gray-700 p-6 rounded-2xl flex flex-col items-center text-center">
                                 <div className="bg-gray-800 p-4 rounded-full mb-4">
                                     <Icon className="w-8 h-8 text-cyan-400" />
                                 </div>
                                 <h3 className="text-xl font-bold mb-2 font-cyber text-sm md:text-base">{item.name}</h3>
                                 <p className="text-gray-400 text-xs md:text-sm mb-6 h-12 flex items-center justify-center">{item.description}</p>
                                 <button 
                                    onClick={() => buyItem(item.id as any, item.cost)}
                                    disabled={!canAfford}
                                    className={`px-4 py-3 rounded-lg font-black w-full text-sm ${canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 active:scale-95' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}
                                 >
                                     {item.cost} GEMS
                                 </button>
                             </div>
                         );
                     })}
                 </div>

                 <button 
                    onClick={closeShop}
                    className="flex items-center px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl rounded-full active:scale-95 shadow-[0_0_20px_rgba(255,0,255,0.4)]"
                 >
                     RESUME <Play className="ml-2 w-5 h-5" fill="white" />
                 </button>
             </div>
        </div>
    );
};

export const HUD: React.FC = () => {
  const { score, lives, maxLives, collectedLetters, status, level, restartGame, startGame, gemsCollected, distance, isImmortalityActive, speed } = useStore();
  const target = ['G', 'E', 'M', 'I', 'N', 'I'];

  if (status === GameStatus.SHOP) return <ShopScreen />;

  if (status === GameStatus.MENU) {
      return (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm p-6 pointer-events-auto">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)] border border-white/10">
                <div className="relative w-full bg-gray-900">
                     <img src="https://www.gstatic.com/aistudio/starter-apps/gemini_runner/gemini_runner.png" alt="Cover" className="w-full h-auto block" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                     <div className="absolute inset-0 flex flex-col justify-end items-center p-8 text-center z-10">
                        <button 
                          onClick={() => { audio.init(); startGame(); }}
                          className="w-full py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-black text-xl rounded-2xl active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:border-cyan-400"
                        >
                            <span className="tracking-widest flex items-center justify-center">
                                START RUN <Play className="ml-2 w-6 h-6 fill-white" />
                            </span>
                        </button>
                        <p className="text-cyan-400/80 text-xs font-mono mt-4 tracking-widest uppercase">
                            Swipe to move & jump
                        </p>
                     </div>
                </div>
              </div>
          </div>
      );
  }

  if (status === GameStatus.GAME_OVER) {
      return (
          <div className="absolute inset-0 bg-black/95 z-[100] text-white pointer-events-auto backdrop-blur-sm flex flex-col items-center justify-center p-8">
                <h1 className="text-5xl font-black text-white mb-8 font-cyber text-center drop-shadow-[0_0_20px_red]">GAME OVER</h1>
                <div className="w-full max-w-xs space-y-3 mb-10">
                    <div className="flex justify-between font-mono bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-gray-400 uppercase text-xs">Distance</span>
                        <span className="text-xl font-bold">{Math.floor(distance)} LY</span>
                    </div>
                    <div className="flex justify-between font-mono bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-gray-400 uppercase text-xs">Score</span>
                        <span className="text-xl font-bold text-yellow-400">{score.toLocaleString()}</span>
                    </div>
                </div>
                <button onClick={() => { audio.init(); restartGame(); }} className="px-12 py-5 bg-cyan-500 text-white font-black text-xl rounded-full active:scale-95 shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                    RETRY
                </button>
          </div>
      );
  }

  if (status === GameStatus.VICTORY) {
    return (
        <div className="absolute inset-0 bg-black z-[100] text-white pointer-events-auto backdrop-blur-md flex flex-col items-center justify-center p-8">
            <Rocket className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
            <h1 className="text-4xl font-black text-yellow-400 mb-4 font-cyber text-center">MISSION COMPLETE</h1>
            <p className="text-cyan-400 text-sm font-mono mb-10 text-center tracking-widest">YOU REACHED THE EDGE OF THE COSMOS</p>
            <div className="text-5xl font-black font-cyber mb-12 text-white">{score.toLocaleString()}</div>
            <button onClick={() => { audio.init(); restartGame(); }} className="px-12 py-5 bg-white text-black font-black text-xl rounded-full active:scale-95">
                PLAY AGAIN
            </button>
        </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-50">
        <div className="flex justify-between items-start w-full">
            <div className="text-3xl md:text-5xl font-black text-cyan-400 font-cyber drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                {score.toLocaleString()}
            </div>
            <div className="flex space-x-1">
                {[...Array(maxLives)].map((_, i) => (
                    <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-gray-800'}`} />
                ))}
            </div>
        </div>
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 px-4 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <span className="text-xs font-black font-cyber text-purple-400 uppercase tracking-widest">LVL {level}</span>
        </div>

        {isImmortalityActive && (
             <div className="absolute top-32 left-1/2 -translate-x-1/2 text-yellow-400 font-black text-xl animate-pulse flex items-center font-cyber">
                 <Shield className="mr-2 w-6 h-6" /> INVINCIBLE
             </div>
        )}

        <div className="absolute top-20 left-1/2 -translate-x-1/2 flex space-x-1">
            {target.map((char, idx) => {
                const isCollected = collectedLetters.includes(idx);
                const color = GEMINI_COLORS[idx];
                return (
                    <div 
                        key={idx}
                        style={{
                            borderColor: isCollected ? color : 'rgba(255,255,255,0.1)',
                            color: isCollected ? '#000' : 'rgba(255,255,255,0.1)',
                            backgroundColor: isCollected ? color : 'transparent',
                            boxShadow: isCollected ? `0 0 15px ${color}` : 'none'
                        }}
                        className="w-7 h-9 md:w-10 md:h-12 flex items-center justify-center border-2 font-black text-sm md:text-xl font-cyber rounded-lg transition-all duration-300"
                    >
                        {char}
                    </div>
                );
            })}
        </div>

        <div className="flex justify-end opacity-60">
             <div className="flex items-center space-x-2 text-cyan-500 font-mono text-xs">
                 <Zap className="w-4 h-4" />
                 <span>SPD {Math.round((speed / RUN_SPEED_BASE) * 100)}%</span>
             </div>
        </div>
    </div>
  );
};
