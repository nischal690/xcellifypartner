import React from 'react';
import { MdDownload } from 'react-icons/md';
import MSMECertificateIcon from '../../assets/svg-icons/MSMECertificateIcon';

const DocumentCard = ({ name, fileName, fileType, downloadLink }) => {
  return (
    <div className="flex items-center justify-between rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3 flex-1">
        <span className="text-gray-700 font-medium truncate">{name}</span>
      </div>

      <div className="flex items-center justify-between space-x-3 w-1/3">
        <div className="flex items-center space-x-3 bg-white shadow-md px-4 py-2 rounded-lg w-full max-w-[300px]">
          <MSMECertificateIcon className="text-purple-600 text-lg" />

          <span className="text-gray-600 text-sm truncate">{fileName}</span>

          <a href={downloadLink} download={`${fileName}.${fileType}`}>
            <MdDownload className="text-gray-700 text-lg" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
