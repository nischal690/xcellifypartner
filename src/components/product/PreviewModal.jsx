import React from 'react';

const PreviewModal = ({ previewMedia, setPreviewMedia }) => {
  if (!previewMedia) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-10">
      <div className="relative bg-white rounded-md shadow-md p-4">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 z-20 bg-white text-center rounded-md"
          onClick={() => setPreviewMedia(null)}
        >
          Close
        </button>
        {previewMedia.type === 'image' ||
        previewMedia.url?.includes('image') ? (
          <img
            src={previewMedia.url}
            alt="Preview"
            className="max-w-full max-h-screen rounded-md"
          />
        ) : (
          <video
            src={previewMedia.url}
            controls
            className="max-w-full max-h-screen rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default PreviewModal;
