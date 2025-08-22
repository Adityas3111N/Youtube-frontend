import React from "react";
import { Clock, ListVideo, Clock3, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const youSections = [
  {
    icon: <Clock className="w-7 h-7 text-red-500" />,
    title: "History",
    path: "/history",
    count: 1,
  },
  {
    icon: <ListVideo className="w-7 h-7 text-blue-500" />,
    title: "Playlists",
    path: "/playlists",
    count: 5,
  },
  {
    icon: <Clock3 className="w-7 h-7 text-green-500" />,
    title: "Watch Later",
    path: "/watch-later",
    count: 12,
  },
  {
    icon: <ThumbsUp className="w-7 h-7 text-purple-500" />,
    title: "Liked Videos",
    path: "/liked-videos",
    count: 101,
  },
];

export default function YouPage() {
  const userName = "Aditya"; // later you can fetch from auth/user context

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Hi {userName} 👋, your Curation is here. Enjoy😍
        </h1>
        <span className="text-sm text-gray-500">
          Manage your activity & saved content
        </span>
      </div>

      {/* Content */}
      <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {youSections.map((section, i) => (
          <Link to={section.path} key={i}>
            <motion.div
              whileHover={{ scale: 1.07, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* Icon with animated hover */}
              <motion.div
                whileHover={{ rotate: 5 }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 group-hover:bg-gray-200 transition"
              >
                {section.icon}
              </motion.div>

              {/* Title */}
              <span className="mt-4 text-base font-semibold text-gray-800 group-hover:text-red-500 transition">
                {section.title}
              </span>

              {/* Count/Stats */}
              <span className="mt-1 text-sm text-gray-500">
                {section.count} items
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
