import React, { use } from "react";
import FileUploader from "../components/FileUploader";
import { useAppContext } from "../AppContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"

const HomePage = () => {
  const { globalFiles, setfilename } = useAppContext();
  const navigate = useNavigate();

  // Only show the last 5 files uploaded
  const recentFiles = globalFiles.slice(-5);

  // Function to get file type logo
  const getFileLogo = (type) => {
    if (type.includes("pdf")) return "/pdf.png";
    if (type.includes("word")) return "/doc.png";
    else return "/txt.png";
    return "/default.png";
  };

  const handleclick=(file)=>{
    setfilename(file.name);
    navigate("/display", {
      state: { file }, // Pass file as state
    })
  }

  return (
    <>
    <Navbar/>
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col items-center px-4">
      <h1 className="text-[48px] leading-[56px] mt-10 font-extrabold font-['Plus_Jakarta_Sans'] text-[#1E293B] text-center">
        Let AI Skim your Documents
      </h1>
      <p className="text-[20px] leading-[28px] font-semibold text-gray-600 text-center mt-2">
        Turn your documents into AI chat
      </p>

      {/* File Uploader */}
      <div className="mt-10 w-full max-w-md">
        <FileUploader />
      </div>

      {/* Display Uploaded Files */}
      <div className="mt-10 w-[60%] mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent</h2>

        {/* File Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {recentFiles.map((file, index) => (
            <div
              key={index}
              className="bg-[#EEF2FF] p-4 rounded-lg shadow-md flex flex-col items-center text-center"
              onClick={() =>
                
               handleclick(file)
              }
            >
              {/* File Logo */}
              <img
                src={getFileLogo(file.type)}
                alt="File Type"
                className="w-6 h-6 mb-4"
              />

              {/* Placeholder Image */}
              <div className="w-full h-32 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">Placeholder</span>
              </div>

              {/* File Name */}
              <p className="text-gray-800 font-bold truncate w-full">
                {file.name}
              </p>

              {/* Read File Again Button */}
              <button
                className="text-blue-600 mt-2 font-semibold cursor-default"
                disabled
              >
                Read file again →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;