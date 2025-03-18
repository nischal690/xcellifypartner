import React, { useEffect, useState } from 'react';

import apiRequest from '../../utils/apiRequest';
import StatCard from '../../components/StatCard';
import SalesGraph from '../../components/charts/SalesGraph';
import OrdersTable from '../../components/OrdersTable';
import Dropdown from '../../components/commonComponents/Dropdown';
import { useStore } from '../../stores';

const timeRangeOptions = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_15_days', label: 'Last 15 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_1_year', label: 'Last 1 Year' },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('last_15_days');
  const [salesDataLoading, setSalesDataLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalOrdersCount, setTotalOrdersCount] = useState();
  const [ordersDataLoading, setOrdersDataLoading] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  const { appStore } = useStore();

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

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      <div className="relative mb-8">
        <Dropdown
          name="time_range_select"
          options={timeRangeOptions}
          defaultValueText={`Select Time Range`}
          selectedValue={timeRange}
          handleChange={(event) => setTimeRange(event.target.value)}
          inputStyle="bg-white border rounded-md px-4 py-2 pr-8"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={totalRevenue} />
        <StatCard title="Total Orders" value={totalOrdersCount} />
      </div>

      <div className="bg-white shadow rounded-md p-4 mb-8">
        <SalesGraph data={salesData} isLoading={salesDataLoading} />
      </div>

      <div className="bg-white shadow rounded-md p-4">
        <OrdersTable data={ordersData} isLoading={ordersDataLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
