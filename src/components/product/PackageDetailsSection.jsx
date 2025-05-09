import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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

const PackageDetailsSection = ({ formData, setFormData }) => {
  const [packages, setPackages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [errors, setErrors] = useState({
    price: '',
    discount: '',
    package_duration: '',
  });

  const [newPackage, setNewPackage] = useState({
    package_title: '',
    pricing_type: '',
    price: '',
    discount: '',
    final_package_price: '',
    package_details: '',
    currency: 'INR',
    package_duration: '',
  });

  useEffect(() => {
    if (formData.package && formData.package.length > 0) {
      setPackages(formData.package);
    }
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      package: packages,
    }));
    // console.log('🧩 Live package update sent to formData:', packages);
  }, [packages]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['price', 'discount', 'package_duration'].includes(name)) {
      const numericValue = parseFloat(value);

      if (numericValue < 0) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.replace('_', ' ')} must be positive`,
        }));
      } else if (name === 'discount' && numericValue > 100) {
        setErrors((prev) => ({
          ...prev,
          discount: 'Discount must be between 0 and 100%',
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

  const calculateFinalPrice = (price, discount) => {
    const final = price - (price * discount) / 100;
    return final >= 0 ? final : 0;
  };

  const handleAddPackage = () => {
    const { pricing_type, package_duration, discount } = newPackage;

    if (!pricing_type || !package_duration) {
      toast.error('Please fill in all package * required fields.');
      return;
    }

    if (
      errors.price ||
      errors.discount ||
      errors.package_duration ||
      parseFloat(newPackage.price) < 0 ||
      parseFloat(newPackage.discount) < 0 ||
      parseFloat(newPackage.discount) > 100 ||
      parseInt(newPackage.package_duration) < 0
    ) {
      toast.error('Please fix all errors in package fields before adding.');
      return;
    }

    const discountVal = parseFloat(discount) || 0;
    if (discountVal > 100) {
      toast.error('Discount must be less than or equal to 100%.');
      return;
    }

    const price = parseFloat(newPackage.price) || 0;
    const finalPrice = calculateFinalPrice(price, discountVal);
    const duration = parseInt(package_duration) || 0;

    const newEntry = {
      package_title: newPackage.package_title || '',
      pricing_type,
      price,
      discount: discountVal,
      final_package_price: finalPrice,
      package_details: newPackage.package_details || '',
      currency: newPackage.currency || '',
      package_duration: duration,
    };

    const updatedPackages = [...packages, newEntry].slice(0, 5);
    setPackages(updatedPackages);
    setEditingIndex(null);

    // Reset form
    setNewPackage({
      package_title: '',
      pricing_type: '',
      price: '',
      discount: '',
      final_package_price: '',
      package_details: '',
      currency: '',
      package_duration: '',
    });
  };

  const handleDeletePackage = (index) => {
    const updated = [...packages];
    updated.splice(index, 1);
    setPackages(updated);
  };

  const handleEditPackage = (index) => {
    if (editingIndex !== null) {
      toast.warning(
        'Please save and update the current package before editing another.'
      );
      return;
    }

    setNewPackage(packages[index]);
    handleDeletePackage(index);
    setEditingIndex(index);
  };

  return (
    <div className="mb-6 mx-auto p-6 w-full max-w-4xl">
      <h3 className="text-md font-semibold mb-4 text-lg">Package Details</h3>

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
              name="package_duration"
              value={newPackage.package_duration}
              onChange={handleChange}
              placeholder="Duration"
              type="number"
              className="p-2 border rounded w-full"
            />
            {errors.package_duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.package_duration}
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
            <label className="block mb-1 font-medium">Discount (%)</label>
            <input
              name="discount"
              value={newPackage.discount}
              onChange={handleChange}
              placeholder="Enter discount"
              type="number"
              className="p-2 border rounded w-full"
              min={0}
              max={100}
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Final Price</label>
            <input
              name="final_package_price"
              value={calculateFinalPrice(
                parseFloat(newPackage.price) || 0,
                parseFloat(newPackage.discount) || 0
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
