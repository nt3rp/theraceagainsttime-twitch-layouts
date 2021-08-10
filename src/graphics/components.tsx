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
      <ProgressBar
        mode="full"
        markers={[
          { id: "0", value: 0 },
          { id: "2", value: 50 },
          { id: "3", value: 100 },
          { id: "4", value: 200 },
        ]}
        value={75}
        labelFn={(el, index, arr) => {
          if (index === 0) return el.value;
          if (index === arr.length - 1) return "Banana";
          return undefined;
        }}
      />
    </Panel>
  </div>,
  container
);
