import {
  Document, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun,
  Header, Footer, Table, TableRow, TableCell, WidthType, ExternalHyperlink,
  HeaderFooterType,
} from 'docx';

// Consolidated configuration
const CONFIG = {
  company: {
    name: 'XCELLIFY PRIVATE LIMITED',
    cin: 'U85500KA2024PTC189409',
    address: 'RG 601, Purva Riviera, Marathahalli,',
    city: 'Bangalore- 560037, Karnataka State',
    fullAddress: 'RG-601, Purva Riviera, Marathahalli, Bangalore-560037, Karnataka, India',
    email: 'pradipta@xcellify.com',
    director: 'Pradipta Sahoo',
  },
  fonts: { default: 'Times New Roman' },
  sizes: { small: 24, medium: 28, large: 32, xlarge: 48 },
};

// Language templates
const LANG_TEMPLATES = {
  individual: {
    pronoun: 'I', namePrefix: 'I', businessEngagement: 'I am engaged in the business of',
    confirmGST: 'I hereby confirm that we are',
    confirmInvoices: 'I confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform: 'I undertake to promptly inform you in writing of any changes to my/our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue: 'I hereby declare that the above statements are true and correct to the best of my/our knowledge and belief.',
  },
  company: {
    pronoun: 'We', namePrefix: 'We', businessEngagement: 'We are engaged in the business of',
    confirmGST: 'We hereby confirm that we are',
    confirmInvoices: 'We confirm that any GST charged on invoices will be accurately reported and remitted to the appropriate government authority in a timely manner.',
    undertakeToInform: 'We undertake to promptly inform you in writing of any changes to our GST registration status, including cancellation, suspension, or modification of GSTIN details.',
    declareTrue: 'We hereby declare that the above statements are true and correct to the best of our knowledge and belief.',
  },
};

// Company type templates for service agreement
const COMPANY_TEMPLATES = {
  Individual: '{contact_person_name}, S/D/o/ of {careOf}, aged about {age}, having PAN {PAN} and Aadhaar No. {CIN} and currently residing at {address_line_1},{address_line_2} (hereinafter referred to as the "Partner" which expression shall unless repugnant to the context or meaning thereof be deemed to mean and include his/her legal heirs, representatives and permitted assigns) of the SECOND PART.',
  privateltd: '{company_name} a company incorporated in India under the Companies Act, [1956/2013], bearing CIN: {CIN} and GST No: {GST} having its registered office at {address_line_1}, {address_line_2}(hereinafter referred to as the "Partner", which expression shall be deemed to mean and include its successors, legal representatives and permitted assigns) of the SECOND PART.',
  llp: '{company_name}, a limited liability partnership firm registered under the Limited Liability Partnership Act, 2008, bearing GST No: {GST} having its principal place of business at {address_line_1}, {address_line_2} (,represented by its authorized signatory [●] (hereinafter referred to as "Partner", which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
  partnership: '{company_name}, a partnership firm registered under the Indian Partnership Act, 1932, bearing GST No: {GST} having its principal place of business at {address_line_1}, {address_line_2}, represented by its authorized signatory [●] (hereinafter referred to as "Partner", which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
  sole_proprietership: '{contact_person_name}, a sole proprietorship bearing GST No: {GST} and having its principal place of business at {address_line_1},{address_line_2}, represented by its authorized signatory [●] (hereinafter referred to as "Partner", which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the SECOND PART.',
};

// Utility functions
const getLanguageTemplate = (companyType) => 
  ['Individual', 'sole_proprietership', 'partnership'].includes(companyType) 
    ? LANG_TEMPLATES.individual 
    : LANG_TEMPLATES.company;

const createTextRun = (text, options = {}) => new TextRun({ text, ...options });

const createParagraph = (content, options = {}) => new Paragraph({
  children: Array.isArray(content) ? content : [createTextRun(content)],
  ...options
});

const substituteTemplate = (template, data) => 
  template?.replace(/{(\w+)}/g, (match, key) => data[key] || '') || '';

const createBulletPoint = (text, lang) => createParagraph([createTextRun(`➢ ${text}`)]);

