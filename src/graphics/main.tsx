import { h, render, Fragment } from "preact";
import { useCallback, useState, useEffect } from "preact/hooks";
import { Panel } from "./components/panel";
import { useReplicant, useListenFor } from "use-nodecg";
import { clamp, percent } from "../utils";

import type {
  Checkpoint,
  DonationEvent,
  StreamEvent,
  Timer,
} from "../types/events";

import "./components/css/icons.css";
import "./css/event.css";
import { Giveaway } from "../extension/giveaways";

const STAGES = [
  { theme: "600-ad", range: [0, 600] },
  { theme: "1000-ad", range: [600, 1000] },
  { theme: "1999-ad", range: [1000, 1999] },
  { theme: "2300-ad", range: [2000, 2300] },
  { theme: "12000-bc", range: [2300, 2300] },
];

const percentClamp = (numerator: number, denominator: number) =>
  clamp(percent(numerator, denominator), 0, 100);

const Milestones = ({ hideAfter = 10000 }: any) => {
  const [visibility, setVisibility] = useState(false);
  const [campaign, _setCampaign]: [any, any] = useReplicant("campaign", {});
  const [milestones, _setMilestones]: [any, any] = useReplicant(
    "milestones",
    []
  );

  if (!campaign || milestones.length === 0) return <Fragment />;

  const { amountRaised } = campaign;
  const stageId = STAGES.findIndex(({ range }) => amountRaised >= range[0]);
  const { theme, range } = STAGES[stageId] || STAGES.at(-1);
  const [start, end] = range;
  const nextStage = STAGES[stageId + 1] || STAGES.at(-1);

  const scale = end - start;
  const position = percentClamp(amountRaised - start, scale);
  console.log(position);

  const currentMarkers = milestones.filter(
    ({ amount }: any) => end >= amount && amount >= start
  );

  const showProgress = useCallback(() => {
    setVisibility(true);
    setTimeout(() => {
      setVisibility(false);
    }, hideAfter);
  }, [setVisibility, hideAfter]);

  // TODO: Animate movement.
  // For now, just show the current
  useListenFor("donation", (event: DonationEvent) => {
    showProgress();
  });

  useListenFor("donation.show", () => {
    showProgress();
  });

  const width = "3em";
  const epochWidth = "32px";
  const epochHeight = "44px";
  return (
    <Panel
      className={`progress slide-open vertical ${
        visibility ? "show" : "hide"
      } ${theme}`}
      style={{
        position: "absolute",
        width: "100%",
        height: "100px",
        backgroundColor: "#f00",
      }}
    >
      <div className="path">
        <div className="trail">
          <div
            className="trail-start"
            style={{
              width: `${position}%`,
              top: `calc(50% - 3px)`,
              height: "6px",
              borderBottom: "6px dashed var(--ct-white)",
            }}
          ></div>
          <div
            className="current"
            style={{
              top: `calc(50% - 37px)`,
              left: `calc(${position}% - ${epochWidth}/2)`,
              width: epochWidth,
              height: epochHeight,
            }}
          ></div>
          <div
            className="trail-end"
            style={{
              width: `${100 - position}%`,
              right: "0px",
              top: `calc(50% - 3px)`,
              height: "6px",
              borderBottom: "6px dashed var(--ct-gray)",
            }}
          ></div>
        </div>
        <div className="map-icons">
          <div
            className={`marker amt-${start}`}
            style={{
              left: `calc(0% - var(--marker-width)/2)`,
              top: `calc(50% + var(--marker-height)/3)`,
            }}
          ></div>
          {currentMarkers.map(({ amount }: any) => (
            <div
              className={`marker amt-${amount}`}
              style={{
                left: `calc(${percentClamp(
                  amount - start,
                  scale
                )}% - var(--marker-height)/2)`,
                top: `calc(50% + var(--marker-height)/3)`,
              }}
            ></div>
          ))}
        </div>
        <div className="labels">
          <div
            className="marker"
            style={{
              left: `calc(0% - ${width}/2)`,
              width,
            }}
          >
            ${start}
          </div>
          {currentMarkers.map(({ amount }: any) => (
            <div
              className="marker"
              style={{
                left: `calc(${percentClamp(
                  amount - start,
                  scale
                )}% - ${width}/2)`,
                width,
              }}
            >
              ${amount}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

const DEFAULT_TIMER: Timer = {
  splits: [],
  checkpoint: undefined,
  state: "paused",
};

const Goals = () => {
  const [checkpoints, _setCheckpoints]: [Array<Checkpoint>, any] = useReplicant(
    "checkpoints",
    []
  );
  const [timer, _setTimer]: [Timer, any] = useReplicant("timer", DEFAULT_TIMER);
  const currentCheckpoint = checkpoints.find(
    (c: Checkpoint) => c.id === timer.checkpoint
  );

  if (!currentCheckpoint) return <Fragment />;

  const { id, title } = currentCheckpoint;

  return (
    <Panel className="event goal">
      <div className="label">Current checkpoint:</div>
      <div className="text">
        <div className="title">{title}</div>
      </div>
      <div className={`icon ${id}`}></div>
    </Panel>
  );
};

const EventToast = ({ icon, title, description }: any) => {
  return (
    <Fragment>
      <div className={`icon ${icon}`} />
      <div className="text">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </Fragment>
  );
};

const EventToaster = ({ duration }: any) => {
  const [state, setState]: [any, any] = useState({
    event: undefined,
    events: [],
    visible: false,
    sound: undefined,
  });

  useListenFor("stream-event", (event: StreamEvent) => {
    setState((currentState: any) => ({
      ...currentState,
      events: [...currentState?.events, event],
    }));
  });

  const { event, events, visible, sound } = state;

  const onTransitionEnd = useCallback(() => {
    if (visible) {
      setTimeout(() => {
        setState((current: any) => ({ ...current, visible: false }));
      }, duration);
    } else {
      // TODO: Define fadeout / fancier change instead of hard stop.
      sound && (sound as any).stop();
      setState((current: any) => ({
        ...current,
        event: undefined,
        sound: undefined,
      }));
    }
  }, [visible, setState, sound, duration]);

  const fireEvent = useCallback(() => {
    const [earliest, ...remaining] = events;
    if (!earliest) return;
    const eventSound: any = undefined;
    const sfx = earliest.sound || "generic";
    // TODO: SFX
    // if (sfx && nodecg.findCue(sfx)) {
    //   eventSound = nodecg.playSound(sfx);
    // }

    setState((current: any) => ({
      ...current,
      visible: true,
      event: earliest,
      events: remaining,
      sound: eventSound,
    }));
  }, [events]);

  useEffect(() => {
    if (!event && events.length > 0) {
      fireEvent();
    }
  }, [event, events]);

  return (
    <Panel
      className={`alert event slide-open vertical ${visible ? "show" : "hide"}`}
      onTransitionEnd={onTransitionEnd}
    >
      {event ? <EventToast {...event} /> : ""}
    </Panel>
  );
};

const FundsRaised = () => {
  const [campaign, _setCampaign]: [any, any] = useReplicant("campaign", {});

  return (
    <Panel>
      <div className="label" style={{ paddingBottom: "8px" }}>
        Raised for Trans Lifeline:
      </div>
      <div
        className="details"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          className="current"
          style={{ flex: 1, textAlign: "right", fontSize: "2em" }}
        >
          ${(campaign.amountRaised || 0).toFixed(2)}
        </span>
        <span className="divider">/</span>
        <span className="goal">
          {(campaign.fundraiserGoalAmount || 0).toFixed(2)}
        </span>
      </div>
    </Panel>
  );
};

const Guest = () => {
  const [guest, _setGuest]: [any, any] = useReplicant(
    "guests.current",
    undefined
  );

  if (!guest) {
    return (
      <div className={`widescreen border guest slide-open vertical hide`}></div>
    );
  }

  const { id } = guest;
  const url = `https://vdo.ninja/?view=${id.toLowerCase()}&scene&room=the_race_against_time_viii&noaudio`;

  return (
    <div className={`widescreen border guest slide-open vertical show`}>
      <iframe src={url} />
    </div>
  );
};

const GiveawayAlert = () => {
  const [giveaways, _changeGiveaways]: [Array<Giveaway>, any] = useReplicant(
    "giveaways",
    []
  );
  const [alert, setAlert] = useState(false);

  const currentGiveaway = giveaways.find(({ active }: Giveaway) => active);

  useEffect(() => {
    if (currentGiveaway) {
      setAlert(true);
      document.getElementById("app")?.classList.add("giveaway");
    } else {
      setAlert(false);
      document.getElementById("app")?.classList.remove("giveaway");
    }
  }, [currentGiveaway, setAlert]);

  const visibility = alert ? "show" : "hide";
  return (
    <Panel className={`giveaway-alert slide-open vertical ${visibility}`}>
      Giveaway in progress:{" "}
      {currentGiveaway?.title || "My super awesome giveaway"} (!giveaway to
      enter)
    </Panel>
  );
};

// TODO: console.log panel positions to help with OBS settings.
const MainPage = [
  <div className="infoNav transparent">
    <div className="widescreen border">Video</div>
    <Guest />
    <div
      className="spacer"
      style={{
        display: "flex",
        flexDirection: "column",
        placeContent: "flex-end",
      }}
    >
      <Goals />
      {/* <Panel className="event slide-open vertical show">
        <div className="icon yakra failure"></div>
        <div className="text">
          <div className="title">
            C donated $Y and this is a really long message to see what happens
            when it is too long
          </div>
          <div className="description">
            This is a really long message that the person wrote and it's unclear
            what is going to happen but we're going to show the whole thing here
            and see what happens in the HTML and maybe we'll need to fix it?
            Yeah I think we will.
          </div>
        </div>
      </Panel>
      <Panel className="event slide-open vertical show">
        <div className="icon guardian success"></div>
        <div className="text">
          <div className="title">C donated $Y</div>
          <div className="description">
            This is a really long message that the person wrote and it's unclear
            what is going to happen but we're going to show the whole thing here
            and see what happens in the HTML and maybe we'll need to fix it?
            Yeah I think we will.
          </div>
        </div>
      </Panel>
      <Panel className="event slide-open vertical show">
        <div className="icon"></div>
        <div className="text">
          <div className="title">C donated $Y</div>
          <div className="description">
            This is a really long message that the person wrote and it's unclear
            what is going to happen but we're going to show the whole thing here
            and see what happens in the HTML and maybe we'll need to fix it?
            Yeah I think we will.
          </div>
        </div>
      </Panel> */}
    </div>
    <FundsRaised />
  </div>,
  <div className="display">
    <GiveawayAlert />
    <div className="primaryVideo transparent standard">
      <EventToaster duration={5000} />
    </div>
    <Milestones />
  </div>,
];

render(MainPage, document.getElementById("app")!);
