import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Upload, X, Plus, Save } from "lucide-react";
import api from "../utils/api";
import { CreateGigData } from "../types";
import toast from "react-hot-toast";

const EditGig: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGig, setIsLoadingGig] = useState(true);
  const [coverImage, setCoverImage] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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

  // Load existing gig data
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.get(`/gigs/single/${id}`);
        const gig = response.data;

        // Set form values
        setValue("title", gig.title);
        setValue("shortTitle", gig.shortTitle);
        setValue("shortDesc", gig.shortDesc);
        setValue("desc", gig.desc);
        setValue("category", gig.category);
        setValue("price", gig.price);
        setValue("deliveryTime", gig.deliveryTime);
        setValue("revisionNumber", gig.revisionNumber);

        // Set images
        setCoverImage(gig.cover);
        setAdditionalImages(gig.images || []);

        // Set features
        setFeatures(
          gig.features && gig.features.length > 0 ? gig.features : [""]
        );
      } catch (error) {
        console.error("Error fetching gig:", error);
        toast.error("Failed to load gig data");
      } finally {
        setIsLoadingGig(false);
      }
    };

    if (id) {
      fetchGig();
    }
  }, [id, setValue]);

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

      await api.put(`/gigs/${id}`, gigData);
      toast.success("Gig updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update gig");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingGig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Service
          </h1>
          <p className="text-gray-600">Update your service details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="input-field"
                  placeholder="e.g., I will create a professional website"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Title *
                </label>
                <input
                  type="text"
                  {...register("shortTitle", {
                    required: "Short title is required",
                  })}
                  className="input-field"
                  placeholder="e.g., Professional Website"
                />
                {errors.shortTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shortTitle.message}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
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
                    min: { value: 1, message: "Price must be at least $1" },
                  })}
                  className="input-field"
                  placeholder="e.g., 50"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                {...register("shortDesc", {
                  required: "Short description is required",
                })}
                rows={3}
                className="input-field"
                placeholder="Brief description of your service..."
              />
              {errors.shortDesc && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shortDesc.message}
                </p>
              )}
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Detailed Description
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                {...register("desc", { required: "Description is required" })}
                rows={8}
                className="input-field"
                placeholder="Detailed description of what you offer..."
              />
              {errors.desc && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.desc.message}
                </p>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
                  placeholder="e.g., 7"
                />
                {errors.deliveryTime && (
                  <p className="text-red-500 text-sm mt-1">
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
                    required: "Revision number is required",
                    min: {
                      value: 0,
                      message: "Revision number must be at least 0",
                    },
                  })}
                  className="input-field"
                  placeholder="e.g., 2"
                />
                {errors.revisionNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.revisionNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                        Upload Cover Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "cover");
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, "additional")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 inline-flex items-center space-x-2">
                <Plus size={16} />
                <span>Add More Images</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "additional");
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Features
            </h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 input-field"
                    placeholder="Add a feature..."
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
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
              className="btn-primary flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isLoading ? "Updating..." : "Update Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGig;
