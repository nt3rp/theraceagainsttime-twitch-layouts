import { h, FunctionComponent } from "preact";

import "./css/panel.css";

export const Panel: FunctionComponent<any> = (props: any) => {
  return (
    <div {...props} className={`panel ${props.className}`}>
      {props.children}
    </div>
  );
};
