import React, { useEffect, useState, memo } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useAppContext } from "../AppContext";

const FileViewer = () => {
  const { selectedFile, filename } = useAppContext();
  const [fileURL, setFileURL] = useState(null);
  const [fileContent, setFileContent] = useState(""); // For TXT content
  const [loading, setLoading] = useState(true);

  const fileType = selectedFile?.name.split(".").pop().toLowerCase();

  useEffect(() => {
    if (!selectedFile) return;

    if (fileType === "pdf") {
      setFileURL(URL.createObjectURL(selectedFile));
      setLoading(false);
    } else if (fileType === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
        setLoading(false);
      };
      reader.readAsText(selectedFile);
    } else if (fileType === "docx") {
      // Add DOCX to PDF conversion logic here
      setLoading(false);
    } else {
      console.error("Unsupported file type");
      setLoading(false);
    }
  }, [selectedFile, fileType]);

  if (!selectedFile) {
    return <p>No file selected. Please go back and select a file.</p>;
  }

  return (
    <div
      style={{
        flex: 2,
        padding: "10px",
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd",
      }}
    >
      <h4>{filename}</h4>
      {loading && <p>Loading file...</p>}
      {fileType === "txt" && fileContent && (
        <pre style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
          {fileContent}
        </pre>
      )}
      {fileURL && (
        <DocViewer
          documents={[{ uri: fileURL, name: filename, fileType: "pdf" }]}
          pluginRenderers={DocViewerRenderers}
        />
      )}
    </div>
  );
};

export default memo(FileViewer);