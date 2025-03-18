function OrdersTable({ isLoading, data }) {
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

  const getOrderStatus = (order_status) => {
    const order_status_info = {
      FAILED: 'bg-red-100 text-red-800',
      NEW: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800',
    };
    return order_status_info[order_status] || '';
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-max">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 text-xs sm:text-sm">
            <th className="px-4 py-3 whitespace-nowrap">Order ID</th>
            <th className="px-4 py-3 whitespace-nowrap ">Product ID</th>
            <th className="px-4 py-3 whitespace-nowrap">Customer Name</th>
            <th className="px-4 py-3 whitespace-nowrap ">Date of Order</th>
            <th className="px-4 py-3 whitespace-nowrap">Amount Paid</th>
            <th className="px-4 py-3 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No orders available
              </td>
            </tr>
          ) : (
            data.map((order, index) => (
              <tr key={index} className="border-t text-xs sm:text-sm">
                <td className="px-4 py-3 whitespace-nowrap">{order.orderId}</td>
                <td className="px-4 py-3 whitespace-nowrap ">
                  {order.productId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {order.customerName || order.userId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap ">
                  {getParsedDate(order?.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {order?.productFinalPrice || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 ${getOrderStatus(
                      order.saleStatus
                    )} rounded-full text-xs`}
                  >
                    {order.saleStatus}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
