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
          data: [{ key: 'id', value: id }],
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

  console.log(product);

  console.log('subcategory', subcategory);

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

  return (
    <div className="max-w-7xl mx-auto px-10 font-dmsans">
      <div className="flex justify-between items-center my-4">
        <div className="flex item-center">
          <span className="text-lg mr-3">Products</span>
          <span>{'>'}</span>
          <span className="text-lg font-semibold ml-3">Product Details</span>
        </div>
        <div className="space-x-5">
          {product?.product_status === 'Rejected' && (
            <button className="border border-purple-primary px-4 py-1 text-purple-primary rounded-md hover:text-white hover:bg-purple-primary transition-colors duration-300">
              Re-submit
            </button>
          )}
          <button
            className="text-white bg-[#F04C4D] rounded-md px-4 py-1"
            onClick={handleDelete}
          >
            Delete product
          </button>
        </div>
      </div>
      {/* <div>
        <div>
          <img
            src={productImage}
            alt="banner"
            className="h-52 w-full object-cover rounded-lg"
          />
        </div>
        <img
          src={appStore?.brandLogo || placeholderImg}
          alt=""
          className="w-16 h-16 rounded-full mr-3 object-cover -mt-10 ms-10"
        />
      </div> */}
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
