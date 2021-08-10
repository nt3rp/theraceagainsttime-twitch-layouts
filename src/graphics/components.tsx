import { h, render } from "preact";
// import { GuestCamera } from "./components/camera";
// import { Panel } from "./components/panel";
import { PollComponent } from "./components/poll";

const container = document.getElementById("container");
// render(<GuestCamera id="cam1" aspectRatio={"fullscreen"} />, container);
render(
  <div
    style={{
      position: "absolute",
      top: "100px",
      left: "100px",
      width: "400px",
      height: "100px",
    }}
  >
    <PollComponent />
  </div>,
  container
);
