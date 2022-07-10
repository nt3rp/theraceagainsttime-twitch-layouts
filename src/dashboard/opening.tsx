import { h, render, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";

const OpeningPanel: FunctionComponent<any> = () => {
  const [start, setStart]: [boolean, any] = useReplicant("start", false);
  return (
    <label>
      <input
        type="checkbox"
        checked={start}
        onChange={() => setStart(!start)}
      />
      Start the show?
    </label>
  );
};

const root = document.getElementById("container")!;
render(<OpeningPanel />, root);
