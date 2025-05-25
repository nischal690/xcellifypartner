import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const pricingTypes = [
  { label: 'Per Hour', value: 'Per Hour' },
  { label: 'Per Week', value: 'Per Week' },
  { label: 'Per Month', value: 'Per Month' },
  { label: 'Per Package', value: 'Per Package' },
];

const currencies = [
  { label: 'INR', value: 'INR' },
  { label: 'USD', value: 'USD' },
];

const tutoringFields = [
  {
    label: 'Mode of Teaching',
    name: 'mode_of_teaching',
    options: [
      'Online(1 on 1)',
      'Online(group)',
      'Physical(1 on 1)',
      'Physical(group)',
      'Home Visits',
    ],
  },
  {
    label: 'Study Level',
    name: 'study_levels',
    options: ['6', '7', '8', '9', '10', '11', '12', 'Graduation'],
  },
  {
    label: 'Subjects',
    name: 'subjects',
    options: [
      'Maths',
      'Science',
      'Physics',
      'Chemistry',
      'Biology',
      'Economics',
      'History',
      'Geography',
    ],
  },
];

const PackageDetailsSection = ({ formData, setFormData, category }) => {
  const [packages, setPackages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [errors, setErrors] = useState({
    price: '',
    discount_percent: '',
    package_duration_hours: '',
  });

  const [newPackage, setNewPackage] = useState({
    package_title: '',
    pricing_type: '',
    price: '',
    discount_percent: '',
    final_package_price: '',
    package_details: '',
    currency: 'INR',
    package_duration_hours: '',
  });

  useEffect(() => {
    if (formData.package && formData.package.length > 0) {
      setPackages(formData.package);
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      packages_details: packages,
    }));
    console.log('🧩 Live package update sent to formData:', packages);
  }, [packages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ['price', 'discount_percent', 'package_duration_hours'].includes(name)
    ) {
      const numericValue = parseFloat(value);

      if (numericValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.replace('_', ' ')} must be positive`,
        }));
      } else if (name === 'discount_percent' && numericValue > 100) {
        setErrors((prev) => ({
          ...prev,
          discount_percent: 'discount_percent must be between 0 and 100%',
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
    setNewPackage((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, field) => {
    setNewPackage((prev) => ({ ...prev, [field]: selectedOption.value }));
  };

  const calculateFinalPrice = (price, discount_percent) => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount_percent) || 0;

    const final = p - (p * d) / 100;
    return parseFloat(final.toFixed(2)); // 2 decimal precision
  };

  const handleAddPackage = () => {
    const { pricing_type, package_duration_hours, discount_percent } =
      newPackage;

    if (!pricing_type || !package_duration_hours) {
      toast.error('Please fill in all package * required fields.');
      return;
    }

    if (
      errors.price ||
      errors.discount_percent ||
      errors.package_duration_hours ||
      parseFloat(newPackage.price) < 0 ||
      parseFloat(newPackage.discount_percent) < 0 ||
      parseFloat(newPackage.discount_percent) > 100 ||
      parseInt(newPackage.package_duration_hours) < 0
    ) {
      toast.error('Please fix all errors in package fields before adding.');
      return;
    }

    const discount_percentVal = parseFloat(discount_percent) || 0;
    if (discount_percentVal > 100) {
      toast.error('discount_percent must be less than or equal to 100%.');
      return;
    }

    const price = parseFloat(newPackage.price) || 0;
    const finalPrice = calculateFinalPrice(price, discount_percentVal);
    const duration = parseInt(package_duration_hours) || 0;

    const newEntry = {
      package_title: newPackage.package_title || '',
      pricing_type,
      price,
      discount_percent: discount_percentVal,
      final_package_price: finalPrice,
      package_details: newPackage.package_details || '',
      currency: newPackage.currency || '',
      package_duration_hours: duration,

      mode_of_teaching: (formData.mode_of_teaching || '')
        .split(', ')
        .filter(Boolean),
      study_levels: (formData.study_levels || '').split(', ').filter(Boolean),
      subjects: (formData.subjects || '').split(', ').filter(Boolean),
      language_medium: (formData.language_medium || '')
        .split(', ')
        .filter(Boolean),
      materials_provided: (formData.materials_provided || '')
        .split(', ')
        .filter(Boolean),
      available_slots: (formData.available_slots || '')
        .split(', ')
        .filter(Boolean),
    };

    const updatedPackages = [...packages, newEntry].slice(0, 5);
    setPackages(updatedPackages);
    setEditingIndex(null);

    // Reset form
    setNewPackage({
      package_title: '',
      pricing_type: '',
      price: '',
      discount_percent: '',
      final_package_price: '',
      package_details: '',
      currency: '',
      package_duration_hours: '',
    });
  };

  const handleDeletePackage = (index) => {
    const updated = [...packages];
    updated.splice(index, 1);
    setPackages(updated);

    if (updated.length === 0) {
      setFormData((prev) => ({
        ...prev,
        mode_of_teaching: '',
        study_levels: '',
        subjects: '',
        language_medium: '',
        materials_provided: '',
        available_slots: '',
      }));
    }
  };

  const handleEditPackage = (index) => {
    if (editingIndex !== null) {
      toast.warning(
        'Please save and update the current package before editing another.'
      );
      return;
    }

    const pkg = packages[index];

    setNewPackage(pkg);

    setFormData((prev) => ({
      ...prev,
      mode_of_teaching: Array.isArray(pkg.mode_of_teaching)
        ? pkg.mode_of_teaching.join(', ')
        : '',
      study_levels: Array.isArray(pkg.study_levels)
        ? pkg.study_levels.join(', ')
        : '',
      subjects: Array.isArray(pkg.subjects) ? pkg.subjects.join(', ') : '',
      language_medium: Array.isArray(pkg.language_medium)
        ? pkg.language_medium.join(', ')
        : '',
      materials_provided: Array.isArray(pkg.materials_provided)
        ? pkg.materials_provided.join(', ')
        : '',
      available_slots: Array.isArray(pkg.available_slots)
        ? pkg.available_slots.join(', ')
        : '',
    }));

    handleDeletePackage(index);
    setEditingIndex(index);
  };

  const handleMultiSelectChange = (selectedOptions, name) => {
    const values = selectedOptions.map((opt) => opt.value).join(', ');
    setFormData((prev) => ({
      ...prev,
      [name]: values,
    }));
  };

  return (
    <div className="mb-6 mx-auto p-6 w-full max-w-4xl">
      <h3 className="text-md font-semibold mb-4 text-lg">Package Details</h3>

      {category === 'Competitative exam' && (
        <div className="mt-4 space-y-6">
          <div>
            <label className="block font-medium mb-1">Exam Name</label>
            <Select
              name="exam"
              options={[
                { label: 'JEE Mains', value: 'JEE Mains' },
                { label: 'NEET', value: 'NEET' },
                { label: 'UPSC', value: 'UPSC' },
                { label: 'GATE', value: 'GATE' },
                { label: 'CAT', value: 'CAT' },
              ]}
              value={
                formData.exam
                  ? { label: formData.exam, value: formData.exam }
                  : null
              }
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, exam: selected.value }))
              }
              placeholder="Select an exam"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutoringFields.map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label}</label>
                <Select
                  isMulti
                  options={field.options.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  value={
                    (formData[field.name] || '')
                      .split(', ')
                      .filter(Boolean)
                      .map((val) => ({ value: val, label: val })) || []
                  }
                  onChange={(selected) =>
                    handleMultiSelectChange(selected, field.name)
                  }
                  placeholder={`Select ${field.label}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {(editingIndex !== null || packages.length === 0) &&
        category === 'Tutoring' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {tutoringFields.map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label}</label>
                <Select
                  isMulti
                  options={field.options.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  value={
                    (formData[field.name] || '')
                      .split(', ')
                      .filter(Boolean)
                      .map((val) => ({ value: val, label: val })) || []
                  }
                  onChange={(selected) =>
                    handleMultiSelectChange(selected, field.name)
                  }
                  placeholder={`Select ${field.label}`}
                />
              </div>
            ))}
          </div>
        )}

      {(editingIndex !== null || packages.length === 0) &&
        ['Tutoring', 'Competitative exam'].includes(category) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Language Medium</label>
              <Select
                options={['English', 'Hindi'].map((lang) => ({
                  label: lang,
                  value: lang,
                }))}
                value={
                  formData.language_medium
                    ? {
                        label: formData.language_medium,
                        value: formData.language_medium,
                      }
                    : null
                }
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    language_medium: selected.value,
                  }))
                }
                placeholder="Select language"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Materials Provided
              </label>
              <CreatableSelect
                isMulti
                value={(formData.materials_provided || '')
                  .split(', ')
                  .filter(Boolean)
                  .map((val) => ({ label: val, value: val }))}
                onChange={(selected) => {
                  const values = selected.map((opt) => opt.value).join(', ');
                  setFormData((prev) => ({
                    ...prev,
                    materials_provided: values,
                  }));
                }}
                placeholder="Add or select materials"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Available Slots</label>
              <CreatableSelect
                isMulti
                value={(formData.available_slots || '')
                  .split(', ')
                  .filter(Boolean)
                  .map((val) => ({ label: val, value: val }))}
                onChange={(selected) => {
                  const values = selected.map((opt) => opt.value).join(', ');
                  setFormData((prev) => ({ ...prev, available_slots: values }));
                }}
                placeholder="Add available time slots"
              />
            </div>
          </div>
        )}

      {packages.map((pkg, index) => (
        <div
          key={index}
          className="mb-2 p-4 border border-gray-300 rounded flex justify-between items-center bg-purple-50"
        >
          <div>
            <strong>Package {index + 1}: </strong>
            {pkg.package_title} - {pkg.pricing_type} -{' '}
            {pkg.currency === 'USD' ? '$' : '₹'}
            {pkg.final_package_price}
          </div>

          <div className="flex gap-2">
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => handleEditPackage(index)}
            >
              Edit
            </button>
            <button
              className="text-sm text-red-600 hover:underline"
              onClick={() => handleDeletePackage(index)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {packages.length < 5 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block mb-1 font-medium">Package Title</label>
            <input
              name="package_title"
              value={newPackage.package_title}
              onChange={handleChange}
              placeholder="Enter package name"
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Pricing Type <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Choose pricing type"
              options={pricingTypes}
              value={
                pricingTypes.find(
                  (opt) => opt.value === newPackage.pricing_type
                ) || null
              }
              onChange={(selected) =>
                handleSelectChange(selected, 'pricing_type')
              }
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Package Duration (in hours){' '}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="package_duration_hours"
              value={newPackage.package_duration_hours}
              onChange={handleChange}
              placeholder="Duration"
              type="number"
              className="p-2 border rounded w-full"
            />
            {errors.package_duration_hours && (
              <p className="text-red-500 text-sm mt-1">
                {errors.package_duration_hours}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Package Details</label>
            <textarea
              name="package_details"
              value={newPackage.package_details}
              onChange={handleChange}
              placeholder="Enter package details"
              className="p-2 border rounded w-full h-[200px]"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 text-right">
              {newPackage.package_details.length}/1000 characters <br /> 50 to
              1000 characters
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              name="price"
              value={newPackage.price}
              onChange={handleChange}
              placeholder="Enter price"
              type="number"
              className="p-2 border rounded w-full"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              discount_percent (%)
            </label>
            <input
              name="discount_percent"
              value={newPackage.discount_percent}
              onChange={handleChange}
              placeholder="Enter discount_percent"
              type="number"
              className="p-2 border rounded w-full"
              min={0}
              max={100}
            />
            {errors.discount_percent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discount_percent}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Final Price</label>
            <input
              name="final_package_price"
              value={calculateFinalPrice(
                parseFloat(newPackage.price) || 0,
                parseFloat(newPackage.discount_percent) || 0
              )}
              placeholder="Final price"
              type="number"
              className="p-2 border rounded w-full bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Currency</label>
            <Select
              placeholder="Currency"
              options={currencies}
              value={
                currencies.find((opt) => opt.value === newPackage.currency) ||
                null
              }
              onChange={(selected) => handleSelectChange(selected, 'currency')}
            />
          </div>
        </div>
      )}

      {packages.length < 5 && (
        <div className="text-center mt-8">
          <button
            className="bg-purple-700 text-white py-2 px-4 rounded justify-center"
            onClick={handleAddPackage}
          >
            {editingIndex !== null ? 'Update Package' : 'Save Existing Package'}
          </button>

          <p className="text-gray-700 mb-4 text-base">
            Added atleast one package by clicking on above save button after
            filling details (max 5 packages)
          </p>
          <button
            type="button"
            className="text-purple-700 font-semibold hover:underline"
            onClick={handleAddPackage}
          >
            + Add another Package
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageDetailsSection;
