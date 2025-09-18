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

  useEffect(() => {
    // Đếm số lượng sản phẩm khác nhau
    if (user) {
      const distinctProductCount = new Set(items.map(item => item.product._id)).size;
      setBadgeCount(distinctProductCount);
    }

    // Fetch cart nếu chưa có dữ liệu và user đã đăng nhập
    if (user && items.length === 0) {
      dispatch(fetchCart());
    }
  }, [items, location.pathname, user, dispatch]);

  return {
    badgeCount, // Số lượng sản phẩm khác nhau trong giỏ hàng
    hasItems: items.length > 0, // Hiển thị badge khi có sản phẩm trong giỏ
  };
};
