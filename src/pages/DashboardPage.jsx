import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../utils/productsData";

const DashboardPage = () => {
    const [products, setProducts] = useState(() => {
      const storedData = JSON.parse(localStorage.getItem("products"));
      return storedData || productsData;
    });
    
    const [companyType, setCompanyType] = useState(() => {
      return localStorage.getItem("companyType") || "Private Limited";
    });

    useEffect(() => {
      localStorage.setItem("products", JSON.stringify(products));
      
      // Get company type from local storage if available
      const storedCompanyType = localStorage.getItem("companyType");
      if (storedCompanyType) {
        setCompanyType(storedCompanyType);
      }
      
      // Mock function to simulate fetching user data
      const fetchUserData = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(fetchUserData);
    }, [products]);
    
    const [isLoading, setIsLoading] = useState(true);

    const {totalRevenue, totalEnrollments, recentActivity} = useMemo(() => iterateData(), [products]);

    let navigate = useNavigate();

    function iterateData(){
      let totalEnrollments=0, totalRevenue=0;
      let recentActivity = [];
      
      products.forEach((product, index) => {
        if(product.enrolledStudents){
          totalEnrollments += product?.enrolledStudents
          totalRevenue += product?.revenue;
        }
        else if(product.registeredStudents){
          totalEnrollments += product?.registeredStudents
        }
        
        // Create mock recent activity data for the first 3 products
        if (index < 3) {
          recentActivity.push({
            id: index,
            type: product.type || "Course",
            name: product.name || `Product ${index + 1}`,
            action: index % 2 === 0 ? "New enrollment" : "Revenue update",
            date: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString(),
            amount: product.revenue ? `₹${product.revenue.toLocaleString('en-IN')}` : "N/A"
          });
        }
      })
      
      return {totalRevenue, totalEnrollments, recentActivity}
    }
    
    const updateLocalStorage = () => {
      localStorage.setItem("products", JSON.stringify(products));
    }
    
    const handleDeclarationDownload = (format) => {
      // Mock function for downloading declaration document
      alert(`Downloading declaration document in ${format} format`);
      // In a real implementation, this would call an API to generate the document
    }
    
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    }
    
    const quickActions = [
      { name: "Add New Product", icon: "📦", action: () => navigate("/add-product") },
      { name: "View Analytics", icon: "📊", action: () => navigate("/analytics") },
      { name: "Update Profile", icon: "👤", action: () => navigate("/profile") },
      { name: "Support", icon: "🛟", action: () => navigate("/support") },
    ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-6 md:p-10">
          {/* Dashboard Header */}
          <header className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{getGreeting()}, Vendor</h1>
                <p className="text-gray-600 mt-1">Welcome to your dashboard. Here's what's happening today.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Account
                </button>
              </div>
            </div>
          </header>

          {/* Stats Overview Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Products/Services</p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">{products.length}</h2>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {products.length > 0 ? `${products.length} active products in your catalog` : "No active products"}
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h2>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-500">
                  {totalRevenue > 0 ? "Revenue is growing" : "No revenue yet"}
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Enrollments</p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">{totalEnrollments.toLocaleString('en-IN')}</h2>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-purple-500">
                  {totalEnrollments > 0 ? `${totalEnrollments} students enrolled` : "No enrollments yet"}
                </p>
              </div>
            </div>
          </section>
          
          {/* Quick Actions Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <div 
                  key={index}
                  onClick={action.action}
                  className="bg-white shadow-sm rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl mb-2">{action.icon}</span>
                  <p className="text-sm font-medium text-gray-700">{action.name}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Two Column Layout for Recent Activity and Supplier Declaration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Section */}
            <section className="lg:col-span-2 bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="py-4 flex items-start">
                      <div className={`p-2 rounded-full mr-4 ${
                        activity.action.includes("enrollment") ? "bg-blue-100" : "bg-green-100"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                          activity.action.includes("enrollment") ? "text-blue-600" : "text-green-600"
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {activity.action.includes("enrollment") ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.name} ({activity.type})</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity to display.</p>
              )}
              <div className="mt-4 text-right">
                <button 
                  onClick={() => navigate("/activity")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all activity →
                </button>
              </div>
            </section>
            
            {/* Supplier Declaration Document Section */}
            <section className="bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Supplier Declaration</h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  {companyType === "Individual" || companyType === "Sole Proprietorship" || companyType === "Partnership" 
                    ? "I hereby declare that all information provided is accurate and complete."
                    : "We hereby declare that all information provided is accurate and complete."
                  }
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Company Type: <span className="font-medium">{companyType}</span></p>
                <p className="text-sm text-gray-600">Last Updated: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => handleDeclarationDownload("pdf")}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download as PDF
                </button>
                <button 
                  onClick={() => handleDeclarationDownload("docx")}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Download as DOCX
                </button>
                <button 
                  onClick={() => navigate("/declaration-preview")}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Declaration
                </button>
              </div>
            </section>
          </div>
          
          {/* Products Section */}
          <section className="mt-8 bg-white shadow-sm rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Products</h2>
              <button 
                onClick={() => navigate("/add-product")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Add New Product
              </button>
            </div>
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.slice(0, 5).map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name || `Product ${index + 1}`}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.type || "Course"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{(product.enrolledStudents || product.registeredStudents || 0).toLocaleString('en-IN')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">₹{(product.revenue || 0).toLocaleString('en-IN')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No products available. Add your first product to get started.</p>
            )}
            {products.length > 5 && (
              <div className="mt-4 text-right">
                <button 
                  onClick={() => navigate("/products")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all products →
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
