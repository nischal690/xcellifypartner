import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { toast } from 'react-toastify';

const ImageCropper = ({ image, aspect = 16 / 9, onCropComplete, onCancel }) => {
  const cropperRef = useRef(null);
  const [cropping, setCropping] = useState(false);

  const handleCrop = async () => {
    if (cropping) return;
    setCropping(true);

    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;

      //  Convert cropped area to Blob
      cropper.getCroppedCanvas().toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to process image');
          setCropping(false);
          return;
        }

        //  Convert Blob to File
        const croppedFile = new File([blob], 'cropped-image.jpg', {
          type: 'image/jpeg',
        });

        onCropComplete(croppedFile);
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Error cropping image');
    } finally {
      setCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-[600px] h-[700px] relative">
        {/*  Cropper Component */}
        <Cropper
          ref={cropperRef}
          src={image}
          style={{ height: '500px', width: '100%' }}
          viewMode={1}
          autoCropArea={1}
          movable={true}
          zoomable={true}
          scalable={true}
          rotatable={true}
          background={false}
          responsive={true}
          initialAspectRatio={aspect} //  Keeps a starting ratio but allows free resizing
        />

        {/*  Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-md"
            disabled={cropping}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCrop}
            className={`px-4 py-2 text-white rounded-md flex items-center justify-center ${
              cropping ? 'cursor-not-allowed opacity-75' : ''
            }`}
            style={{
              background: 'linear-gradient(to right, #876FFD, #19074A)',
            }}
            disabled={cropping}
          >
            {cropping ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
