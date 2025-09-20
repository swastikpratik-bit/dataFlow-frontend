import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Home() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    // Allowed file extensions
    const allowedExtensions = [".csv", ".xlsx", ".xls", ".ods"];

    const fileName = selectedFile.name.toLowerCase();

    // Validate file type
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      setMessage("⚠️ Please select a CSV, XLSX, XLS, or ODS file");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setMessage("⚠️ File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };


  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      // Simulate API call - optional
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create FormData and send using Axios to your backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage("✅ File uploaded successfully!");
      setFile(null);

      // Navigate to data page after successful upload
      setTimeout(() => {
        navigate('/data');
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const navigateToData = () => {
    navigate('/data');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
              <span className="text-3xl">📊</span>
            </div>
          </div>

          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to DataFlow
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your data management experience with our intuitive platform. Upload, process, and visualize your CSV data effortlessly.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <FeatureCard
              icon="🔒"
              title="Secure Upload"
              bgColor="bg-emerald-500/20"
              textColor="text-emerald-400"
            />
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              bgColor="bg-blue-500/20"
              textColor="text-blue-400"
            />
            <FeatureCard
              icon="📈"
              title="Smart Analytics"
              bgColor="bg-purple-500/20"
              textColor="text-purple-400"
            />
          </div>
        </div>

        {/* Upload Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Upload Your Data
            </h2>

            {/* Drag & Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                  ? "border-blue-400 bg-blue-400/10 scale-105"
                  : "border-gray-400 hover:border-blue-400 hover:bg-blue-400/5"
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.ods"
                onChange={(e) => e.target.files[0] && handleFileSelection(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Upload CSV, XLSX, XLS, or ODS file"
              />

              <div className="space-y-6">
                <div className="text-6xl animate-bounce">
                  {file ? "📄" : "☁️"}
                </div>
                <div className="text-white">
                  <p className="text-xl font-semibold mb-2">
                    {file ? file.name : "Drop your file here"}
                  </p>
                  <p className="text-gray-300">
                    or click to browse your files
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Supported: CSV, XLSX, XLS, ODS (max 10MB)
                  </p>
                </div>
              </div>
            </div>


            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "🚀 Upload & Process"
              )}
            </button>

            {/* Status Message */}
            {message && (
              <StatusMessage message={message} />
            )}

            {/* View Data Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={navigateToData}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-105 cursor-pointer"
              >
                📊 View My Data Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted components for better organization
function FeatureCard({ icon, title, bgColor, textColor }) {
  return (
    <div className={`flex items-center space-x-3 ${textColor} hover:scale-105 transition-transform duration-200`}>
      <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
        <span className="text-lg">{icon}</span>
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
}

function StatusMessage({ message }) {
  const isSuccess = message.startsWith("✅");
  const isWarning = message.startsWith("⚠️");
  const isError = message.startsWith("❌");

  let classes = "mt-6 rounded-2xl p-4 text-center font-medium ";

  if (isSuccess) {
    classes += "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
  } else if (isWarning) {
    classes += "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  } else if (isError) {
    classes += "bg-red-500/20 text-red-300 border border-red-500/30";
  } else {
    classes += "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  }

  return (
    <div className={classes}>
      {message}
    </div>
  );
}