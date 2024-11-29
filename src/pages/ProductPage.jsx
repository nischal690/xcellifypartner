import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoursePlaceholderImg from '../assets/course-placeholder.png'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const productsData = JSON.parse(localStorage.getItem("products")) || [];

  const product = productsData.find((item) => item.id === parseInt(id));
  const [lessons, setLessons] = useState(product?.lessons || []);
  const [newLesson, setNewLesson] = useState({
    title: "",
    duration: "",
    videoLink: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: product?.name,
    type: product?.type,
    price: product?.price,
    details: product?.details,
    coverImage: product?.coverImage,
  });
  const [upcomingSessions, setUpcomingSessions] = useState(product?.upcomingSessions || []);
  const [completedSessions, setCompletedSessions] = useState(product?.completedSessions || []);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "", id: null });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(product.isRegistrationOpen);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-bold text-lg">
        Product not found
      </div>
    );
  }

  const {
    name,
    type,
    price,
    details,
    coverImage,
    enrolledStudents,
    completedStudents,
    inProgressStudents,
    certificatesClaimed,
    revenue,
    registeredStudents,
    sessionsBooked,
  } = product;

  // Function to add a new lesson
  const handleAddLesson = () => {
    if (newLesson.title.trim()) {
      const updatedLessons = [
        ...lessons,
        {
          id: lessons.length + 1,
          title: newLesson.title,
          duration: newLesson.duration || "Not specified",
          videoLink: newLesson.videoLink || "",
        },
      ];
      setLessons(updatedLessons);
      setNewLesson({ title: "", duration: "", videoLink: "" });

      // Update in localStorage
      const updatedProducts = productsData.map((p) =>
        p.id === product.id ? { ...p, lessons: updatedLessons } : p
      );
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
  };

  // Function to toggle webinar registration
  const handleToggleRegistration = () => {
    setIsRegistrationOpen(!isRegistrationOpen);
  };

  // Approve a session
  const handleApprove = (id) => {
    setUpcomingSessions((prev) =>
      prev.map((session) =>
        session.id === id ? { ...session, status: "Approved" } : session
      )
    );
  };

  // Reschedule a session
  const handleReschedule = (id) => {
    setUpcomingSessions((prev) =>
      prev.map((session) =>
        session.id === id
          ? {
              ...session,
              Date: rescheduleData.date || session.Date,
              Time: rescheduleData.time || session.Time,
              status: "Rescheduled",
            }
          : session
      )
    );
    setRescheduleData({ date: "", time: "", id: null });
  };
  
  // Mark a session as completed
  const handleComplete = (id) => {
    const sessionToComplete = upcomingSessions.find((session) => session.id === id);
    setUpcomingSessions((prev) => prev.filter((session) => session.id !== id));
    setCompletedSessions((prev) => [...prev, { ...sessionToComplete, status: "Completed" }]);
  };

  const handleDelete = () => {
    const updatedProducts = productsData.filter((p) => p.id !== product.id);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    navigate("/dashboard");
  };

  const handleEditSubmit = () => {
    const updatedProducts = productsData.map((p) =>
      p.id === product.id ? { ...p, ...editedProduct } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 ml-6 hover:bg-blue-700"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {/* Product Header */}
        <div className="flex items-center flex-col md:flex-row gap-6">
          <img
            src={coverImage || CoursePlaceholderImg}
            alt={name}
            className="w-full md:w-1/3 h-48 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-gray-600 text-lg mt-2">{details}</p>
            <p className="text-xl font-semibold text-gray-900 mt-4">
              Price: {price}
            </p>
            <p className="text-gray-600 text-lg mt-2">
              Type: <span className="font-bold">{type}</span>
            </p>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-8">
          {type === "Course" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Course Details</h2>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>Enrolled Students: {enrolledStudents.toLocaleString("en-IN")}</li>
                <li>Completed Students: {completedStudents.toLocaleString("en-IN")}</li>
                <li>In Progress Students: {inProgressStudents.toLocaleString("en-IN")}</li>
                <li>Certificates Claimed: {certificatesClaimed.toLocaleString("en-IN")}</li>
                <li>Revenue: {product.price !== "Free" && "₹"} {revenue.toLocaleString("en-IN")} {type === "tutoring" && "/hr"}</li>
                <li>Lessons: {lessons.length}</li>
              </ul>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">Add New Lesson</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    className="border border-gray-300 px-3 py-2 rounded-md"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 30 mins)"
                    className="border border-gray-300 px-3 py-2 rounded-md"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Video Link"
                    className="border border-gray-300 px-3 py-2 rounded-md"
                    value={newLesson.videoLink}
                    onChange={(e) => setNewLesson({ ...newLesson, videoLink: e.target.value })}
                  />
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 mt-2"
                    onClick={handleAddLesson}
                  >
                    Add Lesson
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">Lessons</h3>
                <ul className="list-disc list-inside text-gray-600 mt-2">
                  {lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() =>
                        navigate(`/lessons/${lesson.id}`, { state: { lesson, courseName : name } })
                      }
                    >
                      {lesson.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {type === "Webinar" && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Webinar Details</h2>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li>Registered Students: {registeredStudents}</li>
                <li>Revenue: ${revenue}</li>
                <li>
                  Registration Status:{" "}
                  <span
                    className={`font-bold ${isRegistrationOpen ? "text-green-600" : "text-red-600"}`}
                  >
                    {isRegistrationOpen ? "Open" : "Closed"}
                  </span>
                </li>
              </ul>
              <button
                onClick={handleToggleRegistration}
                className={`mt-4 px-4 py-2 rounded-md text-white ${
                  isRegistrationOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isRegistrationOpen ? "Close Registration" : "Open Registration"}
              </button>
            </div>
          )}

          {type === "Tutoring" && (
            <div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8">Tutoring Details</h2>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>Sessions Booked: {sessionsBooked}</li>
              <li>Revenue: ₹{revenue.toLocaleString("en-IN")}</li>
            </ul>
            <button
              onClick={() => alert("Manage tutoring sessions here.")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Manage Sessions
            </button>

            {/* Upcoming Sessions */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Sessions</h3>
              <div className="mt-4 space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex flex-col gap-2 border-b border-gray-200 pb-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p>
                          <strong>Student:</strong> {session.studentName || "Unknown"}
                        </p>
                        <p>
                          <strong>Date:</strong> {session.Date}
                        </p>
                        <p>
                          <strong>Time:</strong> {session.Time}
                        </p>
                        <p>
                          <strong>Status:</strong> {session.status}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(session.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRescheduleData({ ...rescheduleData, id: session.id })}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleComplete(session.id)}
                          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                    {rescheduleData.id === session.id && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="date"
                          className="border border-gray-300 px-3 py-2 rounded-md"
                          value={rescheduleData.date}
                          onChange={(e) =>
                            setRescheduleData((prev) => ({ ...prev, date: e.target.value }))
                          }
                        />
                        <input
                          type="time"
                          className="border border-gray-300 px-3 py-2 rounded-md"
                          value={rescheduleData.time}
                          onChange={(e) =>
                            setRescheduleData((prev) => ({ ...prev, time: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => handleReschedule(session.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Confirm Reschedule
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800">Completed Sessions</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                {completedSessions.map((session) => (
                  <li key={session.id}>
                    {session.Date} at {session.Time} - {session.studentName} ({session.status})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            onClick={() => setIsEditing(true)}
          >
            Edit Product
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete Product
          </button>
        </div>
        {isEditing && (
          <div className="mt-5">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={editedProduct.coverImage}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, coverImage: e.target.value })
                  }
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                  value={editedProduct.name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Type</label>
                <select
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                  value={editedProduct.type}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, type: e.target.value })
                  }
                >
                  <option value="Course">Course</option>
                  <option value="Webinar">Webinar</option>
                  <option value="Tutoring">Tutoring</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price</label>
                <input
                  type="text"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Details</label>
                <textarea
                  className="border border-gray-300 px-3 py-2 rounded-md w-full"
                  value={editedProduct.details}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, details: e.target.value })
                  }
                  rows="4"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
