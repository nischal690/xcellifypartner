import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import productsData from "../utils/productsData";

const DashboardPage = () => {

    const [products, setProducts] = useState(() => {
      const storedData = JSON.parse(localStorage.getItem("products"));
      return storedData || productsData;
    });

    useEffect(() => {
      localStorage.setItem("products", JSON.stringify(products));
    }, [products]);

    const {totalRevenue, totalEnrollments} = useMemo(() => iterateData(), []);

    let navigate = useNavigate();

    function iterateData(){
      let totalEnrollments=0,totalRevenue=0;
      products.forEach((product) => {
        if(product.enrolledStudents){
          totalEnrollments += product?.enrolledStudents
          totalRevenue += product?.revenue;
        }
        else if(product.registeredStudents){
          totalEnrollments += product?.registeredStudents
        }
      })
      return {totalRevenue, totalEnrollments}
    }
    
    const updateLocalStorage = () => {
      localStorage.setItem("products", JSON.stringify(products));
    }

  return (
    <div className="p-10">
      {/* Dashboard Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
        <p className="text-gray-600">Manage your courses, webinars, and tutoring sessions.</p>
      </header>

      {/* Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800">Active Products/Services</h2>
          <p className="text-2xl text-blue-600 font-bold">{products.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800">Total Revenue</h2>
          <p className="text-2xl text-green-600 font-bold">{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-bold text-gray-800">Total Enrollments</h2>
          <p className="text-2xl text-purple-600 font-bold">{totalEnrollments.toLocaleString('en-IN')}</p>
        </div>
      </section>
      
    </div>
  );
};

export default DashboardPage;

