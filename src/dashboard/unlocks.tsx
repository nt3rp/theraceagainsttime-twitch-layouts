import { h, render, FunctionComponent } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useReplicant } from "use-nodecg";
import type { Secret } from "../extension/secrets";

// OH SHIT; how do we handle giveaways like this?
// Just shunt into giveaways list
export interface Unlock {
  name: string;
  visible?: boolean;
  giveaway?: boolean;
  resolved?: boolean;
}

// If not visible, name will appear as "???"
const UnlocksRow: FunctionComponent<any> = ({
  unlock,
  unlocks,
  setUnlocks,
}) => {
  const { name, visible, resolved, giveaway } = unlock;
  const onChange = ({ target }: any) => {
    const { checked, name: attr } = target;
    setUnlocks({
      ...unlocks,
      [name]: {
        ...unlocks[name],
        [attr]: checked,
      },
    });
  };

  return (
    <tr>
      <td>{name}</td>
      <td>
        <input
          type="checkbox"
          name="visible"
          checked={!!visible}
          onChange={onChange}
        ></input>
      </td>
      <td>
        <input
          type="checkbox"
          name="giveaway"
          checked={!!giveaway}
          onChange={onChange}
        ></input>
      </td>
      <td>
        <input
          type="checkbox"
          name="resolved"
          checked={!!resolved}
          onChange={onChange}
        ></input>
      </td>
    </tr>
  );
};

// List of text fields
const UnlocksPanel: FunctionComponent<any> = () => {
  const [unlocks, setUnlocks]: [any, any] = useReplicant("unlocks", {});
  const [name, setName] = useState("");
  const [giveaway, setGiveaway] = useState(false);
  const addUnlock = useCallback(() => {
    setUnlocks({
      ...(unlocks || {}),
      [name]: {
        name,
        giveaway,
        visible: false,
        resolved: false,
      },
    });
    setName("");
    setGiveaway(false);
  }, [unlocks, name, setName, giveaway, setGiveaway]);

  return (
    <div>
      <div className="new-unlock">
        <div className="field">
          <label for="unlock">Name: </label>
          <input
            id="unlock"
            type="text"
            value={name}
            onChange={(event) => {
              const target = event?.target as HTMLInputElement;
              setName(target.value);
            }}
          ></input>
        </div>
        <div className="field">
          <label for="giveaway">Is Giveaway: </label>
          <input
            id="giveaway"
            type="checkbox"
            value={name}
            onChange={(event) => {
              const target = event?.target as HTMLInputElement;
              setGiveaway(target.checked);
            }}
          ></input>
        </div>
        <div className="field">
          <button onClick={addUnlock}>Add Unlockable</button>
        </div>
      </div>
      <hr />
      <table className="unlocks" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Visible</th>
            <th>Giveaway</th>
            <th>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(unlocks || {}).map(([_, s]: [any, any]) => (
            <UnlocksRow
              key={s.name}
              unlock={s}
              unlocks={unlocks}
              setUnlocks={setUnlocks}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const root = document.getElementById("container")!;
render(<UnlocksPanel />, root);
