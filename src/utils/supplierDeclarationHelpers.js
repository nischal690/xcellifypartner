import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ExternalHyperlink,
  HeaderFooterType,
} from 'docx';

// Language templates for different company types
const languageTemplates = {
  individual: {
    pronoun: 'I',
    namePrefix: 'I',
    businessEngagement: 'I am engaged in the business of',
    confirmGST: 'I hereby confirm that we are',
    confirmInvoices:
      'I confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform:
      'I undertake to promptly inform you in writing of any changes to my/our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue:
      'I hereby declare that the above statements are true and correct to the best of my/our knowledge and belief.',
  },
  company: {
    pronoun: 'We',
    namePrefix: 'We',
    businessEngagement: 'We are engaged in the business of',
    confirmGST: 'We hereby confirm that we are',
    confirmInvoices:
      'We confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform:
      'We undertake to promptly inform you in writing of any changes to our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue:
      'We hereby declare that the above statements are true and correct to the best of our knowledge and belief.',
  },
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
  const declarationName =
    company_type === 'Individual' ||
    company_type === 'sole_proprietership' ||
    company_type === 'partnership'
      ? contact_person_name
      : company_name;

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
            children: [
              new TextRun(`${lang.namePrefix} ${declarationName || '-'}`),
            ],
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
            children: [new TextRun(`➢ ${lang.confirmInvoices}`)],
          }),
          new Paragraph({
            children: [new TextRun(`➢ ${lang.undertakeToInform}`)],
          }),
          new Paragraph({ text: '', spacing: { after: 200 } }),
          new Paragraph({
            children: [new TextRun(`${lang.declareTrue}`)],
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

export const generateIndividualDoc = (
  formData,
  signatureImage,
  formattedDate
) => {
  return generateSupplierDoc(formData, signatureImage, formattedDate);
};

export const generateCompanyDoc = (formData, signatureImage, formattedDate) => {
  return generateSupplierDoc(formData, signatureImage, formattedDate);
};

export const declarationFirstPageCom = {
  Individual: {
    firstParagraph:
      'Mr./Ms. {contact_person_name}, S/D/o/ of {careOf}, aged about {age}, having PAN {PAN} and Aadhaar No. {CIN} and currently residing at {address_line_1},{address_line_2} (hereinafter referred to as the “Partner” which expression shall unless repugnant to the context or meaning thereof be deemed to mean and include his/her legal heirs, representatives and permitted assigns) of the SECOND PART. ',
  },
  privateltd: {
    firstParagraph:
      '{company_name} a company incorporated in India under the Companies Act, [1956/2013], bearing CIN: {CIN} and GST No: {GST} having its registered office at {address_line_1}, {address_line_2}(hereinafter referred to as the “Partner”, which expression shall be deemed to mean and include its successors, legal representatives and permitted assigns) of the SECOND PART.',
  },
  llp: {
    firstParagraph:
      '{company_name}, a limited liability partnership firm registered under the Limited Liability Partnership Act, 2008, bearing GST No: {GST} having its principal place of business at {address_line_1}, {address_line_2} (,represented by its authorized signatory [●] (hereinafter referred to as “Partner”, which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
  },
  partnership: {
    firstParagraph:
      '{company_name}, a partnership firm registered under the Indian Partnership Act, 1932, bearing GST No: {GST} having its principal place of business at {address_line_1}, {address_line_2}, represented by its authorized signatory [●] (hereinafter referred to as “Partner”, which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
  },
  sole_proprietership: {
    firstParagraph:
      '{contact_person_name}, a sole proprietorship bearing GST No: {GST} and having its principal place of business at {address_line_1},{address_line_2}, represented by its authorized signatory [●] (hereinafter referred to as “Partner”, which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
  },
};

export const generateComIndividualDoc = async (
  formData,
  signatureImage,
  formattedDate,
  careOf,
  age
) => {
  const {
    company_type,
    contact_person_name,
    contact_person_email,
    signature,
    PAN,
    CIN,
    GST,
    address_line_1,
    address_line_2,
  } = formData;

  const tpl = declarationFirstPageCom[company_type]?.firstParagraph;
  const paragraphText = tpl
    ?.replace(/{contact_person_name}/g, contact_person_name || '')
    .replace(/{careOf}/g, careOf || '')
    .replace(/{age}/g, age || '')
    .replace(/{company_name}/g, formData.company_name || '')
    .replace(/{PAN}/g, PAN || '')
    .replace(/{CIN}/g, CIN || '')
    .replace(/{GST}/g, GST || '')
    .replace(/{address_line_1}/g, address_line_1 || '')
    .replace(/{address_line_2}/g, address_line_2 || '');

  const logoResponse = await fetch('/LogoPrimary.png');
  const logoBlob = await logoResponse.blob();
  const logoArrayBuffer = await logoBlob.arrayBuffer();
  const logoImage = new Uint8Array(logoArrayBuffer);

  const header = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new ImageRun({
            data: logoImage,
            transformation: { width: 120, height: 100 },
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'XCELLIFY PRIVATE LIMITED',
            bold: true,
            size: 48,
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: 200 },
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        // tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({
            text: 'Xcellify Private Limited',
            color: '808080',
            size: 24,
          }),
          // new TextRun({ text: '\t' }), // jumps to the right tab stop
          // new TextRun({
          //   text: '1', // static page number
          //   color: '808080',
          //   size: 24,
          // }),
        ],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'RG 601, Purva Riviera, Marathahalli, Bangalore – 560037, Karnataka',
            color: '808080',
            size: 24,
          }),
        ],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `CIN – U85500KA2024PTC189409`,
            color: '808080',
            size: 24,
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        headers: {
          default: header,
        },
        footers: {
          default: footer,
        },
        properties: {
          headerType: HeaderFooterType.DEFAULT,
          footerType: HeaderFooterType.DEFAULT,
        },
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'SERVICE AGREEMENT',
                font: 'Times New Roman',
                bold: true,
                size: 32,
              }),
            ],
            spacing: {
              after: 300,
            },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `This SERVICE AGREEMENT (“Agreement”) is entered into in Bengaluru on this day [•] of ${formattedDate}`,
                font: 'Times New Roman',
                bold: false,
                size: 24,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'BY AND BETWEEN',
                font: 'Times New Roman',
                bold: true,
                size: 32,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'XCELLIFY PRIVATE LIMITED,',
                font: 'Times New Roman',
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ' a company incorporated under the Companies Act, 2013 bearing CIN: U85500KA2024PTC189409 with registered office at - RG-601, Purva Riviera, Marathahalli, Bangalore-560037, Karnataka, India (hereinafter referred to as “Company”, which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the FIRST PART;',
                font: 'Times New Roman',
                bold: false,
                size: 24,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'AND',
                font: 'Times New Roman',
                bold: true,
                size: 28,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: paragraphText || '',
                font: 'Times New Roman',
                size: 24,
              }),
            ],
            spacing: {
              after: 400,
            },
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'For the purposes of this Agreement, the Company and Partner shall be singularly known as ',
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: '“Party”',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: ' and collectively be known as the ',
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: '“Parties”',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: ', as the context may require.',
                font: 'Times New Roman',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: 'WHEREAS:', bold: true, size: 28 })],
            spacing: { after: 300 },
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'A. ', bold: true, size: 24 }),
              new TextRun({
                text: 'The Company, inter alia, is engaged in the business of providing an online marketplace via domain name https://xcellify.com/ (“Platform”) for listing, and sale of various products and services.',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'B. ', bold: true, size: 24 }),
              new TextRun({
                text: 'The Partner is desirous of being listed on the Platform to offer their products and/or services (hereinafter referred to as “Partner’s Product(s)” or “Partner’s Service(s)” or “Partner’s Product(s)/Service(s)”) to Customer (defined below).',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'C. ', bold: true, size: 24 }),
              new TextRun({
                text: 'The Partner has approached the Company to avail the Services (defined hereinafter), and the Company has agreed to provide the Services to the Partner, in accordance with the terms of this Agreement.',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: 'D. ', bold: true, size: 24 }),
              new TextRun({
                text: 'The Parties wish to formalize their agreement on the terms and conditions set forth under this Agreement.',
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({ pageBreakBefore: true }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({ text: '11.4 No Waiver: ', bold: true, size: 24 }),
              new TextRun({
                text: 'The failure of either Party at any time to require performance by the other Party of any provision of this Agreement shall in no way affect that Party’s right to enforce such provisions, nor shall the waiver by either Party of any breach of any provision of this Agreement be taken or held to be a waiver of any further breach of the same provision.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({ text: '11.5 Notices: ', bold: true, size: 24 }),
              new TextRun({
                text: 'All notices, requests, demands and other communications hereunder shall be in writing and the same shall be deemed to be served, if personally delivered or sent by registered mail to the address details which are first mentioned above in this Agreement, or delivered by electronic mail at the details specified below, or at such other address as such Party may hereafter specify for such purpose to the other Party by notice in writing.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({
                text: 'E-mail to Company: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: 'pradipta@xcellify.com',
                    style: 'Hyperlink',
                    size: 24,
                    font: 'Times New Roman',
                  }),
                ],
                link: 'mailto:pradipta@xcellify.com',
              }),
            ],
          }),
          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'E-mail to Partner: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new ExternalHyperlink({
                children: [
                  new TextRun({
                    text: formData.contact_person_email || '-',
                    style: 'Hyperlink',
                    font: 'Times New Roman',
                    size: 24,
                  }),
                ],
                link: `mailto:${formData.contact_person_email || ''}`,
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({ text: '11.6 Assignment: ', bold: true, size: 24 }),
              new TextRun({
                text: 'This Agreement is personal to the Parties herein. Neither Party shall directly or indirectly assign this Agreement, or the rights or duties created by this Agreement, without the prior written approval of the other Party.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 200 },
            children: [
              new TextRun({ text: '11.7 Survival: ', bold: true, size: 24 }),
              new TextRun({
                text: 'Any part of this Agreement that may reasonably be interpreted or construed as surviving termination or which may be necessary or convenient for a Party to effectively enforce the terms of this Agreement shall survive the termination of this Agreement.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '11.8 Severability: ',
                bold: true,
                font: 'Times New Roman',
                size: 24,
              }),
              new TextRun({
                text: 'If any part, or provision of this Agreement not being of a fundamental nature, is held illegal or unenforceable, the validity or enforceability of the remainder of this Agreement shall not be affected if such part, term of provision of this Agreement is severable from the rest of this Agreement without altering the essence of this Agreement.',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '11.9 No Disparagement: ',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: 'The Partner shall not, both during and after the termination of this Agreement, publish any oral or written statements about the Company or its shareholders, subsidiaries, affiliates and group companies or each of their respective board of trustees, equity holders, representatives that: (a) are slanderous, libelous or defamatory; or (b) place any of the foregoing in false light before the public.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({
            indent: { hanging: 720 },

            spacing: { after: 300 },
            children: [
              new TextRun({ text: '11.10 Costs: ', bold: true, size: 24 }),
              new TextRun({
                text: 'Each Party shall bear its own costs (including legal costs) incurred in negotiating and execution of this Agreement. The stamp duty on this Agreement shall be borne equally by both the Parties.',
                size: 24,
                font: 'Times New Roman',
              }),
            ],
          }),

          new Paragraph({ pageBreakBefore: true }),

          new Paragraph({
            children: [
              new TextRun({
                text: 'IN WITNESS WHEREOF,',
                bold: true,
                size: 28,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: ' the Parties have entered into and executed this Agreement the day and year first above written:',
                bold: true,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            spacing: { after: 400 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'For XCELLIFY PRIVATE LIMITED',
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `For ${formData.contact_person_name}`,
                            bold: true,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Name: ${'Pradipta Sahoo'}`,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Name: ${formData.contact_person_name}`,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ text: '' }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Designation: Director',
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ text: '', spacing: { before: 400 } }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: 'Authorised Signatory:',
                            bold: true,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                      signatureImage
                        ? new Paragraph({
                            children: [
                              new ImageRun({
                                data: signatureImage,
                                transformation: { width: 200, height: 50 },
                              }),
                            ],
                          })
                        : new Paragraph({
                            text: '(Signature not provided)',
                            italics: true,
                            font: 'Times New Roman',
                          }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Designation: ${
                              formData.company_type === 'Individual' ||
                              formData.company_type === 'sole_proprietership'
                                ? 'Proprietor'
                                : 'CEO'
                            }`,
                            size: 24,
                            font: 'Times New Roman',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
            margins: {
              top: 200,
              bottom: 200,
            },
          }),

          new Paragraph({ pageBreakBefore: true }),

          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'Partner GST number. (viii) HSN code of the Product and any other information as may be communicated by the Company.',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.9 Payment to Partner:',
                bold: true,
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.9.1 Payments to the Partner will be processed fortnightly basis on the 1st and 3rd Wednesday of each month as per the Company’s established payment cycle. The Company reserves the right to adjust the payment cycle or frequency upon prior notice to the Partner.',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.9.2 Notwithstanding anything to the contrary contained in this Agreement, it is hereby clarified that the liability of the Company to pay to the Partner shall arise only (i) for payments actually received by the Company from the Customer for a particular Order; (ii) for the Partner’s Products successfully delivered to the Customer without a return, refund or exchange request being placed in relation to that particular Order; and (iii) after the return, refund, exchange and cancellation window for the respective Order transaction is closed.',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.9.3 In cases where customer refunds, returns, exchanges, or cancellations have occurred after the payment to the Partner, the Company may deduct the corresponding amounts including GST from future payments to the Partner so that the entire amount can be refunded to the Customer. In such cases, the responsibility of reconciling any GST already remitted shall be by the Partner.',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.10 Payment Method:',
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: ' Payments to the Partner shall be made using the online payment method agreed upon between the Parties. The Company will remit the Partner payment in the below mentioned account:',
                size: 24,
              }),
            ],
          }),

          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Account Name: ${formData.account_holder_name}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Account Number: ${formData.bank_account_number}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Account Type: ${formData.bank_account_type}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Bank Name: ${formData.bank_name}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `IFSC: ${formData.bank_ifsc}`,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 300 },
            children: [new TextRun({ text: 'Branch: [•]', size: 24 })],
          }),

          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '1.11 The Partner acknowledges and agrees that the payment terms set forth in this Clause are an essential part of this Agreement and failure to comply with the same shall be deemed as a breach of this Agreement.',
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });
};
