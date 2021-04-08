import { h, FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

export interface AlertProps {
  title: string;
  description: string;
}

export const Alert: FunctionComponent<AlertProps> = ({
  title,
  description,
}: AlertProps) => (
  <li>
    {title}: {description}
  </li>
);

export interface AlertQueueProps {
  initialAlerts: AlertProps[];
  delay?: number;
}

// TODO: How to test this?
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
