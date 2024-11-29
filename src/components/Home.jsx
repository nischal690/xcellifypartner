import React from "react";
import PrimaryLogo from '../assets/logo-primary.png'
import TutorPlaceholder from '../assets/tutorPlaceholder.png'
import { Link } from "react-router-dom";
import { useStore } from "../stores";
import { AuthStatuses } from "../utils/constants";

const HomePage = () => {
  const {appStore} = useStore()

  const handleLogout = () => {
    appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
    appStore.updatePartnerInfo({});
    localStorage.removeItem("token");
    location.reload();
  }
  console.log(appStore.authStatus)
  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="bg-white w-72 p-6 shadow-lg flex flex-col items-center fixed top-0 left-0 h-screen md:relative md:h-auto z-10 md:z-0">
            <div className="text-white text-xl font-bold bais-1/4">
              <a href="https://vendor.xcellify.com/">
                <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify" />
              </a>
            </div>
          <div className="mb-8 space-y-4 basis-2/4 pt-20">
            <Link
              to="/dashboard"
              className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-center shadow-sm hover:bg-blue-600 hover:text-white"
            >
              Dashboard
            </Link>
            
            <Link
              to="/addNewProduct"
              className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-center shadow-sm hover:bg-blue-600 hover:text-white"
            >
              Add Products/Services
            </Link>

            <Link
              to="/products"
              className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-center shadow-sm hover:bg-blue-600 hover:text-white"
            >
              View Products/Services
            </Link>
          </div>
          <div className="basis-1/4">
            <div className="flex items-center justify-center mb-6">
                <img
                  src={TutorPlaceholder}
                  alt="Vendor Logo"
                  className="w-20 h-20 rounded-full shadow-md"
                />
              </div>
              <Link
                to="/profile"
                className="block bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-center shadow-sm hover:bg-blue-600 hover:text-white mb-4"
              >
                Your Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 text-white px-4 py-2 rounded-md text-center shadow-sm hover:bg-red-600"
              >
                Logout
              </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 md:ml-0 w-full">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome, Vendor!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Manage your products and services easily from the dashboard.
            </p>
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg shadow-md hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;
