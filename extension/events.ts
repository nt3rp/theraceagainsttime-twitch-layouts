import { NodeCG, Replicant } from "nodecg-types/types/server"
/*
Event logger: Keeps a history of all events that happened
during the Race Against Time.
*/
const TIMESTAMP_REGEX = /At$/;
const copy = (obj) => JSON.parse(JSON.stringify(obj));

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

export default (nodecg: NodeCG) => {
  nodecg.Replicant("events-bar", { defaultValue: "" });
  const events: Replicant<Array<Event>> = nodecg.Replicant("events", { defaultValue: [] });

  nodecg.listenFor("event", (e) => {
    const newEvent = copy(e);
    // TODO: Define 'event' structure.
    // TODO: Consider logging event here (if event structure defined)

    // while the name of the key may differ, all timestamps match the pattern
    // ____At (i.e. occuredAt, achievedAt, etc.).
    // Take the first match and use that as the occuredAt timestamp.
    const timestamp: any = Object.keys(newEvent).find((key) =>
      TIMESTAMP_REGEX.test(key)
    );
    events.value.push({
      ...newEvent,
      shown: false,
      occuredAt: newEvent[timestamp] || Date.now(),
    });
  });
};
