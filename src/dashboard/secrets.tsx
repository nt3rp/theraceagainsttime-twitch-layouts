import { h, render, FunctionComponent, Fragment } from "preact";
import { useReplicant } from "use-nodecg";
import type { Secret } from "../extension/secrets";

const subjectToIcon = {
  donation: "💸",
  "donation.total": "💰",
  chat: "💬",
  "subscription.community": "🎁",
  bits: "🔹",
  viewers: "👁‍🗨",
  "host.total": "🥳",
  "follow.total": "🛤",
};

const SecretRow: FunctionComponent<Secret> = ({
  name,
  description,
  subject,
}) => {
  return (
    <tr>
      <td title={subject}>{subjectToIcon[subject]}</td>
      <td className="name">{name}</td>
      <td className="description">{description || "No description"}</td>
    </tr>
  );
};

const SecretsPanel: FunctionComponent<any> = () => {
  const [secrets, _setSecrets]: [Array<Secret>, any] = useReplicant(
    "secrets",
    []
  );

  // TODO :Show count
  const triggeredSecrets = secrets.filter(
    ({ completedAt }) => completedAt !== undefined
  );

  return (
    <Fragment>
      <div>Total secrets triggered: {(triggeredSecrets || []).length}</div>{" "}
      <hr />
      <table className="checkpoints" style={{ width: "100%" }}>
        {triggeredSecrets.map((s) => (
          <SecretRow key={s.name} {...s} />
        ))}
      </table>
    </Fragment>
  );
};

const root = document.getElementById("container")!;
render(<SecretsPanel />, root);
