import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import productsData from '../../utils/productsData';
import CoursePlaceholderImg from '../../assets/course-placeholder.png';
import Sidebar from '../../components/sidebar/index';
import ProductsList from './List';
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import { getProducts_API_PG } from './getProducts_API';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const Products = () => {
  let navigate = useNavigate();
  const { appStore } = useStore();
  const [products, setProducts] = useState([]);
  const [pageNo, setPageNo] = useState(1); // Default to page 1
  const pageSize = 20; // You can make this dynamic too
  const [pageCount, setPageCount] = useState(1);
  const debouncedSearchValue = appStore.searchValue;

  useEffect(() => {
    const getProducts = async () => {
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
      const response = await getProducts_API_PG({
        payload: payload,
        pgNo: pageNo,
        pgSize: pageSize,
      });

      setProducts(response?.data || []);
      setPageCount(response?.meta?.pagination?.pageCount || 1);
    };
    getProducts();
  }, [appStore.partnerInfo?.id, debouncedSearchValue, pageNo]);

  return (
    <>
      {debouncedSearchValue && !products.length ? (
        <p className="w-full text-center text-xl py-20 text-bold text-gray-500">
          No Products found
        </p>
      ) : (
        <>
          <ProductsList products={products} brandLogo={appStore?.brandLogo} />
          <div className="flex justify-center gap-4 my-6">
            <button
              onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
              disabled={pageNo === 1}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
                pageNo === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {'<'} Newer
            </button>

            <span className="px-4 py-2 text-gray-600">
              Page {pageNo} of {pageCount}
            </span>

            <button
              onClick={() => setPageNo((prev) => Math.min(prev + 1, pageCount))}
              disabled={pageNo === pageCount}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
                pageNo === pageCount ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Older {'>'}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default observer(Products);
