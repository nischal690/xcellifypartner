import { AccountStatuses, AuthStatuses, ProfileStatuses } from './constants';
import apiRequest from './apiRequest'

export const validateAndSetAuthStatus = async (appStore) => {
    const partnerInfoResp = localStorage.getItem("token") && await apiRequest({
        url: `/mic-login/partnerProfileInfo`,
        method: 'get',
    });

    if (partnerInfoResp?.data) {
        const userInfo = partnerInfoResp.data.user_info || {};
        const partnerInfo = partnerInfoResp.data.partner_info || {};
        appStore.updatePartnerInfo({ ...userInfo, ...partnerInfo });
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);

        // Step 1: Check if email is verified
        if (!userInfo.is_verified) {
            appStore.setAppProperty('profileStatus', ProfileStatuses.UNVERIFIED);
            return;
        }

        // Step 2: Check if all required details are submitted
        const requiredDetails = [
            'company_name',
            'owner_name',
            'owner_email',
            'address_line_1',
            'country',
            'state',
            'city',
            'pincode',
        ];
        const hasIncompleteProfile = requiredDetails.some((field) => !partnerInfo[field]);
        //const hasIncompleteProfile = false;

        if (hasIncompleteProfile) {
            appStore.setAppProperty('profileStatus', ProfileStatuses.INCOMPLETE_PROFILE);
            return;
        }

        // Step 3: Check if admin has approved the account
        if(partnerInfo.account_status == AccountStatuses.APPROVED){
            appStore.setAppProperty('profileStatus', ProfileStatuses.ACTIVE);
            return;
        }
        if (partnerInfo.account_status == AccountStatuses.PENDING) {
            appStore.setAppProperty('profileStatus', ProfileStatuses.ACTIVE);
            return;
        }
        if(partnerInfo.account_status == AccountStatuses.REJECTED) {
            appStore.setAppProperty('profileStatus', ProfileStatuses.REJECTED);
            return;
        }
    } else {
        appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
    }
};
