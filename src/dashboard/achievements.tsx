import { h, render, FunctionComponent, Fragment } from "preact";
import { useCallback } from "preact/hooks";
import { useReplicant } from "use-nodecg";

const copy = (obj) => JSON.parse(JSON.stringify(obj));

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedAt: Date;
}

// TODO: Figure out how to fix unused vars for typescript like this.
interface Completeable {
  onComplete: (id: string, event: any) => void; // eslint-disable-line no-unused-vars
}

const AchievementRow: FunctionComponent<Achievement & Completeable> = ({
  id,
  title,
  description,
  achieved,
  achievedAt,
  onComplete,
}: Achievement & Completeable) => {
  console.log(achieved);
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
      <td className="achieved-at">{achievedAt}</td>
    </tr>
  );
};

// TODO: Add the ability to add achievements on the fly.
const AchievementsPanel: FunctionComponent<any> = () => {
  // TODO: useReplicant should return an immutable copy of the variable. Otherwise, what's the point of the hooks?
  const [achievements, setAchievements]: [any, any] = useReplicant(
    "achievements",
    []
  );

  const onComplete = useCallback(
    (id: string, event: any) => {
      const checked = event.target.checked;
      const copied = copy(achievements);
      // NOTE: This modifies the array in place.
      copied.find((achievement) => {
        if (achievement.id !== id) return false;

        achievement.achieved = checked;
        if (checked && !achievement.achievedAt) {
          achievement.achievedAt = new Date();
        }

        if (checked) {
          // TODO: Toast.
          // window.nodecg.sendMessage('toast', achievement);
        }
        return true;
      });
      setAchievements(copied);
    },
    [achievements]
  );

  // TODO: Debounce
  // TODO: Syntax highlighting?

  return (
    <Fragment>
      <input
        id="search"
        type="text"
        autoComplete="off"
        placeholder="Search..."
        value=""
      />
      <table>
        {achievements.map((a) => (
          <AchievementRow key={a.id} {...a} onComplete={onComplete} />
        ))}
      </table>
    </Fragment>
  );
};

const root = document.getElementById("container");
render(<AchievementsPanel />, root);
