import { h, render, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { copy } from "../utils";

const EventsPanel: FunctionComponent<any> = () => {
  const [eventsBarRep, setEventsBar]: [string, any] = useReplicant(
    "events-bar",
    ""
  );
  const setting = copy(eventsBarRep);
  return (
    <select
      value={setting}
      onChange={(e) => setEventsBar((e.target as any).value)}
    >
      <option value="">Events (Default)</option>
      <option value="funds">Funds Raised</option>
      <option value="checkpoints">Checkpoints</option>
    </select>
  );
};

const root = document.getElementById("container")!;
render(<EventsPanel />, root);
