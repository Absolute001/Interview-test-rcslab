/** @jsxImportSource @emotion/react */

import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Global, css } from "@emotion/react";
import { App } from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);



const global = css`
  body,
  html {
    padding: 0;
    margin: 0;
    font-family: sans-serif;
  }
`;

root.render(
  <React.StrictMode>
    <Global styles={global} />
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
