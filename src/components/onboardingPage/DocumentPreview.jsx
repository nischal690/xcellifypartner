// src/components/DocumentPreview.jsx
import React, { useMemo } from 'react';
import { declarationFirstPageCom } from '../../utils/supplierDeclarationHelpers';

export default function DocumentPreview({
  formData,
  signatureFile,
  onClose,
  onDownload,
  onAttach,
  careOf,
  age,
}) {
  const {
    company_type,
    company_name,
    contact_person_name,
    contact_person_email,
    bank_name,
    bank_ifsc,
    bank_account_number,
    bank_account_type,
    account_holder_name,
  } = formData;

  const firstParagraph = useMemo(() => {
    const tpl = declarationFirstPageCom[company_type]?.firstParagraph || '';
    return tpl
      .replace(/{contact_person_name}/g, contact_person_name || '')
      .replace(/{company_name}/g, company_name || '')
      .replace(/{careOf}/g, careOf || '')
      .replace(/{age}/g, age || '')
      .replace(/{PAN}/g, formData.PAN || '')
      .replace(/{CIN}/g, formData.CIN || '')
      .replace(/{GST}/g, formData.GST || '')
      .replace(/{address_line_1}/g, formData.address_line_1 || '')
      .replace(/{address_line_2}/g, formData.address_line_2 || '');
  }, [company_type, company_name, contact_person_name, formData, careOf, age]);

  const signatureURL = useMemo(
    () => (signatureFile ? URL.createObjectURL(signatureFile) : null),
    [signatureFile]
  );

  const isProprietor =
    company_type === 'Individual' || company_type === 'sole_proprietership';
  const designation = isProprietor ? 'Proprietor' : 'CEO';

  const today = new Date();
  const formattedDate = [
    String(today.getDate()).padStart(2, '0'),
    String(today.getMonth() + 1).padStart(2, '0'),
    today.getFullYear(),
  ].join('-');

  const Page = ({ children }) => (
    <div className="w-[8.5in] min-h-[11in] p-8 bg-white mx-auto mb-8 border border-gray-200 relative">
      {children}
    </div>
  );

  const Footer = () => (
    <div className="absolute bottom-8 left-8 right-8 text-center text-gray-500 text-xs leading-tight">
      <div>Xcellify Private Limited</div>
      <div>
        RG 601, Purva Riviera, Marathahalli, Bangalore – 560037, Karnataka
      </div>
      <div>CIN – U85500KA2024PTC189409</div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Page 1 */}
        <Page>
          <div className="text-right">
            <img
              src="/LogoPrimary.png"
              alt="Logo"
              className="inline-block w-24 h-24"
            />
          </div>
          <h1 className="text-3xl text-center font-serif font-bold mt-4 mb-8">
            XCELLIFY PRIVATE LIMITED
          </h1>

          <h2 className="text-2xl text-center font-bold mb-6">
            SERVICE AGREEMENT
          </h2>

          <p className="font-serif leading-relaxed">
            This SERVICE AGREEMENT (“Agreement”) is entered into in Bengaluru on
            this day [•] of {formattedDate} by and between{' '}
            <strong>XCELLIFY PRIVATE LIMITED</strong> (“Company”), and{' '}
            <strong>{contact_person_name}</strong> (“Partner”).
          </p>

          <h3 className="font-bold mt-6">BY AND BETWEEN</h3>
          <p className="mt-2 leading-relaxed">{firstParagraph}</p>

          <p className="mt-4 leading-relaxed">
            For the purposes of this Agreement, the Company and Partner shall be
            singularly known as <strong>“Party”</strong> and collectively as{' '}
            <strong>“Parties”</strong>.
          </p>

          <h3 className=" mt-4 font-bold">WHEREAS:</h3>
          <p className="ml-6 leading-relaxed">
            <strong>A.</strong> The Company, inter alia, is engaged in the
            business of providing an online marketplace via. domain name
            https://xcellify.com/ (“Platform”) for listing, and sale of various
            products and services.
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>B.</strong> The Partner is desirous of being listed on the
            Platform to offer their products and/or services (hereinafter
            referred to as “Partner’s Product(s)” or “Partner’s Service(s)” or
            “Partner’s Product(s)/Service(s)”) to Customer (defined below).
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>C.</strong> The Partner has approached the Company to avail
            the Services (defined hereinafter), and the Company has agreed to
            provide the Services to the Partner, in accordance with the terms of
            this Agreement.
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>D.</strong> The Parties wish to formalize their agreement on
            the terms and conditions set forth under this Agreement.
          </p>
          <Footer />
        </Page>

        {/* Page 2 */}
        <div className="page-break" />
        <Page>
          <p className="leading-relaxed">
            NOW THEREFORE, in consideration of the mutual covenants, undertakings
            and conditions set forth below, and for other valid consideration, the
            acceptability and sufficiency of which are hereby acknowledged, the
            Parties hereby agree to the following terms and conditions hereinafter
            contained:
          </p>

          <h3 className="font-bold mt-4">1. DEFINITIONS</h3>
          <p className="ml-6 leading-relaxed">
            Unless otherwise defined in the Agreement, terms when capitalized
            shall have the meaning set out as per <strong>Annexure A</strong> of
            the Agreement.
          </p>

          <h3 className="font-bold mt-4">2. SCOPE OF ENGAGEMENT</h3>
          <p className="ml-6 leading-relaxed">
            2.1 Subject and in accordance to the terms of this Agreement, the
            Company shall provide the following services to the Partner:
          </p>
          <ul className="list-disc ml-12">
            <li>
              2.1.1 list the Partner’s Products and/or Partner’s Services on the
              Platform of the Company;
            </li>
            <li>
              2.1.2 facilitate the sale of Partner’s Products and/or Partner’s
              Services on and through the Company’s Platform;
            </li>
            <li>
              2.1.3 provide the Partner with access to a dedicated Partner
              dashboard on its Platform (“Dashboard”); and
            </li>
            <li>
              2.1.4 based on payment of required fees, market the sale of
              Partner’s Products and/or Partner’s Services by way of banners and/or
              priority ranking on the Company’s Platform.
            </li>
          </ul>
          <p className="ml-6 leading-relaxed">
            hereinafter collectively referred to as the <strong>Services</strong>.
          </p>
          <p className="ml-6 leading-relaxed">
            2.2 The Parties agree that the Agreement is non-exclusive in nature
            and the Company reserves the right to enter into similar transactions
            with any entity or individual, whether or not they are the Partner’s
            competitors.
          </p>
          <p className="ml-6 leading-relaxed">
            2.3 The Parties further agree that once the Partner’s
            Products/Services are listed and exhibited on the Platform, the
            Partner shall be deemed to have made an “offer to sell” the
            Partner’s Products/Services to the Customer, and when any Customer of
            the Platform places an Order, it shall be considered acceptance by
            the Customer of the offer and the Products shall be considered sold
            to the Customer, and the same shall be final and binding upon the
            Partner under the Applicable Law.
          </p>
          <Footer />
        </Page>

        {/* Page 3 */}
        <div className="page-break" />
        <Page>
          <h3 className="font-bold">11.4 No Waiver:</h3>
          <p className="ml-6 leading-relaxed">
            The failure of either Party at any time to require performance by
            the other Party of any provision of this Agreement shall in no way
            affect that Party’s right to enforce such provisions, nor shall the
            waiver by either Party of any breach of any provision of this
            Agreement be taken or held to be a waiver of any further breach of
            the same provision.
          </p>

          <h3 className="font-bold mt-4">11.5 Notices:</h3>
          <p className="ml-6 leading-relaxed">
            All notices, requests, demands and other communications hereunder
            shall be in writing and the same shall be deemed to be served, if
            personally delivered or sent by registered mail to the address
            details which are first mentioned above in this Agreement, or
            delivered by electronic mail at the details specified below, or at
            such other address as such Party may hereafter specify for such
            purpose to the other Party by notice in writing.
          </p>
          <div className="text-center mt-4">
            <strong>E-mail to Company:</strong>{' '}
            <a
              href="mailto:pradipta@xcellify.com"
              className="text-blue-600 underline"
            >
              pradipta@xcellify.com
            </a>
            <br />
            <strong>E-mail to Partner:</strong>{' '}
            <a
              href={`mailto:${contact_person_email}`}
              className="text-blue-600 underline"
            >
              {contact_person_email}
            </a>
          </div>

          <h3 className="font-bold ">11.6 Assignment:</h3>
          <p className="ml-6 leading-relaxed">
            This Agreement is personal to the Parties herein. Neither Party
            shall directly or indirectly assign this Agreement, or the rights or
            duties created by this Agreement, without the prior written approval
            of the other Party.
          </p>

          <h3 className="font-bold ">11.7 Survival:</h3>
          <p className="ml-6 leading-relaxed">
            Any part of this Agreement that may reasonably be interpreted or
            construed as surviving termination or which may be necessary or
            convenient for a Party to effectively enforce the terms of this
            Agreement shall survive the termination of this Agreement.
          </p>

          <h3 className="font-bold ">11.8 Severability:</h3>
          <p className="ml-6 leading-relaxed">
            If any part, or provision of this Agreement not being of a
            fundamental nature, is held illegal or unenforceable, the validity
            or enforceability of the remainder of this Agreement shall not be
            affected if such part, term of provision of this Agreement is
            severable from the rest of this Agreement without altering the
            essence of this Agreement.
          </p>

          <h3 className="font-bold">11.9 No Disparagement:</h3>
          <p className="ml-6 leading-relaxed">
            The Partner shall not, both during and after the termination of this
            Agreement, publish any oral or written statements about the Company
            or its shareholders, subsidiaries, affiliates and group companies or
            each of their respective board of trustees, equity holders,
            representatives that: (a) are slanderous, libelous or defamatory; or
            (b) place any of the foregoing in false light before the public.
          </p>

          <h3 className="font-bold ">11.10 Costs:</h3>
          <p className="ml-6 leading-relaxed">
            Each Party shall bear its own costs (including legal costs) incurred
            in negotiating and execution of this Agreement. The stamp duty on
            this Agreement shall be borne equally by both the Parties.
          </p>

          <Footer />
        </Page>

        {/* Page 4 */}
        <div className="page-break" />
        <Page>
          <h2 className="font-bold text-xl">IN WITNESS WHEREOF,</h2>
          <p className="mt-2">
            the Parties have entered into and executed this Agreement the day
            and year first above written:
          </p>

          <table className="w-full mt-6 table-fixed border border-gray-300 border-collapse">
            <tbody>
              <tr>
                <td className="w-1/2 border border-gray-300 p-2">
                  <strong>For XCELLIFY PRIVATE LIMITED</strong>
                </td>
                <td className="w-1/2 border border-gray-300 p-2">
                  <strong>For {contact_person_name}</strong>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Name: Pradipta Sahoo
                </td>
                <td className="border border-gray-300 p-2">
                  Name: {contact_person_name}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  Designation: Director
                </td>
                <td className="border border-gray-300 p-2">
                  <div>Authorised Signatory:</div>
                  {signatureURL ? (
                    <img
                      src={signatureURL}
                      alt="Signature"
                      className="mt-1 max-w-xs"
                    />
                  ) : (
                    <em className="text-gray-500">(Signature not provided)</em>
                  )}
                  <div className="mt-1">Designation: {designation}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <Footer />
        </Page>

        {/* Page 5 */}
        <div className="page-break" />
        <Page>
          <p>
            Partner GST number. (viii) HSN code of the Product and any other
            information as may be communicated by the Company.
          </p>

          <h3 className="font-bold mt-4">1.9 Payment to Partner:</h3>
          <p className="ml-6 leading-relaxed">
            <strong>1.9.1</strong> Payments to the Partner will be processed
            fortnightly basis on the 1st and 3rd Wednesday of each month as per
            the Company’s established payment cycle. The Company reserves the
            right to adjust the payment cycle or frequency upon prior notice to
            the Partner.
          </p>
          <p className="ml-6 leading-relaxed">
            <strong>1.9.2 </strong> Notwithstanding anything to the contrary
            contained in this Agreement, it is hereby clarified that the
            liability of the Company to pay to the Partner shall arise only (i)
            for payments actually received by the Company from the Customer for
            a particular Order; (ii) for the Partner’s Products successfully
            delivered to the Customer without a return, refund or exchange
            request being placed in relation to that particular Order; and (iii)
            after the return, refund, exchange and cancellation window for the
            respective Order transaction is closed.
          </p>
          <p className="ml-6 leading-relaxed">
            <strong> 1.9.3 </strong> In cases where customer refunds, returns,
            exchanges, or cancellations have occurred after the payment to the
            Partner, the Company may deduct the corresponding amounts including
            GST from future payments to the Partner so that the entire amount
            can be refunded to the Customer. In such cases, the responsibility
            of reconciling any GST already remitted shall be by the Partner.
          </p>

          <h3 className="font-bold mt-4">1.10 Payment Method:</h3>
          <p className="ml-6 leading-relaxed">
            Payments to the Partner shall be made using the online payment
            method agreed upon between the Parties. The Company will remit the
            Partner payment in the below mentioned account:
          </p>
          <ul className="list-disc ml-12 mt-2">
            <li>Account Name: {account_holder_name}</li>
            <li>Account Number: {bank_account_number}</li>
            <li>Account Type: {bank_account_type}</li>
            <li>Bank Name: {bank_name}</li>
            <li>IFSC: {bank_ifsc}</li>
            <li>Branch: [•]</li>
          </ul>

          <p className="mt-4">
            <strong>1.11</strong> The Partner acknowledges and agrees that the
            payment terms set forth in this Clause are an essential part of this
            Agreement and failure to comply with the same shall be deemed as a
            breach of this Agreement.
          </p>

          <Footer />
        </Page>
        {/* …all your four <Page/>s… */}

        {/* STICKY ACTION BAR */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 rounded-lg text-white hover:opacity-90"
            style={{
              background: 'linear-gradient(to right, #19074A, #876FFD)',
            }}
          >
            Download Document
          </button>
          <button
            onClick={onAttach}
            className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          >
            I Agree & Attach
          </button>
        </div>
      </div>
    </div>
  );
}
