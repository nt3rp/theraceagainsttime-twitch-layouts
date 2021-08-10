import { h, FunctionComponent, ComponentChildren } from "preact";
import "./css/panel.css";

export interface PanelProps {
  children?: ComponentChildren;
}

export const Panel: FunctionComponent<PanelProps> = ({
  children,
}: PanelProps) => {
  return <div className="panel">{children}</div>;
};
