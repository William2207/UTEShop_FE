import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../features/order/orderSlice';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    // Lấy thông tin sản phẩm từ state của navigation
    const [productDetails, setProductDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [shippingAddress, setShippingAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        // Kiểm tra xem có thông tin sản phẩm được truyền không
        const state = location.state;
        if (!state || !state.product) {
            // Nếu không có thông tin sản phẩm, chuyển về trang sản phẩm
            navigate('/products', {
                state: {
                    error: 'Không có thông tin sản phẩm để thanh toán'
                }
            });
            return;
        }

        // Kiểm tra đăng nhập
        if (!user) {
            alert('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }

        setProductDetails(state.product);
        setQuantity(state.quantity || 1);

        // Nếu user đã có địa chỉ, điền sẵn
        if (user?.address) {
            setShippingAddress(user.address);
        }
        if (user?.phone) {
            setPhoneNumber(user.phone);
        }
    }, [location, user, navigate]);

    const handleCreateOrder = async () => {
        // Kiểm tra địa chỉ
        if (!shippingAddress.trim()) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        // Kiểm tra số điện thoại
        if (!phoneNumber.trim()) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }

        // Tính tổng giá với discount và phí ship
        const subtotal = productDetails.price * quantity;
        const discountAmount = productDetails.discountPercentage > 0
            ? subtotal * productDetails.discountPercentage / 100
            : 0;
        const deliveryFee = 15000;
        const totalPrice = subtotal - discountAmount + deliveryFee;

        try {
            // Xử lý an toàn để lấy user ID
            let userId = null;

            // Nếu user là object và có _id
            if (user && typeof user === 'object' && user._id) {
                userId = user._id;
            }
            // Nếu user là string (ID)
            else if (typeof user === 'string') {
                userId = user;
            }
            // Nếu user là object nhưng không có _id, thử lấy ID từ các key khác
            else if (user && typeof user === 'object') {
                const idKeys = ['id', 'userId', '_id'];
                for (let key of idKeys) {
                    if (user[key]) {
                        userId = user[key];
                        break;
                    }
                }
            }

            if (!userId) {
                throw new Error('Không thể xác định ID người dùng. Vui lòng đăng nhập lại.');
            }

            const orderData = {
                // Không gửi user ID trong body - backend sẽ lấy từ token
                items: [{
                    product: productDetails._id,
                    quantity: quantity,
                    price: productDetails.price
                }],
                totalPrice, // Thêm tổng giá
                shippingAddress,
                paymentMethod: 'COD',
                codDetails: {
                    phoneNumberConfirmed: false,
                    additionalNotes: `Thanh toán cho sản phẩm: ${productDetails.name}`
                }
            };

            const result = await dispatch(createOrder(orderData)).unwrap();

            alert('Đặt hàng thành công!');
            navigate('/orders');
        } catch (error) {
            console.error('Order Creation Error:', error);

            // Xử lý các loại lỗi khác nhau
            if (error?.code === 'NO_AUTH_USER') {
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                navigate('/login');
            } else if (error?.code === 'NO_ITEMS') {
                alert('Không có sản phẩm để đặt hàng.');
            } else if (error?.code === 'NO_ADDRESS') {
                alert('Vui lòng nhập địa chỉ giao hàng.');
            } else {
                alert(error?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
            }
        }
    };

    // Nếu không có thông tin sản phẩm, không render gì cả
    if (!productDetails) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Thanh Toán</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Product Details */}
                <Card className="h-fit">
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>

                        {/* Product Item */}
                        <div className="flex items-center space-x-4 p-4 border rounded-lg mb-4">
                            <div className="relative">
                                <img
                                    src={productDetails.images?.[0] || "https://via.placeholder.com/80x80?text=No+Image"}
                                    alt={productDetails.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                    {quantity}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{productDetails.name}</h3>
                                <p className="text-sm text-gray-500">Size: {productDetails.size || 'Standard'}</p>
                                <p className="text-sm text-gray-500">Color: {productDetails.color || 'Default'}</p>
                                <p className="font-bold text-lg">{productDetails.price?.toLocaleString()} đ</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{(productDetails.price * quantity).toLocaleString()} đ</span>
                                </div>
                                {productDetails.discountPercentage > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Discount (-{productDetails.discountPercentage}%)</span>
                                        <span>-{Math.round(productDetails.price * quantity * productDetails.discountPercentage / 100).toLocaleString()} đ</span>
                                    </div>
                                )}

                                <hr />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{(() => {
                                        const discountAmount = productDetails.discountPercentage > 0
                                            ? productDetails.price * quantity * productDetails.discountPercentage / 100
                                            : 0;
                                        const finalTotal = (productDetails.price * quantity) - discountAmount;
                                        return Math.round(finalTotal).toLocaleString();
                                    })()} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Column - Checkout Form */}
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>

                        {/* Địa chỉ giao hàng */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Địa Chỉ Giao Hàng</label>
                            <Input
                                type="text"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Nhập địa chỉ giao hàng"
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Số Điện Thoại</label>
                            <Input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="mb-6">
                            <label className="block mb-2 font-medium">Phương Thức Thanh Toán</label>
                            <div className="bg-gray-100 p-3 rounded">
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </div>
                        </div>

                        {/* Nút đặt hàng */}
                        <Button
                            onClick={handleCreateOrder}
                            className="w-full bg-black text-white hover:bg-gray-800 py-3"
                        >
                            Go to Checkout →
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutPage;
