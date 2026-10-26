import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App";
import SiteAnalytics from "./components/SiteAnalytics";
import "./styles.css";
const Router = window.__MILANO_OFFLINE__ || location.protocol === 'file:' ? HashRouter : BrowserRouter;
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
      <SiteAnalytics />
    </Router>
  </React.StrictMode>,
);
import './jersey.css';

import "./identity.css";

import './kit-product.css';

import "./refinements.css";

import "./components/CarViewer.css";

import "./theme.css";
import "./performance.css";
