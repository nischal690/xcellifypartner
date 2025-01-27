import apiRequest from './apiRequest'
import { HTTP_CODE } from './constants';

export default async function getEssentialDocuments(userId, partnerId){
    
    const apiList = [
        apiRequest({
            url: 'mic-login/signature',
            method:'get',
            params: {user_id: userId},
        }),
        apiRequest({
            url: 'mic-login/profile-picture/'+partnerId,
            method:'get',
        }),
        apiRequest({
            url: 'mic-login/msmeCertificate',
            method:'get',
            params: {user_id: userId},
        }),
    ]

    const responseList = await Promise.allSettled(apiList);
    const data = {
        msmeCertificate: responseList[2].status === 'fulfilled' ? responseList[2]?.value?.data?.certificate :'',
        signature: responseList[0].status === 'fulfilled' ? responseList[0]?.value?.data?.signature :'',
        brandLogo: responseList[1].status === 'fulfilled' ? responseList[1]?.value?.data?.image?.image :'',
    }
    return data;
}