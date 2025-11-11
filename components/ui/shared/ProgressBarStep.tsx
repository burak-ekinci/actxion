import { CheckIcon } from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";

// Yardımcı fonksiyon: Tailwind sınıflarını birleştirmek için
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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

  // Form verilerini parent componente ilet
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const handleInputChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

  // Step'e göre farklı form alanları render et
  const renderStepForm = () => {
    switch (stepIndex) {
      case 0: // Hesap Oluştur
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Wallet Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.walletAddress || ""}
                onChange={(e) =>
                  handleInputChange("walletAddress", e.target.value)
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
          </div>
        );

      case 1: // Profil Bilgileri
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Company Name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.companyName || ""}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Contact Person"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.contactPerson || ""}
                onChange={(e) =>
                  handleInputChange("contactPerson", e.target.value)
                }
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
        );

      case 2: // NFT Erişim Onayı
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="NFT Contract Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.nftContract || ""}
                onChange={(e) =>
                  handleInputChange("nftContract", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Token ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.tokenId || ""}
                onChange={(e) => handleInputChange("tokenId", e.target.value)}
              />
              <button
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => handleInputChange("nftVerified", true)}
              >
                Verify NFT Ownership
              </button>
            </div>
          </div>
        );

      case 3: // Kampanya Ayarları
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{step.name}</h3>
            <p className="text-gray-600">{step.description}</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Campaign Budget (USD)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.budget || ""}
                onChange={(e) => handleInputChange("budget", e.target.value)}
              />
              <input
                type="text"
                placeholder="Target Audience"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.targetAudience || ""}
                onChange={(e) =>
                  handleInputChange("targetAudience", e.target.value)
                }
              />
              <textarea
                placeholder="Campaign Description"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
              />
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
                      ? "Kayıt"
                      : stepIdx === 1
                      ? "Profil"
                      : stepIdx === 2
                      ? "NFT"
                      : stepIdx === 3
                      ? "Ayarlar"
                      : "Onay"}
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
            savedData={stepData[currentStepIndex]}
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
  { name: "Hesap Oluştur", description: "Kayıt ve Cüzdan Bağlama.", href: "#" },
  {
    name: "Profil Bilgileri",
    description: "Şirket ve İletişim Detayları.",
    href: "#",
  },
  {
    name: "NFT Erişim Onayı",
    description: "NFT Varlığının Doğrulanması.",
    href: "#",
  },
  {
    name: "Kampanya Ayarları",
    description: "Bütçe ve Hedef Belirleme.",
    href: "#",
  },
  { name: "Önizleme ve Onay", description: "Kampanyayı Başlatma.", href: "#" },
];

export function ParentComponent() {
  // Not: updateSteps fonksiyonu, index'e göre status'ü otomatik belirleyecektir.
  return <AnimatedStepper steps={initialSteps} />;
}
