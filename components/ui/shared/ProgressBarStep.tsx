import { CheckIcon } from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Share,
} from "lucide-react";
import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import ProofSchema from "@/components/ui/advertiser/create/ProofSchema";

// Yardımcı fonksiyon: Tailwind sınıflarını birleştirmek için
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const componentRegistry: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  LocationTimeSelector: lazy(
    () => import("@/components/ui/advertiser/create/LocationTimeSelector")
  ),
  SocialLikeSelector: lazy(
    () => import("@/components/ui/advertiser/create/SocialLikeSelector")
  ),
  ContentVideoSelector: lazy(
    () => import("@/components/ui/advertiser/create/ContentVideoSelector")
  ),
};

type ComponentRegistryKey = keyof typeof componentRegistry;

interface SubCategoryConfig {
  id: string;
  name: string;
  component: ComponentRegistryKey;
  props: Record<string, any>;
}

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  subCategories: SubCategoryConfig[];
}

type BasicInfoFormValues = {
  campaignTitle: string;
  category: string;
  subCategory: string;
  description: string;
  location?: any;
  subCategoryData?: any;
};

const categoryConfig: CategoryConfig[] = [
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
          requiredTime: 30,
          radius: 100,
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
          minWatchTime: 60,
        },
      },
    ],
  },
];

