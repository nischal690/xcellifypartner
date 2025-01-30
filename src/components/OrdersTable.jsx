function OrdersTable({ isLoading, data }) {

  const getParsedDate = (orderDate) => {
    let parsedDate = '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    if (orderDate) {
      const date = new Date(orderDate);
      parsedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return parsedDate || '-'
  }

  const getOrderStatus = (order_status) => {
    const order_status_info = {
      FAILED: 'bg-red-100 text-red-800',
      NEW: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800'
    }
    return order_status_info[order_status] || ''
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="pb-4">Order id</th>
            <th className="pb-4">Product id</th>
            <th className="pb-4">Customer name</th>
            <th className="pb-4">Date of order</th>
            <th className="pb-4">Amount paid</th>
            <th className="pb-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, index) => (
            <tr key={index} className="border-t">
              <td className="py-4">{order.orderId}</td>
              <td>{order.productId}</td>
              <td>{order.customerName || order.userId}</td>
              <td>{getParsedDate(order?.createdAt)}</td>
              <td>{order?.productFinalPrice || '-'}</td>
              <td>
                <span className={`px-2 py-1  ${getOrderStatus(order.saleStatus)}  rounded-full text-sm`}>
                  {order.saleStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;