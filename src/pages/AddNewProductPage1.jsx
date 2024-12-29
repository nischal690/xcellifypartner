import React, { useState } from "react";
import StepVendorProductDetailsPage from "./StepVendorProductDetailsPage";

export default function AddNewProductPage1() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Add Product Detail
      </h1>
      <StepVendorProductDetailsPage />
    </div>
  );
}
