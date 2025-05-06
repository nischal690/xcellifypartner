import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import ImageModule from 'docxtemplater-image-module-free';

export const generateDocFromTemplate = async (
  formData,
  signatureImageFile,
  formattedDate
) => {
  try {
    let templatePath = '';
    switch (formData.company_type) {
      case 'privateltd':
        templatePath = '/docs/PartnerServiceAgreementPvt.docx';
        break;
      case 'llp':
        templatePath = '/docs/PartnerServiceAgreementllp.docx';
        break;
      case 'partnership':
        templatePath = '/docs/PartnerServiceAgreementpart.docx';
        break;
      case 'Individual':
        templatePath = '/docs/PartnerServiceAgreementInd.docx';
        break;
      case 'sole_proprietership':
        templatePath = '/docs/PartnerServiceAgreementSolep.docx';
        break;
      default:
        templatePath = '/docs/PartnerServiceAgreementNormal.docx';
        break;
    }

    const response = await fetch(templatePath);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    let signatureBase64 = '';
    if (signatureImageFile) {
      const arrayBufferSig = await signatureImageFile.arrayBuffer();
      signatureBase64 = window.btoa(
        new Uint8Array(arrayBufferSig).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
    }

    const imageModule = new ImageModule({
      centered: false,
      getImage: function (tagValue) {
        return Uint8Array.from(atob(tagValue), (c) => c.charCodeAt(0));
      },
      getSize: function () {
        return [100, 50];
      },
    });

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
    });

    doc.setData({
      formattedDate: formattedDate,
      company_type: formData.company_type || '',
      contact_person_name: formData.contact_person_name || '',
      GST: formData.GST || '',
      PAN: formData.PAN || '',
      CIN: formData.CIN || '',
      address_line_1: formData.address_line_1 || '',
      address_line_2: formData.address_line_2 || '',
      contact_person_email: formData.contact_person_email || '',
      bank_account_number: formData.bank_account_number || '',
      account_holder_name: formData.account_holder_name || '',
      bank_account_type: formData.bank_account_type || '',
      bank_name: formData.bank_name || '',
      bank_ifsc: formData.bank_ifsc || '',
      company_name: formData.company_name || '',
      signatureImage: signatureBase64 || '',
    });

    doc.render();

    const outputBlob = new Blob([doc.getZip().generate({ type: 'blob' })], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(outputBlob, 'Supplier_Declaration.docx');
  } catch (error) {
    console.error('Error generating document', error);
  }
};
