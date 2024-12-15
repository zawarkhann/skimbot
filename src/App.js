import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import Display from "./pages/Display";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/display" element={<Display />} />
        <Route path="/chat/:fileName" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
