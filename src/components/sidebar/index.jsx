import { useNavigate } from 'react-router-dom';
import {
    RiDashboardLine
} from 'react-icons/ri';

import { ProductsIcon } from '../../assets/svg-icons/Products'
import { PriceIcon } from '../../assets/svg-icons/Price'
import { SettingsIcon } from '../../assets/svg-icons/Settings'
import { LogoutIcon } from '../../assets/svg-icons/Logout'
import profilePlaceholderImage from '../../assets/profilePlaceholder.png'

import PrimaryLogo from '../../assets/logo-primary.png'
import NavItem from './NavItem';
import { useStore } from "../../stores";
import { AuthStatuses } from "../../utils/constants";
import { useEffect, useState } from 'react';
import { getProfilePicture_API } from '../../utils/getProfilePicture_API';
import { observer } from 'mobx-react';

function Sidebar() {
    const navigate = useNavigate();
    const { appStore } = useStore()
    const [profilePicture, setProfilePicture] = useState('');

    const partnerInfo = appStore.getPartnerInfo;
    const display_name = partnerInfo?.company_name || `${partnerInfo?.first_name || ''} ${partnerInfo?.last_name || ''}`

    useEffect(()=>{
        setProfilePicture(appStore?.brandLogo);
    },[appStore?.brandLogo])

    const handleLogout = () => {
        appStore.setAppProperty('authStatus', AuthStatuses.UNAUTHENTICATED);
        appStore.updatePartnerInfo({});
        localStorage.removeItem("token");
        location.reload();
    }

    const goToDashboard = () => {
        navigate('/home/dashboard')
        return;
    }

    const goToProductsView = () => {
        navigate('/home/products')
        return;
    }

    const goToPayoutsView = () => {
        navigate('/home/payout')
        return;
    }

    const goToServicesView = () => {
        navigate('/home/services')
        return;
    }

    const goToProfileView = ()=>{
        navigate('/home/profile');
        return;
    }

    const isCurrentTabActive = (currTab) => {
        return location.pathname.indexOf(currTab) > -1
    }
console.log(appStore.partnerInfo);
    return (
        <div className="w-64 min-h-screen bg-white border-r">
            <div className="p-4">
                <img src={PrimaryLogo} alt="Xcellify" className="h-12" />
            </div>

            <div className="p-4 cursor-pointer "  onClick={goToProfileView}>
                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-md ">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img src={profilePicture || profilePlaceholderImage} alt={partnerInfo.company_name} className='object-cover w-8 h-8 rounded-full' /> {/** TODO : Update with company image URL */}
                    </div>
                    <span>{display_name}</span>
                </div>
            </div>

            <nav className="mt-8">
                <NavItem icon={<RiDashboardLine />} onClick={goToDashboard} text="Dashboard" active={isCurrentTabActive('dashboard')} />
                <NavItem icon={<ProductsIcon />} onClick={goToProductsView} text="Product" active={isCurrentTabActive('products')} />
                <NavItem icon={<ProductsIcon />} onClick={goToServicesView} text="Services" active={isCurrentTabActive('services')} />
                {/*<NavItem icon={<PriceIcon />} onClick={goToPayoutsView} text="Payout" active={isCurrentTabActive('payout')} />*/}
                <NavItem icon={<LogoutIcon />} onClick={handleLogout} text="Logout" className="text-red-500" />
            </nav>
        </div>
    );
}


export default observer(Sidebar);