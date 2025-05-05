import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '../pages/dashboard/index';
import ProductsView from '../pages/products/index';
import Sidebar from '../components/sidebar/index';
import NewProfilePage from '../pages/NewProfilePage';
import ProductDetailedView from '../pages/productDetail/ProductDetailedView';
import Services from '../pages/services/index';
import { useStore } from '../stores';
import { getProfilePicture_API } from '../utils/getProfilePicture_API';
import { observer } from 'mobx-react';

const HomePage = () => {
  const { appStore } = useStore();

  useEffect(() => {
    const fetchPartnerInfo = async () => {
      const brand_logo = await getProfilePicture_API(appStore.partnerInfo?.id);
      if (!!brand_logo)
        appStore.setAppProperty(
          'brandLogo',
          `data:image/png;base64,${brand_logo}`
        );
    };
    fetchPartnerInfo();
  }, [appStore?.partnerInfo?.id]);

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-50">
      {/* Sidebar: Automatically hides on small screens */}
      <div className="w-full sm:w-64 md:w-72 lg:w-80 ">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col">
        {/* Main Content: Fully responsive with proper padding */}
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 overflow-y-auto max-h-screen w-full">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<NewProfilePage />} />
            <Route path="products" element={<ProductsView />} />
            <Route path="product/:id" element={<ProductDetailedView />} />
            {/* <Route path="payouts" element={<ProductsView />} /> */}
            <Route path="services" element={<Services />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default observer(HomePage);
