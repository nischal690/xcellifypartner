import { useEffect, useState } from 'react';
import TabButton from '../../components/TabButton';
import Dropdown from '../../components/commonComponents/Dropdown';
import apiRequest from '../../utils/apiRequest';
import { useStore } from '../../stores';
import ServiceModal from '../../components/commonComponents/modals/ServiceModal'; // Import the modal

const CATEGORY_MAPPING = {
  CRCN: 'Career Counselling',
  STOV: 'Study Overseas',
  STIN: 'Study India',
  TTRN: 'Tutoring',
  SMCR: 'Summer Courses',
  STFN: 'Study Finance',
  MRCN: 'Merchandise',
  EVNT: 'Events',
  FNNN: 'Fun',
};

function Services() {
  const { appStore } = useStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [sortStatus, setSortStatus] = useState('');
  const [servicesData, setServicesData] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const sortingOptions = [
    { value: 'createdAt', label: 'Sort by: Date' },
    { value: 'order_status', label: 'Sort by: Status' },
  ];

  useEffect(() => {
    const getOrdersData = async () => {
      setServicesLoading(true);
      try {
        const params = {};
        if (sortStatus) params.sort = sortStatus;
        if (activeTab && activeTab !== 'all') params.status = activeTab;

        const response = await apiRequest({
          url: `/mic-study/getOrders/${appStore.partnerInfo.id}`,
          method: 'get',
          params,
        });

        setServicesLoading(false);
        setServicesData(response.data || []);
        let filteredData = response.data || [];

        if (activeTab === 'pending') {
          filteredData = filteredData.filter(
            (service) =>
              service.saleStatus === 'pending' &&
              service.order_status === 'PAID'
          );
        }

        setServicesData(filteredData);
      } catch (error) {
        setServicesLoading(false);
        console.error(error);
      }
    };

    getOrdersData();
  }, [sortStatus, activeTab, refreshData]);

  const getOrderStatus = (order_status) => {
    const order_status_info = {
      FAILED: 'bg-red-100 text-red-800',
      NEW: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800',
    };
    return order_status_info[order_status] || '';
  };

  const getParsedDate = (orderDate) => {
    let parsedDate = '';
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (orderDate) {
      const date = new Date(orderDate);
      parsedDate = `${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    }
    return parsedDate || '-';
  };

  const startService = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const verifyOtp = async (otp) => {
    try {
      const response = await apiRequest({
        url: '/mic-study/verifyOrderOtp',
        method: 'post',
        data: {
          orderId: selectedService?.orderId,
          sellerId: selectedService?.sellerId,
          otp: parseInt(otp),
        },
      });

      if (response.data.success) {
        setRefreshData(!refreshData);
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false };
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Services</h1>
        </header>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8">
            <TabButton
              text="All services"
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            />
            <TabButton
              text="Upcoming services"
              active={activeTab === 'pending'}
              onClick={() => setActiveTab('pending')}
            />
            <TabButton
              text="Completed services"
              active={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
            />
            <TabButton
              text="Cancelled services"
              active={activeTab === 'cancelled'}
              onClick={() => setActiveTab('cancelled')}
            />
          </nav>
        </div>

        <div className="relative mb-8">
          <Dropdown
            name="sorting_options"
            options={sortingOptions}
            defaultValueText="Select Sorting"
            selectedValue={sortStatus}
            handleChange={(event) => setSortStatus(event.target.value)}
            inputStyle="bg-white border rounded-md px-4 py-2 pr-8"
          />
        </div>

        {servicesLoading && (
          <div className="w-full text-center"> Loading.... </div>
        )}
        {!servicesLoading && !servicesData?.length && (
          <div className=" w-full text-center"> No services found </div>
        )}

        {!servicesLoading && servicesData?.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Order date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Customer name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Product category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                    Order Status
                  </th>
                  {activeTab === 'pending' && (
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {servicesData.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getParsedDate(service.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {service.customerName || service.userId || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {CATEGORY_MAPPING[service.categoryId] || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm ">
                      <span
                        className={`px-2 py-1 ${
                          service?.saleStatus &&
                          getOrderStatus(service.saleStatus)
                        } rounded-full`}
                      >
                        {service.saleStatus}
                      </span>
                    </td>
                    {activeTab === 'pending' &&
                      service.saleStatus === 'pending' &&
                      service.order_status === 'PAID' && (
                        <td className="px-6 py-4">
                          <button
                            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                            onClick={() => startService(service)}
                          >
                            Start Service
                          </button>
                        </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ServiceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onVerify={verifyOtp}
        />
      </main>
    </div>
  );
}

export default Services;
