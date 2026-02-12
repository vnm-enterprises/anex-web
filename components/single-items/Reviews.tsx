"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string;
  };
}

interface AverageRating {
  average: number;
  count: number;
}

export default function Reviews({ propertyId }: { propertyId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<AverageRating | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const load = async () => {
      try {
        const [reviewsRes, avgRes] = await Promise.all([
          api.get(`/ratings/${propertyId}`),
          api.get(`/ratings/${propertyId}/average`),
        ]);

        setReviews(reviewsRes.data);
        setAverage(avgRes.data);
      } finally {
        setLoading(false);
      }

      try {
        const userRes = await api.get(`/ratings/${propertyId}/user`);
        setUserRating(userRes.data.rating || 0);
        setComment(userRes.data.comment || "");
      } catch {

      }
    };

    load();
  }, [propertyId]);


  const submitReview = async () => {
    if (!userRating) return;

    setSubmitting(true);
    try {
      await api.post(`/ratings/${propertyId}`, {
        rating: userRating,
        comment,
        propertyId
      });

      const [reviewsRes, avgRes] = await Promise.all([
        api.get(`/ratings/${propertyId}`),
        api.get(`/ratings/${propertyId}/average`),
      ]);

      setReviews(reviewsRes.data);
      setAverage(avgRes.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <section className="pt-12 border-t border-gray-100 ">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <Star className="text-yellow-500 fill-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900 ">
          {average?.average?.toFixed(1) ?? "No ratings"}
          {average && (
            <span className="text-gray-500 font-normal text-base ml-2">
              ({average.count} review{average.count !== 1 && "s"})
            </span>
          )}
        </h3>
      </div>

      {/* REVIEWS LIST */}
      <div className="space-y-4 mb-10">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-md p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={r.user.avatar || "/avatar-placeholder.jpg"}
                className="w-9 h-9 rounded-full object-cover"
                alt={r.user.name}
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {r.user.name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < r.rating
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            {r.comment && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {r.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ADD / UPDATE REVIEW */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-6">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
          {userRating ? "Update your review" : "Leave a review"}
        </h4>

        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setUserRating(i + 1)}
              className="focus:outline-none"
            >
              <Star
                size={22}
                className={
                  i < userRating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>

        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-3 text-sm bg-white dark:bg-gray-800 mb-4"
        />

        <button
          onClick={submitReview}
          disabled={submitting || !userRating}
          className="px-5 py-2.5 rounded-md bg-primary text-primary-content font-semibold disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </section>
  );
}
