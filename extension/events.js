/*
Event logger: Keeps a history of all events that happened
during the Race Against Time.
*/
module.exports = (nodecg) => {
  const events = nodecg.Replicant("events", { defaultValue: [] });

  nodecg.listenFor("event", (newEvent) => {
    // TODO: Do we need to make a copy of the event,
    // or can we use the rest operator
    // TODO: Define 'event' structure.
    // TODO: Consider logging event here (if event structure defined)
    events.value.push({ ...newEvent, date: newEvent.date || Date.now() });
  });
};
