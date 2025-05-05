import { useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiMessage2Line,
  RiSettings4Line,
} from 'react-icons/ri';

import { ProductsIcon } from '../../assets/svg-icons/Products';
import { PriceIcon } from '../../assets/svg-icons/Price';
import { SettingsIcon } from '../../assets/svg-icons/Settings';
import { LogoutIcon } from '../../assets/svg-icons/Logout';
import profilePlaceholderImage from '../../assets/profilePlaceholder.png';

import PrimaryLogo from '../../assets/logo-primary.png';
import NavItem from './NavItem';
import Messages from './Messages';
import { useStore } from '../../stores';
import { AuthStatuses } from '../../utils/constants';
import { useEffect, useState } from 'react';
import { RiMenu3Fill, RiCloseFill } from 'react-icons/ri';
import { getProfilePicture_API } from '../../utils/getProfilePicture_API';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

function Sidebar() {
  const navigate = useNavigate();
  const { appStore, messageStore } = useStore();
  const [profilePicture, setProfilePicture] = useState('');
  const [isOpen, setIsOpen] = useState(false); //  Sidebar toggle state

  const partnerInfo = appStore.getPartnerInfo;
  const display_name =
    partnerInfo?.company_name ||
    `${partnerInfo?.first_name || ''} ${partnerInfo?.last_name || ''}`;

  useEffect(() => {
    setProfilePicture(appStore?.brandLogo);
  }, [appStore?.brandLogo]);

  const handleLogout = () => {
    appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
    appStore.updatePartnerInfo({});
    localStorage.removeItem('token');
    location.reload();
    toast.success('Logout Successfully');
  };

  const goToHome = () => {
    navigate('/home');
    setIsOpen(false);
    return;
  };

  const goToDashboard = () => {
    navigate('/home');
    setIsOpen(false);
    return;
  };

  const goToProductsView = () => {
    navigate('/home/products');
    setIsOpen(false);
    return;
  };

  const goToPayoutsView = () => {
    navigate('/home/payout');
    setIsOpen(false);
    return;
  };

  const goToServicesView = () => {
    navigate('/home/services');
    setIsOpen(false);
    return;
  };

  const goToProfileView = () => {
    navigate('/home/profile');
    setIsOpen(false);
    return;
  };

  const isCurrentTabActive = (currTab) => {
    if (currTab === 'dashboard') {
      return location.pathname === '/home';
    }
    return location.pathname.indexOf(currTab) > -1;
  };

  return (
    <>
      {!isOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 bg-blue-primary text-white p-2 rounded-full"
          onClick={() => setIsOpen(true)}
        >
          <RiMenu3Fill size={24} />
        </button>
      )}

      {/*  Sidebar Container */}
      <div
        className={`fixed md:relative w-64 min-h-screen bg-white border-r shadow-sm flex flex-col transform transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:flex md:flex-col z-40`}
      >
        <button
          className="absolute top-4 right-4 md:hidden bg-gray-300 p-2 rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <RiCloseFill size={24} />
        </button>

        {/*  Sidebar Header - Logo */}
        <div className="p-4 border-b">
          <button onClick={goToHome} className="flex justify-center">
            <img src={PrimaryLogo} alt="Xcellify" className="h-12" />
          </button>
        </div>

        {/*  Profile Section */}
        <div
          className="p-4 cursor-pointer bg-gray-50"
          onClick={goToProfileView}
        >
          <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors">
            <img
              src={profilePicture || profilePlaceholderImage}
              alt={partnerInfo.company_name}
              className="object-cover w-10 h-10 rounded-full border-2 border-blue-100"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{display_name}</span>
              <span className="text-xs text-gray-500">View Profile</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>
          <NavItem
            icon={<RiDashboardLine className="text-blue-600" />}
            onClick={goToDashboard}
            text="Dashboard"
            active={isCurrentTabActive('dashboard')}
          />
          <NavItem
            icon={<ProductsIcon className="text-blue-600" />}
            onClick={goToProductsView}
            text="Products"
            active={isCurrentTabActive('products')}
          />
          <NavItem
            icon={<ProductsIcon className="text-blue-600" />}
            onClick={goToServicesView}
            text="Services"
            active={isCurrentTabActive('services')}
          />

          {/* Messages Section - Now below Services */}
          <div className="px-3 mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Messages
          </div>
          <div className="px-2">
            <Messages />
          </div>

          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          <NavItem
            icon={<RiSettings4Line className="text-blue-600" />}
            onClick={goToProfileView}
            text="Settings"
            active={isCurrentTabActive('profile')}
          />
          <NavItem
            icon={<LogoutIcon className="text-red-500" />}
            onClick={handleLogout}
            text="Logout"
            className="text-red-500"
          />
        </nav>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default observer(Sidebar);
