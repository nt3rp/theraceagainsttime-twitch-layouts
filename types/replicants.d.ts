export interface Achievement {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  secretDescription?: string;
  achieved?: boolean;
  achievedAt?: Date;
}

export interface Event {
  id: string;
  icon?: string;
  title: string;
  shown: boolean;
  occuredAt: Date;
  // TODO: add 'type'
  [x: string]: any; // Optionally supports other properties.
}

export interface Checkpoint {
  id: string;
  title: string;
  splits: Array<number>;
  completed: boolean;
  endingId?: string;
  previousYear: number;
  previousBest: number;
  thisYear?: number;
}

export interface Timer {
  splits: Array<number>;
  checkpoint: string | undefined;
  state: "paused" | "playing"; // TODO: Change to boolean 'paused'
}

export interface SocialMedia {
  platform: string;
  handle: string;
}

export interface Guest {
  id: string;
  displayName?: string;
  socialMedia: Array<SocialMedia>;
  camera?: string;
}

export interface Camera {
  id: string;
  name: string;
}

export interface PollOption {
  id: number;
  name: string;
  totalAmountRaised: number;
  [x: string]: any; // Optionally supports other properties.
}

export interface Poll {
  id: number;
  visible?: boolean;
  name: string;
  options: Array<PollOption>;
}
