import { h, render } from "preact";
import { AlertQueue, AlertProps } from "./components/alert";

const initialAlerts: AlertProps[] = [
  {
    title: "Alert 1",
    description: "It's an alert",
  },
  {
    title: "Alert 2",
    description: "It's an alert",
  },
  {
    title: "Alert 3",
    description: "It's an alert",
  },
];

const container = document.getElementById("container");
render(<AlertQueue initialAlerts={initialAlerts} delay={1000} />, container);
