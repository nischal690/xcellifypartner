import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import getProducts_API from '../products/getProducts_API';
import LeftItems from './LeftItems';
import RightItems from './RightItems';
import productBannerImg from '../../assets/product-banner.jpeg'
import productLogo from '../../assets/productLogo.jpeg'
import { detailedViewSchemaData } from '../../utils/detailedViewSchema';
import KeyInfo from './KeyInfo';
import ContentCard from '../../components/commonComponents/ContentCard';

export default function ProductDetailedView() {

    const {id} = useParams();
    const [product, setProduct] = useState();
    const [category, setCategory] = useState();
    const [productSchema, setProductSchema] = useState();

    useEffect(() => {

        const getProduct = async () => {
            const payload = [{
                operation: 'equals',
                data:[{key:'id', value: id},]
            },]

            const fetchedProduct = await getProducts_API({payload: payload});

            if(fetchedProduct){
                setProduct(fetchedProduct[0]);
                setCategory(fetchedProduct[0]?.category)
                setProductSchema(detailedViewSchemaData[fetchedProduct[0]?.category])
                console.log(detailedViewSchemaData[fetchedProduct[0]?.category])
            }
        }

        getProduct();

    }, [id])

  return (
    <div className='max-w-7xl mx-auto p-10 font-dmsans'>
        <div className='flex justify-between items-center my-4'>
            <div>
                {/* Breadcrumbs */}
            </div>
            <div className='space-x-5'>
                {product?.product_status === "Rejected" && (
                    <button className='border border-purple-primary px-4 py-1 text-purple-primary rounded-md hover:text-white hover:bg-purple-primary transition-colors duration-300'>Re-submit</button>
                )}
                <button className='text-white bg-[#F04C4D] rounded-md px-4 py-1'>Delete product</button>
            </div>
        </div>
        <div>
            <div>
                <img src={productBannerImg} alt="banner" className='h-36 w-full object-cover rounded-lg' />
            </div>
            <img src={productLogo} alt="" className="w-16 h-16 rounded-full mr-3 object-cover -mt-10 ms-10" />
        </div>
        <KeyInfo product={product} category={category}/>
        <div className='flex space-x-10'>
            <LeftItems product={product} category={category} schema={productSchema?.[0]}/>
            <RightItems product={product} category={category} schema={productSchema?.[1]}/>
        </div>
        {product?.product_status === "Rejected" && product?.rejection_reason && (
            <ContentCard title="Reason for rejection" content={product?.rejection_reasone}/>
        )}
    </div>
  )
}
