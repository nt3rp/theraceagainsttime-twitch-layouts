// Domain Objects
export interface Guest {
  id: string;
  display?: string;
  live?: boolean;
  socials: Partial<Record<string, string | boolean>>;
}

// Tiltify Events
export interface DonationEvent {
  id: number;
  amount: number;
  name: string;
  comment: string;
  completedAt: number;
  rewardId?: number;
}

// Twitch Events
export interface HypetrainStartEvent {
  channel: string;
  conductor: string;
  startDate: Date;
}

export interface HypetrainEndEvent {
  channel: string;
  level: string;
  endDate: Date;
}

export interface ChatMessageEvent {
  id: string;
  channel: string;
  user: string;
  message: string;
  bits?: number;
  privileged?: boolean;
}

export interface HostEvent {
  channel: string;
  host: string;
  viewers: number;
  isRaid: boolean;
}

export interface ViewersSnapshotEvent {
  channel: string;
  viewers: number;
}

export interface FollowEvent {
  channel: string;
  user: string;
}

export interface BaseSubscriptionEvent {
  channel: string;
  subscriber: string;
  months: number;
}

export interface SubscriptionEvent extends BaseSubscriptionEvent {
  tier: number;
  isPrime: boolean;
  isGifted: boolean;
  streak?: number;
  gifter?: string;
  giftedDuration?: number;
  message?: string;
}

export interface SubscriptionExtendedEvent extends BaseSubscriptionEvent {
  extendedMonths: number;
}

export interface CommunitySubscriptionEvent {
  channel: string;
  gifter: string;
  tier: number;
  count: number;
  totalGifts?: number;
}

// TODO: Deprecate events below this point.
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
