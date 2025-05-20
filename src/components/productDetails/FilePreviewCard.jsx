import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * Component for displaying file preview cards (images/videos)
 */
const FilePreviewCard = ({
  file,
  fieldName,
  onPreview,
  onDelete,
  showMenu,
  toggleMenu,
  isUploading,
  filePreviewMap
}) => {
  return (
    <div className="relative border border-gray-300 rounded-md p-2 shadow-sm w-60">
      <div className="flex items-center gap-2">
        {fieldName === 'product_images' ? (
          <img
            src={
              file instanceof File
                ? URL.createObjectURL(file)
                : file.preview || filePreviewMap.images[file.id]
            }
            alt="Preview"
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <video
            src={
              file instanceof File
                ? URL.createObjectURL(file)
                : file.preview || filePreviewMap.videos[file.id]
            }
            className="h-12 w-12 object-cover rounded-md"
          />
        )}

        <div className="flex-1">
          <p className="text-sm font-medium truncate">
            {file.name || `File ${Date.now()}`}
          </p>
          {isUploading ? (
            <LoadingSpinner />
          ) : (
            <p className="text-xs text-green-500 mt-1">Uploaded</p>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            className="text-gray-700 hover:text-gray-900"
            onClick={() =>
              toggleMenu(`${fieldName}-${file.id || Date.now()}`)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 font-bold"
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

          {showMenu === `${fieldName}-${file.id || Date.now()}` && (
            <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={onPreview}
              >
                Preview
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewCard;
