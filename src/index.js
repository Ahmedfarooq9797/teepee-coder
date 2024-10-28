import React from "react";
import ReactDOM from "react-dom/client";
import amplitude from "amplitude-js";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
amplitude.getInstance().init("f5f7b33cca3676266ad5912a123fe23d", null, {
  // optional configuration options
  includeUtm: true,
  includeGclid: true,
  includeReferrer: true,
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
