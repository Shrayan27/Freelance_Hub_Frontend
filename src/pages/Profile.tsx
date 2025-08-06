import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { User, Edit, Save, X, Plus, Star, Package, Trash2 } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Gig } from "../types";
import toast from "react-hot-toast";

interface ProfileFormData {
  username: string;
  email: string;
  country: string;
  phone?: string;
  desc?: string;
}

const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userGigs, setUserGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username,
        email: currentUser.email,
        country: currentUser.country,
        phone: currentUser.phone || "",
        desc: currentUser.desc || "",
      });
    }
    if (currentUser?.isSeller) {
      fetchUserGigs();
    } else {
      setLoading(false);
    }
  }, [currentUser, reset]);

  const fetchUserGigs = async () => {
    try {
      const response = await api.get("/gigs/user");
      setUserGigs(response.data);
    } catch (error) {
      console.error("Error fetching user gigs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      await api.put("/users", data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleDeleteGig = async (gigId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await api.delete(`/gigs/${gigId}`);
      toast.success("Service deleted successfully!");
      fetchUserGigs(); // Refresh the gigs list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and services</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {isEditing ? <X size={16} /> : <Edit size={16} />}
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    {currentUser?.img ? (
                      <img
                        src={currentUser.img}
                        alt={currentUser.username}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentUser?.username}
                    </h3>
                    <p className="text-gray-600">
                      {currentUser?.isSeller ? "Seller" : "Buyer"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      {...register("username", {
                        required: "Username is required",
                        minLength: {
                          value: 3,
                          message: "Username must be at least 3 characters",
                        },
                      })}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      {...register("country", {
                        required: "Country is required",
                      })}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      disabled={!isEditing}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register("desc")}
                    rows={4}
                    disabled={!isEditing}
                    className="input-field disabled:bg-gray-100"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full btn-outline text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Logout
                </button>
              </div>
            </div>

            {currentUser?.isSeller && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seller Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Gigs</span>
                    <span className="font-semibold">{userGigs.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">
                      {userGigs.reduce((sum, gig) => sum + gig.sales, 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {userGigs.length > 0
                          ? (
                              userGigs.reduce(
                                (sum, gig) => sum + gig.starNumber,
                                0
                              ) / userGigs.length
                            ).toFixed(1)
                          : "0.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User's Gigs (for sellers) */}
        {currentUser?.isSeller && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Services</h2>
              <Link
                to="/add-gig"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add New Service</span>
              </Link>
            </div>

            {userGigs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first service to start earning
                </p>
                <Link to="/add-gig" className="btn-primary">
                  Create Your First Service
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGigs.map((gig) => (
                  <div key={gig._id} className="card card-hover relative group">
                    <img
                      src={gig.cover}
                      alt={gig.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                          {gig.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {gig.starNumber}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {gig.shortTitle}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {gig.shortDesc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${gig.price}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {gig.sales} sales
                          </span>
                        </div>
                      </div>

                      {/* Edit and Delete buttons */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <Link
                            to={`/edit-gig/${gig._id}`}
                            className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDeleteGig(gig._id)}
                            className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
