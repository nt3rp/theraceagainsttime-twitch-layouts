import { h, render } from "preact";

interface DummyObject {
  id: number;
  name: string;
}

const dummy: DummyObject = {
  id: 1,
  name: "Guardian",
};

const container = document.getElementById("container");

render(
  <div>
    {dummy.name} (ID: {dummy.id})
  </div>,
  container
);
