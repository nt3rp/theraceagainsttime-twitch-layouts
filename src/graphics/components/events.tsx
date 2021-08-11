import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";
import { copy } from "../../utils";
import type { Event } from "../../../types/replicants";
import "./css/events.css";
import "./css/icons.css";
export const Events: FunctionComponent<any> = (props: any) => {
  const [eventsRep, _setEvents]: [Array<Event>, unknown] = useReplicant(
    "events",
    []
  );
  const limit = props.limit || 10;
  const events: Array<Event> = copy(eventsRep).slice(-limit).reverse();

  return (
    <Panel {...props}>
      <div className="events horizontally reversed">
        {events.map(({ id, title, description }: Event) => (
          <Panel key={id} className="event">
            <div className={`icon ${id}`} />
            <div className="text">
              <div className="title">{title}</div>
              <div className="description">{description}</div>
            </div>
          </Panel>
        ))}
      </div>
    </Panel>
  );
};
