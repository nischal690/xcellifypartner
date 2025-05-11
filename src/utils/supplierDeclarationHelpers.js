import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from 'docx';

// Language templates for different company types
const languageTemplates = {
  individual: {
    pronoun: 'I',
    namePrefix: 'I',
    businessEngagement: 'I am engaged in the business of',
    confirmGST: 'I hereby confirm that we are',
    confirmInvoices: 'I confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform: 'I undertake to promptly inform you in writing of any changes to my/our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue: 'I hereby declare that the above statements are true and correct to the best of my/our knowledge and belief.'
  },
  company: {
    pronoun: 'We',
    namePrefix: 'We',
    businessEngagement: 'We are engaged in the business of',
    confirmGST: 'We hereby confirm that we are',
    confirmInvoices: 'We confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform: 'We undertake to promptly inform you in writing of any changes to our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue: 'We hereby declare that the above statements are true and correct to the best of our knowledge and belief.'
  }
};

// Helper to determine language style based on company type
export const getLanguageTemplate = (companyType) => {
  if (
    companyType === 'Individual' ||
    companyType === 'sole_proprietership' ||
    companyType === 'partnership'
  ) {
    return languageTemplates.individual;
  } else {
    return languageTemplates.company;
  }
};

// Single generator function for all company types
export const generateSupplierDoc = (
  formData,
  signatureImage,
  formattedDate
) => {
  const {
    contact_person_name,
    hasGSTnumber,
    address_line_1,
    address_line_2,
    GST,
    PAN,
    company_type,
    company_name,
    contact_person_mobile,
    contact_person_email,
  } = formData;

  // Get the appropriate language template based on company type
  const lang = getLanguageTemplate(company_type);
  
  // Determine the name to use in the declaration
  const declarationName = company_type === 'Individual' || 
                         company_type === 'sole_proprietership' || 
                         company_type === 'partnership' 
                         ? contact_person_name : company_name;

  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `Date: ${formattedDate}`, bold: true }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ children: [new TextRun('To,')] }),
          new Paragraph({
            children: [new TextRun('Xcellify Private Limited,')],
          }),
          new Paragraph({
            children: [new TextRun('RG 601, Purva Riviera, Marathahalli,')],
          }),
          new Paragraph({
            children: [new TextRun('Bangalore- 560037, Karnataka State')],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun('Declaration by Supplier')],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [new TextRun(`${lang.namePrefix} ${declarationName || '-'}`)],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `GST Registered/Unregistered - ${hasGSTnumber || '-'}`
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `Having our principal place of business - ${
                  address_line_1 || '-'
                }`
              ),
            ],
          }),
          new Paragraph({
            children: [new TextRun(`${address_line_2 || '-'}`)],
          }),
          new Paragraph({
            children: [new TextRun(`with GSTIN - ${GST || '-'}`)],
          }),
          new Paragraph({
            children: [new TextRun(`PAN - ${PAN || '-'}`)],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun('Hereby declare and confirm the following:'),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`➢ ${lang.businessEngagement} - `),
              new TextRun({
                text: `(${company_type || '-'})`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`➢ ${lang.confirmGST} `),
              new TextRun({
                text: 'not registered as a composition taxpayer.',
                bold: true,
              }),
              new TextRun(
                ' Furthermore, if we are currently unregistered, we commit to obtaining GST registration as and when we become liable to do so. In accordance with the applicable provisions and regulatory requirements.'
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `➢ ${lang.confirmInvoices}`
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(
                `➢ ${lang.undertakeToInform}`
              ),
            ],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun(
                `${lang.declareTrue}`
              ),
            ],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Authorised Signatory', bold: true }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: `For` })],
          }),
          signatureImage
            ? new Paragraph({
                children: [
                  new ImageRun({
                    data: signatureImage,
                    transformation: {
                      width: 100,
                      height: 50,
                    },
                  }),
                ],
              })
            : new Paragraph({ text: '(Signature Image Missing)' }),
          new Paragraph({
            children: [new TextRun(`Name: ${contact_person_name || '-'}`)],
          }),
          new Paragraph({
            children: [new TextRun(`Designation: CEO`)],
          }),
          new Paragraph({
            children: [
              new TextRun(`Contact number: ${contact_person_mobile || '-'}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(`Email Address: ${contact_person_email || '-'}`),
            ],
          }),
        ],
      },
    ],
  });
};

// Legacy functions for backward compatibility
export const generateIndividualDoc = (formData, signatureImage, formattedDate) => {
  return generateSupplierDoc(formData, signatureImage, formattedDate);
};

export const generateCompanyDoc = (formData, signatureImage, formattedDate) => {
  return generateSupplierDoc(formData, signatureImage, formattedDate);
};


