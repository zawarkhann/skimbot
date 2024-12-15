import React, { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Provider to wrap the app and provide global state
export const AppProvider = ({ children }) => {
  const [globalFiles, setGlobalFiles] = useState([]); // Define global files array

  return (
    <AppContext.Provider value={{ globalFiles, setGlobalFiles }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
