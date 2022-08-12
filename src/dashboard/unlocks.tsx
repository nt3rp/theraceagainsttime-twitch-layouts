import { h, render, FunctionComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useReplicant } from "use-nodecg";
import type { Secret } from "../extension/secrets";

// OH SHIT; how do we handle giveaways like this?
// Just shunt into giveaways list
interface Unlock {
  name: string;
  visible?: boolean;
  resolved?: boolean;
}

// If not visible, name will appear as "???"
const UnlocksRow: FunctionComponent<Unlock> = ({ name, visible, resolved }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>
        <input type="checkbox" checked={!!visible}></input>
      </td>
      <td>
        <input type="checkbox" checked={!!resolved}></input>
      </td>
    </tr>
  );
};

// List of text fields
const UnlocksPanel: FunctionComponent<any> = () => {
  const [unlocks, setUnlocks]: [Array<Unlock>, any] = useReplicant(
    "unlocks",
    []
  );
  const [name, setName] = useState("");
  const addUnlock = useCallback(() => {
    setUnlocks([
      ...(unlocks || []),
      {
        name,
        visible: false,
        resolved: false,
      },
    ]);
  }, [unlocks, name, setName]);

  return (
    <div>
      <div className="new-unlock">
        <label for="unlock"></label>
        <input
          id="unlock"
          type="text"
          value={name}
          onChange={(event) => {
            const target = event?.target as HTMLInputElement;
            setName(target.value);
          }}
        ></input>
        <button onClick={addUnlock}>Add Unlockable</button>
      </div>
      <hr />
      <table className="unlocks" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Visible</th>
            <th>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {(unlocks || []).map((s) => (
            <UnlocksRow key={s.name} {...s} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const root = document.getElementById("container")!;
render(<UnlocksPanel />, root);