// Step Content Component - Değerleri saklar ve contract/veritabanına iletir
interface StepContentProps {
  step: any;
  stepIndex: number;
  onDataChange: (data: any) => void;
  savedData?: any;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  stepIndex,
  onDataChange,
  savedData,
}) => {
  const [formData, setFormData] = useState(savedData || {});
  const {
    register: registerBasicInfo,
    setValue: setBasicInfoValue,
    watch: watchBasicInfo,
  } = useForm<BasicInfoFormValues>({
    defaultValues: {
      campaignTitle: savedData?.campaignTitle ?? "",
      category: savedData?.category ?? "",
      subCategory: savedData?.subCategory ?? "",
      description: savedData?.description ?? "",
      location: savedData?.location ?? null,
      subCategoryData: savedData?.subCategoryData ?? null,
    },
    mode: "onChange",
  });

  const categoryValue = watchBasicInfo("category");
  const subCategoryValue = watchBasicInfo("subCategory");

  const selectedCategory = useMemo(() => {
    if (stepIndex !== 0) {
      return null;
    }
    if (!categoryValue) {
      return null;
    }
    return (
      categoryConfig.find((category) => category.id === categoryValue) || null
    );
  }, [categoryValue, stepIndex]);

  const selectedSubCategory = useMemo(() => {
    if (!selectedCategory || stepIndex !== 0) {
      return null;
    }
    if (!subCategoryValue) {
      return null;
    }
    return (
      selectedCategory.subCategories.find(
        (subCategory) => subCategory.id === subCategoryValue
      ) || null
    );
  }, [selectedCategory, subCategoryValue, stepIndex]);

  useEffect(() => {
    if (stepIndex !== 0) {
      return;
    }
    setFormData(watchBasicInfo());
    const subscription = watchBasicInfo((values) => {
      setFormData(values);
    });
    return () => subscription.unsubscribe();
  }, [stepIndex, watchBasicInfo]);

  // Form verilerini parent componente ilet
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      onDataChange(formData);
    }
  }, [formData]); // onDataChange'i dependency'den çıkardık

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

  const renderSubCategoryComponent = () => {
    if (!selectedSubCategory) {
      return null;
    }

    const Component = componentRegistry[selectedSubCategory.component];

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
            setBasicInfoValue("subCategoryData", data);
          }}
        />
      </Suspense>
    );
  };

  // Step'e göre farklı form alanları render et
  const renderStepForm = () => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Campaign Details
              </h3>

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
                  placeholder="Enter campaign title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  {...registerBasicInfo("campaignTitle", { required: true })}
                />
              </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
                    {...registerBasicInfo("category", {
                      onChange: (event) => {
                        const value = event.target.value;
                        setBasicInfoValue("category", value);
                        setBasicInfoValue("subCategory", "");
                        setBasicInfoValue("subCategoryData", null);
                      },
                    })}
                  >
                    <option value="">Select a category</option>
                    {categoryConfig.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
                      {...registerBasicInfo("subCategory", {
                        onChange: (event) => {
                          const value = event.target.value;
                          setBasicInfoValue("subCategory", value);

                          if (!value) {
                            setBasicInfoValue("subCategoryData", null);
                            return;
                          }

                          const matchingSubCategory =
                            selectedCategory.subCategories.find(
                              (subCategory) => subCategory.id === value
                            );

                          if (!matchingSubCategory) {
                            setBasicInfoValue("subCategoryData", null);
                          }
                        },
                      })}
                    >
                      <option value="">Select a subcategory</option>
                      {selectedCategory.subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {renderSubCategoryComponent()}

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Describe your campaign requirements and instructions for participants"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  {...registerBasicInfo("description", { required: true })}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {step.name}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Participants */}
              <div className="space-y-2">
                <label
                  htmlFor="totalMemberNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Target Participants *
                </label>
                <input
                  type="number"
                  id="totalMemberNumber"
                  placeholder="e.g., 100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.totalMemberNumber || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "totalMemberNumber",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  required
                />
              </div>

              {/* Reward per User */}
              <div className="space-y-2">
                <label
                  htmlFor="tokenAmountPerMember"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reward per User *
                </label>
                <input
                  type="number"
                  id="tokenAmountPerMember"
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.tokenAmountPerMember || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "tokenAmountPerMember",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              {/* Currency - Readonly */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <input
                  type="text"
                  value="ACTX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Total Budget - Auto-calculated */}
              <div className="space-y-2">
                <label
                  htmlFor="tokenAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Total Budget *
                </label>
                <input
                  type="number"
                  id="tokenAmount"
                  placeholder="Auto-calculated or manual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={
                    formData.tokenAmount ||
                    (formData.totalMemberNumber && formData.tokenAmountPerMember
                      ? formData.totalMemberNumber *
                        formData.tokenAmountPerMember
                      : "")
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "tokenAmount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  readOnly={
                    !!(
                      formData.totalMemberNumber &&
                      formData.tokenAmountPerMember
                    )
                  }
                />
                <p className="text-xs text-gray-500">
                  Suggested: Enter values above
                </p>
              </div>
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.startDate || ""}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={formData.endDate || ""}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Budget Summary */}
            {formData.totalMemberNumber && formData.tokenAmountPerMember && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-md font-medium text-blue-900 mb-2">
                  Budget Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Target Participants:</span>
                    <span className="font-medium ml-2">
                      {formData.totalMemberNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Reward per User:</span>
                    <span className="font-medium ml-2">
                      {formData.tokenAmountPerMember} ACTX
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-blue-700">Total Budget:</span>
                    <span className="font-medium ml-2 text-lg">
                      {formData.totalMemberNumber *
                        formData.tokenAmountPerMember}{" "}
                      ACTX
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Proof Schema
        return (
          <ProofSchema onDataChange={onDataChange} savedData={savedData} />
        );

      case 3: // Preview
        return (
          <div className="space-y-6">
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {step.name}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>

            {/* Campaign Overview */}
            <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></span>
                Campaign Overview
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-indigo-700">
                      Campaign Title:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {formData.campaignTitle || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-700">
                      Category:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {formData.category
                        ? formData.category.charAt(0).toUpperCase() +
                          formData.category.slice(1)
                        : "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-700">
                      Subcategory:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {formData.subCategory || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-indigo-700">
                      Description:
                    </span>
                    <p className="text-gray-900 font-medium text-sm">
                      {formData.description || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-indigo-700">
                      Proof Type:
                    </span>
                    <p className="text-gray-900 font-medium">
                      {formData.proofType === "gps_location"
                        ? "GPS Location"
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            {formData.subCategoryData && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  Location Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-green-700">
                        Required Time:
                      </span>
                      <p className="text-gray-900 font-medium">
                        {formData.subCategoryData.selectedTime ||
                          formData.subCategoryData.requiredTime}{" "}
                        minutes
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-700">
                        Radius:
                      </span>
                      <p className="text-gray-900 font-medium">
                        {formData.subCategoryData.radius} meters
                      </p>
                    </div>
                  </div>
                  {formData.subCategoryData.location && (
                    <div>
                      <span className="text-sm font-medium text-green-700">
                        Coordinates:
                      </span>
                      <p className="text-gray-900 font-medium text-sm">
                        Lat: {formData.subCategoryData.location.lat?.toFixed(4)}
                        <br />
                        Lng: {formData.subCategoryData.location.lng?.toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Budget Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Budget & Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    Target Participants
                  </span>
                  <p className="text-2xl font-bold text-blue-900">
                    {formData.totalMemberNumber || "N/A"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    Reward per User
                  </span>
                  <p className="text-2xl font-bold text-blue-900">
                    {formData.tokenAmountPerMember || "N/A"} ACTX
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    Total Budget
                  </span>
                  <p className="text-2xl font-bold text-blue-900">
                    {formData.tokenAmount ||
                      (formData.totalMemberNumber &&
                      formData.tokenAmountPerMember
                        ? formData.totalMemberNumber *
                          formData.tokenAmountPerMember
                        : "N/A")}{" "}
                    ACTX
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-blue-700">
                    Start Date:
                  </span>
                  <p className="text-gray-900 font-medium">
                    {formData.startDate
                      ? new Date(formData.startDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-blue-700">
                    End Date:
                  </span>
                  <p className="text-gray-900 font-medium">
                    {formData.endDate
                      ? new Date(formData.endDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Validation Summary */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                Validation & Proof Requirements
              </h4>
              <div className="space-y-2">
                {formData.proofType === "gps_location" ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-purple-700">
                        GPS Location verification required
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-purple-700">
                        Stay duration validation
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-purple-700">
                        Real-time location tracking
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span className="text-sm text-purple-700">
                      No proof type selected yet
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              <button
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                onClick={() => handleInputChange("confirmed", true)}
              >
                Launch Campaign
              </button>
            </div>
          </div>
        );

      case 4: // Önizleme ve Onay
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-semibold text-gray-900">Campaign Summary:</h4>
              <p>
                <strong>Wallet:</strong> {formData.walletAddress}
              </p>
              <p>
                <strong>Company:</strong> {formData.companyName}
              </p>
              <p>
                <strong>Budget:</strong> ${formData.budget}
              </p>
              <p>
                <strong>NFT Verified:</strong>{" "}
                {formData.nftVerified ? "✓" : "✗"}
              </p>
            </div>
            <button
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => handleInputChange("confirmed", true)}
            >
              Launch Campaign
            </button>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      {renderStepForm()}
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// FRAMER MOTION STEPS COMPONENT
// ----------------------------------------------------------------------

/**
 * Dinamik İlerleme Çubuğu Bileşeni
 * @param {Array<Object>} steps - Adım listesi: { name: string, description: string, status: 'complete' | 'current' | 'upcoming', href: string }
 */
export default function AnimatedStepper({ steps }: { steps: any[] }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepData, setStepData] = useState<Record<number, any>>({});

  // Tüm step verilerini birleştir
  const allStepData = Object.values(stepData).reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {}
  );

  const currentSavedData = useMemo(() => {
    if (currentStepIndex >= 3) {
      return { ...allStepData, ...stepData[currentStepIndex] };
    }
    return stepData[currentStepIndex];
  }, [allStepData, currentStepIndex, stepData]);

  // Adım durumunu dinamik olarak güncelleme fonksiyonu
  const updateSteps = steps.map((step: any, index: number) => {
    if (index < currentStepIndex) {
      return { ...step, status: "complete" };
    }
    if (index === currentStepIndex) {
      return { ...step, status: "current" };
    }
    return { ...step, status: "upcoming" };
  });

  // Step verilerini sakla
  const handleStepDataChange = (stepIndex: number, data: any) => {
    setStepData((prev) => ({
      ...prev,
      [stepIndex]: { ...prev[stepIndex], ...data },
    }));
  };

  // Contract'a ve veritabanına veri gönder
  const submitToContractAndDB = async () => {
    try {
      console.log("Submitting data to contract and database:", allStepData);
      // Burada contract ve veritabanı işlemlerini gerçekleştir
      // Örnek: await submitToContract(allStepData);
      // Örnek: await saveToDatabase(allStepData);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }
  };

  // Deneme amacıyla adım ilerletme fonksiyonu
  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Son adımdaysak submit et
  const handleNextOrSubmit = () => {
    if (currentStepIndex === steps.length - 1) {
      submitToContractAndDB();
    } else {
      handleNextStep();
    }
  };

  return (
    <div className="w-full h-full max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Yatay Progress Bar - Üstte ve Responsive - Tam Genişlik */}
      <div className="w-full">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            {updateSteps.map((step: any, stepIdx: number) => {
              const isComplete = step.status === "complete";
              const isCurrent = step.status === "current";
              const isUpcoming = step.status === "upcoming";

              return [
                <div
                  key={`${step.name}-circle`}
                  className="flex flex-col items-center shrink-0"
                >
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: stepIdx * 0.1 }}
                    className={classNames(
                      // Responsive sizing: sm (640px+) için normal, küçük ekran için daha küçük
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2",
                      isComplete
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "",
                      isCurrent ? "border-indigo-600 text-indigo-600" : "",
                      isUpcoming ? "border-gray-300 text-gray-400" : ""
                    )}
                  >
                    {isComplete ? (
                      <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold">
                        {stepIdx + 1}
                      </span>
                    )}
                  </motion.div>
                  {/* Step Name - Küçük ekranda gizli */}
                  <span
                    className={classNames(
                      "text-xs mt-1 sm:mt-2 font-medium text-center leading-tight",
                      "hidden xs:inline-block", // xs breakpoint'te göster (576px+)
                      isComplete ? "text-indigo-600" : "",
                      isCurrent ? "text-indigo-600" : "",
                      isUpcoming ? "text-gray-400" : ""
                    )}
                  >
                    {step.name}
                  </span>
                  {/* Mobile için kısaltılmış isim */}
                  <span
                    className={classNames(
                      "text-xs mt-1 font-medium text-center leading-tight xs:hidden", // xs altında göster
                      isComplete ? "text-indigo-600" : "",
                      isCurrent ? "text-indigo-600" : "",
                      isUpcoming ? "text-gray-400" : ""
                    )}
                  >
                    {stepIdx === 0
                      ? "Basic Info"
                      : stepIdx === 1
                      ? "Budget"
                      : stepIdx === 2
                      ? "Proof Schema"
                      : stepIdx === 3
                      ? "Preview"
                      : "Submit Campaign"}
                  </span>
                </div>,

                // Connecting Line - Her zaman göster
                stepIdx < steps.length - 1 && (
                  <motion.div
                    key={`${step.name}-line`}
                    className="flex-1 h-0.5 mt-[-16px] sm:mt-[-20px] mx-2"
                    initial={{ backgroundColor: "#e5e7eb" }}
                    animate={{
                      backgroundColor: isComplete ? "#4f46e5" : "#e5e7eb",
                    }}
                    transition={{ backgroundColor: { duration: 1 } }}
                    style={{
                      transformOrigin: "left",
                    }}
                  ></motion.div>
                ),
              ];
            })}
          </div>
        </div>
      </div>

      {/* Step Content Component */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          <StepContent
            key={currentStepIndex}
            step={updateSteps[currentStepIndex]}
            stepIndex={currentStepIndex}
            onDataChange={(data) =>
              handleStepDataChange(currentStepIndex, data)
            }
            savedData={currentSavedData}
          />
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-6 sm:mt-8 flex justify-between gap-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="rounded-md flex items-center gap-1 sm:gap-2 bg-gray-400 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </button>

          <button
            onClick={handleNextOrSubmit}
            className="rounded-md flex items-center gap-1 sm:gap-2 bg-indigo-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors shrink-0"
          >
            <span className="text-center">
              {currentStepIndex === steps.length - 1 ? (
                <span className="hidden xs:inline">Submit Campaign</span>
              ) : (
                <span className="hidden xs:inline">Next</span>
              )}
              <span className="xs:hidden">
                {currentStepIndex === steps.length - 1 ? "Submit" : "Next"}
              </span>
            </span>
            {currentStepIndex !== steps.length - 1 && (
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Örnek Kullanım (Parent Component)
// ----------------------------------------------------------------------

const initialSteps = [
  {
    name: "Basic Info",
    description: "Enter campaign title, category and details.",
    href: "#",
  },
  {
    name: "Budget",
    description: "Set your campaign budget and rewards.",
    href: "#",
  },
  {
    name: "Proof Schema",
    description: "Configure proof requirements and validation.",
    href: "#",
  },
  {
    name: "Preview",
    description: "Review and launch your campaign.",
    href: "#",
  },
];

export function ParentComponent() {
  // Not: updateSteps fonksiyonu, index'e göre status'ü otomatik belirleyecektir.
  return <AnimatedStepper steps={initialSteps} />;
}
