import React, { useEffect, useState , useRef} from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../AppContext";

const Chat = () => {
  const location = useLocation();
  const file = location.state?.file;
  const { filename, userMessages, addMessage } = useAppContext(); // Get filename from AppContext
  const [inputMessage, setInputMessage] = useState("");
  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      addMessage(inputMessage.trim()); // Add user message and AI response
      setInputMessage(""); // Clear the input field
    }
  };
  const chatContainerRef = useRef(null); // Ref for the chat container

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [userMessages]);
  console.log(filename);
  const [fileURL, setFileURL] = useState(null);
  const [fileContent, setFileContent] = useState(""); // For TXT content
  const [loading, setLoading] = useState(true);

  const fileType = file?.name.split(".").pop().toLowerCase();

  // Function to handle TXT files
  const handleTextFile = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleDocxFile = async () => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(",")[1]; // Extract Base64 string
        const payload = {
          Parameters: [
            {
              Name: "File",
              FileValue: { Name: file.name, Data: base64Data },
            },
            { Name: "StoreFile", Value: true },
          ],
        };

        const response = await axios.post(
          "https://v2.convertapi.com/convert/docx/to/pdf?auth=secret_uZ5HSNMOYRhgaNhj",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        const pdfURL = response.data.Files[0]?.Url;
        if (pdfURL) {
          setFileURL(pdfURL); // Set the converted PDF URL
          setFileContent(""); // Clear any file content for TXT
        } else {
          console.error("No file URL returned from ConvertAPI");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error converting DOCX file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!file) return;

    if (fileType === "pdf") {
      setFileURL(URL.createObjectURL(file)); // Display PDF directly
      setLoading(false);
    } else if (fileType === "txt") {
      handleTextFile(); // Display TXT content
    } else if (fileType === "docx") {
      handleDocxFile(); // Convert DOCX to PDF
    } else {
      console.error("Unsupported file type");
      setLoading(false);
    }
  }, [file, fileType]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Vertical Navbar */}
      <div
        style={{
          width: "60px",
          backgroundColor: "#f1f1f1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <img src="/icon.png" alt="Logo" style={{ width: "auto", height: "auto" }} />
        </div>

        <div>
          <img src="/navicons.png" alt="Navicons" style={{ width: "auto", height: "auto" }} />
        </div>

        <div style={{ marginTop: "auto", marginBottom: "10px" }}>
          <img src="/avatar.png" alt="User Avatar" style={{ width: "40px", height: "auto" }} />
        </div>
      </div>

      {/* File Preview Section */}
      <div
        style={{
          flex: 2,
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
       <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[16px] leading-[28px] tracking-[-0.01em] mb-10">{filename}</h4>
        <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />
        {loading && <p>Refresh The Window Or Try Selecting Doc Again</p>}

        {/* Show filename above the TXT content */}
        {fileType === "txt" && fileContent && !loading && (
          <>
                       <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[18px] leading-[24px] tracking-[-0.008em]">
  Preview
</h4>  {/* Display the filename */}
            <div
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                whiteSpace: "pre-wrap",
                backgroundColor: "#f9f9f9",
              }}
            >
              {fileContent}
            </div>
          </>
        )}

        {/* PDF or Converted DOCX file */}
        {fileURL && !loading && (
          <>
           <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[18px] leading-[24px] tracking-[-0.008em]">
  Preview
</h4> {/* Display the filename above the PDF */}
            <div style={{ height: "80vh" }}>
              <DocViewer
                documents={[{ uri: fileURL, name: filename, fileType: "pdf" }]} // Set the filename here
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                      disableHeader: false, // Show header
                      disableFileName: true, // Hide the file name
                    },
                  }}
              />
            </div>
          </>
        )}
      </div>

      {/* Chat Section */}
      <div
  style={{
    flex: 3,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  }}
>
  {/* Header Section */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    }}
  >
    {/* Dropdown */}
    <select className="
  w-[320px] h-[48px] min-h-[48px] 
  px-3 py-2 
  border border-gray-300 rounded-[123px] 
  outline-none cursor-pointer 
  font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#475569]

">
  <option value="read">Read</option>
  <option value="write">Write</option>
  <option value="review">Review</option>
</select>

    {/* Download Button */}
    <div className="bg-[#4F46E5] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-700">
                <span className="text-[16px] leading-[22px] font-bold font-['Plus_Jakarta_Sans'] tracking-[-0.007em]">
                  Download Now
                </span>
                <img src="/Download.png" alt="Download" className="h-auto w-auto" />
              </div>
  </div>
  <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />

  {/* Chat Box */}
  
      {/* Chat Section */}
      <div
        ref={chatContainerRef} // Attach ref to chat container
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {userMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* User's Message */}
            {msg.type === "user" && (
              <>
                <div className="bg-[#635DFF] text-white rounded-lg py-2 px-4 max-w-md">
                  {msg.text}
                </div>
                <img
                  src="/client.png"
                  alt="User"
                  className="ml-2 w-8 h-8 rounded-full object-cover"
                />
              </>
            )}

            {/* AI's Message */}
            {msg.type === "ai" && (
              <>
                <img
                  src="/ai.png"
                  alt="User"
                  className="ml-2 w-8 h-8 rounded-full object-cover"
                />
                <div className="ml-2 bg-white border rounded-lg p-4 shadow-sm max-w-md">
                  <p className="text-gray-700">{msg.text}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex items-center p-4 border-t bg-white">
        <input
          type="text"
          placeholder="Ask anything ..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-[#635DFF] text-white py-2 px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>

    </div>
  );
};

export default Chat;
