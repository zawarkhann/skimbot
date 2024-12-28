import React, { use } from "react";
import FileUploader from "../components/FileUploader";
import { useAppContext } from "../AppContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"
import Modal from "react-modal";
import { useState,useEffect } from "react";

Modal.setAppElement("#root"); // Required for accessibility

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
    navigate("/Chat", {
      state: { file }, // Pass file as state
    })
  }

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Check if the screen width is smaller than a threshold (e.g., 768px)
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // Adjust width as needed
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
    <Navbar/>
    {isSmallScreen && (
        <Modal
          isOpen={true}
          contentLabel="Screen Size Warning"
          style={{
            content: {
              backgroundColor:"black",
              color:"white",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            },
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          }}
        >
          <h2>This Demo Website is Built for Large Screens</h2>
          <p>
            Please use a desktop or laptop to view this website. It is not
            responsive for smaller screens like mobiles or tablets.
          </p>
        </Modal>
      )}
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
      className="bg-[#EEF2FF] p-4 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer"
      onClick={() => handleclick(file)}
    >
      {/* File Logo */}
      <img
        src={getFileLogo(file.type)}
        alt="File Type"
        className="w-6 h-6 mb-2"
      />

      {/* Placeholder Image */}
      <div className="w-full h-28 bg-white rounded mb-4 flex items-center justify-center">
        <img 
          src="/docc.jpg" 
          alt="Placeholder" 
          className="w-24 h-24 object-contain" 
        />
      </div>

      {/* File Name */}
      <p className="text-gray-800 font-bold truncate w-full">
        {file.name}
      </p>

      {/* Read File Again Button */}
      <button
        className="text-blue-600 mt-2 font-semibold cursor-pointer"
      >
        Ask AI →
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