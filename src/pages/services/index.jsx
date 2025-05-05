import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiCalendar, FiTag, FiUser, FiBox, FiClock } from 'react-icons/fi';
import apiRequest from '../../utils/apiRequest';
import { useStore } from '../../stores';
import ServiceModal from '../../components/commonComponents/modals/ServiceModal';

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

const CATEGORY_ICONS = {
  'Career Counselling': '👨‍💼',
  'Study Overseas': '✈️',
  'Study India': '🏛️',
  'Tutoring': '📚',
  'Summer Courses': '☀️',
  'Study Finance': '💰',
  'Merchandise': '🛍️',
  'Events': '🎭',
  'Fun': '🎮',
};

function Services() {
  const { appStore } = useStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [sortStatus, setSortStatus] = useState('createdAt');
  const [servicesData, setServicesData] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const sortingOptions = [
    { value: 'createdAt', label: 'Date: Newest First' },
    { value: '-createdAt', label: 'Date: Oldest First' },
    { value: 'order_status', label: 'Status' },
    { value: 'categoryId', label: 'Category' },
  ];

  useEffect(() => {
    getOrdersData();
  }, [sortStatus, activeTab, refreshData]);

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

  const getOrderStatus = (order_status) => {
    const statusStyles = {
      FAILED: 'bg-red-50 text-red-600 border border-red-200',
      NEW: 'bg-amber-50 text-amber-600 border border-amber-200',
      SUCCESS: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      pending: 'bg-blue-50 text-blue-600 border border-blue-200',
      completed: 'bg-green-50 text-green-600 border border-green-200',
      cancelled: 'bg-gray-50 text-gray-600 border border-gray-200',
    };
    return statusStyles[order_status] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getParsedDate = (orderDate) => {
    let parsedDate = '';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
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

  const getApiBasePath = (category) => {
    switch (category) {
      case 'Study Overseas':
      case 'Study India':
        return 'mic-study';
      case 'Tutoring':
      case 'Career Counselling':
      case 'Summer Courses':
        return 'mic-counselling';
      case 'Study Finance':
      case 'Loans and Scholarships':
        return 'mic-finance';
      case 'Events':
      case 'Competitions':
        return 'mic-events';
      default:
        console.error('Category not matched:', category);
        throw new Error(`Unknown category: ${category}`);
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const categoryName = CATEGORY_MAPPING[selectedService?.categoryId];
      const apiBase = getApiBasePath(categoryName);

      const response = await apiRequest({
        url: `/${apiBase}/verifyOrderOtp`,
        method: 'post',
        data: {
          orderId: selectedService?.orderId,
          sellerId: selectedService?.sellerId,
          otp: parseInt(otp),
        },
      });

      if (response.data.success) {
        setModalOpen(false);
        setRefreshData(!refreshData);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  };

  const filteredServices = servicesData.filter(service => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (service.orderId && service.orderId.toLowerCase().includes(searchLower)) ||
      (service.customerName && service.customerName.toLowerCase().includes(searchLower)) ||
      (CATEGORY_MAPPING[service.categoryId] && CATEGORY_MAPPING[service.categoryId].toLowerCase().includes(searchLower))
    );
  });

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return getParsedDate(dateString);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Services</h1>
          <p className="text-gray-500">Manage your service orders and track their status</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">{servicesData.length}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <FiBox className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {servicesData.filter(s => s.saleStatus === 'pending').length}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <h3 className="text-2xl font-bold text-green-600">
                  {servicesData.filter(s => s.saleStatus === 'completed').length}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <FiTag className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Cancelled</p>
                <h3 className="text-2xl font-bold text-red-600">
                  {servicesData.filter(s => s.saleStatus === 'cancelled').length}
                </h3>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <FiUser className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by order ID, customer name, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FiFilter className="mr-2" />
                  Filters
                </button>
                
                <select
                  value={sortStatus}
                  onChange={(e) => setSortStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
                >
                  {sortingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {isFilterOpen && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label>
                    <div className="flex items-center">
                      <input
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <span className="mx-2 text-gray-400">to</span>
                      <input
                        type="date"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                    <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option value="">All Categories</option>
                      {Object.entries(CATEGORY_MAPPING).map(([key, value]) => (
                        <option key={key} value={key}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    {tab.label}
                    {tab.id === 'pending' && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-600">
                        {servicesData.filter(s => s.saleStatus === 'pending').length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Table/Cards */}
          <div className="px-6 pb-6">
            {servicesLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : !filteredServices.length ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png" 
                  alt="No orders" 
                  className="w-32 h-32 mb-4 opacity-30"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                <p className="text-gray-500 max-w-md">
                  There are no orders matching your current filters. Try changing your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-xs text-gray-500">Order ID</span>
                          <h3 className="font-medium text-gray-900">{service.orderId}</h3>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getOrderStatus(service.saleStatus)}`}>
                          {service.saleStatus}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start">
                          <FiUser className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <span className="text-xs text-gray-500 block">Customer</span>
                            <span className="text-sm text-gray-900">{service.customerName || service.userId || '-'}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FiBox className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <span className="text-xs text-gray-500 block">Category</span>
                            <span className="text-sm text-gray-900">
                              {CATEGORY_ICONS[CATEGORY_MAPPING[service.categoryId]] || '📦'} {CATEGORY_MAPPING[service.categoryId] || '-'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FiCalendar className="text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <span className="text-xs text-gray-500 block">Order Date</span>
                            <span className="text-sm text-gray-900">{getParsedDate(service.createdAt)}</span>
                            <span className="text-xs text-gray-500 ml-2">({getTimeAgo(service.createdAt)})</span>
                          </div>
                        </div>
                      </div>
                      
                      {activeTab === 'pending' &&
                        service.saleStatus === 'pending' &&
                        service.order_status === 'PAID' && (
                          <button
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => startService(service)}
                          >
                            Start Service
                          </button>
                        )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onVerify={verifyOtp}
      />
    </div>
  );
}

export default Services;
