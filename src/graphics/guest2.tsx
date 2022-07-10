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
      height: "438px",
    }}
  />,
  <GuestCamera
    cameraId="cam1"
    key="camera1"
    style={{
      position: "absolute",
      top: "30px",
      right: "975px",
      width: "779px",
      height: "438px",
    }}
  />,
  <GuestCamera
    cameraId="cam2"
    key="camera2"
    style={{
      position: "absolute",
      bottom: "144px",
      right: "975px",
      width: "779px",
      height: "438px",
    }}
  />,
  <Camera
    key="camera"
    style={{
      position: "absolute",
      top: "30px",
      left: "975px",
      width: "779px",
      height: "438px",
      border: "4px solid #000", // Replace when we have transparent panels
      background: "#f0f",
    }}
  >
    <div className="label">TheRaceAgainstTime</div>
  </Camera>,
  <Camera
    key="game"
    style={{
      position: "absolute",
      bottom: "144px",
      left: "975px",
      width: "779px",
      height: "438px",
      border: "4px solid #000", // Replace when we have transparent panels
      background: "#f0f",
    }}
  />,
  <Events
    key="events"
    style={{
      position: "absolute",
      bottom: "0px",
      left: "0px",
      right: "250px",
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

const root = document.getElementById("container")!;
render(Panels, root);
