import { h, render } from "preact";
import { GuestCamera } from "./components/camera";

const container = document.getElementById("container");
render(<GuestCamera id="cam1" aspectRatio={"fullscreen"} />, container);
