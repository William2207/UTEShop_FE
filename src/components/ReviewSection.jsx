import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, MessageCircle, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import {
    getProductReviewsAsync,
    getUserReviewAsync,
    createReviewAsync,
    updateReviewAsync,
    deleteReviewAsync
} from '../features/reviews/reviewSlice';

const ReviewSection = ({ productId, autoOpenReview = false, orderId = null, onReviewChange = null, onOrderReviewed = null }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { reviews, userReview, stats, loading, error } = useSelector(state => state.reviews);

    const [showReviewForm, setShowReviewForm] = useState(autoOpenReview);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(orderId);

    useEffect(() => {
        if (productId) {
            dispatch(getProductReviewsAsync({ productId }));
            if (user) {
                dispatch(getUserReviewAsync(productId));
            }
        }
    }, [dispatch, productId, user]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Vui lòng đăng nhập để đánh giá sản phẩm');
            return;
        }

        try {
            if (editingReview) {
                await dispatch(updateReviewAsync({
                    reviewId: editingReview._id,
                    reviewData: { rating, comment }
                })).unwrap();
                setEditingReview(null);
            } else {
                await dispatch(createReviewAsync({
                    productId,
                    reviewData: {
                        rating,
                        comment,
                        ...(currentOrderId && { orderId: currentOrderId })
                    }
                })).unwrap();
            }

            setShowReviewForm(false);
            setComment('');
            setRating(5);

            // Notify parent components about successful review
            if (onReviewChange) {
                onReviewChange();
            }

            // Notify order tracking that this order has been reviewed
            if (orderId && onOrderReviewed) {
                onOrderReviewed(orderId);
            }

            // Reload reviews để cập nhật stats
            console.log('🔄 Reloading reviews after creating review');
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            // Hiển thị thông báo lỗi cho user
            const errorMessage = error || 'Có lỗi xảy ra khi gửi đánh giá';

            // Kiểm tra nếu là lỗi về việc chưa mua hàng
            if (errorMessage.includes('mua và nhận hàng')) {
                alert('❌ ' + errorMessage + '\n\n💡 Bạn cần mua sản phẩm này và nhận hàng thành công trước khi có thể đánh giá.');
            } else {
                alert('❌ ' + errorMessage);
            }
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setComment(review.comment || '');
        setShowReviewForm(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                await dispatch(deleteReviewAsync(reviewId)).unwrap();
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('❌ Có lỗi xảy ra khi xóa đánh giá');
            }
        }
    };

    const renderStars = (rating, interactive = false, onRatingChange = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${star <= rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Review Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>
                    {user && !userReview && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Viết đánh giá
                        </button>
                    )}
                    {!user && (
                        <div className="text-sm text-gray-500">
                            <span>Vui lòng </span>
                            <a href="/login" className="text-blue-500 hover:underline">đăng nhập</a>
                            <span> để đánh giá</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-500">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center">
                            {renderStars(Math.round(stats.averageRating))}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            {stats.totalReviews} đánh giá
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.ratingDistribution[star] || 0;
                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-3">{star}</span>
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="w-8 text-gray-600">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold mb-4">
                        {editingReview ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
                    </h4>
                    {!editingReview && (
                        <div className="space-y-3 mb-4">
                            {currentOrderId && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <p className="text-sm text-green-800">
                                            <strong>Đã xác thực:</strong> Bạn đã mua và nhận hàng thành công. Có thể đánh giá sản phẩm này.
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">!</span>
                                    </div>
                                    <p className="text-sm text-yellow-800">
                                        <strong>Lưu ý:</strong> Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Đánh giá</label>
                            {renderStars(rating, true, setRating)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Bình luận</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="4"
                                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                                maxLength="500"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                                {comment.length}/500 ký tự
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setEditingReview(null);
                                    setComment('');
                                    setRating(5);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review._id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    {review.user.avatarUrl ? (
                                        <img
                                            src={review.user.avatarUrl}
                                            alt={review.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600 font-medium">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">{review.user.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            </div>

                            {user && user._id === review.user._id && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditReview(review)}
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="Chỉnh sửa"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review._id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Xóa"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            {renderStars(review.rating)}
                        </div>

                        {review.comment && (
                            <p className="text-gray-700">{review.comment}</p>
                        )}
                    </div>
                ))}

                {reviews.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>Chưa có đánh giá nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
