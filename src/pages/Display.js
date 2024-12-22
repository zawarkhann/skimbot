import React, { useEffect, useState, useRef, useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../AppContext";
import './Display.css'

const Chat = () => {
  const location = useLocation();
  const { filename, userMessages, addMessage, clearMessages } = useAppContext();
  const [inputMessage, setInputMessage] = useState("");
  const [currentFile, setCurrentFile] = useState(location.state?.file || null);
  const [fileURL, setFileURL] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(true);
  const chatContainerRef = useRef(null);

  // Clear messages when component mounts
  useEffect(() => {
    clearMessages();
  }, []); // Empty dependency array means this runs once when component mounts

  const fileType = currentFile?.name.split(".").pop().toLowerCase();

  // Memoize the document viewer configuration
  const documents = useMemo(() => {
    if (fileURL) {
      return [{ uri: fileURL, name: filename, fileType: "pdf" }];
    }
    return [];
  }, [fileURL, filename]);

  // Memoize the viewer component to prevent unnecessary re-renders
  const FileViewer = useMemo(() => {
    if (!fileURL || loading) return null;

    return (
      <div style={{ height: "80vh" }}>
        <DocViewer
          documents={documents}
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: false,
              disableFileName: true,
            },
          }}
        />
      </div>
    );
  }, [fileURL, loading, documents]);

  // Memoize the text content viewer
  const TextViewer = useMemo(() => {
    if (!fileContent || loading || fileType !== "txt") return null;

    return (
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
    );
  }, [fileContent, loading, fileType]);

  useEffect(() => {
    if (location.state?.file && !currentFile) {
      setCurrentFile(location.state.file);
      // Store in session storage
      const fileData = {
        name: location.state.file.name,
        type: location.state.file.type,
        lastModified: location.state.file.lastModified,
      };
      sessionStorage.setItem("currentFile", JSON.stringify(fileData));

      const reader = new FileReader();
      reader.onload = (e) => {
        sessionStorage.setItem("fileBlob", e.target.result);
      };
      reader.readAsDataURL(location.state.file);
    }
  }, [location.state?.file, currentFile]);

  // Recover file from session storage if needed
  useEffect(() => {
    if (!currentFile) {
      const savedFileData = sessionStorage.getItem("currentFile");
      const savedFileBlob = sessionStorage.getItem("fileBlob");

      if (savedFileData && savedFileBlob) {
        const fileData = JSON.parse(savedFileData);
        const blob = dataURLtoBlob(savedFileBlob);
        const file = new File([blob], fileData.name, {
          type: fileData.type,
          lastModified: fileData.lastModified,
        });
        setCurrentFile(file);
      }
    }
  }, [currentFile]);

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      addMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [userMessages]);

  const handleTextFile = () => {
    if (!currentFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
      setLoading(false);
    };
    reader.readAsText(currentFile);
  };

  const handleDocxFile = async () => {
    if (!currentFile) return;
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(",")[1];
        const payload = {
          Parameters: [
            {
              Name: "File",
              FileValue: { Name: currentFile.name, Data: base64Data },
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
          setFileURL(pdfURL);
          setFileContent("");
        }
      };
      reader.readAsDataURL(currentFile);
    } catch (error) {
      console.error("Error converting DOCX file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentFile) return;

    if (fileType === "pdf") {
      const url = URL.createObjectURL(currentFile);
      setFileURL(url);
      setLoading(false);
      return () => URL.revokeObjectURL(url);
    } else if (fileType === "txt") {
      handleTextFile();
    } else if (fileType === "docx") {
      handleDocxFile();
    } else {
      console.error("Unsupported file type");
      setLoading(false);
    }
  }, [currentFile, fileType]);

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
          <img
            src="/icon.png"
            alt="Logo"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div>
          <img
            src="/navicons.png"
            alt="Navicons"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div style={{ marginTop: "auto", marginBottom: "10px" }}>
          <img
            src="/avatar.png"
            alt="User Avatar"
            style={{ width: "40px", height: "auto" }}
          />
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
        <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[16px] leading-[28px] tracking-[-0.01em] mb-10">
          {filename}
        </h4>
        <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />

        {loading && <p>Refresh The Window Or Try Selecting Doc Again</p>}

        {fileType === "txt" && !loading && (
          <>
            <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[18px] leading-[24px] tracking-[-0.008em]">
              Preview
            </h4>
            {TextViewer}
          </>
        )}

        {(fileType === "pdf" || fileType === "docx") && !loading && (
          <>
            <h4 className="text-[#1E293B] font-['Plus_Jakarta_Sans'] font-bold text-[18px] leading-[24px] tracking-[-0.008em]">
              Preview
            </h4>
            {FileViewer}
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
          <select className="w-[320px] h-[48px] min-h-[48px] px-3 py-2 border border-gray-300 rounded-[123px] outline-none cursor-pointer font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#475569]">
            <option value="read">Read</option>
            <option value="write">Write</option>
            <option value="review">Review</option>
          </select>

          <div className="bg-[#4F46E5] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-purple-700">
            <span className="text-[16px] leading-[22px] font-bold font-['Plus_Jakarta_Sans'] tracking-[-0.007em]">
              Download Now
            </span>
            <img src="/Download.png" alt="Download" className="h-auto w-auto" />
          </div>
        </div>

        <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {userMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.type === "user" ? (
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
              ) : (
                <>
                  <img
                    src="/ai.png"
                    alt="AI"
                    className="mr-2 w-8 h-8 rounded-full object-cover"
                  />
                  <div className="bg-white border rounded-lg p-4 shadow-sm max-w-md">
                    <p className="text-gray-700">{msg.text}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

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
