import { useEffect, useState } from "react";
import TabButton from "../../components/TabButton";
import Dropdown from "../../components/commonComponents/Dropdown";
import apiRequest from '../../utils/apiRequest';
import { useStore } from "../../stores";

function Services() {
    const { appStore } = useStore();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [sortStatus, setSortStatus] = useState('');
    const [servicesData, setServicesData] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const sortingOptions = [
        { value: 'date', label: 'Sort by: Date' },
        { value: 'status', label: 'Sort by: Status' }
    ];

    const getParsedDate = (orderDate) => {
        let parsedDate = '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
        if (orderDate) {
            const date = new Date(orderDate);
            parsedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        }
        return parsedDate || '-'
    }

    useEffect(() => {

        const getOrdersData = async () => {
            setServicesLoading(true);
            try {
                const params = {}
                if (sortStatus) {
                    params.sort_status = sortStatus
                }
                if (activeTab) {
                    params.order_status = activeTab
                }
                const response = await apiRequest({
                    url: `/mic-study/getOrders/${appStore.partnerInfo.id}`,
                    method: "get",
                    params
                });
                setServicesLoading(false)
                setServicesData(response.data || [])
            } catch (error) {
                setServicesLoading(false);
                console.error(error)
            }
        };

        getOrdersData();
    }, [sortStatus, activeTab, refreshData])

    const startService = (service) => {
        console.log("service >>> ", service)
        //TODO Start And confirm service

        setRefreshData(!refreshData);
    }

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Main content */}
            <main className="flex-1">

                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Services</h1>
                </header>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="flex gap-8">
                        <TabButton text="All services" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                        <TabButton text="Upcoming services" active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')} />
                        <TabButton text="Completed services" active={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
                        <TabButton text="Cancelled services" active={activeTab === 'cancelled'} onClick={() => setActiveTab('cancelled')} />
                    </nav>
                </div>

                {/* Sort dropdown */}
                <div className="relative mb-8">
                    <Dropdown
                        name="sorting_options"
                        options={sortingOptions}
                        defaultValueText={`Select Sorting`}
                        selectedValue={sortStatus}
                        handleChange={(event) => setSortStatus(event.target.value)}
                        inputStyle="bg-white border rounded-md px-4 py-2 pr-8"
                    />
                </div>

                {/* Services table */}

                {servicesLoading && <div> Loading.... </div>}

                {!servicesLoading && servicesData?.length > 0 && <div className="bg-white rounded-lg shadow">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order date</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer name</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product category</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order Status</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {servicesData.map((service) => (
                                <tr key={service.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{service.orderId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{getParsedDate(service.createdAt)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{service.customer || service.userId || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{service.categoryId || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{service.saleStatus}</td>
                                    <td className="px-6 py-4">
                                        <button className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700" onClick={() => startService(service)}>
                                            Start Service
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                }
            </main>
        </div>
    )
}

export default Services;