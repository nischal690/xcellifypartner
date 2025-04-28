export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for images
export const MAX_MEDIA_SIZE = 20 * 1024 * 1024; // 20MB for media files

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4'];

export const validateFileUpload = (file, type) => {
  const maxSize = type === 'product_images' ? MAX_FILE_SIZE : MAX_MEDIA_SIZE;

  if (file.size > maxSize) {
    toast.error(
      `File size should not exceed ${
        maxSize === MAX_FILE_SIZE ? '5MB' : '20MB'
      }`
    );
    return false;
  }

  if (type === 'product_images') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload an image file (JPG, JPEG, PNG)');
      return false;
    }
  } else if (type === 'product_videos') {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error('Please upload a video file (MP4)');
      return false;
    }
  }

  return true;
};