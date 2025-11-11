import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface ProofSchemaProps {
  onDataChange: (data: any) => void;
  savedData?: any;
}

const ProofSchema: React.FC<ProofSchemaProps> = ({
  onDataChange,
  savedData,
}) => {
  const [selectedProofType, setSelectedProofType] = useState<string>(
    savedData?.proofType || ""
  );

  // Sadece GPS Location seçeneği
  const proofTypes = [{ value: "gps_location", label: "GPS Location" }];

  const handleProofTypeChange = (proofType: string) => {
    setSelectedProofType(proofType);
    onDataChange({
      proofType,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-gray-900">Proof Schema</h3>
        <p className="text-gray-600">
          Configure proof requirements and validation methods for your campaign.
        </p>
      </div>

      {/* Proof Type Dropdown */}
      <div className="space-y-2">
        <label
          htmlFor="proofType"
          className="block text-sm font-medium text-gray-700"
        >
          Proof Type *
        </label>
        <div className="relative">
          <select
            id="proofType"
            value={selectedProofType}
            onChange={(e) => handleProofTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none pr-8"
            required
          >
            <option value="">Select proof type</option>
            {proofTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500">
          Choose the validation method for campaign participation
        </p>
      </div>

      {/* Proof Type Description */}
      {selectedProofType && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-green-900 mb-2">
            GPS Location Proof
          </h4>
          <p className="text-sm text-green-700">
            Participants must prove their physical presence at the specified
            location using GPS coordinates. The system will validate their
            location within the defined radius and time frame.
          </p>
          <div className="mt-3 text-sm text-green-800">
            <strong>Validation Criteria:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>GPS coordinates within specified radius</li>
              <li>Stay duration requirements met</li>
              <li>Real-time location verification</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofSchema;
