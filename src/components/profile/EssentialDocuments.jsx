import React, { useRef, useState } from 'react';
import DocumentCard from './DocumentCard';
import apiRequest from '../../utils/apiRequest';
import { toast } from 'react-toastify';
import { MdEdit, MdUpload } from 'react-icons/md';

const getExtensionFromMime = (mimeType) => {
  const mimeMap = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
    'image/svg+xml': 'svg',
  };
  return mimeMap[mimeType] || 'file';
};

const EssentialDocuments = ({
  essentialDocs,
  setEssentialDocs,
  activeTab,
  userId,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleBrandLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', userId);

    try {
      setUploading(true);
      const response = await apiRequest({
        url: 'mic-login/profile-picture',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response?.data?.success) {
        toast.success('Brand logo uploaded successfully');

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          const updatedDoc = {
            base64,
            contentType: file.type,
            updatedAt: new Date().toISOString(),
          };
          setEssentialDocs((prev) => ({
            ...prev,
            brand_logo: updatedDoc,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(response?.data?.message || 'Failed to upload brand logo');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Error uploading brand logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {activeTab === 'complianceDetails' && essentialDocs && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Essential Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
            {Object.entries(essentialDocs).map(([key, doc], index) => {
              const isBrandLogo = key === 'brand_logo';
              return doc?.base64 || isBrandLogo ? (
                <div key={key} className="col-span-1 lg:col-span-4 relative">
                  <DocumentCard
                    name={key
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    fileName={key}
                    fileType={getExtensionFromMime(
                      doc?.contentType || 'image/png'
                    )}
                    downloadLink={
                      doc?.base64
                        ? `data:${doc.contentType};base64,${doc.base64}`
                        : ''
                    }
                  />

                  {isBrandLogo && (
                    <div className="mt-3 flex justify-start">
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleBrandLogoUpload}
                      />
                      <button
                        className="text-sm text-blue-600 bg-white border border-blue-500 px-3 py-1 rounded shadow hover:bg-blue-50 flex items-center gap-1"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                      >
                        {doc?.base64 ? (
                          <>
                            <MdEdit className="text-base" />
                            Edit Logo
                          </>
                        ) : (
                          <>
                            <MdUpload className="text-base" />
                            Upload Logo
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EssentialDocuments;
