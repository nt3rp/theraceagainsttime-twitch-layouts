import { h, render } from "preact";
// import { GuestCamera } from "./components/camera";
import { Panel } from "./components/panel";
import { ProgressBar } from "./components/progress";

const container = document.getElementById("container");
// render(<GuestCamera id="cam1" aspectRatio={"fullscreen"} />, container);
render(
  <Panel>
    <ProgressBar mode="full" markers={[0, 100]} value={25} />
  </Panel>,
  container
);
