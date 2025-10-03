import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  UsersIcon,
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/summary');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Users',
      value: dashboardData?.summary?.totalUsers || 0,
      icon: UsersIcon,
      change: dashboardData?.recent?.users || 0,
      changeType: 'increase'
    },
    {
      name: 'Total Products',
      value: dashboardData?.summary?.totalProducts || 0,
      icon: ShoppingBagIcon,
      change: 0,
      changeType: 'neutral'
    },
    {
      name: 'Total Categories',
      value: dashboardData?.summary?.totalCategories || 0,
      icon: TagIcon,
      change: 0,
      changeType: 'neutral'
    },
    {
      name: 'Total Orders',
      value: dashboardData?.summary?.totalOrders || 0,
      icon: ClipboardDocumentListIcon,
      change: dashboardData?.recent?.orders || 0,
      changeType: 'increase'
    },
    {
      name: 'Total Revenue',
      value: `₹${dashboardData?.summary?.totalRevenue || 0}`,
      icon: CurrencyDollarIcon,
      change: dashboardData?.recent?.revenue || 0,
      changeType: 'increase'
    },
    {
      name: 'Low Stock Products',
      value: dashboardData?.summary?.lowStockProducts || 0,
      icon: ExclamationTriangleIcon,
      change: 0,
      changeType: dashboardData?.summary?.lowStockProducts > 0 ? 'decrease' : 'neutral'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your TIROS admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      {stat.change > 0 && (
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 
                          stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : stat.changeType === 'decrease' ? (
                            <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                          ) : null}
                          <span className="sr-only">
                            {stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                          </span>
                          {stat.change}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Orders
          </h3>
          {dashboardData?.recentOrders?.length > 0 ? (
            <div className="overflow-hidden">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
        </div>
      </div>

      {/* Order Status Breakdown */}
      {dashboardData?.orderStatusBreakdown?.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Order Status Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {dashboardData.orderStatusBreakdown.map((status) => (
                <div key={status._id} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                  <div className="text-sm text-gray-500 capitalize">{status._id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
