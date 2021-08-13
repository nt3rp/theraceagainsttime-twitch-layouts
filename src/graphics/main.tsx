import { h, render } from "preact";
import { Camera, GuestCamera } from "./components/camera";
import { FundsRaised } from "./components/fundsraised";
import { Events } from "./components/events";
import { Toaster } from "./components/toaster";

// TODO: replace this with an 'Theme' so that you can use replicant? Pass these in as children?
const Panels = [
  <Toaster
    key="toaster"
    duration={5000}
    style={{
      position: "absolute",
      bottom: "114px",
      right: "0px",
      height: "113px",
    }}
  />,
  <Camera
    // aspectRatio="fullscreen"
    key="game"
    style={{
      position: "absolute",
      top: "30px",
      bottom: "144px",
      left: "598px",
      aspectRatio: "4/3", // Not supported in OBS; set explicit height;
      width: "1208px",
      border: "4px solid #000", // Replace when we have transparent panels
      background: "#f0f",
    }}
  />,
  <Camera
    // aspectRatio="fullscreen"
    key="camera"
    style={{
      position: "absolute",
      top: "30px",
      right: "1352px",
      width: "457px",
      aspectRatio: "4/3", // Not supported in OBS; set explicit height;
      height: "343px",
      border: "4px solid #000", // Replace when we have transparent panels
      background: "#f0f",
    }}
  >
    <div className="label">TheRaceAgainstTime</div>
  </Camera>,
  <Camera
    // aspectRatio="fullscreen"
    key="chat"
    style={{
      position: "absolute",
      top: "373px",
      right: "1352px",
      width: "457px",
      bottom: "144px",
      background: "#f0f",
    }}
  />,
  <GuestCamera
    cameraId="cam1"
    key="camera2"
    // aspectRatio="widescreen" // Not supported in OBS; set explicit height;
    style={{
      position: "absolute",
      top: "373px",
      right: "1352px",
      width: "457px",
      height: "255px",
    }}
  />,
  <Events
    key="events"
    style={{
      position: "absolute",
      bottom: "0px",
      left: "0px",
      right: "0px",
      height: "114px",
    }}
  />,
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
