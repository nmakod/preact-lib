import { h } from "preact";
import { useState } from "preact/hooks";

const PreactLib = () => {
  const title = useState("My awesome library");
  return <div>{title}</div>;
};

export { PreactLib };
