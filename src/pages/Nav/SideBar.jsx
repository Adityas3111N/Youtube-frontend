import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Flame,
  Youtube,
  History,
  Settings,
  Menu,
  UserCircle
} from "lucide-react";

const navItems = [
  { icon: <Home className="w-6 h-6" />, label: "Home", path: "/" },
  { icon: <Flame className="w-6 h-6" />, label: "Trending", path: "/trending" },
  { icon: <UserCircle className="w-6 h-6" />, label: "You", path: "/you" },
  { icon: <History className="w-6 h-6" />, label: "History", path: "/history" },
  { icon: <Settings className="w-6 h-6" />, label: "Settings", path: "/settings" },
];

export default function Sidebar({ sidebarExpanded, toggleSidebar }) {
  const location = useLocation();

  return (
    <>
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 bg-white border-r shadow transition-all duration-300 ease-in-out flex flex-col items-start ${
          sidebarExpanded ? "w-60" : "w-16"
        }`}
      >
        {/* Top Logo/Menu */}
        <div className="flex items-center w-full px-4 py-3">
          <button
            className="p-1 hover:bg-gray-200 rounded-full"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>
          {sidebarExpanded && (
            <img
              src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
              alt="YouTube"
              className="h-6 ml-4"
            />
          )}
        </div>

        {/* Navigation Items */}
        <div className="mt-2 flex flex-col space-y-1 w-full items-start">
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={i}
                className={`flex items-center p-2 rounded w-full transition-colors duration-200 ${
                  sidebarExpanded ? "justify-start pl-4 space-x-3" : "justify-center"
                } ${
                  isActive
                    ? "bg-gray-100 text-red-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => sidebarExpanded && toggleSidebar()}
              >
                <div className={`${isActive ? "text-red-600" : "text-gray-700"}`}>
                  {item.icon}
                </div>
                {sidebarExpanded && (
                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      isActive ? "text-red-600" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
