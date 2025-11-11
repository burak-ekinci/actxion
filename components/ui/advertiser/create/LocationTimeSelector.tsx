import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import GoogleMap from "./GoogleMap";

interface LocationTimeSelectorProps {
  requiredTime: number;
  radius: number;
  onDataChange: (data: any) => void;
}

export const LocationTimeSelector: React.FC<LocationTimeSelectorProps> = ({
  requiredTime,
  radius,
  onDataChange,
}) => {
  // Kullanıcının seçtiği süre (dakika cinsinden)
  const [selectedTime, setSelectedTime] = useState<number>(requiredTime);

  // Zaman seçenekleri
  const timeOptions = [
    { value: 0, label: "Only once at the location" },
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
  ];

  const handleTimeChange = (time: number) => {
    setSelectedTime(time);
    // Zaman değişikliğinde parent componente bildir
    onDataChange({
      selectedTime: time,
      requiredTime: time, // backward compatibility için
      radius,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-blue-900 mb-2">
          Location Requirements
        </h4>
        <p className="text-sm text-blue-700">
          Users must stay at the selected location for{" "}
          <strong>{selectedTime} minutes</strong> within a{" "}
          <strong>{radius} meter</strong> radius.
        </p>
      </div>

      {/* Süre Seçimi Dropdown */}
      <div>
        <label
          htmlFor="stayDuration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Required Stay Duration
        </label>
        <div className="relative">
          <select
            id="stayDuration"
            value={selectedTime}
            onChange={(e) => handleTimeChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
          >
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Selection
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Select the location where participants need to stay for the specified
          time.
        </p>
        <GoogleMap
          onLocationSelect={(location) => {
            onDataChange({
              location,
              selectedTime,
              requiredTime: selectedTime, // backward compatibility için
              radius,
              timestamp: new Date().toISOString(),
            });
          }}
          selectedLocation={null}
        />
      </div>
    </div>
  );
};

export default LocationTimeSelector;
