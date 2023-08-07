// index.tsx
import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom/client";
// fonts
import "@fontsource/plus-jakarta-sans/latin.css";

import Pioneer from "lib/components/pioneer";
import { PioneerProvider, usePioneer } from "lib/context/Pioneer";
import { theme } from "lib/styles/theme";

import App from "./App";

// To publish as lib uncomment

// index.tsx

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <App />
  </>
);
export { Pioneer, PioneerProvider, usePioneer };
