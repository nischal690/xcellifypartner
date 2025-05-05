import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import productsData from '../../utils/productsData';
import CoursePlaceholderImg from '../../assets/course-placeholder.png';
import Sidebar from '../../components/sidebar/index';
import ProductsList from './List';
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import { getProducts_API_PG } from './getProducts_API';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import './products.css';

const Products = () => {
  let navigate = useNavigate();
  const { appStore } = useStore();
  const [products, setProducts] = useState([]);
  const [pageNo, setPageNo] = useState(1); // Default to page 1
  const pageSize = 20; // You can make this dynamic too
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearchValue = appStore.searchValue;

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      const payload = [
        {
          operation: 'equals',
          data: [{ key: 'partner_id', value: appStore.partnerInfo?.id }],
        },
      ];
      if (!!debouncedSearchValue) {
        payload.push({
          operation: 'contains',
          data: [
            { key: 'product_title', value: debouncedSearchValue },
            { key: 'product_description', value: debouncedSearchValue },
            { key: 'category', value: debouncedSearchValue },
          ],
          conditionType: 'or',
        });
      }
      try {
        const response = await getProducts_API_PG({
          payload: payload,
          pgNo: pageNo,
          pgSize: pageSize,
        });

        setProducts(response?.data || []);
        setPageCount(response?.meta?.pagination?.pageCount || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, [appStore.partnerInfo?.id, debouncedSearchValue, pageNo]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="products-container px-4 py-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen"
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : debouncedSearchValue && !products.length ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center py-20"
        >
          <p className="text-2xl font-bold text-gray-500">No Products Found</p>
          <p className="text-gray-400 mt-2">Try a different search term</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <ProductsList products={products} brandLogo={appStore?.brandLogo} />
          
          <motion.div 
            className="flex justify-center gap-4 my-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <button
              onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
              disabled={pageNo === 1}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                pageNo === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>

            <div className="px-6 py-2 bg-white rounded-full shadow-md text-gray-700 font-medium">
              Page {pageNo} of {pageCount}
            </div>

            <button
              onClick={() => setPageNo((prev) => Math.min(prev + 1, pageCount))}
              disabled={pageNo === pageCount}
              className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
                pageNo === pageCount 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default observer(Products);
