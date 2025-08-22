import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../../utils/formatDuration";

const BASE_API_URL = "http://localhost:8000/api/v1";

export default function WatchLater() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/users/watch-later`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching watch later:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (videoId) => {
    navigate(`/videos/watch/${videoId}`);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Clock className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-800">Watch Later</h1>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-52"
            ></div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video._id}
              onClick={() => handleCardClick(video._id)}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col"
            >
              {/* Thumbnail with duration */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-40 object-cover"
                />
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                  {video.title}
                </h2>
                <p className="text-xs text-gray-600">{video.channel || "Unknown Channel"}</p>
                <p className="text-xs text-gray-500 mt-auto">
                  {video.views ? `${video.views} views` : "0 views"}{" "}
                  {video.time ? `• ${video.time}` : ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 col-span-full">
            <Clock className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No videos saved</p>
            <p className="text-sm">Your saved videos will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
