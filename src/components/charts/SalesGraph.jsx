import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const sampleData = [
  { name: 'Jan 01', units_sold: 10, total_transaction: 25 },
  { name: 'Jan 02', units_sold: 20, total_transaction: 50 },
  { name: 'Jan 03', units_sold: 30, total_transaction: 75 },
  { name: 'Jan 04', units_sold: 15, total_transaction: 35 },
  { name: 'Jan 05', units_sold: 25, total_transaction: 75 },
  { name: 'Jan 06', units_sold: 18, total_transaction: 55 },
  { name: 'Jan 07', units_sold: 19, total_transaction: 50 },
  { name: 'Jan 08', units_sold: 23, total_transaction: 65 },
  { name: 'Jan 09', units_sold: 10, total_transaction: 25 },
  { name: 'Jan 10', units_sold: 17, total_transaction: 50 },
  { name: 'Jan 11', units_sold: 40, total_transaction: 15 },
  { name: 'Jan 12', units_sold: 35, total_transaction: 90 },
  { name: 'Jan 13', units_sold: 45, total_transaction: 15 },
  { name: 'Jan 14', units_sold: 30, total_transaction: 90 },
  { name: 'Jan 15', units_sold: 23, total_transaction: 75 },
];

export default function SalesGraph({ isLoading, data }) {
  const modifiedData =
    data && data.length > 0
      ? data.map((item) => {
          let tempDate = new Date(item.date);
          return {
            ...item,
            date: tempDate.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            totalTransaction: item.totalTransaction / 1000, // Scaling the totalTransaction by 1000
          };
        })
      : [];

  const tooltipFormatter = (value, name, props) => {
    if (name === 'totalTransaction') {
      return [`${value.toFixed(3)}K`, name]; // Display with 3 decimal points and K
    }
    return [value, name]; // Default for orderCount
  };

  return (
    <div className="w-full overflow-x-auto relative">
      {/* If no data, display the "No data" message */}
      {modifiedData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-semibold">
          No data available
        </div>
      )}

      <div className="min-w-[700px] lg:min-w-[1000px] mx-auto">
        <ComposedChart
          width={1000}
          height={400}
          data={modifiedData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" scale="band" />
          <YAxis />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Bar dataKey="orderCount" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="totalTransaction" stroke="#ff7300" />
        </ComposedChart>
      </div>
    </div>
  );
}
