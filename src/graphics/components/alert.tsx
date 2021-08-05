import { h, FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { useReplicant } from "use-nodecg";

export interface AlertProps {
  title: string;
  description: string;
  achieved: boolean;
}

export const Alert: FunctionComponent<AlertProps> = ({
  title,
  description,
  achieved,
}: AlertProps) => (
  <li>
    {achieved ? "✅" : "❎"}
    {title}: {description}
  </li>
);

export interface AlertQueueProps {
  initialAlerts: AlertProps[];
  delay?: number;
}

// TODO: How to test this?
// TODO: Convert useTimout to function / hook
export const AlertQueue: FunctionComponent<AlertQueueProps> = ({
  initialAlerts,
  delay,
}: AlertQueueProps) => {
  const [alerts, setAlerts] = useState(initialAlerts);
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(alerts.slice(1));
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [alerts]);
  return <ul>{alerts.map((alert) => Alert(alert))}</ul>;
};

export const AchievementAlerts: FunctionComponent<any> = () => {
  const [achievements, _setAchievements]: [any, unknown] = useReplicant(
    "achievements",
    []
  );
  return (
    <ul>
      {achievements.map((a) => (
        <Alert key={a.id} {...a} />
      ))}
    </ul>
  );
};
