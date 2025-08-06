import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  RefreshCw,
  Check,
  User,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Gig as GigType, Review, User as UserType } from "../types";
import toast from "react-hot-toast";
import PaymentModal from "../components/PaymentModal";

const Gig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [gig, setGig] = useState<GigType | null>(null);
  const [seller, setSeller] = useState<UserType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "reviews">(
    "overview"
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const [gigResponse, reviewsResponse] = await Promise.all([
          api.get(`/gigs/single/${id}`),
          api.get(`/reviews/${id}`),
        ]);

        setGig(gigResponse.data);
        setReviews(reviewsResponse.data);

        if (gigResponse.data.userId) {
          try {
            const sellerResponse = await api.get(
              `/users/${gigResponse.data.userId}`
            );
            setSeller(sellerResponse.data);
          } catch (error) {
            console.error("Error fetching seller details:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching gig details:", error);
        toast.error("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGigDetails();
    }
  }, [id]);

  const handlePurchase = () => {
    if (!currentUser) {
      toast.error("Please login to purchase this service");
      return;
    }

    setShowPaymentModal(true);
  };

  const handleContact = () => {
    if (!currentUser) {
      toast.error("Please login to contact the seller");
      return;
    }

    // Navigate to messages page or create conversation
    window.location.href = `/messages?gigId=${id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gig not found
          </h2>
          <p className="text-gray-600 mb-4">
            The gig you're looking for doesn't exist.
          </p>
          <Link to="/gigs" className="btn-primary">
            Browse Other Services
          </Link>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.star, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gig Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <img
                src={gig.cover}
                alt={gig.title}
                className="w-full h-96 object-cover rounded-t-lg"
              />
              {gig.images && gig.images.length > 0 && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    More Images
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    {gig.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${gig.title} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gig Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {gig.shortTitle}
                </h1>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              {seller && (
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {seller.img ? (
                      <img
                        src={seller.img}
                        alt={seller.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {seller.username}
                    </h3>
                    <p className="text-gray-600 text-sm">{seller.country}</p>
                  </div>
                  <button
                    onClick={handleContact}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <MessageSquare size={16} />
                    <span>Contact</span>
                  </button>
                </div>
              )}

              {/* Gig Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {gig.deliveryTime} days delivery
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {gig.revisionNumber} revisions
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">{gig.sales} sales</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "overview"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "reviews"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    About this gig
                  </h3>
                  <div className="prose max-w-none text-gray-600 mb-6">
                    {gig.desc.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {gig.features && gig.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        What's included
                      </h4>
                      <ul className="space-y-2">
                        {gig.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Reviews
                  </h3>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this service!
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border-b border-gray-200 pb-6 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <User size={16} />
                              </div>
                              <span className="font-medium text-gray-900">
                                User
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.star
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${gig.price}
                </span>
                <span className="text-gray-600"> one-time</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery time</span>
                  <span className="font-medium">{gig.deliveryTime} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revisions</span>
                  <span className="font-medium">{gig.revisionNumber}</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                className="w-full btn-primary flex items-center space-x-2 mb-4"
              >
                <ShoppingCart size={16} />
                <span>Continue to Order</span>
              </button>

              <button
                onClick={handleContact}
                className="w-full btn-outline flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        gigId={id!}
        amount={gig.price}
        gigTitle={gig.shortTitle}
      />
    </div>
  );
};

export default Gig;
