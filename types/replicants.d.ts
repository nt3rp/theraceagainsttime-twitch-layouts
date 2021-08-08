export interface Achievement {
  id: string;
  title: string;
  description: string;
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
