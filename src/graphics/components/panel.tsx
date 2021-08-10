import { h, FunctionComponent, ComponentChildren } from "preact";
import "./css/panel.css";

/* Can't figure out type for JSX.HtmlAttributes
   Neither TS nor ESLint know about it :shrug:
*/
export interface HtmlAttributes {
  classNames?: string;
}

export interface PanelProps {
  children?: ComponentChildren;
}

export const Panel: FunctionComponent<PanelProps & HtmlAttributes> = ({
  children,
  classNames,
}: PanelProps & HtmlAttributes) => {
  return <div className={`panel ${classNames}`}>{children}</div>;
};
