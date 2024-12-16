import { AuthStatuses } from './constants';
import apiRequest from './apiRequest'

export const validateAndSetAuthStatus = async (appStore, navigate) => {
    const partnerInfoResp = localStorage.getItem("token") && await apiRequest({
        url: `/mic-login/partnerProfileInfo`,
        method: 'get',
    });

    if (partnerInfoResp?.data) {
        const userInfo = partnerInfoResp.data.user_info || {};
        const partnerInfo = partnerInfoResp.data.partner_info || {};

        // Step 1: Check if email is verified
        if (!userInfo.is_verified) {
            appStore.setAppProperty('authStatus', AuthStatuses.UNVERIFIED);
            navigate && navigate('/verify-email');
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

        if (hasIncompleteProfile) {
            appStore.setAppProperty('authStatus', AuthStatuses.INCOMPLETE_PROFILE);
            navigate && navigate('/onboarding');
            return;
        }

        // Step 3: Check if admin has approved the account
        if (!partnerInfo.is_active) {
            appStore.setAppProperty('authStatus', AuthStatuses.UNDER_REVIEW);
            navigate && navigate('/under-verification');
            return;
        }

        // Step 4: All checks pass
        appStore.updatePartnerInfo({ ...userInfo, ...partnerInfo });
        appStore.setAppProperty('authStatus', AuthStatuses.LOGIN_SUCCESS);
        navigate && navigate('/');
    } else {
        appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
        navigate && navigate('/login');
    }
};
