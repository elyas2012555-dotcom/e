
export interface Bidder {
  id: string;
  username: string;
  avatar: string;
  totalCoins: number;
}

export interface AccessRequest {
  id: string;
  name: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

export enum AuctionStatus {
  OFFLINE = 'OFFLINE',
  RUNNING = 'RUNNING',
  DALY = 'DALY',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface AuctionState {
  timeLeft: number;
  dalyTimeLeft: number;
  initialDalyTime: number;
  status: AuctionStatus;
  bidders: Bidder[];
  totalParticipants: number;
  snipeDelay: number;
  minBid: number;
  connectionStatus: ConnectionStatus;
  winner?: Bidder | null;
}
