import apiRequest from './apiRequest';

const uploadableFileTypes = [
  'msme_certificate',
  'signature',
  'aadhar_coi',
  'pan_card',
  'gst',
  'cancelled_cheque',
  'gst_declaration',
  'supplier_declaration',
];

export default async function getEssentialDocuments(userId, partnerId) {
  const documentResults = {};

  const fileTypePromises = uploadableFileTypes.map((fileType) =>
    apiRequest({
      url: `/mic-login/getAttachments?userId=${userId}&fileType=${fileType}`,
      method: 'get',
    })
      .then((res) => ({
        fileType,
        success: true,
        data: res?.data,
      }))
      .catch((err) => ({
        fileType,
        success: false,
        data: null,
      }))
  );

  const brandLogoPromise = apiRequest({
    url: `mic-login/profile-picture/${partnerId}`,
    method: 'get',
  })
    .then((res) => ({
      fileType: 'brand_logo',
      success: true,
      data: {
        file_data: res?.data?.image?.image || '',
        content_type: 'image/png',
      },
    }))
    .catch(() => ({
      fileType: 'brand_logo',
      success: false,
      data: null,
    }));

  const allResponses = await Promise.allSettled([
    ...fileTypePromises,
    brandLogoPromise,
  ]);

  allResponses.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.success) {
      const { fileType, data } = result.value;
      if (data?.file_data) {
        documentResults[fileType] = {
          base64: data.file_data,
          contentType: data.content_type,
          updatedAt: data.updated_at || null,
        };
      }
    }
  });

  return documentResults;
}
