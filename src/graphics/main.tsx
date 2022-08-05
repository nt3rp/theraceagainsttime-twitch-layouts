import { h, render } from "preact";

// TODO: console.log panel positions to help with OBS settings.
const MainPage = [
  <div className="infoNav transparent">
    <div className="widescreen border">Video</div>
    <div className="widescreen border">Video 2</div>
    <div className="spacer"></div>
    <div className="border">Funds raised</div>
  </div>,
  <div className="display">
    <div className="primaryVideo transparent standard"></div>
  </div>,
];

render(MainPage, document.getElementById("app")!);
