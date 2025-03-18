import { useNavigate } from 'react-router-dom';
import { RiDashboardLine } from 'react-icons/ri';

import { ProductsIcon } from '../../assets/svg-icons/Products';
import { PriceIcon } from '../../assets/svg-icons/Price';
import { SettingsIcon } from '../../assets/svg-icons/Settings';
import { LogoutIcon } from '../../assets/svg-icons/Logout';
import profilePlaceholderImage from '../../assets/profilePlaceholder.png';

import PrimaryLogo from '../../assets/logo-primary.png';
import NavItem from './NavItem';
import { useStore } from '../../stores';
import { AuthStatuses } from '../../utils/constants';
import { useEffect, useState } from 'react';
import { RiMenu3Fill, RiCloseFill } from 'react-icons/ri';
import { getProfilePicture_API } from '../../utils/getProfilePicture_API';
import { observer } from 'mobx-react';
import { toast } from 'react-toastify';

function Sidebar() {
  const navigate = useNavigate();
  const { appStore } = useStore();
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
    navigate('/home/dashboard');
    setIsOpen(false);
    return;
  };

  const goToDashboard = () => {
    navigate('/home/dashboard');
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
    return location.pathname.indexOf(currTab) > -1;
  };
  console.log(appStore.partnerInfo);
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
        className={`fixed md:relative w-64 min-h-screen bg-white border-r transform transition-transform ${
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
        <div className="p-4">
          <button onClick={goToHome}>
            <img src={PrimaryLogo} alt="Xcellify" className="h-12 mx-auto" />
          </button>
        </div>

        {/*  Profile Section */}
        <div className="p-4 cursor-pointer" onClick={goToProfileView}>
          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md">
            <img
              src={profilePicture || profilePlaceholderImage}
              alt={partnerInfo.company_name}
              className="object-cover w-8 h-8 rounded-full"
            />
            <span>{display_name}</span>
          </div>
        </div>

        {/* ✅ Navigation Links */}
        <nav className="mt-8">
          <NavItem
            icon={<RiDashboardLine />}
            onClick={goToDashboard}
            text="Dashboard"
            active={isCurrentTabActive('dashboard')}
          />
          <NavItem
            icon={<ProductsIcon />}
            onClick={goToProductsView}
            text="Product"
            active={isCurrentTabActive('products')}
          />
          <NavItem
            icon={<ProductsIcon />}
            onClick={goToServicesView}
            text="Services"
            active={isCurrentTabActive('services')}
          />
          <NavItem
            icon={<LogoutIcon />}
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
