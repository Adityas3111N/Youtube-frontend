import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoCard from "../components/videoCard";

export default function ChannelPage() {
  const navigate = useNavigate();
  const { username, owner } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_API_URL = "http://localhost:8000/api/v1";

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const res = await fetch(
          `${BASE_API_URL}/users/channel/${username}/${owner}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch channel: ${res.status}`);
        }
        const json = await res.json();
        setChannelData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChannelData();
  }, [username, owner]);

  if (loading) {
    return <div className="text-center mt-20">Loading channel...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  if (!channelData) {
    return <div className="text-center mt-20">Channel not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-60 overflow-hidden rounded-lg shadow-md">
        <img
          src={channelData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Info */}
      <div className="flex items-center gap-4 mt-4">
        <img
          src={channelData.avatar}
          alt={channelData.fullName}
          className="w-20 h-20 rounded-full border-2 border-gray-300"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{channelData.fullName}</h1>
          <p className="text-gray-500">@{channelData.userName}</p>
          <p className="text-gray-400 text-sm">
            {channelData.subscribersCount} subscribers •{" "}
            {channelData.allVideosOfAChannel.length} videos
          </p>
        </div>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${channelData.isSubscribed
              ? "bg-gray-200 text-gray-800"
              : "bg-red-600 text-white"
            }`}
        >
          {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Videos Grid */}
      <div className="mt-8 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {channelData.allVideosOfAChannel.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
