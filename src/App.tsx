/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Beaker, 
  Atom, 
  FlaskConical, 
  Sparkles, 
  Info, 
  RotateCcw, 
  MessageCircle,
  X,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { ELEMENTS, MOLECULES, Element, Molecule } from './types';
import { askProfessorProton } from './services/geminiService';

export default function App() {
  const [beakerElements, setBeakerElements] = useState<string[]>([]);
  const [discoveredMolecule, setDiscoveredMolecule] = useState<Molecule | null>(null);
  const [professorMessage, setProfessorMessage] = useState<string>("Welcome to the ChemLab, young scientist! I'm Professor Proton. Let's mix some atoms!");
  const [isAsking, setIsAsking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showInfo, setShowInfo] = useState<Element | null>(null);

  // Check if current beaker elements form a molecule
  useEffect(() => {
    const counts: Record<string, number> = {};
    beakerElements.forEach(symbol => {
      counts[symbol] = (counts[symbol] || 0) + 1;
    });

    const found = MOLECULES.find(m => {
      const compKeys = Object.keys(m.composition);
      const countKeys = Object.keys(counts);
      if (compKeys.length !== countKeys.length) return false;
      return compKeys.every(k => m.composition[k] === counts[k]);
    });

    if (found && (!discoveredMolecule || discoveredMolecule.formula !== found.formula)) {
      setDiscoveredMolecule(found);
      setProfessorMessage(`BOOM! (The good kind!) You made ${found.name}! ${found.funFact}`);
    } else if (!found && discoveredMolecule) {
      setDiscoveredMolecule(null);
    }
  }, [beakerElements]);

  const addElement = (symbol: string) => {
    if (beakerElements.length < 6) {
      setBeakerElements([...beakerElements, symbol]);
    } else {
      setProfessorMessage("Whoa there! The beaker is getting a bit crowded. Let's clear it out or try a different mix!");
    }
  };

  const removeElement = (index: number) => {
    const newElements = [...beakerElements];
    newElements.splice(index, 1);
    setBeakerElements(newElements);
  };

  const resetBeaker = () => {
    setBeakerElements([]);
    setDiscoveredMolecule(null);
    setProfessorMessage("Fresh beaker, fresh start! What should we build next?");
  };

  const handleAskProfessor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAsking) return;

    setIsAsking(true);
    const context = beakerElements.length > 0 
      ? `The student has ${beakerElements.join(', ')} in their beaker right now.`
      : "The student is looking at the element tray.";
    
    const response = await askProfessorProton(userInput, context);
    setProfessorMessage(response);
    setUserInput("");
    setIsAsking(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] text-slate-800 font-sans selection:bg-yellow-200">
      {/* Header */}
      <header className="bg-white border-b-4 border-yellow-400 p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 p-3 rounded-2xl rotate-3 shadow-lg">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
              ChemLab <span className="text-yellow-500">Adventure</span>
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Elementary Science Lab</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-full border-2 border-slate-200">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
            P
          </div>
          <div className="text-xs font-bold uppercase tracking-tighter">
            <div className="text-slate-400">Lab Assistant</div>
            <div className="text-slate-900">Professor Proton</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Element Tray */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-3xl border-4 border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Atom className="w-24 h-24" />
            </div>
            
            <h2 className="text-xl font-black mb-4 flex items-center gap-2 uppercase italic">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Element Tray
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.values(ELEMENTS).map((el) => (
                <motion.button
                  key={el.symbol}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addElement(el.symbol)}
                  className="relative group p-4 rounded-2xl border-b-4 border-r-4 transition-all"
                  style={{ 
                    backgroundColor: `${el.color}20`, 
                    borderColor: el.color,
                    color: el.color
                  }}
                >
                  <div className="text-2xl font-black mb-1">{el.symbol}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{el.name}</div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowInfo(el);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </motion.button>
              ))}
            </div>
            
            <p className="mt-6 text-xs font-bold text-slate-400 uppercase text-center italic">
              Click an element to add it to the beaker!
            </p>
          </section>

          {/* Professor Proton's Message Box */}
          <section className="bg-blue-600 text-white p-6 rounded-3xl shadow-2xl relative border-b-8 border-blue-800">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-lg rotate-6">
                P
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium leading-relaxed italic">
                  "{professorMessage}"
                </p>
                
                <form onSubmit={handleAskProfessor} className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Professor Proton..."
                    className="w-full bg-blue-700 border-2 border-blue-500 rounded-xl py-2 px-4 text-sm placeholder:text-blue-300 focus:outline-none focus:border-white transition-colors pr-10"
                  />
                  <button 
                    type="submit"
                    disabled={isAsking}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white disabled:opacity-50"
                  >
                    {isAsking ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: The Lab Bench */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border-4 border-slate-200 shadow-2xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-2xl font-black mb-12 uppercase tracking-tight italic text-slate-400">
                The Mixing Station
              </h2>

              {/* The Beaker */}
              <div className="relative w-64 h-80">
                {/* Beaker Glass */}
                <div className="absolute inset-0 border-8 border-slate-200 border-t-0 rounded-b-[60px] bg-white/50 backdrop-blur-sm z-10">
                  <div className="absolute top-0 left-0 right-0 h-4 border-x-8 border-slate-200" />
                  <div className="absolute top-0 left-[-12px] right-[-12px] h-4 border-b-8 border-slate-200 rounded-full" />
                </div>

                {/* Elements inside beaker */}
                <div className="absolute inset-0 z-20 p-8 flex flex-wrap content-end justify-center gap-3">
                  <AnimatePresence>
                    {beakerElements.map((symbol, idx) => (
                      <motion.div
                        key={`${symbol}-${idx}`}
                        initial={{ y: -100, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ y: -5 }}
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg cursor-pointer border-2 border-white/50"
                        style={{ backgroundColor: ELEMENTS[symbol].color }}
                        onClick={() => removeElement(idx)}
                      >
                        {symbol}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Liquid Effect (if discovered) */}
                {discoveredMolecule && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '70%' }}
                    className="absolute bottom-0 left-0 right-0 bg-yellow-400/20 rounded-b-[52px] z-0"
                  />
                )}
              </div>

              {/* Controls */}
              <div className="mt-12 flex gap-4">
                <button 
                  onClick={resetBeaker}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                >
                  <RotateCcw className="w-5 h-5" />
                  CLEAR BEAKER
                </button>
              </div>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
              {discoveredMolecule && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  className="absolute bottom-8 left-8 right-8 bg-yellow-400 p-6 rounded-3xl shadow-2xl border-b-8 border-yellow-600 z-30 flex items-center gap-6"
                >
                  <div className="bg-white p-4 rounded-2xl shadow-inner">
                    <FlaskConical className="w-10 h-10 text-yellow-500" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-none">
                        {discoveredMolecule.name}
                      </h3>
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-xs font-mono font-bold">
                        {discoveredMolecule.formula}
                      </span>
                    </div>
                    <p className="text-slate-800 font-bold text-sm mt-1">
                      {discoveredMolecule.description}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Facts / Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 flex gap-4">
              <div className="bg-emerald-500 p-3 rounded-2xl h-fit shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-emerald-900 uppercase italic text-sm mb-1">Did you know?</h4>
                <p className="text-emerald-800 text-xs font-medium leading-relaxed">
                  Everything in the world is made of tiny building blocks called atoms! When atoms stick together, they form molecules.
                </p>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-100 flex gap-4">
              <div className="bg-purple-500 p-3 rounded-2xl h-fit shadow-lg">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-purple-900 uppercase italic text-sm mb-1">Lab Mission</h4>
                <p className="text-purple-800 text-xs font-medium leading-relaxed">
                  Try mixing 2 Hydrogen (H) and 1 Oxygen (O) to see what happens! Or try 1 Sodium (Na) and 1 Chlorine (Cl).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-200"
            >
              <div className="p-8 text-center relative">
                <button 
                  onClick={() => setShowInfo(null)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
                
                <div 
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-black shadow-xl mb-6 border-4 border-white"
                  style={{ backgroundColor: showInfo.color }}
                >
                  {showInfo.symbol}
                </div>
                
                <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-2">
                  {showInfo.name}
                </h3>
                
                <div className="inline-block bg-slate-100 px-4 py-1 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
                  Atomic Number: {showInfo.atomicNumber}
                </div>
                
                <p className="text-slate-600 font-medium leading-relaxed mb-8">
                  {showInfo.description}
                </p>
                
                <button
                  onClick={() => {
                    addElement(showInfo.symbol);
                    setShowInfo(null);
                  }}
                  className="w-full py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: showInfo.color }}
                >
                  ADD TO BEAKER
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-12 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
          Chemistry is everywhere! Keep exploring.
        </p>
      </footer>
    </div>
  );
}
