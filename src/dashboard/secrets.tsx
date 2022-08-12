import { h, render, FunctionComponent } from "preact";
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

  return (
    <table className="checkpoints" style={{ width: "100%" }}>
      {secrets
        .filter(({ completedAt }) => completedAt !== undefined)
        .map((s) => (
          <SecretRow key={s.name} {...s} />
        ))}
    </table>
  );
};

const root = document.getElementById("container")!;
render(<SecretsPanel />, root);
