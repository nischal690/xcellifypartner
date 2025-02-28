import React, { useState } from 'react';
import ImageModal from './ImageModal';

const FileUploadPreviewCard = ({ file, fieldName }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePreview = () => {
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setPreviewOpen(true);
      setMenuOpen(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewUrl(null);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="border p-2 rounded-md flex items-center justify-between w-full shadow-sm bg-gray-100 relative">
      {/* Thumbnail */}
      <img
        src={URL.createObjectURL(file)}
        alt="Uploaded Preview"
        className="w-12 h-12 object-cover rounded-md"
      />

      {/* File Name */}
      <p className="text-sm truncate max-w-[150px]">{file.name}</p>

      {/* Three Dots Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="text-gray-700 hover:text-gray-900"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#876FFD] hover:text-[#654DFF]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6h.01M12 12h.01M12 18h.01"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md w-24">
            <button
              className="text-sm text-gray-700 p-2 hover:bg-gray-200 w-full text-left"
              onClick={handlePreview}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <ImageModal onClose={handleClosePreview}>
          <img src={previewUrl} alt="Preview" className="w-full h-auto" />
        </ImageModal>
      )}
    </div>
  );
};

export default FileUploadPreviewCard;
