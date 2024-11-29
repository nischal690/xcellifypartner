import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNewProductPage = () => {
  const [productType, setProductType] = useState("Course");
  const [isFree, setIsFree] = useState(false);
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    type: "Course",
    price: "",
    details: "",
    coverImage: "",
    enrolledStudents: 0,
    completedStudents: 0,
    inProgressStudents: 0,
    certificatesClaimed: 0,
    revenue: 0,
    lessons: [],
    seats: null,
    timeSlots: [],
  });

  const navigate = useNavigate();

  const handleLessonAdd = () => {
    setProductData((prevData) => ({
      ...prevData,
      lessons: [
        ...prevData.lessons,
        { id: prevData.lessons.length + 1, title: "", duration: "" },
      ],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem("products")) || [];
    const newProduct = {
      ...productData,
      id: storedData.length + 1,
      revenue: isFree ? 0 : parseInt(productData.price) * productData.enrolledStudents,
    };
    storedData.push(newProduct);
    localStorage.setItem("products", JSON.stringify(storedData));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Product/Service</h2>
        <form onSubmit={handleSubmit}>
          {/* General Fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={productData.type}
              onChange={(e) => {
                setProductType(e.target.value);
                setProductData({ ...productData, type: e.target.value });
              }}
            >
              <option value="Course">Course</option>
              <option value="Webinar">Webinar</option>
              <option value="Workshop">Workshop</option>
              <option value="Tutoring">Tutoring</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Details</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="4"
              value={productData.details}
              onChange={(e) => setProductData({ ...productData, details: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Cover Image URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={productData.coverImage}
              onChange={(e) => setProductData({ ...productData, coverImage: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
          </div>

          {/* Conditional Fields */}
          {productType === "Course" && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Lessons</label>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => {
                    setProductData((prevData) => ({
                      ...prevData,
                      lessons: [
                        ...prevData.lessons,
                        {
                          id: prevData.lessons.length + 1,
                          title: "",
                          duration: "",
                          videoLink: "",
                        },
                      ],
                    }));
                  }}
                >
                  Add Lesson
                </button>
                {productData.lessons.map((lesson, index) => (
                  <div key={index} className="mb-4 border p-3 rounded-md bg-gray-50">
                    {/* Displaying Lesson Number */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-800 font-semibold">
                        Lesson {index + 1}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => {
                          setProductData((prevData) => ({
                            ...prevData,
                            lessons: prevData.lessons.filter((_, i) => i !== index),
                          }));
                        }}
                      >
                        Remove Lesson
                      </button>
                    </div>

                    {/* Input for Lesson Title */}
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                      value={lesson.title}
                      onChange={(e) =>
                        setProductData((prevData) => {
                          const newLessons = [...prevData.lessons];
                          newLessons[index].title = e.target.value;
                          return { ...prevData, lessons: newLessons };
                        })
                      }
                    />

                    {/* Input for Lesson Duration */}
                    <input
                      type="text"
                      placeholder="Duration (e.g., '45 min')"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                      value={lesson.duration}
                      onChange={(e) =>
                        setProductData((prevData) => {
                          const newLessons = [...prevData.lessons];
                          newLessons[index].duration = e.target.value;
                          return { ...prevData, lessons: newLessons };
                        })
                      }
                    />

                    {/* Input for Video Link */}
                    <input
                      type="text"
                      placeholder="Video Link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={lesson.videoLink}
                      onChange={(e) =>
                        setProductData((prevData) => {
                          const newLessons = [...prevData.lessons];
                          newLessons[index].videoLink = e.target.value;
                          return { ...prevData, lessons: newLessons };
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {(productType === "Webinar" || productType === "Workshop") && (
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={() => {
                    setIsFree(!isFree);
                    setProductData({ ...productData, price: isFree ? "" : "Free" });
                  }}
                />
                <span>Free</span>
                {!isFree && (
                  <input
                    type="number"
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    required
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewProductPage;
