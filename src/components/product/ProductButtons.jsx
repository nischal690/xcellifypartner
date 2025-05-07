import React from 'react';

const ProductButtons = ({
  handleAddProductForm,
  handleSkipNow,
  handleSubmit,
  loading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6">
      {/* Save & Add Product Button */}
      <button
        type="button"
        className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg text-white font-dmsans font-bold rounded-md bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
        onClick={handleAddProductForm}
      >
        Save & add product
      </button>

      {/* Skip As of Now Button */}
      <button
        type="button"
        className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg text-white font-dmsans font-bold rounded-md bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200"
        onClick={handleSkipNow}
      >
        Skip as of now
      </button>

      {/* Submit All Products Button */}
      <button
        type="button"
        className={`w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg font-dmsans text-white font-bold rounded-md flex items-center justify-center bg-[#876FFD] hover:bg-[#F3F1FF] hover:text-blue-primary hover:border hover:border-blue-primary transition duration-200 ${
          loading ? 'cursor-not-allowed opacity-75' : ''
        }`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
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
          'Submit All Products'
        )}
      </button>
    </div>
  );
};

export default ProductButtons;
