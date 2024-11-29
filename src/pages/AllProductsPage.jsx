import React, { useEffect, useState } from 'react'
import productsData from '../utils/productsData';
import { useNavigate } from 'react-router-dom';
import CoursePlaceholderImg from '../assets/course-placeholder.png'

export default function AllProductsPage() {
    const [products, setProducts] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem("products"));
        return storedData || productsData;
    });

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);

    let navigate = useNavigate();


  return (
    <section className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Products/Services</h2>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Product Image */}
              <img
                src={product.coverImage!="" ?  product.coverImage : CoursePlaceholderImg}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{product.type}</p>
                <p className="text-md font-semibold text-blue-600">
                  {product.price !== "Free" && "₹"} {product.price}
                  {product.type === "tutoring" && "/hr"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}
