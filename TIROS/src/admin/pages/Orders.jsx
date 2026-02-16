import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  TruckIcon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/api/admin/orders?${params}`);
      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId) => {
    try {
      const response = await api.get(`/api/admin/orders/${orderId}`);
      setSelectedOrder(response.data);
      setShowOrderModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders(); // Refresh the list
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/api/admin/orders/${orderId}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setShowOrderModal(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage customer orders and track their status
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.userId?.name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.email || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.address?.phone || 'No Phone'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewOrder(order._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, getNextStatus(order.status))}
                        className="text-green-600 hover:text-green-900"
                      >
                        {order.status === 'pending' && <CheckIcon className="h-4 w-4" />}
                        {order.status === 'confirmed' && <TruckIcon className="h-4 w-4" />}
                        {order.status === 'shipped' && <CheckIcon className="h-4 w-4" />}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowOrderModal(false)} />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Order Details - #{selectedOrder._id.slice(-8)}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Name:</span> {selectedOrder.userId?.name || 'N/A'}</p>
                          <p><span className="font-medium">Phone:</span> {selectedOrder.userId?.address?.phone || 'N/A'}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.userId?.email || 'N/A'}</p>
                          <p><span className="font-medium">Shipping Address:</span> {selectedOrder.shippingAddress || 'N/A'}</p>
                          <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-3">Order Information</h4>
                        <div className="space-y-2">
                          <p><span className="font-medium">Status:</span>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                              {selectedOrder.status}
                            </span>
                          </p>
                          <p><span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount}</p>
                          <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Products</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedOrder.products?.map((item, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {item.productId?.image && (
                                      <img className="h-10 w-10 rounded-lg object-cover mr-3" src={item.productId.image} alt={item.productId.name} />
                                    )}
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{item.productId?.name || 'Product'}</div>
                                      <div className="text-sm text-gray-500">{item.productId?.description || ''}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${item.productId?.price || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ${(item.productId?.price || 0) * item.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Update Status</h4>
                      <div className="flex space-x-2">
                        {getNextStatus(selectedOrder.status) && (
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, getNextStatus(selectedOrder.status))}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            {selectedOrder.status === 'pending' && (
                              <>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Confirm Order
                              </>
                            )}
                            {selectedOrder.status === 'confirmed' && (
                              <>
                                <TruckIcon className="h-4 w-4 mr-1" />
                                Mark as Shipped
                              </>
                            )}
                            {selectedOrder.status === 'shipped' && (
                              <>
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Mark as Delivered
                              </>
                            )}
                          </button>
                        )}
                        {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
