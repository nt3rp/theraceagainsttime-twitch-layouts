import { h, render } from "preact";
import { Panel } from "./components/panel";
import { useReplicant } from "use-nodecg";

import "./components/css/icons.css";
import "./css/event.css";

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
  </div>,
];

render(MainPage, document.getElementById("app")!);
