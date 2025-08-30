import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [blocks, setBlocks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get("/products/home-blocks");
                setBlocks(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy home blocks:", err);
                setError("Không thể tải dữ liệu sản phẩm");
            } finally {
                setLoading(false);
            }
        };
        fetchBlocks();
    }, []);

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

    if (!blocks) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng đến với UTEShop</h1>
                <p className="text-gray-600">Khám phá những sản phẩm chất lượng nhất</p>
            </div>

            <Section
                title="🆕 Sản phẩm mới nhất"
                products={blocks.newest}
                maxCols={4}
            />
            <Section
                title="🔥 Sản phẩm bán chạy"
                products={blocks.bestSelling}
                maxCols={3}
            />
            <Section
                title="👁️ Sản phẩm xem nhiều"
                products={blocks.mostViewed}
                maxCols={4}
            />
            <Section
                title="🎉 Khuyến mãi cao nhất"
                products={blocks.topDiscount}
                maxCols={2}
            />
        </div>
    );
};

const Section = ({ title, products, maxCols = 4 }) => {
    if (!products || products.length === 0) return null;

    const gridCols = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        8: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
    };

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {products.length} sản phẩm
                </span>
            </div>
            <div className={`grid ${gridCols[maxCols]} gap-6`}>
                {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                ))}
            </div>
        </section>
    );
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Chỉ navigate, view count sẽ được tăng trong ProductDetailPage
        navigate(`/products/${product._id}`);
    };

    const originalPrice = product.price;
    const discountedPrice = product.discountPercentage > 0
        ? originalPrice * (1 - product.discountPercentage / 100)
        : originalPrice;

    return (
        <div
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onClick={handleClick}
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


export default HomePage;
