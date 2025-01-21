import apiRequest from '../../utils/apiRequest'
import { HTTP_CODE } from '../../utils/constants';

const getProducts_API = async ({payload})=>{
    const products = await apiRequest({
        url: '/mic-login/getAllProducts',
        // url: 'http://192.168.0.100:3000/mic-login/getAllProducts',
        method: 'post',
        data: payload,
    })
    if(products.status == HTTP_CODE.SUCCESS){
        return (products.data?.data);
    }
    else{
        console.log('Error fetching products');
    }
    return [];
}

export default getProducts_API;