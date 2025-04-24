import { useState } from 'react';

const FilePreviewCard = ({ file, mediaType, onPreview, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const isLocal = file instanceof File;
  const mediaUrl = isLocal
    ? URL.createObjectURL(file)
    : `${import.meta.env.VITE_STRAPI_URL}${file.url}`;

  console.log(mediaUrl);
  console.log(file, file.name);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <div className="relative border border-gray-300 rounded-md p-2 shadow-sm">
      <div className="flex items-center gap-2">
        {mediaType === 'image' ? (
          <img
            src={mediaUrl}
            alt="Preview"
            className="h-12 w-12 object-cover rounded-md"
          />
        ) : (
          <video
            src={mediaUrl}
            alt="Preview"
            className="h-12 w-24 object-cover rounded-md"
          />
        )}

        <div className="flex-1">
          <p className="text-sm font-medium truncate">
            {file?.name || 'New media'}
            {console.log(file, file.name)}
          </p>
          <p className="text-xs text-green-500 mt-1">Uploaded</p>
        </div>

        <div className="relative ps-5">
          <button
            type="button"
            title="Menu"
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6h.01M12 12h.01M12 18h.01"
              />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  onPreview();
                  setShowMenu(false);
                }}
              >
                Preview
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
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
