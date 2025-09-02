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
import { useSelector, useDispatch } from 'react-redux';
const navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); 
  const handleUserLogoClick = () => {
    navigate("/profile");
  };

  const handleLogoClick = () => {
    navigate("/");
  };


  const handleShopClick = () => {
    navigate("/products");
  };

  const handleNewArrivalsClick = () => {
    navigate("/new-arrivals");
  };

  const handleOnSaleClick = () => {
    navigate("/products?sort=top-discount");
  };

  const handleBrandsClick = () => {
    navigate("/products"); // hoặc trang brands riêng nếu có
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div onClick={handleLogoClick} className="flex-shrink-0 cursor-pointer">
          <h1 className="text-2xl font-bold text-black hover:text-blue-600 transition-colors">UTE SHOP</h1>
        </div>

        {/* Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div
            onClick={handleShopClick}
            className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors"
          >
            <span className="text-gray-700 hover:text-blue-600">Shop</span>
            <ChevronDown className="h-4 w-4 text-gray-700" />
          </div>
          <span
            onClick={handleOnSaleClick}
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
          >
            On Sale
          </span>
          <span
            onClick={handleNewArrivalsClick}
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
          >
            New Arrivals
          </span>
          <span
            onClick={handleBrandsClick}
            className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors"
          >
            Brands
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 pr-4 py-2 w-full bg-gray-100 border-0 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <ShoppingBag className="h-5 w-5 text-gray-700" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleUserLogoClick}>
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
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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

export default navbar;
