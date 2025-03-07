import React from 'react';
import MSMECertificateIcon from '../../assets/MSMECertificateIcon';
import { MdDownload } from 'react-icons/md';

export default function RefundPolicyCard({ product, category }) {
  const refundPolicyUrl = product?.refund_policy_media
    ? `${import.meta.env?.VITE_STRAPI_URL}${product.refund_policy_media.url}`
    : null;

  return (
    <div className="min-w-96 shadow-md shadow-gray-300 p-3 rounded-md bg-white">
      <h2 className="text-lg font-semibold my-4">Refund Policy</h2>
      <p>
        <strong>Refund Policy:</strong>{' '}
        {product?.refund_policy ? 'Agreed' : 'Not Agreed'}
      </p>

      {/* Download Refund Policy Media */}
      {refundPolicyUrl && (
        <div className="mt-3">
          <h3 className="text-md font-semibold mb-2">Refund Policy Document</h3>
          <a href={refundPolicyUrl} target="_blank" rel="noopener noreferrer">
            <button className="rounded-md border bg-white shadow-sm shadow-gray-300 flex items-center py-3 px-5">
              <span className="pr-2">
                <MSMECertificateIcon />
              </span>
              Download Refund Policy
              <MdDownload className="text-gray-700 ml-2" />
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
