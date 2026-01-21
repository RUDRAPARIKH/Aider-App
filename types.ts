
export interface AppIdea {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  executiveSummary: string;     // Replaces simplifiedExplanation for professional tone
  helperPrompts: string[];       
  coreFeatures: string[];
  techStack: string[];          
  userJourney: string[];        
  dataFlow: string[];           
  monetizationStrategy: string; // New: Detailed professional strategy
  relevantFacts: string[];      // New: Technical or market data points
  targetAudience: string;
  monetization: string;         // Short version for summary
  aiImplementation: {
    useCase: string;
    modelSuggestion: string;
    whyThisModel: string;
  };
  complexity: 'Low' | 'Medium' | 'High';
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  ideas: AppIdea[];
}

export enum AppState {
  IDLE = 'idle',
  LOADING = 'loading',
  RESULTS = 'results',
  ERROR = 'error',
  HISTORY = 'history'
}
