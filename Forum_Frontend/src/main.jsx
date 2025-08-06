import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/Homepage"; // this now includes all your routing logic
import ProfilePage from "./Pages/Profile";
import "./index.css"; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  </React.StrictMode>
);
