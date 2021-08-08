/*
Event logger: Keeps a history of all events that happened
during the Race Against Time.
*/
const TIMESTAMP_REGEX = /At$/;

module.exports = (nodecg) => {
  const events = nodecg.Replicant("events", { defaultValue: [] });

  nodecg.listenFor("event", (newEvent) => {
    // TODO: Do we need to make a copy of the event,
    // or can we use the rest operator?
    // TODO: Define 'event' structure.
    // TODO: Consider logging event here (if event structure defined)

    // while the name of the key may differ, all timestamps match the pattern
    // ____At (i.e. occuredAt, achievedAt, etc.).
    // Take the first match and use that as the occuredAt timestamp.
    const timestamp = Object.keys(newEvent).find((key) =>
      TIMESTAMP_REGEX.test(key)
    );
    events.value.push({
      ...newEvent,
      occuredAt: newEvent[timestamp] || Date.now(),
    });
  });
};
