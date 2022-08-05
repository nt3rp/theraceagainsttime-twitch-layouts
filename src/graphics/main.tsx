import { h, render } from "preact";
import { Panel } from "./components/panel";

import "./components/css/icons.css";
import "./css/event.css";

// TODO: console.log panel positions to help with OBS settings.
const MainPage = [
  <div className="infoNav transparent">
    <div className="widescreen border">Video</div>
    <div className="widescreen border">Video 2</div>
    <div
      className="spacer"
      style={{
        display: "flex",
        flexDirection: "column",
        placeContent: "flex-end",
      }}
    >
      <Panel className="event">
        <div className="icon yakra failure"></div>
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
      <Panel className="event">
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
      <Panel className="event">
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
      </Panel>
    </div>
    <Panel className="border">
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
          $135.00
        </span>
        <span className="divider">/</span>
        <span className="goal">2300.00</span>
      </div>
    </Panel>
  </div>,
  <div className="display">
    <div className="primaryVideo transparent standard"></div>
  </div>,
];

render(MainPage, document.getElementById("app")!);
