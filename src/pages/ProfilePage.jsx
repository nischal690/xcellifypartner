import React, { useState } from "react";
import useVendorProfile from "../hooks/profile/useVendorProfile";
import PrimaryLogo from "../assets/logo-primary.png";
import { MdEmail } from "react-icons/md";
import { PiPhone } from "react-icons/pi";
import { BiPhone } from "react-icons/bi";

export default function ProfilePage() {
  const { profile, errors, handleInputChange, handleSubmit } = useVendorProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const toggleEditMode = () => setIsEditing(!isEditing);

  // Sections data
  const sections = {
    companyDetails: {
      title: "Company Details",
      fields: [
        { label: "Company Name", name: "company_name" },
        { label: "Website", name: "website" },
        { label: "Owner/CEO", name: "owner_name" },
        { label: "Contact Person", name: "contact_person_name" },
      ],
    },
    bankDetails: {
      title: "Bank Details",
      fields: [
        { label: "Bank A/C Number", name: "bank_account_number" },
        { label: "Bank IFSC", name: "bank_ifsc" },
        { label: "Bank Name", name: "bank_name" },
        { label: "Bank A/C Type", name: "bank_account_type" },
      ],
    },
    address: {
      title: "Address",
      fields: [
        { label: "Address", name: "address" },
        { label: "State", name: "state" },
        { label: "Pin Code / Zip Code", name: "zipCode" },
        { label: "City", name: "city" },
        { label: "Country", name: "country" },
      ],
    },
    compliances: {
      title: "Compliances",
      fields: [
        { label: "CIN", name: "CIN" },
        { label: "PAN", name: "PAN" },
        { label: "GST", name: "GST" },
        { label: "Registered under MSME", name: "MSME" },
      ],
    },
  };

  return (
    <div className="w-full py-8 px-14 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <a href="https://vendor.xcellify.com/">
          <img src={PrimaryLogo} className="w-24 lg:w-32" alt="Xcellify Logo" />
        </a>
        <h1 className="text-4xl font-semibold text-purple-700">Profile</h1>
        <button
          onClick={toggleEditMode}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-500"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-dmsans">
        {/* Company Details Card */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{sections.companyDetails.title}</h2>
          <div className="p-6 bg-gray-200 shadow-md flex">
            <div className="w-1/3">
              <img src="https://st2.depositphotos.com/5205783/7801/v/450/depositphotos_78017774-stock-illustration-logo-abstract-triangle-vector.jpg" alt="" className="w-20 h-20"/>
            </div>
            <div className="w-2/3">
              <h3 className="text-2xl font-semibold  text-gray-800">{profile.company_name}</h3>
              <a href="www.stickon.tech">{profile.website}</a>
              <p className="text-sm mt-4">Owner / CEO</p>
              <div className="flex items-center w-1/2">
                <h4 className="text-lg basis-2/4">{profile.owner_name}</h4>
                <a href="" className=" basis-1/4"><BiPhone /></a>
                <a href="" className=" basis-1/4"><MdEmail /></a>
              </div>
              <hr/>
              <p className="text-sm mt-4">Contact person details</p>
              <div className="flex items-center justify-between w-1/2">
                <h4 className="text-lg">{profile.contact_person_name}</h4>
                <a href="" className=" basis-1/4"><BiPhone /></a>
                <a href="" className=" basis-1/4"><MdEmail /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details Card */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{sections.bankDetails.title}</h2>
          <div className="px-8 py-12 bg-gray-200 shadow-md flex justify-between">
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full">
                <div>Bank A/C Number</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.bank_account_number}</p></div>
              </div>
              <div className="w-full">
                <div>Bank Name</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.bank_name}</p></div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full">
                <div>Bank IFSC</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.bank_ifsc}</p></div>
              </div>
              <div className="w-full">
                <div>Bank A/C Type</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.bank_account_type}</p></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Address Card */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{sections.address.title}</h2>
          <div className="px-8 py-12 bg-gray-200 shadow-md flex justify-between">
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full grow">
                <div>Address</div>
                <div className="w-full bg-white px-2 py-2 h-[90%]"><p>{profile.address}</p></div>
              </div>
              <div className="w-full">
                <div>City</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.city}</p></div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full">
                <div>State</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.state}</p></div>
              </div>
              <div className="w-full">
                <div>Pin Code / Zip Code</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.pincode}</p></div>
              </div>
              <div className="w-full">
                <div>Country</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.country}</p></div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliances Card */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{sections.compliances.title}</h2>
          <div className="px-8 py-12 bg-gray-200 shadow-md flex justify-between">
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full">
                <div>CIN</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.CIN}</p></div>
              </div>
              <div className="w-full">
                <div>GST</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.GST}</p></div>
              </div>
            </div>
            <div className="flex flex-col items-center w-[47%] space-y-5">
              <div className="w-full">
                <div>PAN</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.PAN}</p></div>
              </div>
              <div className="w-full">
                <div>Registered under MSME</div>
                <div className="w-full bg-white px-2 py-2"><p>{profile.MSME_registered || "Yes"}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Submit Button */}
      {isEditing && (
        <div className="text-right mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}