import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/FormatDuration";
import { getRelativeTime } from "../utils/FormatDuration";
import toast from "react-hot-toast";



export default function VideoCard({ video }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

    const handleAddToWatchLater = async (videoId) => {
        try {
            const res = await fetch(`${BASE_API_URL}/users/watch-later/add/${videoId}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            if (data.success) {
                if (data.message?.includes("already")) {
                    toast("✅ Already in Watch Later", {
                        icon: "ℹ️",
                    });
                } else {
                    toast.success("🎬 Added to Watch Later");
                }
            } else {
                toast.error(data.message || "❌ Failed to add");
            }
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Error adding to Watch Later");
        }
    };


    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className="relative bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
            {/* Thumbnail */}
            <div onClick={() => navigate(`/videos/watch/${video._id}`)} className="relative">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                />
                {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                        {formatDuration(video.duration)}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex items-start space-x-3">
                <img
                    src={video.owner?.avatar || "https://placehold.co/40x40/cccccc/333333?text=U"}
                    alt={video.owner?.userName || "User"}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate(`/users/channel/${video.owner.userName}/${video.owner._id}`)}
                />

                <div className="flex-1">
                    <h3
                        className="font-semibold text-sm line-clamp-2"
                        title={video.title}
                        onClick={() => navigate(`/videos/watch/${video._id}`)}
                    >
                        {video.title}
                    </h3>
                    <p className="text-xs text-gray-600">{video.owner?.fullName || "Unknown"}</p>
                    <p className="text-xs text-gray-500">
                        {video.views || 0} views • {getRelativeTime(video.createdAt)}
                    </p>
                </div>

                {/* 3 dots */}
                <div className="relative" ref={menuRef}>
                    <MoreVertical
                        className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu((prev) => !prev);
                        }}
                    />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border z-20">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => handleAddToWatchLater(video._id)}
                            >
                                ➕ Watch Later
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => {
                                    console.log("Add to Playlist:", video._id);
                                    setShowMenu(false);
                                }}
                            >
                                📂 Add to Playlist
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
