import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TicketIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    usageLimit: '',
    usagePerUser: '1',
    validFrom: '',
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/coupons');
      setCoupons(response.data.coupons);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    // Set validFrom to current date/time by default
    const now = new Date();
    now.setSeconds(0, 0); // Remove seconds and milliseconds for cleaner datetime
    const defaultValidFrom = now.toISOString().slice(0, 16);
    
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      usageLimit: '',
      usagePerUser: '1',
      validFrom: defaultValidFrom,
      validUntil: '',
      isActive: true,
    });
    setShowCouponModal(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      usagePerUser: coupon.usagePerUser?.toString() || '1',
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
      isActive: coupon.isActive,
    });
    setShowCouponModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        usagePerUser: parseInt(formData.usagePerUser) || 1,
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon._id}`, payload);
      } else {
        await api.post('/admin/coupons', payload);
      }

      setShowCouponModal(false);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-1">Manage discount coupons for your store</p>
        </div>
        <button
          onClick={handleCreateCoupon}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Coupon
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-shadow ${
              !coupon.isActive ? 'border-gray-300 opacity-60' : 
              isExpired(coupon.validUntil) ? 'border-red-300' : 'border-blue-300'
            }`}
          >
            <div className="p-6">
              {/* Coupon Code */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <TicketIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900 font-mono">
                    {coupon.code}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {coupon.description && (
                <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>
              )}

              {/* Discount Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600 mr-2" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% OFF`
                        : `Rs. ${coupon.discountValue} OFF`
                      }
                    </div>
                    {coupon.maxDiscountAmount && coupon.discountType === 'percentage' && (
                      <div className="text-xs text-gray-600 mt-1">
                        Max: Rs. {coupon.maxDiscountAmount}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {coupon.minOrderAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min. Order:</span>
                    <span className="font-medium">Rs. {coupon.minOrderAmount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage:</span>
                  <span className="font-medium">
                    {coupon.usageCount} / {coupon.usageLimit || '∞'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Per User:</span>
                  <span className="font-medium">{coupon.usagePerUser}x</span>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {formatDate(coupon.validFrom)} - {formatDate(coupon.validUntil)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    !coupon.isActive ? 'bg-gray-100 text-gray-800' :
                    isExpired(coupon.validUntil) ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {!coupon.isActive ? 'Inactive' : isExpired(coupon.validUntil) ? 'Expired' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && !loading && (
        <div className="text-center py-12">
          <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No coupons</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new coupon.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coupon Code */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
                      placeholder="e.g., SAVE20"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows="2"
                      placeholder="e.g., Get 20% off on all orders"
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      required
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      max={formData.discountType === 'percentage' ? '100' : undefined}
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                    />
                  </div>

                  {/* Min Order Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min. Order Amount (Rs.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>

                  {/* Max Discount Amount */}
                  {formData.discountType === 'percentage' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max. Discount Amount (Rs.)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.maxDiscountAmount}
                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="No limit"
                      />
                    </div>
                  )}

                  {/* Usage Limit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Unlimited"
                    />
                  </div>

                  {/* Usage Per User */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Per User *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.usagePerUser}
                      onChange={(e) => setFormData({ ...formData, usagePerUser: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Valid From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid From
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Valid Until */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Active
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCouponModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCoupon ? 'Update' : 'Create'}
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


