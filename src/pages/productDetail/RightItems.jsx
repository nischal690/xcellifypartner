import React from 'react';
import ContentCard from '../../components/commonComponents/ContentCard';
import TagsCard from '../../components/commonComponents/TagsCard';
import RefundPolicyCard from '../../components/commonComponents/RefundPolicyCard';

export default function RightItems({ product, category, subcategory, schema }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-'; // Handle undefined/null cases
    const date = new Date(dateString);

    // Extract day, month (short format), and year (2-digit)
    const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
    const month = date.toLocaleString('en-GB', { month: 'short' }); // Short month
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year

    return `${day}-${month}-${year}`; // Construct desired format
  };

  const productDescription = product?.[schema?.[0]?.name];
  const productUniqueSellingPoint = product?.[schema?.[1]?.name];
  const productScholarshipDescription = product?.[schema?.[2]?.name];
  console.log(schema?.[2]?.fields);
  const serviceLocations = schema?.[3]?.fields?.map((sec) => ({
    key: sec.label,
    values:
      sec.name === 'event_registration_deadline'
        ? [formatDate(product[sec.name])] // Format the date
        : product?.[sec?.name]?.toString()?.split(', '),
  }));
  console.log(serviceLocations);

  return (
    <div className="w-1/2 py-10">
      <div className="space-y-10">
        <ContentCard title="Product description" content={productDescription} />
        <ContentCard
          title="Product unique selling point"
          content={productUniqueSellingPoint}
        />
        {category === 'Summer courses' && (
          <ContentCard
            title="Scholarship description"
            content={productScholarshipDescription}
          />
        )}

        <TagsCard title="Service locations" data={serviceLocations} />
        <RefundPolicyCard product={product} category={category} />
      </div>
    </div>
  );
}
