import React from 'react'
import ContentCard from '../../components/commonComponents/ContentCard'
import TagsCard from '../../components/commonComponents/TagsCard';

export default function RightItems({ product, category, schema }) {
    
    const productDescription = product?.[schema?.[0]?.name];
    const productUniqueSellingPoint = product?.[schema?.[1]?.name];
    console.log(schema?.[2]?.fields)
    const serviceLocations = schema?.[2]?.fields?.map(sec => ({ key: sec.label, values: product?.[sec?.name]?.toString()?.split(", ")}));
    
  return (
    <div className='w-1/2 py-10'>
        <div className='space-y-10'>
            <ContentCard title="Product description" content={productDescription}/>
            <ContentCard title="Product unique selling point" content={productUniqueSellingPoint}/>
            <TagsCard title="Service locations" data={serviceLocations}/>
        </div>
    </div>
  )
}
