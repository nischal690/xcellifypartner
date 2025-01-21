import React from "react";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const sampleData = [
    { name: "Jan 01", units_sold: 10, total_transaction: 25 },
    { name: "Jan 02", units_sold: 20, total_transaction: 50 },
    { name: "Jan 03", units_sold: 30, total_transaction: 75 },
    { name: "Jan 04", units_sold: 15, total_transaction: 35 },
    { name: "Jan 05", units_sold: 25, total_transaction: 75 },
    { name: "Jan 06", units_sold: 18, total_transaction: 55 },
    { name: "Jan 07", units_sold: 19, total_transaction: 50 },
    { name: "Jan 08", units_sold: 23, total_transaction: 65 },
    { name: "Jan 09", units_sold: 10, total_transaction: 25 },
    { name: "Jan 10", units_sold: 17, total_transaction: 50 },
    { name: "Jan 11", units_sold: 40, total_transaction: 15 },
    { name: "Jan 12", units_sold: 35, total_transaction: 90 },
    { name: "Jan 13", units_sold: 45, total_transaction: 15 },
    { name: "Jan 14", units_sold: 30, total_transaction: 90 },
    { name: "Jan 15", units_sold: 23, total_transaction: 75 },
];

export default function SalesGraph({isLoading, data}) {
    return (
        <ComposedChart
            width={1000}
            height={400}
            data={sampleData}
            margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }}
        >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="units_sold" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="total_transaction" stroke="#ff7300" />
        </ComposedChart>
    );
}
