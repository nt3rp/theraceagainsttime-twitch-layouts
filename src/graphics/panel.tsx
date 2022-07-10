import { h, render } from "preact";
import { Panel } from "./components/panel";

const root = document.getElementById("root")!;
render(<Panel style={{ height: "100%", width: "100%" }} />, root);
