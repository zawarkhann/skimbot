import React from "react";
import { useLocation, useParams } from "react-router-dom";

const ChatPage = () => {
  const { state } = useLocation(); // Get file passed as state
  const { fileName } = useParams(); // Get file name from URL

  const file = state?.file;

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
      </div>
    </>
  );
};

export default ChatPage;
