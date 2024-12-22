import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../AppContext";

const ChatComponent = () => {
  const { userMessages, addMessage } = useAppContext();
  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      addMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userMessages]);

  return (
    <div
      style={{
        flex: 3,
        padding: "20px",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div ref={chatContainerRef} style={{ flex: 1, overflowY: "auto" }}>
        {userMessages.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <div
              style={{
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: msg.type === "user" ? "#635DFF" : "#f1f1f1",
                color: msg.type === "user" ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#635DFF",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;