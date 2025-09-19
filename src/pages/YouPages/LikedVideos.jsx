import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import VideoCard from "../../components/videoCard"; // adjust path if needed
import { fetchWithAuth } from "../../services/apiClient";

export default function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await fetchWithAuth(`/users/liked-videos`);

        const data = await res.json();

        if (data.success) {
          setVideos(data.data || []);
        } else {
          console.error("Failed to fetch liked videos:", data.message);
        }
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, [BASE_API_URL]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Heart className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-800">Liked Videos</h1>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading liked videos...
          </div>
        ) : videos.length > 0 ? (
          videos.map((video) => <VideoCard key={video._id} video={video} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 col-span-full">
            <Heart className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No liked videos</p>
            <p className="text-sm">Your liked videos will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