// Supplier Declaration Document Generator
export const generateSupplierDoc = (formData, signatureImage, formattedDate) => {
  const { contact_person_name, hasGSTnumber, address_line_1, address_line_2, GST, PAN, 
          company_type, company_name, contact_person_mobile, contact_person_email } = formData;
  
  const lang = getLanguageTemplate(company_type);
  const declarationName = ['Individual', 'sole_proprietership', 'partnership'].includes(company_type) 
    ? contact_person_name : company_name;

  const content = [
    createParagraph('', { alignment: AlignmentType.LEFT, children: [createTextRun(`Date: ${formattedDate}`, { bold: true })] }),
    createParagraph(''),
    createParagraph('To,'),
    createParagraph(`${CONFIG.company.name},`),
    createParagraph(CONFIG.company.address),
    createParagraph(CONFIG.company.city),
    createParagraph('', { spacing: { after: 200 } }),
    createParagraph('Declaration by Supplier', { alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_2 }),
    createParagraph('', { spacing: { after: 200 } }),
    createParagraph(`${lang.namePrefix} ${declarationName || '-'}`),
    createParagraph(`GST Registered/Unregistered - ${hasGSTnumber || '-'}`),
    createParagraph(`Having our principal place of business - ${address_line_1 || '-'}`),
    createParagraph(`${address_line_2 || '-'}`),
    createParagraph(`with GSTIN - ${GST || '-'}`),
    createParagraph(`PAN - ${PAN || '-'}`),
    createParagraph('', { spacing: { after: 200 } }),
    createParagraph('Hereby declare and confirm the following:'),
    createParagraph([
      createTextRun(`➢ ${lang.businessEngagement} - `),
      createTextRun(`(${company_type || '-'})`, { italics: true })
    ]),
    createParagraph([
      createTextRun(`➢ ${lang.confirmGST} `),
      createTextRun('not registered as a composition taxpayer.', { bold: true }),
      createTextRun(' Furthermore, if we are currently unregistered, we commit to obtaining GST registration as and when we become liable to do so. In accordance with the applicable provisions and regulatory requirements.')
    ]),
    createParagraph(`➢ ${lang.confirmInvoices}`),
    createParagraph(`➢ ${lang.undertakeToInform}`),
    createParagraph('', { spacing: { after: 200 } }),
    createParagraph(`${lang.declareTrue}`),
    createParagraph('', { spacing: { after: 200 } }),
    createParagraph('', { children: [createTextRun('Authorised Signatory', { bold: true })] }),
    createParagraph('For'),
    signatureImage ? new Paragraph({
      children: [new ImageRun({ data: signatureImage, transformation: { width: 100, height: 50 } })]
    }) : createParagraph('(Signature Image Missing)'),
    createParagraph(`Name: ${contact_person_name || '-'}`),
    createParagraph('Designation: CEO'),
    createParagraph(`Contact number: ${contact_person_mobile || '-'}`),
    createParagraph(`Email Address: ${contact_person_email || '-'}`),
  ];

  return new Document({ sections: [{ properties: {}, children: content }] });
};

