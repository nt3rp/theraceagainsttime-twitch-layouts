import { h, render } from "preact";
import { Panel } from "./components/panel";

const Panels = [
  <Panel
    key="game"
    properties={{
      props: {
        style: {
          position: "absolute",
          top: "30px",
          bottom: "144px",
          left: "598px",
          aspectRatio: "4/3",
        },
      },
    }}
  >
    Camera
  </Panel>,
  <Panel
    key="camera"
    properties={{
      props: {
        style: {
          position: "absolute",
          top: "30px",
          right: "1352px",
          width: "457px",
          aspectRatio: "4/3",
        },
      },
    }}
  >
    Camera
  </Panel>,
  <Panel
    key="chat"
    properties={{
      props: {
        style: {
          position: "absolute",
          top: "373px",
          right: "1352px",
          width: "457px",
          bottom: "144px",
        },
      },
    }}
  >
    chat
  </Panel>,
  <Panel
    key="camera2"
    properties={{
      props: {
        style: {
          position: "absolute",
          top: "373px",
          right: "1352px",
          width: "457px",
          aspectRatio: "4/3",
        },
      },
    }}
  >
    Camera 2
  </Panel>,
  <Panel
    key="omnibar"
    properties={{
      props: {
        style: {
          position: "absolute",
          bottom: "0px",
          left: "0px",
          right: "0px",
          height: "114px",
        },
      },
    }}
  >
    Omnibar
  </Panel>,
];

const root = document.getElementById("container");
render(Panels, root);
