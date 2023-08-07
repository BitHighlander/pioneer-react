// index.tsx
import { ColorModeScript } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom/client";
// fonts
import "@fontsource/plus-jakarta-sans/latin.css";

import { theme } from "lib/styles/theme";

import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <>
        <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
        <App />
    </>
);



//To publish as lib uncomment

// index.tsx
import { PioneerProvider, usePioneer } from 'lib/context/Pioneer';
import Pioneer from 'lib/components/pioneer';
export { Pioneer, PioneerProvider, usePioneer };

