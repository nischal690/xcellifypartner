import React from 'react';
import DocumentCard from './DocumentCard';

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
    // Extend if needed
  };
  return mimeMap[mimeType] || 'file';
};

const EssentialDocuments = ({ essentialDocs, activeTab }) => {
  return (
    <div>
      {activeTab === 'complianceDetails' && essentialDocs && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Essential Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
            {Object.entries(essentialDocs).map(([key, doc], index) =>
              doc?.base64 ? (
                <div
                  key={key}
                  className={`col-span-1 ${
                    index < 4 ? 'lg:col-span-4' : 'lg:col-span-4'
                  }`}
                >
                  <DocumentCard
                    name={key.replace(/_/g, ' ')}
                    fileName={key}
                    fileType={getExtensionFromMime(doc.contentType)}
                    downloadLink={`data:${doc.contentType};base64,${doc.base64}`}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EssentialDocuments;
