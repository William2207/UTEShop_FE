import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const viewCountCalled = useRef(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                // Reset view count flag when ID changes
                viewCountCalled.current = false;

                // Lấy thông tin sản phẩm
                const productRes = await axios.get(`/products/${id}`);
                setProduct(productRes.data);

                // Tăng view count chỉ một lần
                if (!viewCountCalled.current) {
                    viewCountCalled.current = true;
                    axios.post(`/products/${id}/view`).catch(err =>
                        console.error("Lỗi khi tăng view:", err)
                    );
                }
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
                setError("Không thể tải thông tin sản phẩm");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error || "Sản phẩm không tồn tại"}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    const originalPrice = product.price;
    const discountedPrice = product.discountPercentage > 0
        ? originalPrice * (1 - product.discountPercentage / 100)
        : originalPrice;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-lg border">
                        <img
                            src={product.images?.[selectedImage] || "https://via.placeholder.com/500x500?text=No+Image"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index
                                        ? 'border-blue-500'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {product.name}
                        </h1>
                        <div className="flex gap-2 mb-4">
                            {product.category && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                    {product.category.name}
                                </span>
                            )}
                            {product.brand && (
                                <span className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                                    {product.brand.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-red-600">
                                {discountedPrice.toLocaleString()}₫
                            </span>
                            {product.discountPercentage > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">
                                        {originalPrice.toLocaleString()}₫
                                    </span>
                                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                                        -{product.discountPercentage}%
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span>Đã bán: {product.soldCount || 0}</span>
                        <span>Lượt xem: {product.viewCount || 0}</span>
                        <span>Còn lại: {product.stock} sản phẩm</span>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {product.description}
                        </p>

                        {/* Brand Info */}
                        {product.brand && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <span>Thương hiệu:</span>
                                    <span className="text-purple-600">{product.brand.name}</span>
                                    {product.brand.country && (
                                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                            {product.brand.country}
                                        </span>
                                    )}
                                </h4>
                                {product.brand.description && (
                                    <p className="text-sm text-gray-600">
                                        {product.brand.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quantity and Add to Cart */}
                    {product.stock > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="font-medium">Số lượng:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        min="1"
                                        max={product.stock}
                                        className="w-16 text-center border-x border-gray-300 py-2"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="px-3 py-2 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-red-600 font-semibold">Sản phẩm đã hết hàng</p>
                        </div>
                    )}

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
