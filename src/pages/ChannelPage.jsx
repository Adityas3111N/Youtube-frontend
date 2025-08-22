import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ChannelPage() {
  const navigate = useNavigate();
  const { username, owner } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_API_URL = "http://localhost:8000/api/v1";

  const formatDuration = (s) => {
    s = Math.floor(s);
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor(s / 60);
    const seconds = Math.floor(s % 60);
    const h = hours > 0 ? `${String(hours)}:` : "";
    const m = String(minutes);
    const sec = String(seconds).padStart(2, "0");
    return `${h}${m}:${sec}`;
  };

  const getRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const now = new Date();
    const diff = (now - new Date(date)) / 1000;

    const units = [
      { max: 60, value: 1, name: "second" },
      { max: 3600, value: 60, name: "minute" },
      { max: 86400, value: 3600, name: "hour" },
      { max: 2592000, value: 86400, name: "day" },
      { max: 31536000, value: 2592000, name: "month" },
      { max: Infinity, value: 31536000, name: "year" },
    ];

    for (const unit of units) {
      if (diff < unit.max) {
        const value = Math.floor(diff / unit.value) * -1;
        return rtf.format(value, unit.name);
      }
    }
  };

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
          className={`px-4 py-2 rounded-full font-semibold ${
            channelData.isSubscribed
              ? "bg-gray-200 text-gray-800"
              : "bg-red-600 text-white"
          }`}
        >
          {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Videos Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {channelData.allVideosOfAChannel.map((video) => (
          <div
            key={video._id}
            className="cursor-pointer bg-white rounded-lg shadow hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="relative"
            onClick={() => navigate(`/videos/watch/${video._id}`)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              {video.duration && (
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </span>
              )}
            </div>

            <div className="p-3 flex items-start space-x-3">
              <img
              onClick={() => navigate(`/users/channel/${channelData.userName}/${channelData._id}`)}
                src={
                  channelData.avatar ||
                  "https://placehold.co/40x40/cccccc/333333?text=U"
                }
                alt={channelData.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3
                  className="font-semibold text-sm line-clamp-2"
                  title={video.title}
                >
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {channelData.fullName || "Unknown"}
                </p>
                <p className="text-xs text-gray-500">
                  {video.views || 0} views • {getRelativeTime(video.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
