import { useContext, createContext } from 'react';
import AppStore from './stores/app';

const store = {
    appStore: new AppStore()
};

export const StoreContext = createContext(store);
export const useStore = () => {
    return useContext(StoreContext);
};

export default store;
