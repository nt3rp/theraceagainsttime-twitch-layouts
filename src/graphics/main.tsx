import { h, render, Fragment } from "preact";
import { useCallback, useState, useEffect } from "preact/hooks";
import { Panel } from "./components/panel";
import { useReplicant, useListenFor } from "use-nodecg";

import type { Checkpoint, StreamEvent, Timer } from "../types/events";

import "./components/css/icons.css";
import "./css/event.css";

const Milestones = () => {
  /*
  Keep track of current "stage" as well as next "stage"
  For now, hard-code "stages" (but still draw milestones from ... milestone replicant?)
  On stage complete, transition away from previous milestone to next one, as with 
  alert bar below?

  Simple slide down, slide up

  BUT FOR NOW, get checkpoints working again
  */
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
    <div className="primaryVideo transparent standard"></div>
    <EventToaster duration={5000} />
  </div>,
];

render(MainPage, document.getElementById("app")!);
