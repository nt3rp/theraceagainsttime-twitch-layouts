import { h, render } from "preact";
// import { GuestCamera } from "./components/camera";
import { Panel } from "./components/panel";

const container = document.getElementById("container");
// render(<GuestCamera id="cam1" aspectRatio={"fullscreen"} />, container);
render(<Panel />, container);
