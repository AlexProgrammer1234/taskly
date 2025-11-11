import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Theme
        appearance="dark"
        accentColor="violet"
        grayColor="mauve"
        radius="large"
        style={{ background: "none" }}
      >
        <App />
        <Toaster />
      </Theme>
    </HashRouter>
  </React.StrictMode>
);
