import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import brandLogoPlaceholder from '../../assets/brandLogoPlaceholder.png';

export default function ProductCard({ product, brandLogo }) {
  const navigate = useNavigate();

  const {
    product_status = '',
    product_title = '',
    product_description = '',
    category = '',
    id = '',
    product_images = [],
  } = product || {};

  let productImage = brandLogoPlaceholder;

  if (!!product_images?.length && !!product_images[0]?.url) {
    if (!!product_images[0]?.formats?.small?.url) {
      productImage =
        import.meta.env?.VITE_STRAPI_URL +
        product_images[0]?.formats?.small?.url;
    } else
      productImage = import.meta.env?.VITE_STRAPI_URL + product_images[0]?.url;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-[370px] w-full flex flex-col justify-between h-full">
      <div className="">
        <div
          className="h-28 bg-cover bg-center text-right p-1"
          style={{ backgroundImage: `url(${`${productImage}`})` }}
        >
          <span
            className={`px-2 text-white rounded-md text-xs ${
              product_status === 'Pending'
                ? 'bg-yellow-400'
                : product_status === 'Approved'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          >
            {product_status}
          </span>
        </div>

        <div className="p-2 flex flex-col justify-between">
          <div className="flex items-center mb-2">
            <img
              src={brandLogo || brandLogoPlaceholder}
              alt="logo"
              className="w-12 h-12 rounded-full mr-3 object-cover -mt-10"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {product_title}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {product_description
              ? `${product_description.slice(0, 145)}....`
              : ''}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center p-2 mb-4">
        <span className="bg-purple-primary text-white px-4 py-0.5 rounded-lg text-[12px]">
          {category}
        </span>
        <button
          className="text-blue-500 text-[12px] underline hover:underline flex items-center"
          onClick={() => navigate(`/home/product/${id}`)}
        >
          View Details <FaArrowRight className="ml-1" />
        </button>
      </div>
    </div>
  );
}
