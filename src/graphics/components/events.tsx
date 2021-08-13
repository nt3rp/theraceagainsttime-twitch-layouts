import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";
import { ProgressBar } from "./progress";
import { copy } from "../../utils";
import type { Event } from "../../../types/replicants";
import "./css/events.css";
import "./css/icons.css";
export const Events: FunctionComponent<any> = (props: any) => {
  const [settingRep, _setting]: [string, unknown] = useReplicant(
    "events-bar",
    ""
  );

  const setting = copy(settingRep);

  let content;
  switch (setting) {
    case "checkpoint":
      break;
    case "funds":
      content = <FundsBar />;
      break;
    default:
      content = <EventsBar />;
      break;
  }

  return <Panel {...props}>{content}</Panel>;
};

export const FundsBar: FunctionComponent<any> = () => {
  const [campaignRep, _setCampaignRep]: [any, unknown] = useReplicant(
    "campaign",
    {}
  );
  const [milestonesRep, _setMilestonesRep]: [
    Array<any>,
    unknown
  ] = useReplicant("milestones", []);
  const campaign = copy(campaignRep);
  const milestones = copy(milestonesRep).map(({ id, amount }) => ({
    id,
    value: amount,
  }));
  return (
    <ProgressBar
      value={campaign.totalAmountRaised || 0}
      markers={milestones}
      labelFn={(m) => `$${m.value}`}
      mode="full"
    />
  );
};

export const EventsBar: FunctionComponent<any> = (props: any) => {
  const [eventsRep, _setEvents]: [Array<Event>, unknown] = useReplicant(
    "events",
    []
  );
  const limit = props.limit || 10;
  const events: Array<Event> = copy(eventsRep).slice(-limit).reverse();
  return (
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
  );
};
