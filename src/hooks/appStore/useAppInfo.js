import { toJS } from 'mobx';
import { useStore } from '../../stores';

export const useAppInfo = () => {
  const { appStore } = useStore();

  const partnerInfo = toJS(appStore.partnerInfo) ?? {};
  const userInfo = toJS(appStore.userInfo) ?? {};

  return { partnerInfo, userInfo, appStore };
};
