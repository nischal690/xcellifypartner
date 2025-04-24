import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getProducts_API from '../products/getProducts_API';
import LeftItems from './LeftItems';
import RightItems from './RightItems';
import placeholderImg from '../../assets/brandLogoPlaceholder.png';
import { detailedViewSchemaData } from '../../utils/detailedViewSchema';
import KeyInfo from './KeyInfo';
import ProductSlider from './ProductSlider';
import ContentCard from '../../components/commonComponents/ContentCard';
import apiRequest from '../../utils/apiRequest';
import { toast } from 'react-toastify';
import { useStore } from '../../stores';

export default function ProductDetailedView() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [category, setCategory] = useState();
  const [subcategory, setSubcategory] = useState();
  const [productSchema, setProductSchema] = useState();

  const { appStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      const payload = [
        {
          operation: 'equals',
          data: [{ key: 'product_id', value: id }],
        },
      ];

      const fetchedProduct = await getProducts_API({ payload: payload });

      if (fetchedProduct) {
        const productData = fetchedProduct[0];
        setProduct(productData);
        setCategory(productData?.category);
        setSubcategory(productData?.subcategory);

        // Choose schema dynamically based on category & subcategory
        if (
          productData?.subcategory &&
          detailedViewSchemaData[productData?.category]?.[
            productData?.subcategory
          ]
        ) {
          setProductSchema(
            detailedViewSchemaData[productData?.category][
              productData?.subcategory
            ]
          );
        } else {
          setProductSchema(detailedViewSchemaData[productData?.category]);
        }
      }
    };

    getProduct();
  }, [id]);

  // console.log('Hola===', product);

  // console.log('productSchema', productSchema);

  // console.log('subcategory', subcategory);

  const handleDelete = async () => {
    let deleteProductResp = await apiRequest({
      url: '/mic-study/deleteProduct',
      method: 'POST',
      params: {
        product_id: product?.product_id,
        profile_id: appStore.partnerInfo.id,
      },
    });
    if (deleteProductResp?.data) {
      toast.success('Product deleted');
      navigate('/home/products');
    }
  };

  let productImage = placeholderImg;

  if (!!product?.product_images?.length) {
    let maxWidth = 0;
    product?.product_images?.forEach((image, index) => {
      if (image?.width > maxWidth) {
        productImage =
          import.meta.env?.VITE_STRAPI_URL +
          product?.product_images[index]?.url;
        maxWidth = image?.width;
      }
    });
  }

  console.log('productcate', product?.category);

  return (
    <div className="max-w-7xl mx-auto px-10 font-dmsans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 space-y-3 sm:space-y-0">
        {/* Breadcrumbs */}
        <div className="flex items-center flex-wrap">
          <span className="text-lg mr-2">Products</span>
          <span>{'>'}</span>
          <span className="text-lg font-semibold ml-2">Product Details</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-auto">
          {product?.product_status === 'Rejected' && (
            <button className="border border-purple-500 px-3 py-1 text-purple-500 rounded-md hover:bg-purple-500 hover:text-white transition-colors duration-300 w-auto sm:w-auto min-w-[120px]">
              Re-submit
            </button>
          )}
          <button
            className={`px-3 py-1 rounded-md w-auto sm:w-auto min-w-[120px] text-center transition-colors duration-300 ${
              product?.product_status === 'Approved'
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-purple-primary text-white hover:bg-purple-700'
            }`}
            onClick={() => {
              if (product?.product_status === 'Approved') {
                toast.info(
                  'This product is already approved. Contact admin to request changes.'
                );
                return;
              }
              navigate(
                `/edit-product/${product?.category}/${
                  product?.subcategory || 'none'
                }?product_id=${product?.product_id}`
              );
            }}
          >
            Edit product
          </button>

          <button
            className="text-white bg-red-500 rounded-md px-3 py-1 w-auto sm:w-auto min-w-[120px] text-center"
            onClick={handleDelete}
          >
            Delete product
          </button>
        </div>
      </div>

      <ProductSlider product={product} brandLogo={appStore?.brandLogo} />

      <KeyInfo
        product={product}
        category={category}
        subcategory={subcategory}
      />
      <div className="flex space-x-10">
        <LeftItems
          product={product}
          category={category}
          subcategory={subcategory}
          schema={productSchema?.[0]}
        />
        <RightItems
          product={product}
          category={category}
          subcategory={subcategory}
          schema={productSchema?.[1]}
        />
      </div>
      {product?.product_status === 'Rejected' && product?.rejection_reason && (
        <ContentCard
          title="Reason for rejection"
          content={product?.rejection_reasone}
        />
      )}
    </div>
  );
}
