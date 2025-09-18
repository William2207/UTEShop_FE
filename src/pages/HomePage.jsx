import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { addToCart } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/formatPrice';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { addingToCart } = useSelector((state) => state.cart);

    const handleClick = () => {
        navigate(`/products/${product._id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            navigate('/login');
            return;
        }

        try {
            await dispatch(addToCart({ 
                productId: product._id, 
                quantity: 1 
            })).unwrap();
            
            alert(`Đã thêm sản phẩm vào giỏ hàng!`);
        } catch (error) {
            alert(error || "Không thể thêm sản phẩm vào giỏ hàng");
        }
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
                        {formatPrice(discountedPrice)}
                    </span>
                    {product.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Đã bán: {product.soldCount || 0}</span>
                    <span>Lượt xem: {product.viewCount || 0}</span>
                </div>

                {/* Stock Status */}
                <div className="mt-2 mb-3">
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

                {/* Add to Cart Button */}
                {product.stock > 0 && (
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {addingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                    </button>
                )}
            </div>
        </div>
    );
};

const Section = ({ title, products, maxCols = 4, viewAllLink, sectionStyle, totalCount, showViewAll }) => {
    const navigate = useNavigate();

    const getGridCols = () => {
        switch(maxCols) {
            case 2: return 'grid-cols-1 md:grid-cols-2';
            case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
            case 4: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
            default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
        }
    };

    const getSectionBgColor = () => {
        switch(sectionStyle) {
            case 'newest': return 'bg-gradient-to-r from-blue-50 to-indigo-50';
            case 'bestselling': return 'bg-gradient-to-r from-green-50 to-emerald-50';
            case 'mostviewed': return 'bg-gradient-to-r from-purple-50 to-pink-50';
            case 'discount': return 'bg-gradient-to-r from-red-50 to-orange-50';
            default: return 'bg-gray-50';
        }
    };

    const getSectionTitleColor = () => {
        switch(sectionStyle) {
            case 'newest': return 'text-blue-700';
            case 'bestselling': return 'text-green-700';
            case 'mostviewed': return 'text-purple-700';
            case 'discount': return 'text-red-700';
            default: return 'text-gray-700';
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className={`rounded-xl p-6 ${getSectionBgColor()}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={`text-2xl font-bold ${getSectionTitleColor()}`}>
                        {title}
                    </h2>
                    {totalCount && (
                        <p className="text-sm text-gray-600 mt-1">
                            {totalCount} sản phẩm có sẵn
                        </p>
                    )}
                </div>
                {showViewAll && viewAllLink && (
                    <button
                        onClick={() => navigate(viewAllLink)}
                        className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm font-medium"
                    >
                        Xem tất cả
                    </button>
                )}
            </div>

            <div className={`grid ${getGridCols()} gap-4`}>
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

const HomePage = () => {
    const [blocks, setBlocks] = useState(null);
    const [totals, setTotals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get("/products/home-blocks");
                
                // Log để debug
                console.log("API Response:", res.data);
                console.log("Totals:", res.data.totals);
                
                setBlocks(res.data);
                setTotals(res.data.totals);
            } catch (err) {
                console.error("Lỗi khi lấy home blocks:", err);
                // Log chi tiết lỗi
                console.error("Error Details:", err.response?.data || err.message);
                setError(err.response?.data?.message || "Không thể tải dữ liệu sản phẩm");
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

    // Hiển thị thông báo nếu không có sản phẩm
    if (!blocks || Object.keys(blocks).length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600">Không có sản phẩm để hiển thị</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng đến với UTEShop</h1>
                <p className="text-gray-600">Khám phá những sản phẩm chất lượng nhất</p>
            </div>

            {/* Chỉ render section nếu có sản phẩm */}
            {blocks.newest && blocks.newest.length > 0 && (
                <Section 
                    title="Sản phẩm mới nhất" 
                    products={blocks.newest} 
                    maxCols={4}
                    viewAllLink="/new-arrivals"
                    sectionStyle="newest"
                    totalCount={totals?.newest}
                    showViewAll={true}
                />
            )}

            <div className="my-16"></div>

            {blocks.bestSelling && blocks.bestSelling.length > 0 && (
                <Section 
                    title="Sản phẩm bán chạy" 
                    products={blocks.bestSelling} 
                    maxCols={3}
                    viewAllLink="/products?sort=best-selling"
                    sectionStyle="bestselling"
                    totalCount={totals?.bestSelling}
                    showViewAll={true}
                />
            )}
            
            <div className="my-16"></div>
            
            {blocks.mostViewed && blocks.mostViewed.length > 0 && (
                <Section 
                    title="Sản phẩm xem nhiều" 
                    products={blocks.mostViewed} 
                    maxCols={4}
                    viewAllLink="/products?sort=most-viewed"
                    sectionStyle="mostviewed"
                    totalCount={totals?.mostViewed}
                    showViewAll={true}
                />
            )}
            
            <div className="my-16"></div>
            
            {blocks.topDiscount && blocks.topDiscount.length > 0 && (
                <Section 
                    title="Khuyến mãi cao nhất" 
                    products={blocks.topDiscount} 
                    maxCols={2}
                    viewAllLink="/products?sort=top-discount"
                    sectionStyle="discount"
                    totalCount={totals?.topDiscount}
                    showViewAll={true}
                />
            )}
        </div>
    );
};

export default HomePage;