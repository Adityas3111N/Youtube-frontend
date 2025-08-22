import React from "react";
import { Clock } from "lucide-react";

const watchLaterVideos = [
  {
    id: 1,
    title: "Learn JavaScript in 20 Minutes",
    thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg",
    channel: "Code Academy",
    views: "1.2M views",
    time: "2 weeks ago",
  },
  {
    id: 2,
    title: "Atomic Habits Summary",
    thumbnail: "https://img.youtube.com/vi/AdKUJxjn-R8/hqdefault.jpg",
    channel: "Productivity Guy",
    views: "850K views",
    time: "1 month ago",
  },
  {
    id: 3,
    title: "React Hooks Crash Course",
    thumbnail: "https://img.youtube.com/vi/TNhaISOUy6Q/hqdefault.jpg",
    channel: "Dev Simplified",
    views: "500K views",
    time: "3 days ago",
  },
];

export default function WatchLater() {
  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Clock className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-800">Watch Later</h1>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {watchLaterVideos.length > 0 ? (
          watchLaterVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              {/* Thumbnail */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover"
              />

              {/* Info */}
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h2>
                <p className="text-xs text-gray-600 mt-1">{video.channel}</p>
                <p className="text-xs text-gray-500">
                  {video.views} • {video.time}
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
