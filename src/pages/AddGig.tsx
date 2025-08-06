import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Upload, X, Plus } from "lucide-react";
import api from "../utils/api";
import { CreateGigData } from "../types";
import toast from "react-hot-toast";

const AddGig: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateGigData>();

  const categories = [
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Design",
    "Writing",
    "Marketing",
    "Video & Animation",
    "Music & Audio",
    "Programming",
    "Business",
    "Lifestyle",
  ];

  const handleImageUpload = async (
    file: File,
    type: "cover" | "additional"
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData);
      const imageUrl = response.data.url;

      if (type === "cover") {
        setCoverImage(imageUrl);
      } else {
        setAdditionalImages([...additionalImages, imageUrl]);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const removeImage = (index: number, type: "cover" | "additional") => {
    if (type === "cover") {
      setCoverImage("");
    } else {
      setAdditionalImages(additionalImages.filter((_, i) => i !== index));
    }
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const onSubmit = async (data: CreateGigData) => {
    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsLoading(true);
    try {
      const gigData = {
        ...data,
        cover: coverImage,
        images: additionalImages,
        features: features.filter((f) => f.trim() !== ""),
      };

      await api.post("/gigs", gigData);
      toast.success("Gig created successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create a New Gig
            </h1>
            <p className="text-gray-600">
              Showcase your skills and start earning
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 10,
                        message: "Title must be at least 10 characters",
                      },
                    })}
                    className="input-field"
                    placeholder="e.g., I will create a professional website"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Title *
                  </label>
                  <input
                    type="text"
                    {...register("shortTitle", {
                      required: "Short title is required",
                      maxLength: {
                        value: 60,
                        message: "Short title must be less than 60 characters",
                      },
                    })}
                    className="input-field"
                    placeholder="Professional Website Design"
                  />
                  {errors.shortTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shortTitle.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      min: {
                        value: 5,
                        message: "Price must be at least $5",
                      },
                    })}
                    className="input-field"
                    placeholder="50"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  {...register("shortDesc", {
                    required: "Short description is required",
                    maxLength: {
                      value: 200,
                      message:
                        "Short description must be less than 200 characters",
                    },
                  })}
                  rows={3}
                  className="input-field"
                  placeholder="Brief description of your service"
                />
                {errors.shortDesc && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shortDesc.message}
                  </p>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Detailed Description
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  {...register("desc", {
                    required: "Description is required",
                    minLength: {
                      value: 100,
                      message: "Description must be at least 100 characters",
                    },
                  })}
                  rows={8}
                  className="input-field"
                  placeholder="Describe your service in detail..."
                />
                {errors.desc && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.desc.message}
                  </p>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Service Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time (days) *
                  </label>
                  <input
                    type="number"
                    {...register("deliveryTime", {
                      required: "Delivery time is required",
                      min: {
                        value: 1,
                        message: "Delivery time must be at least 1 day",
                      },
                    })}
                    className="input-field"
                    placeholder="3"
                  />
                  {errors.deliveryTime && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.deliveryTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Revisions *
                  </label>
                  <input
                    type="number"
                    {...register("revisionNumber", {
                      required: "Number of revisions is required",
                      min: {
                        value: 0,
                        message: "Revisions must be 0 or more",
                      },
                    })}
                    className="input-field"
                    placeholder="2"
                  />
                  {errors.revisionNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.revisionNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Images</h2>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image *
                </label>
                {coverImage ? (
                  <div className="relative">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(0, "cover")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "cover");
                      }}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="cursor-pointer text-primary-600 hover:text-primary-700"
                    >
                      Upload cover image
                    </label>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, "additional")}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {additionalImages.length < 4 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "additional");
                        }}
                        className="hidden"
                        id="additional-upload"
                      />
                      <label
                        htmlFor="additional-upload"
                        className="cursor-pointer text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Add image
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                What's Included
              </h2>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 input-field"
                      placeholder="e.g., Source files included"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Plus size={16} />
                  <span>Add feature</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Creating..." : "Create Gig"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGig;
