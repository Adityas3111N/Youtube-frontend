import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDuration } from "../utils/formatDuration";
import { getRelativeTime } from "../utils/formatDuration";
import { createPlaylist } from "../pages/PlayList/PlaylistApis";
import toast from "react-hot-toast";



export default function VideoCard({ video }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [inWatchLater, setInWatchLater] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDesc, setNewPlaylistDesc] = useState("");





    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        const checkWatchLater = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/users/in-watch-later/${video._id}`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) {
                    setInWatchLater(data.inWatchLater);
                }
            } catch (err) {
                console.error("Error checking watch later", err);
            }
        };
        checkWatchLater();
    }, [video._id]);

    //fetch playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/playlist`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data?.data) {
                    const updated = data.data.map(pl => ({
                        ...pl,
                        containsVideo: pl.videos?.includes(video._id)
                    }));
                    setPlaylists(updated);
                }
            } catch (err) {
                console.error("Error fetching playlists", err);
            }
        };
        fetchPlaylists();
    }, [video._id]);


    // console.log(playlists)



    const handleAddToWatchLater = async (videoId) => {
        try {
            const res = await fetch(`${BASE_API_URL}/users/watch-later/add/${videoId}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setInWatchLater(true);
                toast.success("🎬 Added to Watch Later");
            }

        } catch (err) {
            console.error(err);
            toast.error("⚠️ Error adding to Watch Later");
        }
    };

    const handleRemoveFromWatchLater = async (videoId) => {
        try {
            const res = await fetch(`${BASE_API_URL}/users/watch-later/remove/${videoId}`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setInWatchLater(false);
                toast("🗑️ Removed from Watch Later");
            }

        } catch (err) {
            console.error(err);
            toast.error("⚠️ Error removing from Watch Later");
        }
    };

    //when click for adding or removing from playlists.
    const toggleVideoInPlaylist = async (playlistId, isInPlaylist) => {
        try {
            const url = `${BASE_API_URL}/playlist/${playlistId}/videos/${video._id}`;
            const method = isInPlaylist ? "DELETE" : "POST";

            const res = await fetch(url, {
                method,
                credentials: "include",
            });
            const result = await res.json();

            if (result.success) {
                // Update local state
                setPlaylists(prev =>
                    prev.map(pl =>
                        pl._id === playlistId
                            ? { ...pl, containsVideo: result.data.videos.includes(video._id) }
                            : pl
                    )
                );

                if (isInPlaylist) {
                    toast("🗑️ Removed from Playlist")
                }
                else {
                    toast.success("🎬 Added to Playlist")
                }

            }
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Error updating playlist");
        }
    };

    //create playlist from 3 dots
    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim() || !newPlaylistDesc.trim()) {
            return toast.error("Enter both name and description");
        }

        try {
            const res = await createPlaylist(newPlaylistName, newPlaylistDesc);
            if (res.success) {
                const newPl = { ...res.data, containsVideo: false, description: newPlaylistDesc };
                setPlaylists((prev) => [newPl, ...prev]);
                setNewPlaylistName("");
                setNewPlaylistDesc("");
                setShowCreatePlaylist(false);
                toast.success("✅ Playlist created");
            } else {
                toast.error(res.message || "Error creating playlist");
            }
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Failed to create playlist");
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
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50">
                            <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() =>
                                    inWatchLater
                                        ? handleRemoveFromWatchLater(video._id)
                                        : handleAddToWatchLater(video._id)
                                }
                            >
                                <input
                                    type="checkbox"
                                    checked={inWatchLater}
                                    readOnly
                                    className="mr-2"
                                />
                                Watch Later
                            </button>


                            {playlists.length > 0 && (
                                <div>
                                    {playlists.map((pl) => (
                                        <button
                                            key={pl._id}
                                            className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            onClick={() => toggleVideoInPlaylist(pl._id, pl.containsVideo)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={pl.containsVideo}
                                                readOnly
                                                className="mr-2"
                                            />
                                            {pl.name}
                                        </button>
                                    ))}

                                </div>
                            )}


                            {/* Create New Playlist Toggle */}
                            <button
                                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                onClick={() => setShowCreatePlaylist((prev) => !prev)}
                            >
                                + New Playlist
                            </button>

                            <motion.div
                                className="bg-gray-50 rounded-lg shadow-md border border-gray-200 flex flex-col"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {/* Input for new playlist */}
                                {showCreatePlaylist && (
                                    <div className="px-4 py-3 bg-gray-50 rounded-lg shadow-md border border-gray-200 flex flex-col gap-2 mt-1 animate-fade-in">
                                        <input
                                            type="text"
                                            value={newPlaylistName}
                                            onChange={(e) => setNewPlaylistName(e.target.value)}
                                            placeholder="Playlist name"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                        />
                                        <textarea
                                            value={newPlaylistDesc}
                                            onChange={(e) => setNewPlaylistDesc(e.target.value)}
                                            placeholder="Description"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
                                            rows={2}
                                        />
                                        <button
                                            onClick={handleCreatePlaylist}
                                            className="mt-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-lg px-3 py-2 hover:opacity-95 transition-shadow shadow-md hover:shadow-lg"
                                        >
                                            Create Playlist
                                        </button>
                                    </div>
                                )}

                            </motion.div>



                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
