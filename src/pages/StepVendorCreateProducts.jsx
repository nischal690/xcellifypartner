// src/pages/StepVendorCreateProducts.jsx
import React, { useState } from 'react';
import PrimaryLogo from '../assets/logo-primary.png';

import StudyOverseasForm from '../components/productForms/studyOverseas/StudyOverseasForm';
import StudyIndiaForm from '../components/productForms/studyIndia/StudyIndiaForm';
import TutoringForm from '../components/productForms/tutoring/TutoringForm';
import CareerCounsellingForm from '../components/productForms/careerCounselling/CareerCounsellingForm';
import SummerCoursesForm from '../components/productForms/summerCourses/SummerCoursesForm';
import EventsForm from '../components/productForms/events/EventsForm';
import EducationLoanForm from '../components/productForms/studyFinance/educationLoan/EducationLoanForm';
import ScholarshipForm from '../components/productForms/studyFinance/scholarship/ScholarshipForm';
import CompetitativeExamForm from '../components/productForms/competitativeExam/CompetitativeExamForm';
import MentoringForm from '../components/productForms/mentoring/MentoringForm';
import MerchandiseForm from '../components/productForms/merchandise/MerchandiseForm';
import { toJS } from 'mobx';
import { useStore } from '../stores';
import { useAppInfo } from '../hooks/appStore/useAppInfo';

const CATEGORY_OPTIONS = [
  'Study overseas',
  'Study India',
  'Tutoring',
  'Career counselling',
  'Summer courses',
  'Events',
  'Study Finance',
  'Competitative exam',
  'Mentoring',
  'Merchandise',
];

const SUBCATEGORY_OPTIONS = {
  'Study Finance': ['Education Loan', 'Scholarship'],
};

const FORM_COMPONENTS = {
  'Study overseas': <StudyOverseasForm />,
  'Study India': <StudyIndiaForm />,
  Tutoring: <TutoringForm />,
  'Career counselling': <CareerCounsellingForm />,
  'Summer courses': <SummerCoursesForm />,
  Events: <EventsForm />,
  'Competitative exam': <CompetitativeExamForm />,
  Mentoring: <MentoringForm />,
  Merchandise: <MerchandiseForm />,
};

const FINANCE_SUBCOMPONENTS = {
  'Education Loan': <EducationLoanForm />,
  Scholarship: <ScholarshipForm />,
};

const StepVendorCreateProducts = () => {
  const { partnerInfo } = useAppInfo();

  // console.log('partnerInfo=====', partnerInfo.partner_id);

  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');

  const renderForm = () => {
    if (category === 'Study Finance') {
      return FINANCE_SUBCOMPONENTS[subCategory] || null;
    }
    return FORM_COMPONENTS[category] || null;
  };

  return (
    <div className="p-10  mx-auto">
      <div className="mb-8">
        <img
          src={PrimaryLogo}
          alt="Xcellify Logo"
          className="w-24 lg:w-32 cursor-pointer"
          onClick={() => (window.location.href = '/home')}
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Category
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory('');
            }}
            className="w-full max-w-md p-2 border rounded-md"
          >
            <option value="">Choose a category</option>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {SUBCATEGORY_OPTIONS[category] && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Subcategory
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full max-w-md p-2 border rounded-md"
            >
              <option value="">Choose a subcategory</option>
              {SUBCATEGORY_OPTIONS[category].map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-8">{renderForm()}</div>
      </div>
    </div>
  );
};

export default StepVendorCreateProducts;
