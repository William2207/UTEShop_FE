import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCart } from '../features/cart/cartSlice';

export const useCartNotifications = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const [badgeCount, setBadgeCount] = useState(0);
  const prevItemsRef = useRef(items);
  const hasFetchedRef = useRef(false);

  // ✅ Tách riêng logic fetch cart - chỉ gọi 1 lần khi user đăng nhập
  useEffect(() => {
    if (user && !hasFetchedRef.current) {
      console.log('🔄 Fetching cart data for user:', user.email || user.username);
      dispatch(fetchCart());
      hasFetchedRef.current = true;
    }
    
    // Reset flag khi user đăng xuất
    if (!user) {
      hasFetchedRef.current = false;
      setBadgeCount(0); // Reset badge khi đăng xuất
    }
  }, [user, dispatch]);

  // ✅ Logic notifications riêng - không gọi API
  useEffect(() => {
    console.log('🔍 DEBUG - Items changed:', {
      prevItemsCount: prevItemsRef.current.length,
      currentItemsCount: items.length,
      prevItems: prevItemsRef.current.map(item => ({ 
        id: item.product._id, 
        name: item.product.name,
        qty: item.quantity 
      })),
      currentItems: items.map(item => ({ 
        id: item.product._id, 
        name: item.product.name,
        qty: item.quantity 
      }))
    });

    // Chỉ xử lý notifications khi có items
    if (items.length === 0) {
      prevItemsRef.current = [];
      return;
    }

    // Xác định sản phẩm mới (thêm mới hoặc tăng số lượng)
    const newProducts = items.filter(newItem => 
      !prevItemsRef.current.some(oldItem => 
        oldItem.product._id === newItem.product._id
      )
    );

    // Xác định sản phẩm có số lượng tăng
    const updatedProducts = items.filter(newItem => {
      const oldItem = prevItemsRef.current.find(oldItem => 
        oldItem.product._id === newItem.product._id
      );
      return oldItem && newItem.quantity > oldItem.quantity;
    });

    const totalNewItems = newProducts.length + updatedProducts.length;

    console.log('🛒 Cart Analysis:', {
      currentPath: location.pathname,
      user: !!user,
      newProducts: newProducts.length,
      updatedProducts: updatedProducts.length,
      totalNewItems,
      shouldShowBadge: totalNewItems > 0 && prevItemsRef.current.length >= 0
    });

    // Hiển thị badge cho cả sản phẩm mới và cập nhật số lượng
    if (totalNewItems > 0) {
      setBadgeCount(prev => {
        const newCount = prev + totalNewItems;
        console.log(`🛍️ Badge updated: ${prev} → ${newCount}`);
        return newCount;
      });
      
      // Vibration feedback trên mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }

    // Cập nhật ref cho lần kiểm tra tiếp theo
    prevItemsRef.current = [...items]; // Clone array để tránh reference issues

  }, [items]); // Chỉ phụ thuộc vào items

  // ✅ Không reset badge khi vào trang cart - giữ thông báo luôn hiển thị
  // useEffect(() => {
  //   if (location.pathname === '/cart') {
  //     setBadgeCount(0);
  //   }
  // }, [location.pathname]);

  return {
    badgeCount: items.length, // ✅ Hiển thị tổng số items thay vì chỉ items mới
    hasItems: items.length > 0, // Hiển thị badge khi có sản phẩm trong giỏ
    totalItems: items.length // Tổng số items trong giỏ hàng
  };
};