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

  useEffect(() => {
    // Xác định sản phẩm mới
    const newProductIds = items
      .filter(newItem => 
        !prevItemsRef.current.some(oldItem => 
          oldItem.product._id === newItem.product._id
        )
      )
      .map(item => item.product._id);

    console.log('🛒 Cart Notifications Debug:', {
      currentPath: location.pathname,
      user: !!user,
      prevItems: prevItemsRef.current.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      currentItems: items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })),
      newProductIds
    });

    // Chỉ tăng badge khi có sản phẩm mới
    if (newProductIds.length > 0) {
      setBadgeCount(prev => prev + newProductIds.length);
      
      console.log(`🛍️ Thêm ${newProductIds.length} sản phẩm mới!`);
      
      // Vibration feedback trên mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }

    // Cập nhật ref cho lần kiểm tra tiếp theo
    prevItemsRef.current = items;

    // Fetch cart nếu chưa có dữ liệu và user đã đăng nhập
    if (user && items.length === 0) {
      dispatch(fetchCart());
    }
  }, [items, location.pathname, user, dispatch]);

  return {
    badgeCount, // Số lượng sản phẩm mới
    hasItems: items.length > 0, // Hiển thị badge khi có sản phẩm trong giỏ
  };
};
