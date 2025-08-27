import { useEffect, useState } from "react";
import { getRelativeTime, formatNumber } from "../utils/formatDuration";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function TrendingVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/videos/trending?limit=20`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setVideos(data.data.videos);
        }
      } catch (err) {
        console.error("Error fetching trending videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  if (loading) {
    return <div className="text-center py-6">Loading trending videos...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔥 Trending Videos</h1>
      <div className="space-y-4">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="flex items-start p-4 bg-white rounded-2xl shadow hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(`/videos/watch/${video._id}`)}
          >
            {/* Rank Number */}
            <div className="text-3xl font-bold text-gray-400 w-12 text-center">
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="w-48 h-28 flex-shrink-0 overflow-hidden rounded-xl">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Info */}
            <div className="ml-4 flex flex-col">
              <h2 className="text-lg font-semibold line-clamp-2">{video.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-1">{video.description}</p>

              {/* Owner + Stats */}
              <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                <img
                  src={video.owner?.avatar}
                  alt={video.owner?.userName}
                  className="w-6 h-6 rounded-full"
                />
                <span>{video.owner?.userName || video.owner?.fullName}</span>
                <span>• {formatNumber(video.views)} views</span>
                <span>• {getRelativeTime(video.createdAt)}</span>
              </div>

              {/* Trending Score (optional, for debugging/testing) */}
              <p className="text-xs text-gray-400 mt-1">
                Score: {Math.round(video.trendingScore)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