// Service Agreement Document Generator
export const generateComIndividualDoc = async (formData, signatureImage, formattedDate, careOf, age) => {
  const { company_type, contact_person_name, contact_person_email, PAN, CIN, GST, address_line_1, address_line_2 } = formData;
  
  const template = COMPANY_TEMPLATES[company_type];
  const partnerText = substituteTemplate(template, { ...formData, careOf, age });

  // Load logo
  const logoResponse = await fetch('/LogoPrimary.png');
  const logoBlob = await logoResponse.blob();
  const logoArrayBuffer = await logoBlob.arrayBuffer();
  const logoImage = new Uint8Array(logoArrayBuffer);

  const header = new Header({
    children: [
      createParagraph('', {
        alignment: AlignmentType.RIGHT,
        children: [new ImageRun({ data: logoImage, transformation: { width: 120, height: 100 } })]
      }),
      createParagraph('', {
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [createTextRun(CONFIG.company.name, { bold: true, size: CONFIG.sizes.xlarge, font: CONFIG.fonts.default })]
      }),
    ],
  });

  const footer = new Footer({
    children: [
      createParagraph('', { 
        alignment: AlignmentType.CENTER,
        children: [createTextRun(CONFIG.company.name, { color: '808080', size: CONFIG.sizes.small })]
      }),
      createParagraph('', {
        alignment: AlignmentType.CENTER,
        children: [createTextRun('RG 601, Purva Riviera, Marathahalli, Bangalore – 560037, Karnataka', { color: '808080', size: CONFIG.sizes.small })]
      }),
      createParagraph('', {
        alignment: AlignmentType.CENTER,
        children: [createTextRun(`CIN – ${CONFIG.company.cin}`, { color: '808080', size: CONFIG.sizes.small })]
      }),
    ],
  });

  const whereAsClauses = [
    { label: 'A.', text: 'The Company, inter alia, is engaged in the business of providing an online marketplace via domain name https://xcellify.com/ ("Platform") for listing, and sale of various products and services.' },
    { label: 'B.', text: 'The Partner is desirous of being listed on the Platform to offer their products and/or services (hereinafter referred to as "Partner\'s Product(s)" or "Partner\'s Service(s)" or "Partner\'s Product(s)/Service(s)") to Customer (defined below).' },
    { label: 'C.', text: 'The Partner has approached the Company to avail the Services (defined hereinafter), and the Company has agreed to provide the Services to the Partner, in accordance with the terms of this Agreement.' },
    { label: 'D.', text: 'The Parties wish to formalize their agreement on the terms and conditions set forth under this Agreement.' },
  ];

  const miscellaneousClauses = [
    { num: '11.4', title: 'No Waiver:', text: 'The failure of either Party at any time to require performance by the other Party of any provision of this Agreement shall in no way affect that Party\'s right to enforce such provisions, nor shall the waiver by either Party of any breach of any provision of this Agreement be taken or held to be a waiver of any further breach of the same provision.' },
    { num: '11.5', title: 'Notices:', text: 'All notices, requests, demands and other communications hereunder shall be in writing and the same shall be deemed to be served, if personally delivered or sent by registered mail to the address details which are first mentioned above in this Agreement, or delivered by electronic mail at the details specified below, or at such other address as such Party may hereafter specify for such purpose to the other Party by notice in writing.' },
    { num: '11.6', title: 'Assignment:', text: 'This Agreement is personal to the Parties herein. Neither Party shall directly or indirectly assign this Agreement, or the rights or duties created by this Agreement, without the prior written approval of the other Party.' },
    { num: '11.7', title: 'Survival:', text: 'Any part of this Agreement that may reasonably be interpreted or construed as surviving termination or which may be necessary or convenient for a Party to effectively enforce the terms of this Agreement shall survive the termination of this Agreement.' },
    { num: '11.8', title: 'Severability:', text: 'If any part, or provision of this Agreement not being of a fundamental nature, is held illegal or unenforceable, the validity or enforceability of the remainder of this Agreement shall not be affected if such part, term of provision of this Agreement is severable from the rest of this Agreement without altering the essence of this Agreement.' },
    { num: '11.9', title: 'No Disparagement:', text: 'The Partner shall not, both during and after the termination of this Agreement, publish any oral or written statements about the Company or its shareholders, subsidiaries, affiliates and group companies or each of their respective board of trustees, equity holders, representatives that: (a) are slanderous, libelous or defamatory; or (b) place any of the foregoing in false light before the public.' },
    { num: '11.10', title: 'Costs:', text: 'Each Party shall bear its own costs (including legal costs) incurred in negotiating and execution of this Agreement. The stamp duty on this Agreement shall be borne equally by both the Parties.' },
  ];

  const paymentClauses = [
    { num: '1.9.1', text: 'Payments to the Partner will be processed fortnightly basis on the 1st and 3rd Wednesday of each month as per the Company\'s established payment cycle. The Company reserves the right to adjust the payment cycle or frequency upon prior notice to the Partner.' },
    { num: '1.9.2', text: 'Notwithstanding anything to the contrary contained in this Agreement, it is hereby clarified that the liability of the Company to pay to the Partner shall arise only (i) for payments actually received by the Company from the Customer for a particular Order; (ii) for the Partner\'s Products successfully delivered to the Customer without a return, refund or exchange request being placed in relation to that particular Order; and (iii) after the return, refund, exchange and cancellation window for the respective Order transaction is closed.' },
    { num: '1.9.3', text: 'In cases where customer refunds, returns, exchanges, or cancellations have occurred after the payment to the Partner, the Company may deduct the corresponding amounts including GST from future payments to the Partner so that the entire amount can be refunded to the Customer. In such cases, the responsibility of reconciling any GST already remitted shall be by the Partner.' },
  ];

  const createClauseParagraph = (clause) => createParagraph([
    createTextRun(`${clause.label || clause.num} `, { bold: true, size: CONFIG.sizes.small }),
    createTextRun(clause.title || '', { bold: true, size: CONFIG.sizes.small }),
    createTextRun(clause.text, { size: CONFIG.sizes.small, font: CONFIG.fonts.default })
  ], { 
    indent: clause.num ? { hanging: 720 } : undefined,
    spacing: { after: clause.num ? 300 : 200 },
    alignment: AlignmentType.LEFT 
  });

  const content = [
    // Title
    createParagraph('', {
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [createTextRun('SERVICE AGREEMENT', { font: CONFIG.fonts.default, bold: true, size: CONFIG.sizes.large })]
    }),

    // Date
    createParagraph('', {
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [createTextRun(`This SERVICE AGREEMENT ("Agreement") is entered into in Bengaluru on this day [•] of ${formattedDate}`, { font: CONFIG.fonts.default, size: CONFIG.sizes.small })]
    }),

    // By and Between
    createParagraph('', {
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [createTextRun('BY AND BETWEEN', { font: CONFIG.fonts.default, bold: true, size: CONFIG.sizes.large })]
    }),

    // First Party
    createParagraph([
      createTextRun(`${CONFIG.company.name},`, { font: CONFIG.fonts.default, bold: true, size: CONFIG.sizes.small }),
      createTextRun(` a company incorporated under the Companies Act, 2013 bearing CIN: ${CONFIG.company.cin} with registered office at - ${CONFIG.company.fullAddress} (hereinafter referred to as "Company", which expression shall, unless it be repugnant to the context or meaning thereof, be deemed to include its successors, affiliates and permitted assigns) of the FIRST PART;`, { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
    ], { alignment: AlignmentType.LEFT, spacing: { after: 400 } }),

    // AND
    createParagraph('', {
      alignment: AlignmentType.CENTER,
      children: [createTextRun('AND', { font: CONFIG.fonts.default, bold: true, size: CONFIG.sizes.medium })]
    }),

    // Second Party
    createParagraph('', {
      alignment: AlignmentType.LEFT,
      spacing: { after: 400 },
      children: [createTextRun(partnerText, { font: CONFIG.fonts.default, size: CONFIG.sizes.small })]
    }),

    // Parties definition
    createParagraph([
      createTextRun('For the purposes of this Agreement, the Company and Partner shall be singularly known as ', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      createTextRun('"Party"', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      createTextRun(' and collectively be known as the ', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      createTextRun('"Parties"', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      createTextRun(', as the context may require.', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
    ], { alignment: AlignmentType.LEFT, spacing: { after: 400 } }),

    // WHEREAS
    createParagraph('', {
      alignment: AlignmentType.LEFT,
      spacing: { after: 300 },
      children: [createTextRun('WHEREAS:', { bold: true, size: CONFIG.sizes.medium })]
    }),

   // WHEREAS clauses
...whereAsClauses.map(createClauseParagraph),

// ADD PAGE 2 CONTENT HERE
new Paragraph({ pageBreakBefore: true }),

// NOW THEREFORE section
createParagraph([
  createTextRun('NOW THEREFORE', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun(', in consideration of the mutual covenants, undertakings and conditions set forth below, and for other valid consideration, the acceptability and sufficiency of which are hereby acknowledged, the Parties hereby agree to the following terms and conditions hereinafter contained:', { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 400 } }),

// 1. DEFINITIONS
createParagraph([
  createTextRun('1.             DEFINITIONS', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 200 } }),

createParagraph([
  createTextRun('Unless otherwise defined in the Agreement, terms when capitalized shall have the meaning set out as per ', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun('Annexure A', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun(' of the Agreement.', { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 400 } }),

// 2. SCOPE OF ENGAGEMENT
createParagraph([
  createTextRun('2.             SCOPE OF ENGAGEMENT', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 200 } }),

createParagraph([
  createTextRun('2.1          Subject and in accordance to the terms of this Agreement, the Company shall provide the following services to the Partner:', { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 200 } }),

// Sub-clauses with proper indentation
createParagraph([
  createTextRun("2.1.1            list the Partner's Products and/or Partner's Services on the Platform of the Company;", { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { indent: { left: 720 }, spacing: { after: 200 } }),

createParagraph([
  createTextRun("2.1.2            facilitate the sale of Partner's Products and/or Partner's Services on and through the Company's Platform;", { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { indent: { left: 720 }, spacing: { after: 200 } }),

createParagraph([
  createTextRun('2.1.3            provide the Partner with access to a dedicated Partner dashboard on its Platform ("', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun('Dashboard', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun('"); and', { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { indent: { left: 720 }, spacing: { after: 200 } }),

createParagraph([
  createTextRun("2.1.4            based on payment of required fees, market the sale of Partner's Products and/or Partner's Services by way of banners and/or priority ranking on the Company's Platform.", { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { indent: { left: 720 }, spacing: { after: 200 } }),

createParagraph([
  createTextRun('hereinafter collectively referred to as the "', { font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun('Services', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
  createTextRun('".', { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 300 } }),

createParagraph([
  createTextRun("2.2          The Parties agree that the Agreement is non-exclusive in nature and the Company reserves the right to enter into similar transactions with any entity or individual, whether or not they are the Partner's competitors.", { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 300 } }),

createParagraph([
  createTextRun("2.3          The Parties further agree that once the Partner's Products/Services are listed and exhibited on the Platform, the Partner shall be deemed to have made an 'offer to sell' the Partner's Products/Services to the Customer, and when any Customer of the Platform places an Order, it shall be considered acceptance by the Customer of the offer and the Products shall be considered sold to the Customer, and the same shall be final and binding upon the Partner under the Applicable Law.", { font: CONFIG.fonts.default, size: CONFIG.sizes.small })
], { spacing: { after: 400 } }),

// Continue with existing page break for miscellaneous clauses
new Paragraph({ pageBreakBefore: true }),

    // Miscellaneous clauses
    ...miscellaneousClauses.map(createClauseParagraph),

    // Email notices
    createParagraph([
      createTextRun('E-mail to Company: ', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      new ExternalHyperlink({
        children: [createTextRun(CONFIG.company.email, { style: 'Hyperlink', size: CONFIG.sizes.small, font: CONFIG.fonts.default })],
        link: `mailto:${CONFIG.company.email}`,
      }),
    ], { indent: { hanging: 720 }, spacing: { before: 50, after: 50 } }),

    createParagraph([
      createTextRun('E-mail to Partner: ', { bold: true, font: CONFIG.fonts.default, size: CONFIG.sizes.small }),
      new ExternalHyperlink({
        children: [createTextRun(contact_person_email || '-', { style: 'Hyperlink', font: CONFIG.fonts.default, size: CONFIG.sizes.small })],
        link: `mailto:${contact_person_email || ''}`,
      }),
    ], { indent: { hanging: 720 }, spacing: { after: 300 } }),

    // Page break
    new Paragraph({ pageBreakBefore: true }),

    // IN WITNESS WHEREOF
    createParagraph([
      createTextRun('IN WITNESS WHEREOF,', { bold: true, size: CONFIG.sizes.medium, font: CONFIG.fonts.default }),
      createTextRun(' the Parties have entered into and executed this Agreement the day and year first above written:', { bold: true, size: CONFIG.sizes.small, font: CONFIG.fonts.default }),
    ], { spacing: { after: 400 } }),

    // Signature Table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [createParagraph('', {
                children: [createTextRun(`For ${CONFIG.company.name}`, { bold: true, size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
              })]
            }),
            new TableCell({
              children: [createParagraph('', {
                children: [createTextRun(`For ${contact_person_name}`, { bold: true, size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
              })]
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [createParagraph('', {
                children: [createTextRun(`Name: ${CONFIG.company.director}`, { size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
              })]
            }),
            new TableCell({
              children: [createParagraph('', {
                children: [createTextRun(`Name: ${contact_person_name}`, { size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
              })]
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                createParagraph(''),
                createParagraph('', {
                  children: [createTextRun('Designation: Director', { size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
                })
              ]
            }),
            new TableCell({
              children: [
                createParagraph('', { spacing: { before: 400 } }),
                createParagraph('', {
                  children: [createTextRun('Authorised Signatory:', { bold: true, font: CONFIG.fonts.default })]
                }),
                signatureImage ? new Paragraph({
                  children: [new ImageRun({ data: signatureImage, transformation: { width: 200, height: 50 } })]
                }) : createParagraph('(Signature not provided)', { children: [createTextRun('(Signature not provided)', { italics: true, font: CONFIG.fonts.default })] }),
                createParagraph('', {
                  children: [createTextRun(`Designation: ${['Individual', 'sole_proprietership'].includes(company_type) ? 'Proprietor' : 'CEO'}`, { size: CONFIG.sizes.small, font: CONFIG.fonts.default })]
                })
              ]
            }),
          ],
        }),
      ],
      margins: { top: 200, bottom: 200 },
    }),

    // Page break for payment section
    new Paragraph({ pageBreakBefore: true }),

    // Partner GST number clause
    createParagraph('Partner GST number. (viii) HSN code of the Product and any other information as may be communicated by the Company.', { spacing: { after: 300 }, children: [createTextRun('Partner GST number. (viii) HSN code of the Product and any other information as may be communicated by the Company.', { size: CONFIG.sizes.small })] }),

    // Payment to Partner
    createParagraph('', {
      spacing: { after: 300 },
      children: [createTextRun('1.9 Payment to Partner:', { bold: true, size: CONFIG.sizes.small })]
    }),

    // Payment clauses
    ...paymentClauses.map(clause => createParagraph('', {
      indent: { left: 720 },
      spacing: { after: 300 },
      children: [createTextRun(clause.text, { size: CONFIG.sizes.small })]
    })),

    // Payment Method
    createParagraph([
      createTextRun('1.10 Payment Method:', { bold: true, size: CONFIG.sizes.small }),
      createTextRun(' Payments to the Partner shall be made using the online payment method agreed upon between the Parties. The Company will remit the Partner payment in the below mentioned account:', { size: CONFIG.sizes.small })
    ], { spacing: { after: 300 } }),

    // Bank details
    ...[
      `Account Name: ${formData.account_holder_name || ''}`,
      `Account Number: ${formData.bank_account_number || ''}`,
      `Account Type: ${formData.bank_account_type || ''}`,
      `Bank Name: ${formData.bank_name || ''}`,
      `IFSC: ${formData.bank_ifsc || ''}`,
      'Branch: [•]'
    ].map(detail => createParagraph('', {
      indent: { left: 720 },
      spacing: { after: 100 },
      children: [createTextRun(detail, { size: CONFIG.sizes.small })]
    })),

    // Final acknowledgment
    createParagraph('1.11 The Partner acknowledges and agrees that the payment terms set forth in this Clause are an essential part of this Agreement and failure to comply with the same shall be deemed as a breach of this Agreement.', { 
      spacing: { after: 300 },
      children: [createTextRun('1.11 The Partner acknowledges and agrees that the payment terms set forth in this Clause are an essential part of this Agreement and failure to comply with the same shall be deemed as a breach of this Agreement.', { size: CONFIG.sizes.small })]
    }),
  ];

  return new Document({
    sections: [{
      headers: { default: header },
      footers: { default: footer },
      properties: { headerType: HeaderFooterType.DEFAULT, footerType: HeaderFooterType.DEFAULT },
      children: content,
    }],
  });
};

// Simplified exports - remove redundant functions
export const generateIndividualDoc = generateSupplierDoc;
export const generateCompanyDoc = generateSupplierDoc;
export { getLanguageTemplate };
export const declarationFirstPageCom = COMPANY_TEMPLATES;