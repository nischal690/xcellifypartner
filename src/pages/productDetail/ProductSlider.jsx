import React from 'react';
import placeHolderImg from '../../assets/brandLogoPlaceholder.png';
import { FaVideo, FaImage } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSlider = ({ product, brandLogo }) => {
  const images =
    product?.product_images?.map(
      (img) => import.meta.env.VITE_STRAPI_URL + img.url
    ) || [];

  const videos =
    product?.product_videos?.map(
      (vid) => import.meta.env.VITE_STRAPI_URL + vid.url
    ) || [];

  let media = [...images, ...videos]; // Combine images and videos

  // If no images or videos exist, use a static placeholder
  if (media.length === 0) {
    media = [placeHolderImg];
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Swiper Slider (Manual Infinite Scroll) */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true} // Enable infinite loop
          className="rounded-lg"
        >
          {media.map((item, index) => (
            <SwiperSlide key={index}>
              {item.includes('.mp4') ? (
                <video
                  src={item}
                  controls
                  className="w-full h-80 sm:h-96 object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img
                  src={item}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-80 sm:h-96 object-contain rounded-lg"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Brand Logo Positioned Inside the Slider */}
        <div className="absolute -bottom-6 left-10 z-10">
          <img
            src={brandLogo || placeHolderImg}
            alt="Brand Logo"
            className="w-20 h-20 rounded-full bg-white p-1 border-2 border-gray-300 shadow-lg"
          />
        </div>

        {/* Image/Video Count Positioned Inside Slider */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded flex items-center space-x-2 z-10">
          {images.length > 0 && (
            <>
              <FaImage /> <span>{images.length}</span>
            </>
          )}
          {videos.length > 0 && (
            <>
              <FaVideo /> <span>{videos.length}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
