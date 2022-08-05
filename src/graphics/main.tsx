import { h, render } from "preact";
import { Panel } from "./components/panel";

// TODO: console.log panel positions to help with OBS settings.
const MainPage = [
  <div className="infoNav transparent">
    <div className="widescreen border">Video</div>
    <div className="widescreen border">Video 2</div>
    <div className="spacer"></div>
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
