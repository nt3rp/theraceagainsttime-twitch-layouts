export interface Completeable {
  // eslint-disable-next-line no-unused-vars
  onComplete: (id: string, event: any) => void;
}

export interface Changeable {
  // eslint-disable-next-line no-unused-vars
  onChange: (id: string, event: any) => void;
}

export interface Checkpoint {
  index?: number;
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

export interface Event {
  id: string;
  icon?: string;
  title: string;
  description?: string;
  shown?: boolean;
  occuredAt: Date;
  // TODO: add 'type'
  [x: string]: any; // Optionally supports other properties.
}
