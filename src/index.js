import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot
import App from "./App";
import { AppProvider } from "./AppContext";
import "./index.css"; // Import Tailwind CSS here

// Create the root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
