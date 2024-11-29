import React, { useState } from "react";

export default function AddNewProductPage1() {
  const [formData, setFormData] = useState({
    logo: "",
    picture: [],
    video: "",
    serviceSince: "",
    citiesAvailable: "",
    productTitle: "",
    productUSP: "",
    productDescription: "",
    googleRating: "",
    educationQualification: "",
    price: "",
    discount: "",
    finalPrice: "",
    studyLevel: "PG",
    studyDestinations: ["United Kingdom", "Australia"],
    serviceDelivery: ["Hyderabad"],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Product Detail</h1>
      <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 shadow-lg rounded-lg">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 cursor-pointer">
            Click to upload
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Picture
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 cursor-pointer">
            5 Pics (each of max 10MB)
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Video
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 cursor-pointer">
            1 Video of max 100MB
          </div>
        </div>

        {/* Service Section */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Service provides since
          </label>
          <input
            type="text"
            name="serviceSince"
            value={formData.serviceSince}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Cities where service is available
          </label>
          <input
            type="text"
            name="citiesAvailable"
            value={formData.citiesAvailable}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Product title
          </label>
          <input
            type="text"
            name="productTitle"
            value={formData.productTitle}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Product USP
          </label>
          <textarea
            name="productUSP"
            value={formData.productUSP}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Product description
          </label>
          <textarea
            name="productDescription"
            value={formData.productDescription}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Dropdowns */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Study level
          </label>
          <select
            name="studyLevel"
            value={formData.studyLevel}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="UG">UG</option>
            <option value="PG">PG</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Study destination / country
          </label>
          <select
            name="studyDestinations"
            value={formData.studyDestinations}
            onChange={(e) =>
              setFormData({
                ...formData,
                studyDestinations: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            multiple
          >
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Service delivery
          </label>
          <select
            name="serviceDelivery"
            value={formData.serviceDelivery}
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceDelivery: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            multiple
          >
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        {/* Pricing Section */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Google rating
          </label>
          <input
            type="text"
            name="googleRating"
            value={formData.googleRating}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Education qualification
          </label>
          <input
            type="text"
            name="educationQualification"
            value={formData.educationQualification}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Price
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Discount
          </label>
          <input
            type="text"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Final price
          </label>
          <input
            type="text"
            name="finalPrice"
            value={formData.finalPrice}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-2 text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 shadow-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
