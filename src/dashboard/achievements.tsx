/// <reference types="nodecg-types/types/browser"/>
import { h, render, FunctionComponent, Fragment } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useReplicant } from "use-nodecg";

import type { Achievement } from "../types/replicants";
import type { Completeable } from "../types/events";

const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

const AchievementRow: FunctionComponent<Achievement & Completeable> = ({
  id,
  title,
  description,
  secretDescription,
  achieved,
  onComplete,
}: Achievement & Completeable) => {
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          name={id}
          checked={achieved}
          onChange={(e) => onComplete(id, e)}
        />
      </td>
      <td className="title">{title}</td>
      <td className="description">{description}</td>
      <td className="secretDescription">{secretDescription}</td>
    </tr>
  );
};

// TODO: Add the ability to add achievements on the fly.
const AchievementsPanel: FunctionComponent<any> = () => {
  const [achievements, setAchievements]: [Array<Achievement>, any] =
    useReplicant("achievements", []);

  const onComplete = useCallback(
    (id: string, event: any) => {
      const checked = event.target.checked;
      const copied: Array<Achievement> = copy(achievements);
      // NOTE: This modifies the array in place.
      copied.find((achievement) => {
        if (achievement.id !== id) return false;
        achievement.achieved = checked;
        if (checked) {
          if (!achievement.achievedAt) {
            achievement.achievedAt = new Date();
          }
          nodecg.sendMessage("event", achievement);
        }
        return true;
      });
      setAchievements(copied);
    },
    [achievements]
  );

  const [search, setSearch] = useState("");

  const results = achievements.filter(
    ({ title, description, secretDescription = "" }) =>
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase()) ||
      secretDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Fragment>
      <input
        id="search"
        type="text"
        autoComplete="off"
        placeholder="Search..."
        onInput={(e) => setSearch((e.target as any).value)}
        value={search}
        style={{ width: "100%" }}
      />
      <table style={{ width: "100%" }}>
        <thead>
          <th />
          <th>Title</th>
          <th>Description</th>
          <th>Secret Description</th>
        </thead>
        <tbody>
          {results.length > 0 ? (
            results.map((a) => (
              <AchievementRow key={a.id} {...a} onComplete={onComplete} />
            ))
          ) : (
            <td colSpan={4}>No results found</td>
          )}
        </tbody>
      </table>
    </Fragment>
  );
};

const root: Element = document.getElementById("container")!;
render(<AchievementsPanel />, root);
