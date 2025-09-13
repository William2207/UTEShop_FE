import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "../../features/auth/authSlice";
import { getCartItemCount, logCartDetails } from "../../features/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useCartNotifications } from "../../hooks/useCartNotifications";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { badgeCount, hasItems } = useCartNotifications();

  // Lấy số lượng giỏ hàng khi user đăng nhập
  useEffect(() => {
    if (user) {
      dispatch(getCartItemCount());
      dispatch(logCartDetails()); // Log chi tiết giỏ hàng
    }
  }, [user, dispatch]);

  // Auto-refresh badge count khi có thay đổi trong cart state
  useEffect(() => {
    // Badge count sẽ tự động update từ Redux state
    console.log('🔢 Badge count updated:', badgeCount);
    console.log('🔢 User:', user);
  }, [badgeCount, user]);

  const handleLogoClick = () => navigate("/");
  const handleShopClick = () => navigate("/products");
  const handleNewArrivalsClick = () => navigate("/new-arrivals");
  const handleOnSaleClick = () => navigate("/products?sort=top-discount");
  const handleBrandsClick = () => navigate("/products"); // hoặc /brands nếu có
  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex-shrink-0 cursor-pointer select-none"
        >
          <h1 className="text-2xl font-bold text-black">UTE SHOP</h1>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={handleShopClick}
            className="flex items-center space-x-1 hover:text-blue-600 text-gray-700"
          >
            <span>Shop</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={handleOnSaleClick}
            className="text-gray-700 hover:text-blue-600"
          >
            On Sale
          </button>
          <button
            onClick={handleNewArrivalsClick}
            className="text-gray-700 hover:text-blue-600"
          >
            New Arrivals
          </button>
          <button
            onClick={handleBrandsClick}
            className="text-gray-700 hover:text-blue-600"
          >
            Brands
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 pr-4 py-2 w-full bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Cart Icon with Badge */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            {user && (
              <span 
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]"
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            )}
          </Button>

          {/* Dummy bag / orders */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => navigate("/orders")}
          >
            <ShoppingBag className="h-5 w-5 text-gray-700" />
          </Button>

          {/* User / Auth */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">
                    {user.name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              <User className="h-5 w-5 text-gray-700" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for products..."
            className="pl-10 pr-4 py-2 w-full bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
