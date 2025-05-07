const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-t-2 border-purple-500 rounded-full animate-spin"></div>
    <span className="ml-2 text-sm text-purple-500">Uploading...</span>
  </div>
);
export default LoadingSpinner;
