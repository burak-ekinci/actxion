import React, { useState } from "react";

interface ContentVideoSelectorProps {
  minWatchTime: number;
  onDataChange: (data: any) => void;
}

export const ContentVideoSelector: React.FC<ContentVideoSelectorProps> = ({
  minWatchTime,
  onDataChange
}) => {
  const [videoUrl, setVideoUrl] = useState("");

  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    onDataChange({
      videoUrl: url,
      minWatchTime,
      contentType: "video",
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-purple-900 mb-2">Content Requirements</h4>
        <p className="text-sm text-purple-700">
          Users must watch your video for at least <strong>{minWatchTime} seconds</strong>.
        </p>
      </div>

      <div>
        <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="https://example.com/video.mp4"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the URL of the video that users need to watch
        </p>
      </div>

      {videoUrl && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Users will be required to watch this video for at least{" "}
            <strong>{Math.floor(minWatchTime / 60)} minutes {minWatchTime % 60} seconds</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentVideoSelector;
