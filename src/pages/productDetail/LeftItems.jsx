import React from 'react';
import KeyInfo from './KeyInfo';
import KeyValuePairCard from '../../components/commonComponents/KeyValuePairCard';
import { FaStar } from 'react-icons/fa';
import StarsView from '../../components/commonComponents/StarsView';

export default function LeftItems({ product, category, subcategory, schema }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-'; // Handle undefined/null cases
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-GB', { month: 'short' }); // Short month
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year

    return `${day}-${month}-${year}`; // Construct desired format
  };

  const basicDetails = schema?.[0]?.fields?.map((sec) => ({
    key: sec.label,
    value:
      sec.name === 'scholarship_available' ||
      sec.name === 'full_financing_available'
        ? product[sec.name]
          ? 'Yes'
          : 'No'
        : sec.name.includes('deadline') || sec.name === 'event_timeline'
        ? formatDate(product[sec.name])
        : product[sec.name] || '-', // Show '-' if value is missing
  }));

  const pricingDetails = schema?.[1]?.fields?.map((sec) => ({
    key: sec.label,
    value: product[sec.name] || '-', // Show '-' if value is missing
  }));

  return (
    <div className="w-full lg:w-1/2 py-4">
      <div className="space-y-10">
        <KeyValuePairCard title="Basic details" keyValuePairs={basicDetails} />
        {['Career counselling', 'Tutoring'].includes(category) &&
        product?.package?.length > 0 ? (
          product.package.map((pkg, idx) => (
            <KeyValuePairCard
              key={pkg.id || idx}
              title={`Package ${idx + 1}: ${pkg.package_title}`}
              keyValuePairs={[
                { key: 'Pricing Type', value: pkg.pricing_type },
                { key: 'Package Duration', value: pkg.package_duration },
                { key: 'Package Details', value: pkg.package_details },
                { key: 'Currency', value: pkg.currency },
                { key: 'Price', value: pkg.price || '0' },
                { key: 'Discount (%)', value: pkg.discount || '0' },
                { key: 'Final Price', value: pkg.final_package_price || '0' },
              ]}
            />
          ))
        ) : (
          <KeyValuePairCard
            title="Pricing details"
            keyValuePairs={pricingDetails}
          />
        )}

        {/* <div>
          <h3 className="font-semibold text-lg mb-4">Review/rating</h3>
          <div className="shadow-md shadow-gray-300 p-5 rounded-md bg-white">
            <p className="text-xl font-semibold mb-6">Google reviews</p>
            <div className="flex">
              <span className="text-xl font-semibold">
                {product?.google_reviews}
              </span>
              <StarsView rating={Math.round(product?.google_reviews)} />
            </div>
            <p className="text-xl font-semibold mb-6 mt-6">
              Google Rating Link
            </p>
            <div className="flex">
              <a
                href={product?.google_rating_url}
                target="_blank"
                className="text-xl"
              >
                {product?.google_rating_url}
              </a>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
