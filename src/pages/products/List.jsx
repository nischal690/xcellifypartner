import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductsList = ({ products, brandLogo }) => {
  const navigate = useNavigate();
  const handleAddAnotherProduct = () => {
    navigate('/add-new-product');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="mb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Products
        </h2>
        <div className="bg-white px-4 py-2 rounded-full shadow-md text-gray-700">
          <span className="font-medium">{products?.length || 0}</span> products
        </div>
      </motion.div>

      <motion.div
        className="min-h-60 bg-white rounded-xl shadow-xl overflow-hidden max-w-[370px] w-full mb-12 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
        whileHover={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          y: -5,
        }}
        onClick={handleAddAnotherProduct}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-full flex flex-col items-center justify-center py-10 bg-gradient-to-br from-blue-50 to-indigo-50">
          <motion.div
            className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-20 h-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <AiOutlinePlus className="text-white text-4xl" />
          </motion.div>
          <p className="mt-6 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Add another product
          </p>
          <p className="text-gray-500 mt-2 text-sm max-w-[80%] text-center">
            Expand your product catalog and reach more customers
          </p>
        </div>
      </motion.div>

      {/* Card Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products?.map((product, index) => (
          <motion.div
            key={product?.id || index}
            variants={itemVariants}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
          >
            <ProductCard product={product} brandLogo={brandLogo} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProductsList;
