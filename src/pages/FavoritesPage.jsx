import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { getFavoritesAsync, toggleFavoriteAsync } from '../features/favorites/favoriteSlice';
import { formatPrice } from '../utils/formatPrice';

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items, loading, error } = useSelector(state => state.favorites);

    useEffect(() => {
        if (user) {
            dispatch(getFavoritesAsync({ page: 1, limit: 20 }));
        }
    }, [dispatch, user]);

    const handleRemoveFavorite = async (productId) => {
        try {
            await dispatch(toggleFavoriteAsync(productId)).unwrap();
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-2xl font-semibold mb-2">Vui lòng đăng nhập</h2>
                    <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem sản phẩm yêu thích</p>
                    <Link
                        to="/login"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Sản phẩm yêu thích</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-48 mb-3"></div>
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
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">
                    <p>Có lỗi xảy ra: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Sản phẩm yêu thích</h1>
                <span className="text-gray-600">{items.length} sản phẩm</span>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h2 className="text-xl font-semibold mb-2">Chưa có sản phẩm yêu thích</h2>
                    <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào danh sách yêu thích của bạn</p>
                    <Link
                        to="/products"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Xem sản phẩm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((product) => (
                        <div key={product._id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                            <Link to={`/product/${product._id}`} className="block">
                                <div className="aspect-square overflow-hidden rounded-t-lg">
                                    <img
                                        src={product.images?.[0] || '/placeholder-product.jpg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-sm line-clamp-2 mb-2">
                                        {product.name}
                                    </h3>
                                    <div className="space-y-1">
                                        <div className="text-lg font-bold text-red-600">
                                            {formatPrice(product.price)}
                                        </div>
                                        {product.discountPercentage > 0 && (
                                            <div className="text-xs text-gray-500 line-through">
                                                {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            {product.soldCount} đã bán
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Remove from favorites button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveFavorite(product._id);
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Bỏ yêu thích"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
