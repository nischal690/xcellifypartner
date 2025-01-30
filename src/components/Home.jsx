import React from "react";
import { Route, Routes } from "react-router-dom";

import Dashboard from '../pages/dashboard/index'
import ProductsView from '../pages/products/index'
import Sidebar from '../components/sidebar/index'
import NavBar from '../components/navbar/index'
import NewProfilePage from '../pages/NewProfilePage'
import ProductDetailedView from "../pages/productDetail/ProductDetailedView";
import Services from "../pages/services/index";

const HomePage = () => {

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <div className="w-full border-b border-gray-200">
          <NavBar />
        </div>
        <div className="mx-auto p-10 overflow-y-auto max-h-screen">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<NewProfilePage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path='products' element={<ProductsView />} />
            <Route path= 'product/:id' element={<ProductDetailedView />}/>
            {/* <Route path="payouts" element={<ProductsView />} /> */}
            <Route path="services" element={<Services />} />
          </Routes>
        </div>
      </main>
    </div>

  );
};

export default HomePage;
