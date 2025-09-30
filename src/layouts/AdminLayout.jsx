import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // AdminRoute đã xử lý việc kiểm tra quyền admin, không cần redirect ở đây

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin'); // Quay về trang đăng nhập admin
  };

  const menuItems = [
    { path: '/admin', icon: 'fas fa-chart-bar', label: 'Dashboard', exact: true },
    { path: '/admin/products', icon: 'fas fa-tshirt', label: 'Sản phẩm' },
    { path: '/admin/orders', icon: 'fas fa-shopping-cart', label: 'Quản lý đơn hàng' },
    { path: '/admin/customers', icon: 'fas fa-users', label: 'Quản lý khách hàng' },
    { path: '/admin/vouchers', icon: 'fas fa-ticket-alt', label: 'Voucher' },
    { path: '/admin/points', icon: 'fas fa-star', label: 'Điểm tích lũy' },
    { path: '/admin/categories', icon: 'fas fa-tags', label: 'Danh mục' },
    { path: '/admin/reports', icon: 'fas fa-chart-line', label: 'Báo cáo' },
    { path: '/admin/settings', icon: 'fas fa-cog', label: 'Cài đặt' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => 
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
    );
    return currentItem ? currentItem.label : 'Admin Panel';
  };

  // AdminRoute đã đảm bảo user là admin, không cần kiểm tra lại

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-purple-600 to-indigo-600">
          <h1 className="text-xl font-bold text-white">Fashion Admin</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path, item.exact)
                    ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <i className={`${item.icon} mr-3 ${
                  isActive(item.path, item.exact) ? 'text-purple-600' : ''
                }`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-4 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <i className="fas fa-bars text-gray-600"></i>
              </button>
              <h2 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-gray-100">
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.avatarUrl || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23667eea'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3E${user?.name?.[0] || 'A'}%3C/text%3E%3C/svg%3E`}
                  alt="Admin" 
                  className="w-10 h-10 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-gray-100"
                  title="Đăng xuất"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
