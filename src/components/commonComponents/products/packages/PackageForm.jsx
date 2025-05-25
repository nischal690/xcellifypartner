// Inside PackageForm.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

import { CreatableMultiInput } from './CreatableMultiInput';

const MultiInput = ({ label, name, options, selected, onChange }) => (
  <div>
    <label className="block font-medium text-gray-700 mb-1">{label}</label>
    <Select
      isMulti
      name={name}
      options={options}
      value={selected.map((v) => ({ label: v, value: v }))}
      onChange={(selected) =>
        onChange(
          name,
          selected.map((item) => item.value)
        )
      }
      placeholder={`Select ${label}`}
    />
  </div>
);

const PackageForm = ({
  category,
  onPackagesChange,
  onCurrentPackageChange,
  schema,
}) => {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(getInitialPackageState(schema));
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (name, values) => {
    if (typeof values === 'string') {
      setForm((prev) => ({
        ...prev,
        [name]: values
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: values }));
    }
  };

  const handleAddPackage = () => {
    if (!form.package_title || !form.pricing_type) return;

    const updatedPackages = [...packages];

    if (editingIndex !== null) {
      updatedPackages[editingIndex] = form;
    } else {
      if (packages.length >= 5) return;
      updatedPackages.push(form);
    }

    setPackages(updatedPackages);
    setForm(getInitialPackageState(schema));
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setForm(packages[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = packages.filter((_, i) => i !== index);
    setPackages(updated);
    setEditingIndex(null);
    setForm(getInitialPackageState(schema));
  };

  const calculateFinalPrice = (price, discount) => {
    const p = parseFloat(price || 0);
    const d = parseFloat(discount || 0);
    return (p - (p * d) / 100).toFixed(2);
  };

  useEffect(() => {
    onPackagesChange(packages);
  }, [packages]);

  useEffect(() => {
    onCurrentPackageChange?.(form);
  }, [form]);

  return (
    <div className="md:col-span-2">
      <div className="w-full bg-white rounded-md border border-gray-200 p-6 mt-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Package Details
        </h3>

        {packages.length > 0 && (
          <div className="space-y-4 mb-6">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="p-4 bg-purple-disabled border border-gray-300 rounded-md flex justify-between items-start"
              >
                <div className="max-w-md">
                  <p className="text-sm text-blue-primary font-semibold mb-1">
                    Package {index + 1} — ₹{pkg.price} ({pkg.currency})
                  </p>
                  <p className="font-semibold text-blue-primary">
                    {pkg.package_title}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {pkg.package_details}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Final Price: ₹
                    {calculateFinalPrice(pkg.price, pkg.discount_percent)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-purple-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(packages.length < 5 || editingIndex !== null) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {schema.map((field) => {
                const isTextArea = field.type === 'textarea';

                if (field.type === 'multiselect') {
                  return (
                    <div key={field.name} className="md:col-span-2">
                      <MultiInput
                        label={field.label}
                        name={field.name}
                        options={field.options.map((o) => ({
                          value: o,
                          label: o,
                        }))}
                        selected={form[field.name] || []}
                        onChange={handleMultiChange}
                      />
                    </div>
                  );
                }

                if (field.type === 'select') {
                  return (
                    <div key={field.name}>
                      <label className="block font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <select
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === 'createselect') {
                  return (
                    <div key={field.name} className="md:col-span-2">
                      <CreatableMultiInput
                        label={field.label}
                        name={field.name}
                        options={field.options.map((o) => ({
                          value: o,
                          label: o,
                        }))}
                        selected={form[field.name] || []}
                        onChange={handleMultiChange}
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={field.name}
                    className={isTextArea ? 'md:col-span-2' : ''}
                  >
                    <label className="block font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    {isTextArea ? (
                      <textarea
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        className="w-full p-2 border rounded-md h-24"
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={form[field.name] || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label}`}
                        className="w-full p-2 border rounded-md"
                      />
                    )}
                    {form.price && form.discount_percent && (
                      <div className="md:col-span-2 text-sm font-medium text-gray-700">
                        Final Price:{' '}
                        <span className="text-blue-primary">
                          ₹
                          {calculateFinalPrice(
                            form.price,
                            form.discount_percent
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={handleAddPackage}
                className="px-6 py-2 bg-purple-primary text-white rounded-md hover:bg-purple-600 transition"
              >
                {editingIndex !== null ? 'Update Package' : 'Add Package'}
              </button>
              {editingIndex !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(getInitialPackageState(schema));
                    setEditingIndex(null);
                  }}
                  className="px-6 py-2 bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const getInitialPackageState = (schema) => {
  const initial = {};
  schema.forEach((field) => {
    if (field.name === 'currency') {
      initial[field.name] = 'INR';
    } else if (field.type === 'multiselect' || field.type === 'createselect') {
      initial[field.name] = [];
    } else {
      initial[field.name] = '';
    }
  });
  return initial;
};

export default PackageForm;
