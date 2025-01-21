import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import VendorBg from '../../assets/vendorBg.jpeg'
import productLogo from '../../assets/productLogo.jpeg'
import { FaArrowRight } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';


const ProductsList = ({products }) => {

    const navigate = useNavigate();

    return (
        <section className= "mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-5">Products</h2>

            {/* Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                {products?.map((product) => (

                    <div 
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden max-w-[370px] w-full"
                        
                    >
                    {/* Image Section */}
                    <div className="h-28 bg-cover bg-center text-right p-1 " style={{ backgroundImage: `url(${VendorBg})` }}>
                    <span className={`px-2 text-white rounded-md text-xs ${product.product_status === "Pending" ? "bg-yellow-400" : product.product_status === "Approved" ? "bg-green-500" : "bg-red-500"}`}>{product.product_status}</span>
                    </div>

                    {/* Content Section */}
                    <div className="p-2">
                        <div className="flex items-center mb-2">
                            <img src={productLogo} alt="logo" className="w-12 h-12 rounded-full mr-3 object-cover -mt-10" />
                            <h3 className="text-lg font-semibold text-gray-800">{product.product_title}</h3>
                            
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{product.product_description + "...."}</p>

                        <div className="flex justify-between items-center">
                            <span className="bg-purple-primary text-white px-4 py-0.5 rounded-lg text-[12px]">
                                {product.category}
                            </span>
                            <button className="text-blue-500 text-[12px] underline hover:underline flex items-center" onClick={() => navigate(`/home/product/${product.id}`)}>
                                View Details <FaArrowRight className="ml-1" />
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                <div className="min-h-60 bg-white rounded-lg shadow-lg shadow-gray-300 overflow-hidden max-w-[370px] w-full flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center bg-blue-primary rounded-full w-16 h-16 cursor-pointer">
                        <AiOutlinePlus className="text-white text-3xl" />
                    </div>
                    <p className="mt-10 text-blue-primary text-lg font-semibold">Add another product</p>
                </div>
            </div>
        </section>
    );
};

export default ProductsList;