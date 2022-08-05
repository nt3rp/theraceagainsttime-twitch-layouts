import { h, render } from "preact";

const MainPage = [
  <div className="infoNav transparent"></div>,
  <div className="display">
    <div className="primaryVideo transparent"></div>
  </div>,
];

render(MainPage, document.getElementById("app")!);
