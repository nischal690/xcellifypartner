import React, { lazy, Suspense } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const StudyIndiaEdit = lazy(() => import('./categories/StudyIndiaEdit'));
const StudyOverSeasEdit = lazy(() => import('./categories/StudyOverseasEdit'));
const TutoringEdit = lazy(() => import('./categories/TutoringEdit'));
const CareerCounsellingEdit = lazy(() =>
  import('./categories/CareerCounsellingEdit')
);
const SummerCoursesEdit = lazy(() => import('./categories/SummerCoursesEdit'));
const EventsEdit = lazy(() => import('./categories/EventsEdit'));
const LoansEdit = lazy(() => import('./categories/LoansEdit'));
const ScholarshipsEdit = lazy(() => import('./categories/ScholarshipsEdit'));
const MerchandiseEdit = lazy(() => import('./categories/MerchandiseEdit'));

export default function ProductEdit() {
  const { category, subcategory } = useParams();
  const [queryParameters] = useSearchParams();
  const product_id = queryParameters.get('product_id');

  console.log(product_id);

  console.log(category, subcategory);

  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      {category == 'Study India' && <StudyIndiaEdit product_id={product_id} />}
      {category == 'Study overseas' && (
        <StudyOverSeasEdit product_id={product_id} />
      )}
      {category == 'Tutoring' && <TutoringEdit product_id={product_id} />}
      {category == 'Career counselling' && (
        <CareerCounsellingEdit product_id={product_id} />
      )}
      {category == 'Summer courses' && (
        <SummerCoursesEdit product_id={product_id} />
      )}
      {category == 'Events' && <EventsEdit product_id={product_id} />}
      {category == 'Study Finance' && subcategory == 'Education Loan' && (
        <LoansEdit product_id={product_id} />
      )}
      {category == 'Study Finance' && subcategory == 'Scholarship' && (
        <ScholarshipsEdit product_id={product_id} />
      )}
      {category == 'Merchandise' && <MerchandiseEdit product_id={product_id} />}
    </Suspense>
  );
}
