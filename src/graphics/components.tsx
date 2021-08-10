import { h, render } from "preact";
// import { GuestCamera } from "./components/camera";
import { Panel } from "./components/panel";
import { ProgressBar } from "./components/progress";

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
    <Panel>
      <ProgressBar mode="full" markers={[0, 100]} value={25} />
    </Panel>
  </div>,
  container
);
