import React, { useState, useEffect, useCallback , useRef } from 'react';
import api from '../../api/axios';
import {
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

// const timerRef = useRef();

export default function Inventory() {
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(10);

  //added from chatgpt
  // useEffect(() => {
  //   if (!threshold) return;
  //   clearTimeout(timerRef.current);
  //   timerRef.current = setTimeout(() => {
  //     fetchInventoryData();
  //   }, 500);
  // }, [threshold]);
  
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockUpdate, setStockUpdate] = useState({
    operation: 'set',
    value: ''
  });

  // Debounce the fetchInventoryData call
  const debouncedFetchInventoryData = useCallback(() => {
    const timer = setTimeout(() => {
      fetchInventoryData();
    }, 1000); // 500ms delay
    return () => clearTimeout(timer);
  }, [threshold]);

  useEffect(() => {
    fetchInventoryData();
  }, []);

  useEffect(() => {
    if (threshold) {
      const cleanup = debouncedFetchInventoryData();
      return cleanup;
    }
  }, [threshold, debouncedFetchInventoryData]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/inventory?threshold=${threshold}`);
      setInventoryData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setStockUpdate({
      operation: 'set',
      value: product.stock.toString()
    });
    setShowStockModal(true);
  };

  const handleSubmitStockUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/inventory/${selectedProduct._id}`, {
        stock: parseInt(stockUpdate.value),
        operation: stockUpdate.operation
      });
      setShowStockModal(false);
      fetchInventoryData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update stock');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor stock levels and manage inventory
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Summary Cards */}
      {inventoryData?.summary && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CubeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryData.summary.totalProducts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryData.summary.lowStock}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryData.summary.outOfStock}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PencilIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Threshold</dt>
                    <dd className="text-lg font-medium text-gray-900">{inventoryData.summary.threshold}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threshold Setting */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Low Stock Threshold</h3>
            <p className="text-sm text-gray-500">Set the stock level that triggers low stock alerts</p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-gray-500">units</span>
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Low Stock Products
          </h3>
          {inventoryData?.lowStockProducts?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryData.lowStockProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {product.image ? (
                              <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <CubeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleUpdateStock(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No low stock products</h3>
              <p className="mt-1 text-sm text-gray-500">
                All products are above the threshold of {threshold} units.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowStockModal(false)} />
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmitStockUpdate}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Update Stock - {selectedProduct.name}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedProduct.stock} units</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Operation</label>
                          <select
                            value={stockUpdate.operation}
                            onChange={(e) => setStockUpdate({...stockUpdate, operation: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="set">Set to specific value</option>
                            <option value="add">Add to current stock</option>
                            <option value="subtract">Subtract from current stock</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {stockUpdate.operation === 'set' ? 'New Stock Level' : 
                             stockUpdate.operation === 'add' ? 'Amount to Add' : 'Amount to Subtract'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={stockUpdate.value}
                            onChange={(e) => setStockUpdate({...stockUpdate, value: e.target.value})}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {stockUpdate.operation !== 'set' && stockUpdate.value && (
                          <div className="bg-blue-50 p-3 rounded-md">
                            <p className="text-sm text-blue-800">
                              <strong>Result:</strong> {
                                stockUpdate.operation === 'add' 
                                  ? `${selectedProduct.stock} + ${stockUpdate.value} = ${selectedProduct.stock + parseInt(stockUpdate.value)}`
                                  : `${selectedProduct.stock} - ${stockUpdate.value} = ${Math.max(0, selectedProduct.stock - parseInt(stockUpdate.value))}`
                              } units
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Update Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStockModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}