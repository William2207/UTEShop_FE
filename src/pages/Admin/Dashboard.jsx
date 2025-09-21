import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 2400000,
    totalOrders: 1234,
    totalCustomers: 856,
    totalProducts: 342
  });

  const [revenueData, setRevenueData] = useState([
    { month: 'T1', value: 120 },
    { month: 'T2', value: 80 },
    { month: 'T3', value: 160 },
    { month: 'T4', value: 100 },
    { month: 'T5', value: 140 },
    { month: 'T6', value: 90 }
  ]);

  const [topProducts] = useState([
    { name: 'Áo thun basic', sold: 234, revenue: 299000, color: 'from-pink-400 to-purple-500' },
    { name: 'Quần jean slim', sold: 189, revenue: 599000, color: 'from-blue-400 to-indigo-500' },
    { name: 'Mũ snapback', sold: 156, revenue: 199000, color: 'from-green-400 to-teal-500' }
  ]);

  const [recentOrders] = useState([
    { id: '#ORD001', customer: 'Nguyễn Văn A', products: 'Áo thun basic x2', total: 598000, status: 'completed', date: '15/12/2024' },
    { id: '#ORD002', customer: 'Trần Thị B', products: 'Quần jean slim', total: 599000, status: 'processing', date: '15/12/2024' },
    { id: '#ORD003', customer: 'Lê Văn C', products: 'Mũ snapback x3', total: 597000, status: 'shipping', date: '14/12/2024' }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'processing': return 'Đang xử lý';
      case 'shipping': return 'Đang giao';
      default: return 'Không xác định';
    }
  };

  const maxValue = Math.max(...revenueData.map(item => item.value));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+12.5%
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-sm text-blue-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+8.2%
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <i className="fas fa-shopping-cart text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Khách hàng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
              <p className="text-sm text-purple-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+15.3%
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <i className="fas fa-users text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
              <p className="text-sm text-orange-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>+5.7%
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <i className="fas fa-tshirt text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Doanh thu theo tháng</h3>
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t w-full mb-2 transition-all duration-300 hover:from-purple-700 hover:to-purple-500" 
                  style={{ height: `${(item.value / maxValue) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-lg flex items-center justify-center`}>
                    <i className="fas fa-tshirt text-white"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sold} đã bán</p>
                  </div>
                </div>
                <span className="text-green-600 font-semibold">{formatCurrency(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h3>
          <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
            Xem tất cả
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Mã đơn</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Khách hàng</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Sản phẩm</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Tổng tiền</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4 font-medium text-purple-600">{order.id}</td>
                  <td className="py-4 px-4">{order.customer}</td>
                  <td className="py-4 px-4">{order.products}</td>
                  <td className="py-4 px-4 font-semibold">{formatCurrency(order.total)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 ${getStatusColor(order.status)} rounded-full text-sm`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
