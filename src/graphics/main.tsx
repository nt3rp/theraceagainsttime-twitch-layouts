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
          right: "150px",
          width: "1124px", // 1184px // 1068px
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
          left: "150px",
          width: "355px", // 456px
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
          top: "344px", // 420px
          left: "150px",
          width: "355px",
          height: "529px",
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
          top: "344px", // 420px
          left: "150px",
          width: "355px",
          aspectRatio: "4/3",
          display: "none",
        },
      },
    }}
  >
    Camera
  </Panel>,
  <Panel
    key="omnibar"
    properties={{
      props: {
        style: {
          position: "absolute",
          bottom: "0px",
          left: "150px",
          right: "150px",
          // width: "1572px",
          height: "66px",
        },
      },
    }}
  >
    Omnibar
  </Panel>,
];

const root = document.getElementById("container");
render(Panels, root);
