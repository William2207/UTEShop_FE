import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/analyticsApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0
  });

  const [growth, setGrowth] = useState({
    revenue: '+0%',
    orders: '+0%',
    customers: '+0%',
    products: '+0%'
  });

  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [completedOrdersStats, setCompletedOrdersStats] = useState({
    totalCompleted: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate years from 2003 to current year + 1
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 2003; year--) {
      years.push(year);
    }
    return years;
  };

  const availableYears = generateYears();

  // Fetch dashboard data for specific year
  const fetchDashboardData = async (year = selectedYear) => {
    try {
      setLoading(true);
      setError(null);

      // Debug: Check if token exists
      const token = sessionStorage.getItem('token');
      console.log('🔍 Dashboard - Token exists:', !!token);
      if (token) {
        console.log('🔍 Dashboard - Token preview:', token.substring(0, 20) + '...');
      }

      console.log(`🗓️ Fetching data for year: ${year}`);

      // Fetch general stats with year parameter
      const generalResponse = await analyticsApi.getGeneralStats({ year });

      if (generalResponse.data.success) {
        const data = generalResponse.data.data;

        // Update stats for the selected year
        setStats({
          totalRevenue: data.totalRevenue,
          totalOrders: data.totalOrders,
          totalCustomers: data.totalCustomers,
          totalProducts: data.totalProducts
        });

        // Set growth data
        if (data.growth) {
          setGrowth(data.growth);
        }
      }

      // Fetch other data
      const [revenueResponse, topProductsResponse] = await Promise.all([
        analyticsApi.getRevenue({ year, type: 'monthly' }),
        analyticsApi.getTopProducts({ limit: 10 })
      ]);

      if (revenueResponse.data.success) {
        setRevenueData(revenueResponse.data.data || []);
      }

      if (topProductsResponse.data.success) {
        setTopProducts(topProductsResponse.data.data || []);
      }

      // Fetch recent completed orders for stats
      const completedOrdersResponse = await analyticsApi.getCompletedOrders({ page: 1, limit: 5 });
      if (completedOrdersResponse.data.success) {
        setRecentOrders(completedOrdersResponse.data.data || []);

        // Set completed orders stats from general stats
        setCompletedOrdersStats({
          totalCompleted: generalResponse.data.data.totalOrders || 0, // This is orders for the year
          totalRevenue: generalResponse.data.data.totalRevenue || 0   // This is revenue for the year
        });
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);

      // Check if it's an authentication error
      if (err.response?.status === 401) {
        setError('Bạn cần đăng nhập với tài khoản admin để xem dashboard. Vui lòng đăng nhập lại.');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
      } else {
        setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };


  // Fetch completed orders for detailed view
  const fetchCompletedOrders = async () => {
    try {
      const response = await analyticsApi.getCompletedOrders({ page: 1, limit: 20 });
      if (response.data.success) {
        // Open modal hoặc navigate to dedicated page
        console.log('Completed orders:', response.data.data);
        alert(`Tìm thấy ${response.data.pagination.totalItems} đơn hàng đã giao thành công!`);
      }
    } catch (err) {
      console.error('Error fetching completed orders:', err);
      alert('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    // Fetch all dashboard data when year changes
    console.log(`📊 Year changed to: ${selectedYear}`);
    fetchDashboardData(selectedYear);
  }, [selectedYear]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
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

  const maxValue = revenueData.length > 0 ? Math.max(...revenueData.map(item => item.value)) : 100;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 text-xl mr-3"></i>
            <div>
              <h3 className="text-red-800 font-semibold">Lỗi tải dữ liệu</h3>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className={`text-sm mt-1 ${growth.revenue.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fas ${growth.revenue.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>{growth.revenue}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <i className="fas fa-coins text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              <p className={`text-sm mt-1 ${growth.orders.startsWith('+') ? 'text-blue-600' : 'text-red-600'}`}>
                <i className={`fas ${growth.orders.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>{growth.orders}
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
              <p className={`text-sm mt-1 ${growth.customers.startsWith('+') ? 'text-purple-600' : 'text-red-600'}`}>
                <i className={`fas ${growth.customers.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>{growth.customers}
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
              <p className={`text-sm mt-1 ${growth.products.startsWith('+') ? 'text-orange-600' : 'text-red-600'}`}>
                <i className={`fas ${growth.products.startsWith('+') ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>{growth.products}
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
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
            <span className="text-sm text-gray-500">Top 10</span>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {topProducts.length > 0 ? topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  {/* Ranking Number */}
                  <div className="flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-600">
                      {index + 1}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-200"
                        onError={(e) => {
                          // Fallback to gradient background if image fails
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-12 bg-gradient-to-r ${product.color} rounded-lg flex items-center justify-center shadow-sm`} style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
                      <i className="fas fa-tshirt text-white text-lg"></i>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 truncate max-w-[150px]" title={product.name}>
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">{product.sold} đã bán</p>
                    {product.discountPercentage > 0 && product.originalPrice && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="line-through text-gray-400">
                          {formatCurrency(product.originalPrice)}
                        </span>
                        <span className="bg-red-100 text-red-600 px-1 rounded">
                          -{product.discountPercentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <span className="text-blue-600 font-semibold text-sm block">
                      {formatCurrency(product.discountedPrice || product.price || 0)}
                    </span>
                    <span className="text-green-600 font-semibold text-xs">
                      Doanh thu: {formatCurrency(product.revenue)}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <i className="fas fa-box-open text-3xl mb-2"></i>
                  <p>Chưa có dữ liệu sản phẩm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completed Orders Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Đơn hàng đã giao thành công</h3>
            <p className="text-sm text-gray-600 mt-1">Thống kê các đơn hàng hoàn thành trong tháng này</p>
          </div>
          <button
            onClick={() => fetchCompletedOrders()}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 px-4 py-2 border border-purple-200 rounded-lg hover:bg-purple-50"
          >
            Xem chi tiết
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-600 text-xl mr-3"></i>
              <div>
                <p className="text-green-800 font-semibold text-2xl">{completedOrdersStats.totalCompleted}</p>
                <p className="text-green-600 text-sm">Đơn đã giao năm {selectedYear}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <i className="fas fa-money-bill-wave text-blue-600 text-xl mr-3"></i>
              <div>
                <p className="text-blue-800 font-semibold text-2xl">
                  {formatCurrency(completedOrdersStats.totalRevenue)}
                </p>
                <p className="text-blue-600 text-sm">Tổng doanh thu năm {selectedYear}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <i className="fas fa-shipping-fast text-purple-600 text-xl mr-3"></i>
              <div>
                <p className="text-purple-800 font-semibold text-2xl">
                  {stats.totalOrders > 0 ? Math.round((completedOrdersStats.totalCompleted / stats.totalOrders) * 100) : 0}%
                </p>
                <p className="text-purple-600 text-sm">Tỷ lệ giao thành công</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

