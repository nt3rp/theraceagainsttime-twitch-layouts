import { h, FunctionComponent, ComponentChildren } from "preact";
import "./css/panel.css";

/* Can't figure out type for JSX.HtmlAttributes
   Neither TS nor ESLint know about it :shrug:
*/
export interface ExtraProperties {
  properties?: any;
}

export interface PanelProps {
  children?: ComponentChildren;
}

export const Panel: FunctionComponent<PanelProps & ExtraProperties> = ({
  children,
  properties,
}: PanelProps & ExtraProperties) => {
  return (
    <div
      className={`panel ${properties?.classes}`}
      {...(properties?.props || {})}
    >
      {children}
    </div>
  );
};
