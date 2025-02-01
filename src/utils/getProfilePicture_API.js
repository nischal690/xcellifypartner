import apiRequest from './apiRequest'
import { HTTP_CODE } from './constants';

export const getProfilePicture_API = async (id)=>{
    const response = await apiRequest({
        url: `/mic-login/profile-picture/${id}`,
        method: 'GET',
    })
    if(response?.status === HTTP_CODE.SUCCESS ){
        return response?.data?.image?.image;
    }
    return '';
}