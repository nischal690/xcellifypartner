import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import productsData from '../../utils/productsData';
import CoursePlaceholderImg from '../../assets/course-placeholder.png'
import Sidebar from '../../components/sidebar/index'
import ProductsList from './List'
import { observer } from 'mobx-react';
import { useStore } from '../../stores';
import getProducts_API from './getProducts_API';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const Products = () => {

    let navigate = useNavigate();
    const {appStore} = useStore();
    const [products, setProducts] = useState([]);
    const debouncedSearchValue = appStore.searchValue;
    
    useEffect(()=>{
        const getProducts = async ()=>{
            const payload = [{
                operation: 'equals',
                data:[{key:'partner_id', value: appStore.partnerInfo?.id},]
            },]
            if(!!debouncedSearchValue){
                payload.push({
                    operation: 'contains',
                    data:[
                        {key: 'product_title', value: debouncedSearchValue},
                        {key: 'product_description', value: debouncedSearchValue},
                        {key: 'category', value: debouncedSearchValue},
                    ],
                    conditionType:'or'
                })
            }
            const products = await getProducts_API({payload: payload});
            setProducts(products);
        }
        getProducts();
    },[appStore.partnerInfo?.id, debouncedSearchValue])

    return (
        <>
            {debouncedSearchValue && !products.length ? <p className='w-full text-center text-xl py-20 text-bold text-gray-500'>No Products found</p>
            : <ProductsList products={products} brandLogo={appStore?.brandLogo}/>
            }
        </>
    );
};

export default observer(Products);