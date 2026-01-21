
import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  onNavigate: (state: AppState) => void;
  currentState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentState }) => {
  return (
    <header className="py-6 px-4 md:px-8 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-md">
      <div 
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => onNavigate(AppState.IDLE)}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight">Aider</span>
      </div>
      <nav className="flex items-center space-x-4 md:space-x-8 text-sm font-medium">
        <button 
          onClick={() => onNavigate(AppState.IDLE)}
          className={`transition-colors ${currentState !== AppState.HISTORY ? 'text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Brainstorm
        </button>
        <button 
          onClick={() => onNavigate(AppState.HISTORY)}
          className={`transition-colors ${currentState === AppState.HISTORY ? 'text-white underline underline-offset-8' : 'text-slate-400 hover:text-white'}`}
        >
          History
        </button>
      </nav>
    </header>
  );
};

export default Header;
