import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../features/order/orderSlice';
import { updateUserProfile } from '../features/auth/authSlice';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import PaymentMethod from '../components/PaymentMethod';
import MoMoPaymentForm from '../components/MoMoPaymentForm';
import api from '../api/axiosConfig';

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
    const [paymentMethod, setPaymentMethod] = useState('MOMO');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState('');

    // Fetch thông tin user mới nhất từ API
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                try {
                    const response = await api.get('/user/profile');
                    // Cập nhật Redux store với thông tin mới nhất
                    dispatch(updateUserProfile(response.data));
                } catch (error) {
                    console.error('Lỗi khi fetch thông tin user:', error);
                }
            }
        };

        fetchUserProfile();
    }, [dispatch, user]);

    useEffect(() => {
        // Xóa URL parameters nếu có (để tránh xử lý callback ở đây)
        const urlParams = new URLSearchParams(window.location.search);
        console.log('🔍 CheckoutPage - Current URL params:', Object.fromEntries(urlParams));

        if (urlParams.get('partnerCode') === 'MOMO') {
            console.log('🎯 CheckoutPage - Detected MoMo callback, redirecting to PaymentSuccessPage');
            // Redirect đến PaymentSuccessPage nếu có callback từ MoMo
            const currentUrl = new URL(window.location);
            const successUrl = `/payment/success${currentUrl.search}`;
            console.log('🚀 CheckoutPage - Redirecting to:', successUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate(successUrl);
            return;
        }

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
    }, [location, user, navigate, dispatch]);

    // Tính tổng giá
    const calculateTotalPrice = () => {
        const subtotal = productDetails?.price * quantity || 0;
        const discountAmount = productDetails?.discountPercentage > 0
            ? subtotal * productDetails.discountPercentage / 100
            : 0;
        //const deliveryFee = paymentMethod === 'COD' ? 15000 : 0; // Miễn phí ship cho thanh toán online
        return subtotal - discountAmount;
    };

    // Xử lý lỗi thanh toán MoMo
    const handleMoMoPaymentError = (error) => {
        setPaymentError(error);
        setIsProcessingPayment(false);
    };

    // Xử lý đặt hàng COD
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

        // Nếu là thanh toán MoMo, không xử lý ở đây
        if (paymentMethod === 'MOMO') {
            return;
        }

        setIsProcessingPayment(true);
        setPaymentError('');

        try {
            const totalPrice = calculateTotalPrice();

            const orderData = {
                items: [{
                    product: productDetails._id,
                    quantity: quantity,
                    price: productDetails.price
                }],
                totalPrice,
                shippingAddress,
                paymentMethod: paymentMethod,
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
                setPaymentError(error?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
            }
        } finally {
            setIsProcessingPayment(false);
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
                                <p className="font-bold text-lg">{productDetails.price?.toLocaleString()}₫</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold mb-3">Order Summary</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{(productDetails.price * quantity).toLocaleString()}₫</span>
                                </div>
                                {productDetails.discountPercentage > 0 && (
                                    <div className="flex justify-between text-red-600">
                                        <span>Discount (-{productDetails.discountPercentage}%)</span>
                                        <span>-{Math.round(productDetails.price * quantity * productDetails.discountPercentage / 100).toLocaleString()}₫</span>
                                    </div>
                                )}
                                {/*
                                <hr />
                                {paymentMethod === 'COD' && (
                                    <div className="flex justify-between">
                                        <span>Phí giao hàng</span>
                                        <span>15,000₫</span>
                                    </div>
                                )}
                                {paymentMethod !== 'COD' && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Phí giao hàng</span>
                                        <span>Miễn phí</span>
                                    </div>
                                )}
                                <hr />
                                */}
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{calculateTotalPrice()?.toLocaleString()}₫</span>
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
                            <PaymentMethod
                                selectedMethod={paymentMethod}
                                onMethodChange={setPaymentMethod}
                                disabled={isProcessingPayment}
                            />
                        </div>

                        {/* Hiển thị lỗi thanh toán */}
                        {paymentError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                                {paymentError}
                            </div>
                        )}

                        {/* Form thanh toán MoMo */}
                        {paymentMethod === 'MOMO' && (
                            <div className="mb-6">
                                <MoMoPaymentForm
                                    amount={calculateTotalPrice()}
                                    orderInfo={`Thanh toán cho sản phẩm: ${productDetails.name}`}
                                    onError={handleMoMoPaymentError}
                                    disabled={isProcessingPayment || !shippingAddress.trim() || !phoneNumber.trim()}
                                    productDetails={productDetails}
                                    quantity={quantity}
                                    shippingAddress={shippingAddress}
                                />
                            </div>
                        )}

                        {/* Nút đặt hàng cho COD */}
                        {paymentMethod !== 'MOMO' && (
                            <Button
                                onClick={handleCreateOrder}
                                disabled={isProcessingPayment}
                                className="w-full bg-black text-white hover:bg-gray-800 py-3"
                            >
                                {isProcessingPayment ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    'Đặt hàng →'
                                )}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutPage;
