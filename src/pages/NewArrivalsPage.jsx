import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const NewArrivalsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                setLoading(true);
                setError(null);

                // Lấy tất cả sản phẩm mới nhất (không giới hạn 8)
                const res = await axios.get("/products?sort=newest&limit=50");
                setProducts(res.data.items || []);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm mới:", err);
                setError("Không thể tải sản phẩm mới nhất");
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">NEW ARRIVALS</h1>
                <p className="text-gray-600 text-lg">Khám phá những sản phẩm mới nhất của chúng tôi</p>
                <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => handleProductClick(product._id)}
                    />
                ))}
            </div>

            {/* Back Button */}
            <div className="text-center mt-12">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                    ← Quay về trang chủ
                </button>
            </div>
        </div>
    );
};

const ProductCard = ({ product, onClick }) => {
    const originalPrice = product.price;
    const discountedPrice = product.discountPercentage > 0
        ? originalPrice * (1 - product.discountPercentage / 100)
        : originalPrice;

    return (
        <div
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={onClick}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden">
                <img
                    src={product.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.discountPercentage}%
                    </div>
                )}

                {/* Brand Badge */}
                {product.brand && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.brand.name}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-red-600">
                        {discountedPrice.toLocaleString()}₫
                    </span>
                    {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            {originalPrice.toLocaleString()}₫
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Đã bán: {product.soldCount || 0}</span>
                    <span>Lượt xem: {product.viewCount || 0}</span>
                </div>

                {/* Stock Status */}
                <div className="mt-2">
                    {product.stock > 0 ? (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Còn {product.stock} sản phẩm
                        </span>
                    ) : (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                            Hết hàng
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewArrivalsPage;
