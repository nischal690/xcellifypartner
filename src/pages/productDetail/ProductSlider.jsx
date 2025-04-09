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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
      }

      if (parsedUrl.searchParams.has('v')) {
        return `https://www.youtube.com/embed/${parsedUrl.searchParams.get(
          'v'
        )}`;
      }

      if (parsedUrl.pathname.includes('/shorts/')) {
        const videoId = parsedUrl.pathname.split('/shorts/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      return null;
    } catch (error) {
      console.error('Invalid YouTube URL:', url);
      return null;
    }
  };

  const youtubeEmbed = getYouTubeEmbedUrl(product?.youtube_url);

  let media = [...images, ...videos];
  if (youtubeEmbed) media.push(youtubeEmbed);

  if (media.length === 0) {
    media = [placeHolderImg];
  }

  console.log('Youtub url', product?.youtube_url);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Swiper Slider */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-lg"
        >
          {media.map((item, index) => (
            <SwiperSlide key={index}>
              {/* YouTube Video */}
              {item.includes('youtube.com/embed') ? (
                <div className="w-full h-80 sm:h-96 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={item}
                    title={`YouTube Video ${index}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : item.includes('.mp4') ? (
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

        {/* Brand Logo */}
        <div className="absolute -bottom-6 left-10 z-10">
          <img
            src={brandLogo || placeHolderImg}
            alt="Brand Logo"
            className="w-20 h-20 rounded-full bg-white p-1 border-2 border-gray-300 shadow-lg"
          />
        </div>

        {/* Media Count */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded flex items-center space-x-2 z-10">
          {images.length > 0 && (
            <>
              <FaImage /> <span>{images.length}</span>
            </>
          )}
          {(videos.length > 0 || youtubeEmbed) && (
            <>
              <FaVideo /> <span>{videos.length + (youtubeEmbed ? 1 : 0)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
