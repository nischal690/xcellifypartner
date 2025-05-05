import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toJS } from 'mobx';

import apiRequest from '../../utils/apiRequest';
import StatCard from '../../components/StatCard';
import SalesGraph from '../../components/charts/SalesGraph';
import OrdersTable from '../../components/OrdersTable';
import Dropdown from '../../components/commonComponents/Dropdown';
import { useStore } from '../../stores';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiCalendar, FiActivity } from 'react-icons/fi';

const timeRangeOptions = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_15_days', label: 'Last 15 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_1_year', label: 'Last 1 Year' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('last_7_days');
  const [salesDataLoading, setSalesDataLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [ordersDataLoading, setOrdersDataLoading] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [orderInvoice, setOrderInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyType, setCompanyType] = useState(() => {
    return localStorage.getItem('companyType') || 'Private Limited';
  });
  const [greeting, setGreeting] = useState('');

  const { appStore } = useStore();

  const partnerInfo = toJS(appStore.partnerInfo);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    // Get company type from local storage if available
    const storedCompanyType = localStorage.getItem('companyType');
    if (storedCompanyType) {
      setCompanyType(storedCompanyType);
    }

    // Set greeting based on time of day
    setGreeting(getGreeting());

    // Mock function to simulate fetching user data
    const fetchUserData = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(fetchUserData);
  }, []);

  useEffect(() => {
    const getSalesData = async () => {
      setSalesDataLoading(true);

      try {
        const response = await apiRequest({
          url: '/mic-study/getOrdersCountPerDay',
          method: 'get',
          params: {
            partner_id: appStore.partnerInfo.id,
            time_range: timeRange,
          },
        });
        setSalesDataLoading(false);
        setSalesData(response?.data || {});
        calculateTotalOrdersAndRevenue(response?.data);
      } catch (error) {
        setSalesDataLoading(false);
        console.error(error);
      }
    };

    const getOrdersData = async () => {
      setOrdersDataLoading(true);
      try {
        const response = await apiRequest({
          url: `/mic-study/getOrders/${appStore.partnerInfo.id}`,
          method: 'get',
          params: {
            time_range: timeRange,
          },
        });
        setOrdersDataLoading(false);
        setOrdersData(response.data || []);
      } catch (error) {
        setOrdersDataLoading(false);
        console.error(error);
      }
    };

    getSalesData();
    getOrdersData();
  }, [timeRange]);

  const calculateTotalOrdersAndRevenue = (data) => {
    let calculatedRevenue = data.reduce(
      (sum, item) => sum + item.totalTransaction,
      0
    );
    let calculatedOrdersCount = data.reduce(
      (sum, item) => sum + item.orderCount,
      0
    );
    setTotalRevenue(calculatedRevenue);
    setTotalOrdersCount(calculatedOrdersCount);
  };

  const handleOrderIdClick = async (orderId) => {
    const getOrderInvoice = await apiRequest({
      // url: `/mic-study/orderReceipts/OD-1744373712855`,
      url: `/mic-study/orderReceipts/${orderId}`,
      method: 'GET',
    });
    if (getOrderInvoice?.data) {
      setOrderInvoice(getOrderInvoice?.data?.files?.[0]?.url);
      window.open(getOrderInvoice?.data?.files?.[0]?.url);
    }
  };

  const handleDeclarationDownload = (format) => {
    // Mock function for downloading declaration document
    alert(`Downloading declaration document in ${format} format`);
    // In a real implementation, this would call an API to generate the document
  };

  // Generate recent activity data based on orders
  const recentActivity = useMemo(() => {
    const activities = [];

    if (ordersData && ordersData.length > 0) {
      // Use the first 3 orders to create activity items
      ordersData.slice(0, 3).forEach((order, index) => {
        activities.push({
          id: order.id || index,
          type: order.productType || 'Order',
          name: order.productName || `Order #${order.orderId || index}`,
          action: 'New order',
          date: order.orderDate || new Date().toLocaleDateString(),
          amount: order.totalAmount ? `₹${order.totalAmount}` : 'N/A',
        });
      });
    }

    return activities;
  }, [ordersData]);

  const quickActions = [
    {
      name: 'Add New Product',
      icon: '📦',
      action: () => navigate('/addNewProduct'),
    },
    {
      name: 'View Analytics',
      icon: '📊',
      action: () => navigate('/home'),
    },
    {
      name: 'Update Profile',
      icon: '👤',
      action: () => navigate('/home/profile'),
    },
    {
      name: 'Support',
      icon: '🛟',
      action: () => window.open('/contact', '_blank'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-4 max-w-screen-xl mx-auto">
          {/* Dashboard Header - Redesigned Welcome Card */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    {greeting}, {partnerInfo?.first_name || 'Vendor'}! 👋
                  </h1>
                  <p className="mt-2 text-blue-100 max-w-xl">
                    {companyType === 'Individual' ||
                    companyType === 'Sole Proprietorship' ||
                    companyType === 'Partnership'
                      ? "I hope you're having a great day. Here's an overview of your business performance."
                      : "We hope you're having a great day. Here's an overview of your business performance."}
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 inline-block">
                    <div className="flex items-center">
                      <FiCalendar className="text-blue-100 mr-2" />
                      <span className="text-sm text-blue-100">
                        {new Date().toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-sm p-6 border-t-0">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap gap-3 mb-4 md:mb-0">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={action.action}
                      className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors"
                    >
                      <span className="mr-2 text-xl">{action.icon}</span>
                      <span className="text-sm font-medium">{action.name}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center">
                  <Dropdown
                    name="time_range_select"
                    options={timeRangeOptions}
                    defaultValueText={`Select Time Range`}
                    selectedValue={timeRange}
                    handleChange={(event) => setTimeRange(event.target.value)}
                    inputStyle="bg-white border rounded-md px-4 py-2 pr-8 mr-4"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/home/profile')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <FiUser className="mr-2" />
                    <span>Manage Account</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Stats Overview Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Orders
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {totalOrdersCount}
                  </h2>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {totalOrdersCount > 0
                    ? `${totalOrdersCount} orders in selected period`
                    : 'No orders yet'}
                </p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h2>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-green-500">
                  {totalRevenue > 0 ? 'Revenue is growing' : 'No revenue yet'}
                </p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Avg. Order Value
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    ₹
                    {totalOrdersCount > 0
                      ? (totalRevenue / totalOrdersCount)
                          .toFixed(2)
                          .toLocaleString('en-IN')
                      : 0}
                  </h2>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-purple-500">
                  {totalOrdersCount > 0
                    ? 'Based on completed orders'
                    : 'No orders yet'}
                </p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Conversion Rate
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {totalOrdersCount > 0 ? '3.2%' : '0%'}
                  </h2>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-yellow-600">
                  {totalOrdersCount > 0
                    ? 'Up 0.5% from last period'
                    : 'No data available'}
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.action}
                  className="bg-white shadow-sm rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl mb-2">{action.icon}</span>
                  <p className="text-sm font-medium text-gray-700">
                    {action.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sales Graph Section */}
          <section className="bg-white shadow-sm rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Sales Overview
            </h2>
            <SalesGraph data={salesData} isLoading={salesDataLoading} />
          </section>

          {/* Two Column Layout for Recent Activity and Supplier Declaration */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Activity Section */}
            <section className="lg:col-span-2 bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Activity
              </h2>
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="py-4 flex items-start">
                      <div className="p-2 bg-blue-100 rounded-full mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.name} ({activity.type})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.amount}
                        </p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity to display.</p>
              )}
              <div className="mt-4 text-right">
                <button
                  onClick={() => navigate('/home')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all activity →
                </button>
              </div>
            </section>

            {/* Supplier Declaration Document Section */}
            <section className="bg-white shadow-sm rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Supplier Declaration
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  {companyType === 'Individual' ||
                  companyType === 'Sole Proprietorship' ||
                  companyType === 'Partnership'
                    ? 'I hereby declare that all information provided is accurate and complete.'
                    : 'We hereby declare that all information provided is accurate and complete.'}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Company Type:{' '}
                  <span className="font-medium">{companyType}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated:{' '}
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleDeclarationDownload('pdf')}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Download as PDF
                </button>
                <button
                  onClick={() => handleDeclarationDownload('docx')}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Download as DOCX
                </button>
                <button
                  onClick={() => navigate('/declaration-preview')}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Preview Declaration
                </button>
              </div>
            </section>
          </div>

          {/* Orders Table Section */}
          <section className="bg-white shadow-sm rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Orders
            </h2>
            <OrdersTable
              data={ordersData}
              isLoading={ordersDataLoading}
              handleOrderIdClick={handleOrderIdClick}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
