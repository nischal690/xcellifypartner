import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import ProductCard from './ProductCard';

const ProductsList = ({ products, brandLogo }) => {

  const navigate = useNavigate();
  const handleAddAnotherProduct = () => {
    navigate('/add-new-product?origin=dashboard');
  };

  return (
    <section className="mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-5">Products</h2>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
        {products?.map((product) => (
          <ProductCard product={product} key={product?.id} brandLogo={brandLogo}/>
        ))}
        <div
          className="min-h-60 bg-white rounded-lg shadow-lg shadow-gray-300 overflow-hidden max-w-[370px] w-full flex flex-col items-center justify-center"
          onClick={handleAddAnotherProduct}
        >
          <div className="flex items-center justify-center bg-blue-primary rounded-full w-16 h-16 cursor-pointer">
            <AiOutlinePlus className="text-white text-3xl" />
          </div>
          <p className="mt-10 text-blue-primary text-lg font-semibold">
            Add another product
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
