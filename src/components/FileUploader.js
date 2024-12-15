import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAppContext } from "../AppContext";

const FileUploader = () => {
  const { globalFiles, setGlobalFiles } = useAppContext();

  // Function to handle accepted files
  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log("File Accepted:", acceptedFiles);

      // Add the accepted files to the global array
      setGlobalFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      // Log the updated array
      console.log("Updated Global Files Array:", [...globalFiles, ...acceptedFiles]);
    },
    [setGlobalFiles, globalFiles]
  );

  // Function to handle rejected files
  const onDropRejected = useCallback((rejectedFiles) => {
    alert(
      "Invalid file. Please upload a file in one of the supported formats: PDF, DOCX, TXT (max size 10 MB)."
    );
    console.log("Rejected Files:", rejectedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB limit
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg bg-[#F9FAFB] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#4F46E5]"
    >
      <input {...getInputProps()} />
      {/* Upload Icon */}
      <div className="bg-[#EEF2FF] p-4 rounded-full mb-4">
        <img src="/FileArrowUp.png" alt="Upload Icon" className="h-8 w-8" />
      </div>
      {/* Text */}
      <p className="text-gray-600 text-lg">
        <span className="text-[#4F46E5] font-semibold">Click here</span> to upload your file or drag.
      </p>
      {/* Supported Format */}
      <p className="text-gray-400 text-sm mt-2">
        Supported Format: PDF, DOCX, TXT (10mb each)
      </p>
    </div>
  );
};

export default FileUploader;
