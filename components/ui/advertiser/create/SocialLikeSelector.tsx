import React, { useState } from "react";

interface SocialLikeSelectorProps {
  platforms: string[];
  onDataChange: (data: any) => void;
}

export const SocialLikeSelector: React.FC<SocialLikeSelectorProps> = ({
  platforms,
  onDataChange
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
    onDataChange({
      platform,
      action: "like",
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-green-900 mb-2">Social Media Requirements</h4>
        <p className="text-sm text-green-700">
          Users must like your post on one of the selected platforms.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Platform
        </label>
        <div className="grid grid-cols-1 gap-2">
          {platforms.map((platform) => (
            <label key={platform} className="flex items-center">
              <input
                type="radio"
                name="platform"
                value={platform}
                checked={selectedPlatform === platform}
                onChange={() => handlePlatformChange(platform)}
                className="mr-2"
              />
              <span className="capitalize">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedPlatform && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Users will be asked to like your post on <strong>{selectedPlatform}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default SocialLikeSelector;
