import React, { useState, useEffect, lazy, Suspense } from "react";
import { ChevronDownIcon, MapPin, Share, FileText } from "lucide-react";
import GoogleMap from "./GoogleMap";

interface Step1Props {
  onDataChange: (data: any) => void;
  savedData?: any;
}

// Configuration-driven category system
const categoryConfig = [
  {
    id: "location",
    name: "Location Check",
    icon: MapPin,
    subCategories: [
      {
        id: "stay_specific_time",
        name: "Stay for specific time",
        component: "LocationTimeSelector",
        props: {
          requiredTime: 30, // Minutes
          radius: 100, // Meters
        },
      },
    ],
  },
  {
    id: "social",
    name: "Social Media",
    icon: Share,
    subCategories: [
      {
        id: "like_post",
        name: "Like our post",
        component: "SocialLikeSelector",
        props: {
          platforms: ["facebook", "instagram", "twitter"],
        },
      },
    ],
  },
  {
    id: "content",
    name: "Content Consumption",
    icon: FileText,
    subCategories: [
      {
        id: "watch_video",
        name: "Watch product video",
        component: "ContentVideoSelector",
        props: {
          minWatchTime: 60, // Seconds
        },
      },
    ],
  },
];

// Component registry for dynamic loading
const componentRegistry = {
  LocationTimeSelector: lazy(() => import("./LocationTimeSelector")),
  SocialLikeSelector: lazy(() => import("./SocialLikeSelector")),
  ContentVideoSelector: lazy(() => import("./ContentVideoSelector")),
};

const Step1: React.FC<Step1Props> = ({ onDataChange, savedData }) => {
  const [formData, setFormData] = useState(
    savedData || {
      campaignTitle: "",
      category: "",
      subCategory: "",
      location: null,
      description: "",
    }
  );

  // Selected category and subcategory objects for dynamic component rendering
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

  // Type-safe subcategory mapping
  const renderSubCategoryOptions = () => {
    if (!selectedCategory?.subCategories) return null;

    return selectedCategory.subCategories.map((subCat: any) => (
      <option key={subCat.id} value={subCat.id}>
        {subCat.name}
      </option>
    ));
  };

  // Form verilerini parent componente ilet
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      onDataChange(formData);
    }
  }, [formData]); // onDataChange'i dependency'den çıkardık

  const handleInputChange = (
    field: string,
    value: any,
    additionalUpdates?: Record<string, any>
  ) => {
    const newData = {
      ...formData,
      [field]: value,
      ...(additionalUpdates || {}),
    };
    setFormData(newData);
  };

  // Seçili subcategory'ye göre component'i render et
  const renderSubCategoryComponent = () => {
    if (!selectedSubCategory) return null;

    const Component =
      componentRegistry[
        selectedSubCategory.component as keyof typeof componentRegistry
      ];

    if (!Component) {
      return (
        <div className="text-red-500">
          Component not found: {selectedSubCategory.component}
        </div>
      );
    }

    return (
      <Suspense
        fallback={<div className="text-gray-500">Loading component...</div>}
      >
        <Component
          {...selectedSubCategory.props}
          onDataChange={(data: any) => {
            // Subcategory specific data
            handleInputChange("subCategoryData", data);
          }}
        />
      </Suspense>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Campaign Details
        </h3>

        {/* Campaign Title */}
        <div className="mb-4">
          <label
            htmlFor="campaignTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Campaign Title
          </label>
          <input
            type="text"
            id="campaignTitle"
            value={formData.campaignTitle}
            onChange={(e) => handleInputChange("campaignTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter campaign title"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              value={formData.category}
              onChange={(e) => {
                const category = categoryConfig.find(
                  (c) => c.id === e.target.value
                );
                setSelectedCategory(category || null);
                setSelectedSubCategory(null);
                handleInputChange("category", e.target.value, {
                  subCategory: "",
                  subCategoryData: null,
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
              required
            >
              <option value="">Select a category</option>
              {categoryConfig.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* SubCategory */}
        {selectedCategory && (
          <div className="mb-4">
            <label
              htmlFor="subCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              SubCategory
            </label>
            <div className="relative">
              <select
                id="subCategory"
                value={formData.subCategory}
                onChange={(e) => {
                  const subCat = selectedCategory.subCategories.find(
                    (s: any) => s.id === e.target.value
                  );
                  setSelectedSubCategory(subCat || null);
                  handleInputChange("subCategory", e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
                required
              >
                <option value="">Select a subcategory</option>
                {renderSubCategoryOptions()}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Dynamic Component Rendering */}
        {renderSubCategoryComponent()}

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Describe your campaign requirements and instructions for participants"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
