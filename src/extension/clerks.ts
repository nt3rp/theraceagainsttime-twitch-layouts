import type { NodeCG } from "nodecg-types/types/server";

// Record every donation, timestamped and when donations occured (for graphing purposes)
export const fundingClerk = () => {};

// Record both the time of day and time during stream events occured.
// clip this/that/it | !clip | (twitch marker)
export const clipClerk = () => {};

// Record every important event on a timeline
export const timelineClerk = () => {};

// Record checkpoints
export const checkpointClerk = () => {};

// Record all people who:
// - Donated
// - Subbed / Gifted
// - Chatted
export const creditsClerk = () => {};

export default (nodecg: NodeCG) => {};
