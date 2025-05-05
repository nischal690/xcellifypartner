import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

import { truncateHTML } from '../../utils/HelperFunction';
import brandLogoPlaceholder from '../../assets/brandLogoPlaceholder.png';

export default function ProductCard({ product, brandLogo }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const {
    product_status = '',
    product_title = '',
    product_description = '',
    category = '',
    product_id = '',
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 'Approved':
        return 'bg-gradient-to-r from-green-400 to-green-500';
      default:
        return 'bg-gradient-to-r from-red-400 to-red-500';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden w-full flex flex-col justify-between h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
    >
      <div className="">
        <div
          className="h-40 bg-cover bg-center text-right p-3 relative overflow-hidden group"
          style={{ 
            backgroundImage: `url(${productImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <motion.div 
            className={`absolute inset-0 bg-black opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-20'}`}
          />
          
          <motion.span
            className={`px-3 py-1 text-white rounded-full text-xs font-medium ${getStatusColor(product_status)} shadow-md relative z-10`}
            whileHover={{ scale: 1.05 }}
          >
            {product_status}
          </motion.span>
          
          <motion.div 
            className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-bold text-white">{product_title}</h3>
          </motion.div>
        </div>

        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center mb-3">
            <motion.img
              src={brandLogo || brandLogoPlaceholder}
              alt="logo"
              className="w-12 h-12 rounded-full mr-3 object-cover -mt-10 border-4 border-white shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {product_title}
            </h3>
          </div>
          <div className="quill-readonly-container text-gray-600 text-sm">
            <ReactQuill
              value={truncateHTML(product_description, 120)}
              readOnly={true}
              theme="bubble"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center p-4 border-t border-gray-100">
        <motion.span 
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-medium shadow-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.span>
        
        <motion.button
          className="flex items-center gap-1 text-blue-600 font-medium text-sm group"
          onClick={() => navigate(`/home/product/${product_id}`)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details 
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaArrowRight className="ml-1 group-hover:transform group-hover:translate-x-1 transition-transform" />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
