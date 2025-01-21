import React from 'react'
import KeyInfo from './KeyInfo'
import KeyValuePairCard from '../../components/commonComponents/KeyValuePairCard';
import { FaStar } from 'react-icons/fa';
import StarsView from '../../components/commonComponents/StarsView';

export default function LeftItems({ product, category, schema }) {
    
    const basicDetails = schema?.[0]?.fields?.map(sec => ({key: sec.label, value: product[sec.name]}));

    const pricingDetails = schema?.[1]?.fields?.map(sec => ({key: sec.label, value: product[sec.name]}))
  return (
    <div className='w-1/2 py-10'>
        <div className='space-y-10'>
            <KeyValuePairCard title="Basic details" keyValuePairs={basicDetails}/>
            <KeyValuePairCard title="Pricing details" keyValuePairs={pricingDetails}/>

            <div>
              <h3 className='font-semibold text-lg mb-4'>Review/rating</h3>
              <div className="shadow-md shadow-gray-300 p-5 rounded-md bg-white">
                <p className='text-xl font-semibold mb-6'>Google reviews</p>
                <div className='flex'>
                  <span className='text-xl font-semibold'>{product?.google_reviews}</span>
                  <StarsView rating={Math.round(product?.google_reviews)}/>
                </div>
              </div>
          
            </div>
        </div>
        
    </div>
  )
}
