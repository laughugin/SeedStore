import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  createReview, 
  updateReview, 
  deleteReview, 
  getReviews 
} from '../services/api';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewSectionProps {
  productId: number;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await getReviews(productId);
      setReviews(data as Review[]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createReview({
        product_id: productId,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>

      {/* Review form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label className="block mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              className="border p-2"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} stars
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="border p-2 w-full"
              rows={4}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
              {user && user.id === Number(review.user_id) && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Удалить
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Posted on {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection; 