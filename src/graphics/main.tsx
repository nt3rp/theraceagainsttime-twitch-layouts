import { h, render } from "preact";
import { Panel } from "./components/panel";
import { FundsRaised } from "./components/fundsraised";

// TODO: replace this with an 'Theme' so that you can use replicant? Pass these in as children?
const Panels = [
  <Panel
    key="game"
    style={{
      position: "absolute",
      top: "30px",
      bottom: "144px",
      left: "598px",
      aspectRatio: "4/3",
    }}
  >
    Camera
  </Panel>,
  <Panel
    key="camera"
    style={{
      position: "absolute",
      top: "30px",
      right: "1352px",
      width: "457px",
      aspectRatio: "4/3",
    }}
  >
    Camera
  </Panel>,
  <Panel
    key="chat"
    style={{
      position: "absolute",
      top: "373px",
      right: "1352px",
      width: "457px",
      bottom: "144px",
    }}
  >
    Chat
  </Panel>,
  <Panel
    key="camera2"
    style={{
      position: "absolute",
      top: "373px",
      right: "1352px",
      width: "457px",
      aspectRatio: "4/3",
    }}
  >
    Camera 2
  </Panel>,
  <Panel
    key="omnibar"
    className="horizontally borderless"
    style={{
      position: "absolute",
      bottom: "0px",
      left: "0px",
      right: "0px",
      height: "114px",
    }}
  >
    <Panel>
      <span>This is the song that never ends...</span>
    </Panel>
    <Panel>
      <span>Yes it goes on and on my friends....</span>
    </Panel>
    <Panel>
      <span>Test</span>
    </Panel>
  </Panel>,
  <FundsRaised
    key="fundsraised"
    className="fundsraised"
    style={{
      position: "absolute",
      bottom: "0px",
      right: "0px",
      height: "114px",
      width: "250px",
    }}
  />,
];

const root = document.getElementById("container");
render(Panels, root);
