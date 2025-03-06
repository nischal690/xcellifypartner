import React from 'react';

export default function KeyInfo({ product, category, subcategory }) {
  return (
    <div className="flex space-x-10 mt-10">
      <div className="flex flex-col space-y-2">
        <span className="font-semibold">Product category</span>
        <span className=" text-center px-2 text-white rounded-md bg-purple-primary">
          {category}
        </span>
        <span className="font-semibold">Subcategory</span>
        <span className="font-semibold">{subcategory}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="font-semibold">Product status</span>
        <span
          className={`text-center text-white rounded-md ${
            product?.product_status === 'Pending'
              ? 'bg-yellow-400'
              : product?.product_status === 'Approved'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        >
          {product?.product_status}
        </span>
      </div>
    </div>
  );
}
