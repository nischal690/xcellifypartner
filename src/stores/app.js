import { makeAutoObservable } from 'mobx';
import { AuthStatuses } from '../utils/constants';

//import { getLocalStorageItem, setLocalStorageItem } from '@/utils/storage';

class AppStore {
    authStatus = AuthStatuses.UNAUTHENTICATED;
    partnerInfo = {};

    constructor() {
        makeAutoObservable(this);
    }

    get getPartnerInfo() {
        return this.partnerInfo;
    }

    updatePartnerInfo = (partnerInfo) => {
        this.partnerInfo = partnerInfo;
    };

    setAppProperty = (property, value) => {
        this[property] = value;
    };
}

export default AppStore;
