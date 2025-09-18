import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import MoMoPaymentForm from '../components/MoMoPaymentForm';

const PaymentTestPage = () => {
    const [amount, setAmount] = useState(100000);
    const [orderInfo, setOrderInfo] = useState('Test payment for UTEShop');
    const [result, setResult] = useState('');

    const handlePaymentSuccess = (orderId, requestId) => {
        setResult(`✅ Thanh toán thành công!\nOrder ID: ${orderId}\nRequest ID: ${requestId}`);
    };

    const handlePaymentError = (error) => {
        setResult(`❌ Lỗi thanh toán: ${error}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Test Thanh Toán MoMo
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form nhập liệu */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Số tiền (VND)</label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Nhập số tiền"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Nội dung thanh toán</label>
                            <Input
                                type="text"
                                value={orderInfo}
                                onChange={(e) => setOrderInfo(e.target.value)}
                                placeholder="Nhập nội dung thanh toán"
                            />
                        </div>

                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-sm text-yellow-800">
                                ⚠️ <strong>Lưu ý:</strong> Đây là trang test.
                                Đảm bảo đã cấu hình đúng thông tin MoMo trong backend.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Form thanh toán */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Thanh toán MoMo</h2>

                    <MoMoPaymentForm
                        amount={amount}
                        orderInfo={orderInfo}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                    />
                </Card>
            </div>

            {/* Kết quả */}
            {result && (
                <Card className="mt-8 p-6">
                    <h3 className="text-lg font-bold mb-4">Kết quả</h3>
                    <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
                        {result}
                    </pre>
                </Card>
            )}

            {/* Hướng dẫn */}
            <Card className="mt-8 p-6">
                <h3 className="text-lg font-bold mb-4">Hướng dẫn test</h3>
                <div className="space-y-2 text-sm">
                    <p>1. Đảm bảo backend đang chạy với cấu hình MoMo đúng</p>
                    <p>2. Nhập số tiền và nội dung thanh toán</p>
                    <p>3. Click "Thanh toán với MoMo"</p>
                    <p>4. Cửa sổ MoMo sẽ mở (hoặc hiển thị QR code)</p>
                    <p>5. Thực hiện thanh toán test</p>
                    <p>6. Kiểm tra kết quả ở phía dưới</p>
                </div>
            </Card>
        </div>
    );
};

export default PaymentTestPage;
