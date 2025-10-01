import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  ChartBarIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function Reports() {
  const [salesReport, setSalesReport] = useState(null);
  const [usersReport, setUsersReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [groupBy, setGroupBy] = useState('day');

  useEffect(() => {
    fetchReports();
  }, [dateRange, groupBy]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch sales report
      const salesParams = new URLSearchParams();
      if (dateRange.startDate) salesParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) salesParams.append('endDate', dateRange.endDate);
      salesParams.append('groupBy', groupBy);
      
      const salesResponse = await api.get(`/api/admin/dashboard/sales-report?${salesParams}`);
      setSalesReport(salesResponse.data);

      // Fetch users report
      const usersParams = new URLSearchParams();
      if (dateRange.startDate) usersParams.append('startDate', dateRange.startDate);
      if (dateRange.endDate) usersParams.append('endDate', dateRange.endDate);
      usersParams.append('groupBy', groupBy);
      
      const usersResponse = await api.get(`/api/admin/dashboard/users-report?${usersParams}`);
      setUsersReport(usersResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateKey = (dateKey) => {
    if (!dateKey) return '';
    if (dateKey.year && dateKey.month && dateKey.day) {
      return `${dateKey.year}-${String(dateKey.month).padStart(2, '0')}-${String(dateKey.day).padStart(2, '0')}`;
    }
    if (dateKey.year && dateKey.month) {
      return `${dateKey.year}-${String(dateKey.month).padStart(2, '0')}`;
    }
    if (dateKey.year) {
      return dateKey.year.toString();
    }
    return '';
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            View detailed reports and analytics for your business
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReports}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Refresh Reports
            </button>
          </div>
        </div>
      </div>

      {/* Sales Report */}
      {salesReport && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Sales Report
            </h3>
            
            {/* Sales Summary */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Sales</p>
                    <p className="text-2xl font-semibold text-blue-900">
                    ₹{salesReport.totals?.totalSales || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total Orders</p>
                    <p className="text-2xl font-semibold text-green-900">
                      {salesReport.totals?.totalOrders || 0}
                    </p>
                  </div>
                                </div>
                              </div>
                              <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                  <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-purple-600">Average Order Value</p>
                                    <p className="text-2xl font-semibold text-purple-900">
                                      ₹{salesReport.totals?.averageOrderValue?.toFixed(2) || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Sales Data Table */}
                            {salesReport.salesData?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sales
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Avg Order Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {salesReport.salesData.map((data, index) => (
                                      <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatDateKey(data._id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          ₹{data.totalSales}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {data.orderCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          ₹{data.averageOrderValue?.toFixed(2) || 0}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No sales data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  No sales data available for the selected period.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Users Report */}
                      {usersReport && (
                        <div className="bg-white shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                              Users Report
                            </h3>
                            
                            {/* Users Summary */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
                              <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                  <UsersIcon className="h-8 w-8 text-blue-600" />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-blue-600">Total Users</p>
                                    <p className="text-2xl font-semibold text-blue-900">
                                      {usersReport.userStats?.totalUsers || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-green-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                  <UsersIcon className="h-8 w-8 text-green-600" />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-green-600">Active Users</p>
                                    <p className="text-2xl font-semibold text-green-900">
                                      {usersReport.userStats?.activeUsers || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-red-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                  <UsersIcon className="h-8 w-8 text-red-600" />
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-red-600">Blocked Users</p>
                                    <p className="text-2xl font-semibold text-red-900">
                                      {usersReport.userStats?.blockedUsers || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* User Growth Data Table */}
                            {usersReport.userGrowthData?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                      </th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        New Users
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {usersReport.userGrowthData.map((data, index) => (
                                      <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                          {formatDateKey(data._id)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                          {data.newUsers}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No user growth data</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                  No user growth data available for the selected period.
                                </p>
                              </div>
                            )}

                            {/* Recent Users */}
                            {usersReport.recentUsers?.length > 0 && (
                              <div className="mt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-3">Recent Users</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Joined
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {usersReport.recentUsers.map((user) => (
                                        <tr key={user._id}>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.name}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                              user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                              {user.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
