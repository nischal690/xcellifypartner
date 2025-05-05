import { useContext, createContext } from 'react';
import AppStore from './stores/app';
import MessageStore from './stores/MessageStore';

const store = {
    appStore: new AppStore(),
    messageStore: new MessageStore()
};

export const StoreContext = createContext(store);
export const useStore = () => {
    return useContext(StoreContext);
};

export default store;
