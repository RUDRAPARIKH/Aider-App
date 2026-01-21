
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { AppIdea, AppState, HistoryItem } from './types';
import { brainstormIdeas } from './services/gemini';

const HISTORY_KEY = 'aider_brainstorm_history';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [ideas, setIdeas] = useState<AppIdea[]>([]);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [selectedIdea, setSelectedIdea] = useState<AppIdea | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (query: string, resultIdeas: AppIdea[]) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      query,
      timestamp: Date.now(),
      ideas: resultIdeas
    };
    const updatedHistory = [newItem, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const handleBrainstorm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setStatus(AppState.LOADING);
    setError(null);
    setSelectedIdea(null);
    
    try {
      const results = await brainstormIdeas(prompt);
      setIdeas(results);
      saveToHistory(prompt, results);
      setStatus(AppState.RESULTS);
    } catch (err: any) {
      setError(err.message || 'Architecture generation failed.');
      setStatus(AppState.ERROR);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    setPrompt(item.query);
    setIdeas(item.ideas);
    setSelectedIdea(null);
    setStatus(AppState.RESULTS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Header onNavigate={setStatus} currentState={status} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:px-8">
        
        {status !== AppState.HISTORY ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                Architect Your <br />
                <span className="gradient-text">AI Enterprise</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto mb-10">
                Generate high-performance system blueprints with production-grade roadmaps and technical market validation.
              </p>

              <form onSubmit={handleBrainstorm} className="relative max-w-3xl mx-auto">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., 'Omni-channel logistic optimization' or 'Neural risk-assessment engine'"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-3xl px-8 py-5 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-40 shadow-2xl"
                />
                <button
                  type="submit"
                  disabled={status === AppState.LOADING}
                  className="absolute right-3 top-3 bottom-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold px-8 rounded-2xl transition-all flex items-center gap-2"
                >
                  {status === AppState.LOADING ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Initialize</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {status === AppState.LOADING && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-full animate-ping"></div>
                  </div>
                </div>
                <p className="mt-8 text-slate-400 font-mono text-xs tracking-widest uppercase animate-pulse">Designing Infrastructure...</p>
              </div>
            )}

            {status === AppState.RESULTS && (
              <div className="space-y-16">
                <div className="grid md:grid-cols-3 gap-8">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() => setSelectedIdea(idea)}
                      className={`cursor-pointer p-8 rounded-[2.5rem] transition-all border group flex flex-col h-full ${
                        selectedIdea?.id === idea.id
                          ? 'bg-blue-600/10 border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.02]'
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 shadow-xl'
                      }`}
                    >
                      <div className="mb-6 flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-slate-800 text-slate-400 rounded-full">
                          {idea.complexity} Rank
                        </span>
                      </div>
                      <h3 className="text-2xl font-black mb-3 group-hover:text-blue-400 transition-colors leading-tight">{idea.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-4 italic">"{idea.tagline}"</p>
                      <p className="text-slate-400 text-sm line-clamp-3 flex-1 mb-8 leading-relaxed">
                        {idea.solution}
                      </p>
                      <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                        <span className="text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                          Analyze Architecture
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedIdea && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                      <div className="space-y-8">
                        <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800">
                          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                            Executive Summary
                          </div>
                          <h2 className="text-4xl font-black mb-4">{selectedIdea.title}</h2>
                          <p className="text-slate-300 text-xl leading-relaxed font-medium">
                            {selectedIdea.executiveSummary}
                          </p>
                        </div>

                        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
                          <h4 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                               </svg>
                            </div>
                            Technical Implementation Roadmap
                          </h4>
                          <div className="space-y-5">
                            {selectedIdea.helperPrompts.map((p, i) => (
                              <div key={i} className="group relative">
                                <pre className="bg-slate-950 p-6 rounded-2xl text-[11px] text-emerald-500 font-mono overflow-x-auto whitespace-pre-wrap border border-slate-800/80 group-hover:border-blue-500/50 transition-all">
                                  {p}
                                </pre>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(p)}
                                  className="absolute top-4 right-4 text-slate-700 hover:text-white transition-colors p-2 rounded-lg bg-slate-900/50"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012-2m0 0h2a2 2 0 012 2m0 0h2a2 2 0 012 2" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-emerald-500/20 shadow-xl">
                          <h4 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-tight">
                            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            System Facts & Market Logic
                          </h4>
                          <ul className="space-y-4">
                            {selectedIdea.relevantFacts.map((fact, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                                {fact}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-8 sticky top-32">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-10 rounded-[2.5rem]">
                          <h4 className="text-xl font-black mb-8 text-white uppercase tracking-widest">
                             Foundation Stack
                          </h4>
                          <div className="grid grid-cols-2 gap-3 mb-10">
                            {selectedIdea.techStack.map((tech, i) => (
                              <div key={i} className="bg-slate-950/60 px-4 py-3 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-tighter">
                                {tech}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-8 pt-8 border-t border-slate-800/50">
                             <div>
                               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Primary AI Engine</p>
                               <p className="text-white font-bold text-2xl tracking-tight">{selectedIdea.aiImplementation.modelSuggestion}</p>
                             </div>
                             <div>
                               <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Monetization Model</p>
                               <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/40 p-6 rounded-2xl border border-slate-800/50">
                                 {selectedIdea.monetizationStrategy}
                               </p>
                             </div>
                          </div>
                        </div>

                        <div className="bg-slate-900/20 p-8 rounded-[2rem] border border-slate-800/50">
                           <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">User Flow Protocol</h4>
                           <div className="space-y-3">
                              {selectedIdea.userJourney.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                   <span className="text-blue-500">0{idx+1}</span>
                                   {step}
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
             <div className="flex items-center justify-between mb-12">
               <h1 className="text-5xl font-black tracking-tight">System Registry</h1>
               {history.length > 0 && (
                 <button onClick={() => { if(confirm("Wipe architecture history?")) { localStorage.removeItem(HISTORY_KEY); setHistory([]); } }} className="text-slate-600 hover:text-red-400 font-bold text-sm transition-colors">Clear Archive</button>
               )}
             </div>
             {history.length === 0 ? (
               <div className="text-center py-32 bg-slate-900/10 border-2 border-dashed border-slate-800/50 rounded-[3rem]">
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Repository Inactive</p>
               </div>
             ) : (
               <div className="grid gap-6">
                 {history.map(item => (
                   <div key={item.id} onClick={() => loadFromHistory(item)} className="p-8 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group flex items-center justify-between shadow-xl">
                      <div>
                        <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">{item.query}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span>{item.ideas.length} Variations</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                        <svg className="w-5 h-5 text-slate-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </main>
      
      <footer className="py-20 border-t border-slate-900 bg-black/40 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
          Strategic Engineering Intelligence.
        </p>
      </footer>
    </div>
  );
};

export default App;
