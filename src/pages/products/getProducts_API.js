import apiRequest from '../../utils/apiRequest';
import { HTTP_CODE } from '../../utils/constants';

const getProducts_API = async ({ payload }) => {
  const products = await apiRequest({
    url: '/mic-study/getProducts',
    method: 'post',
    data: payload,
  });
  if (products.status == HTTP_CODE.SUCCESS) {
    return products.data?.data;
  } else {
    console.log('Error fetching products');
  }
  return [];
};

export default getProducts_API;

export const getProducts_API_PG = async ({
  payload,
  pgNo = 1,
  pgSize = 20,
}) => {
  const products = await apiRequest({
    url: `/mic-study/getProducts?pgNo=${pgNo}&pgSize=${pgSize}`,
    method: 'post',
    data: payload,
  });

  if (products.status === HTTP_CODE.SUCCESS) {
    return products.data;
  } else {
    console.log('Error fetching products');
  }
  return [];
};
