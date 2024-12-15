import React from "react";
import Docviewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer"
import { useLocation, useParams } from "react-router-dom";
import DocViewer from "@cyntler/react-doc-viewer";
// import "./ChatPage.css"

const ChatPage = () => {
  const { state } = useLocation(); // Get file passed as state
  const { fileName } = useParams(); // Get file name from URL


  const file = state?.file;

  const docs=[
    {uri: "https://calibre-ebook.com/downloads/demos/demo.docx",
      fileType: "docx",
      fileName: "demo.docx"
    }
  ]
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          File: {fileName}
        </h1>

        {/* Download Button */}
        {file && (
          <a
            href={URL.createObjectURL(file)}
            download={file.name}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Download File
          </a>
        )}
        {!file && (
          <p className="text-red-500">
            File data not available. Please return to the homepage.
          </p>
        )}

<DocViewer
  documents={docs}
  pluginRenderers={DocViewerRenderers}
  className="doc-viewer-container"
/>
      </div>
    </>
  );
};

export default ChatPage;
