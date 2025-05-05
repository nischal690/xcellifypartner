import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';

const FileUploadPreviewCard = ({ 
  id,
  name,
  onChange,
  onRemove,
  value,
  accept,
  fileType,
  isUploading,
  progress,
  className
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileName, setFileName] = useState('');

  // Clean up object URL when component unmounts or when value changes
  useEffect(() => {
    // Create object URL only if value is a valid File or Blob object
    if (value instanceof File || value instanceof Blob) {
      try {
        const url = URL.createObjectURL(value);
        setFileUrl(url);
        setFileName(value.name || 'Uploaded file');
        
        // Clean up function to revoke object URL
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error creating object URL:', error);
        setFileUrl(null);
      }
    } else if (typeof value === 'string' && value) {
      // If value is a string (e.g., a URL), use it directly
      setFileUrl(value);
      setFileName(value.split('/').pop() || 'Uploaded file');
    } else {
      // Reset if no valid value
      setFileUrl(null);
      setFileName('');
    }
  }, [value]);

  const handlePreview = () => {
    if (fileUrl) {
      setPreviewUrl(fileUrl);
      setPreviewOpen(true);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange({
        target: {
          name,
          value: e.target.files[0]
        }
      });
    }
  };

  // If no file is selected yet, show the upload input
  if (!value) {
    return (
      <div className={`border border-dashed border-gray-300 p-4 rounded-lg ${className || ''}`}>
        <input
          type="file"
          id={id}
          name={name}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        <label 
          htmlFor={id}
          className="flex flex-col items-center justify-center cursor-pointer py-6 hover:bg-purple-50 transition-colors duration-200 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-purple-700 font-medium">Click to upload {fileType || 'file'}</span>
          <span className="text-xs text-gray-500 mt-1">{accept ? `Accepted formats: ${accept.replace(/\./g, '').replace(/,/g, ', ')}` : 'All file types accepted'}</span>
        </label>
      </div>
    );
  }

  // Show preview of uploaded file
  return (
    <div className={`border p-3 rounded-lg flex items-center justify-between w-full bg-white shadow-sm relative ${className || ''}`}>
      {/* Thumbnail */}
      {fileUrl && (value instanceof File || value instanceof Blob) && ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(value.type) ? (
        <img
          src={fileUrl}
          alt="Uploaded Preview"
          className="w-12 h-12 object-cover rounded-md"
        />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )}

      {/* File Name */}
      <div className="flex-1 px-3">
        <p className="text-sm truncate max-w-full font-medium">{fileName}</p>
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${progress || 0}%` }}></div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {fileUrl && (
          <button
            type="button"
            className="text-purple-600 hover:text-purple-800"
            onClick={handlePreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <ImageModal onClose={handleClosePreview}>
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-[80vh]" />
        </ImageModal>
      )}
    </div>
  );
};

export default FileUploadPreviewCard;
