function OrdersTable({ isLoading, data }) {
  const orders = [
    { id: '1234', productId: '12345678', customerName: 'Arjun', date: '2-jan-2025', quantity: 1, price: 20000, totalPrice: 20000, partnerAmount: 16000, amountPaid: 8000, status: 'Partially paid', dueDate: 'jan-15-2025' },
    { id: '1234', productId: '12345678', customerName: 'Arjun', date: '2-jan-2025', quantity: 1, price: 20000, totalPrice: 20000, partnerAmount: 16000, amountPaid: 8000, status: 'Partially paid', dueDate: 'jan-15-2025' },
    { id: '1234', productId: '12345678', customerName: 'Arjun', date: '2-jan-2025', quantity: 1, price: 20000, totalPrice: 20000, partnerAmount: 16000, amountPaid: 8000, status: 'Partially paid', dueDate: 'jan-15-2025' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <a href="#" className="text-purple-600 text-sm">View full report →</a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="pb-4">Order id</th>
              <th className="pb-4">Product id</th>
              <th className="pb-4">Customer name</th>
              <th className="pb-4">Date of order</th>
              <th className="pb-4">Quantity</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Total</th>
              <th className="pb-4">Amount paid</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Due date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <tr key={index} className="border-t">
                <td className="py-4">{order.orderId}</td>
                <td>{order.productId}</td>
                <td>{order.customerName}</td>
                <td>{new Date(order?.createdAt).toLocaleString()}</td>
                <td>{order?.quantity || '1'}</td>
                <td>{order.price}</td>
                <td>{order.finalPrice}</td>
                <td>{order.amountPaid}</td>
                <td>
                  <span className={`px-2 py-1  ${order.saleStatus == "FAILED" ? "bg-red-100 text-red-800" : order.saleStatus == "NEW" ? "bg-yellow-100 text-yellow-800" : order.saleStatus == "SUCCESS" ? "bg-green-100 text-green-800": ""}  rounded-full text-sm`}>
                    {order.saleStatus}
                  </span>
                </td>
                <td>{new Date(order?.expiryDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTable;