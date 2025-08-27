import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import VideoCard from "../../components/videoCard"; // ✅ adjust path if needed

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function WatchLater() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Clock className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-800">Watch Later</h1>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-52"
            ></div>
          ))
        ) : videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
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
