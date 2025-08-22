import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const BASE_API_URL = "http://localhost:8000/api/v1/";

// ✅ Format duration into hh:mm:ss
const formatDuration = (totalSeconds) => {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

// ✅ Relative time (e.g. "5 minutes ago")
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
  return "";
};

// ✅ Group videos by date (Today, Yesterday, Weekday, etc.)
const groupByDate = (videos) => {
  const groups = {};
  const now = new Date();

  videos.forEach((item) => {
    const date = new Date(item.watchedAt);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    let label;
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Yesterday";
    else if (diffDays < 7)
      label = date.toLocaleDateString("en-US", { weekday: "long" });
    else label = date.toLocaleDateString();

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}users/history`, {
          credentials: "include",
        });
        const data = await res.json();
        setHistory(data.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const groupedHistory = groupByDate(history);

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Clock className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900">Watch History</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-10">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : history.length ? (
          Object.entries(groupedHistory).map(([label, items]) => (
            <div key={label} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">{label}</h2>

              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start space-x-4 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/videos/watch/${item.video._id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={item.video.thumbnail}
                      alt={item.video.title}
                      className="w-52 h-28 object-cover rounded-md"
                    />
                    {item.video.duration && (
                      <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">
                        {formatDuration(item.video.duration)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.video.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.video.owner?.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.video.views} views • {getRelativeTime(item.watchedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Clock className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No watch history yet</p>
            <p className="text-sm">Videos you watch will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
