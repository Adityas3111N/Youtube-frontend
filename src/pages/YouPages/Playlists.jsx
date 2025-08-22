import React from "react";
import { PlaySquare } from "lucide-react";

const playlists = [
  {
    id: 1,
    title: "Web Development Tutorials",
    videoCount: 15,
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  },
  {
    id: 2,
    title: "Music Vibes",
    videoCount: 42,
    thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg",
  },
  {
    id: 3,
    title: "Fitness Motivation",
    videoCount: 8,
    thumbnail: "https://img.youtube.com/vi/kXYiU_JCYtU/hqdefault.jpg",
  },
];

export default function Playlists() {
  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <PlaySquare className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-800">Playlists</h1>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              {/* Thumbnail */}
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-40 object-cover"
              />

              {/* Info */}
              <div className="p-4">
                <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {playlist.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {playlist.videoCount} videos
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 col-span-full">
            <PlaySquare className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No playlists created yet</p>
            <p className="text-sm">Your playlists will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
