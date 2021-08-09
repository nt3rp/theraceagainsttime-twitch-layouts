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
  title: string;
  occuredAt: Date;
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
  state: "paused" | "playing";
}
