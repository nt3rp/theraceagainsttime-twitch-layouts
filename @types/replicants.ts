export interface Achievement {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  secretDescription?: string;
  achieved?: boolean;
  achievedAt?: Date;
}
