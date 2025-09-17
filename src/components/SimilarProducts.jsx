import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSimilarProducts } from '../api/similarProductApi';
import FavoriteButton from './FavoriteButton';
import { formatPrice } from '../utils/formatPrice';
import { ShoppingCart } from 'lucide-react';

const SimilarProducts = ({ productId, limit = 8 }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                setLoading(true);
                const response = await getSimilarProducts(productId, limit);
                setSimilarProducts(response.similarProducts || []);
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchSimilarProducts();
        }
    }, [productId, limit]);

    if (loading) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Sản phẩm tương tự</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Không thể tải sản phẩm tương tự
            </div>
        );
    }

    if (similarProducts.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Sản phẩm tương tự</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((product) => (
                    <div key={product._id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="aspect-square overflow-hidden rounded-t-lg">
                            <img
                                src={product.images?.[0] || '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <div className="p-3">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                                {product.name}
                            </h4>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="text-lg font-bold text-red-600">
                                        {formatPrice(product.price)}
                                    </div>
                                    {product.discountPercentage > 0 && (
                                        <div className="text-xs text-gray-500 line-through">
                                            {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {product.soldCount} đã bán
                                </div>
                            </div>

                            {/* Stock Status and Favorite */}
                            <div className="mt-2 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                                </div>
                                <FavoriteButton productId={product._id} size="small" />
                            </div>

                            {/* Buy Button */}
                            <div className="mt-2">
                                <Link
                                    to={`/products/${product._id}`}
                                    className="w-full bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 text-xs"
                                >
                                    <ShoppingCart className="w-3 h-3" />
                                    Xem chi tiết
                                </Link>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
