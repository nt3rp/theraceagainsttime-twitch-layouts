import { h, render } from "preact";
import { AchievementAlerts } from "./components/alert";

const container = document.getElementById("container");
render(<AchievementAlerts />, container);
