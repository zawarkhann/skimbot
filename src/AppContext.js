import React, { createContext, useContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Provider to wrap the app and provide global state
export const AppProvider = ({ children }) => {
  const [globalFiles, setGlobalFiles] = useState([]); // Define global files array
  const [filename, setfilename] = useState("");
  const [userMessages, setUserMessages] = useState([]); // Array of user messages

  const aiResponses = [
    "Hello! How can I assist you today?",
    "Sure! Here's the information you requested.",
    "I'm sorry, I didn't quite catch that. Could you repeat?",
    "Your query is being processed, please hold on.",
    "That's an interesting question! Let me find the answer for you.",
    "I'm here to help. What do you need assistance with?",
    "Here's a detailed response to your question.",
    "Oops! It seems there was a slight issue. Let me try again.",
    "Is there anything else I can help you with?",
    "That's beyond my current knowledge, but I'm learning every day!",
    "Here's a summary for you to review.",
    "Feel free to ask anything – I'm ready to assist.",
    "Thank you for your patience! Here's the result.",
    "It seems like a technical question. Let me dive deeper.",
    "I hope this answers your question. If not, let me know!",
  ];

  // Function to add a user message and get an AI response
  const addMessage = (userMessage) => {
    const randomAIResponse =
      aiResponses[Math.floor(Math.random() * aiResponses.length)];
    setUserMessages((prev) => [
      ...prev,
      { type: "user", text: userMessage },
      { type: "ai", text: randomAIResponse },
    ]);
  };

  // Function to clear chat history
  const clearMessages = () => {
    setUserMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        globalFiles,
        setGlobalFiles,
        setfilename,
        filename,
        userMessages,
        addMessage,
        clearMessages, // Add clearMessages to the context
      }}
    >
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

export default AppProvider;
