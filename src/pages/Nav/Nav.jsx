// src/components/Nav.jsx
import React from "react";
import { Bell, Mic, Search, Video, Menu } from "lucide-react";
import UploadModal from "./uploadVideo/uploadModal";
import { useState } from "react";

const Nav = ({ sidebarExpanded, toggleSidebar, userAvatar }) => {
 const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-8 py-2 bg-white sticky top-0 z-30 border-b border-gray-200">
      {/* LEFT: Menu + Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <img
          src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
          alt="YouTube"
          className="h-5 cursor-pointer"
        />
      </div>

      {/* CENTER: Search bar */}
      <div className="flex items-center w-full max-w-xl">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            aria-label="Search"
            className="flex items-center justify-center w-16 border border-l-0 border-gray-300 bg-gray-100 rounded-r-full hover:bg-gray-200 transition-colors"
          >
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          aria-label="Voice search"
          className="ml-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Mic className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* RIGHT: Video, Notifications, Avatar */}
      <div className="flex items-center space-x-2">
        <button
          aria-label="Create video"
          onClick={() => setIsUploadOpen(true)}   // ✅ opens modal
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Video className="w-6 h-6 text-gray-700" />
        </button>

        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full"></span>
        </button>

        <img
          src={userAvatar || "https://placehold.co/40x40/cccccc/333333?text=U"}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover cursor-pointer"
        />
      </div>

            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

    </header>
  );
};

export default Nav;
