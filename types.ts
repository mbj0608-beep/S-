export enum RoleType {
  ARTIST = '画手',
  WRITER = '写手',
  COSPLAYER = 'Coser'
}

export enum WorkRank {
  B = 'B',
  A = 'A',
  S = 'S',
  SSR = 'SSR'
}

export interface Work {
  id: string;
  title: string;
  type: RoleType;
  rank: WorkRank;
  quality: number; // Final calculated quality
  potential: number; // Final calculated potential
  views: number;
  likes: number;
  comments: number;
  income: number;
  isViral: boolean;
  createdAtMonth: number;
}

export interface CreationStage {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    qualityMod: number;
    potentialMod: number;
    risk: number;
    reqSkill?: number; // Minimum skill required
    reqInspiration?: number; // Minimum inspiration required
    aiSuspicionMod?: number; // Adds to AI suspicion
    fameMod?: number; // Adds to Fame
  }[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    effect: (state: GameState) => Partial<GameState>;
  }[];
}

// New Interface for Work Events
export interface WorkEvent {
  id: string;
  title: string;
  description: (workName: string) => string;
  effect: (work: Work, state: GameState) => { workUpdate: Partial<Work>, stateUpdate: Partial<GameState>, log: string };
}

export interface GameLog {
  month: number;
  message: string;
  type: 'positive' | 'negative' | 'neutral' | 'viral' | 'rankup' | 'danger';
}

export interface Comment {
  id: string;
  userName: string;
  content: string;
  isReplied: boolean;
  isLiked: boolean;
  rewardClaimed: boolean;
}

export interface CreatorRank {
  title: string;
  minFans: number;
  benefit: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  costMoney: number;
  costAp: number; 
  effect: (state: GameState) => Partial<GameState>;
  effectDesc: string;
}

export interface GameState {
  // Meta
  isGameOver: boolean;
  gameOverReason?: string; // Reason for game over
  gameStarted: boolean;
  playerName: string;
  role: RoleType | null;
  month: number;
  rankTitle: string;
  
  // Resources
  money: number;       
  actionPoints: number;
  maxActionPoints: number; 
  inspiration: number; 
  
  // Attributes
  skill: number;       
  fans: number;        
  mood: number;
  fame: number; // New: Reputation/Fame
  aiSuspicion: number; // New: Suspected of using AI (0-100)

  // Content
  works: Work[];
  inbox: Comment[]; 
  
  // History
  logs: GameLog[];
  monthlyStats: { month: number; fans: number; income: number }[];
}