import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaylistById } from "./PlaylistApis";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const PlaylistDetail = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const res = await getPlaylistById(playlistId);
            setPlaylist(res.data);
        } catch (err) {
            console.error("Error fetching playlist:", err);
        }
        setLoading(false);
    };

    const goToVideo = (videoId) => {
        navigate(`/videos/watch/${videoId}`);
    };

    // Calculate total duration
    const totalDuration = playlist?.videos?.reduce((sum, v) => sum + v.duration, 0) || 0;

    // Format duration hh:mm:ss
    const formatDuration = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return h > 0
            ? `${h}h ${m}m ${s}s`
            : m > 0
                ? `${m}m ${s}s`
                : `${s}s`;
    };

    if (loading)
        return (
            <div className="p-6 mb-8 bg-white shadow-2xl rounded-xl mx-auto">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-gray-300 h-64 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (!playlist)
        return <p className="p-6 text-gray-500 text-center">Playlist not found.</p>;

    return (
        <div className="p-6 mb-8 bg-white shadow-md rounded-xl mx-auto">
            {/* Playlist Info */}
            <div className="mb-6">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                    {playlist.name}
                </h1>
                <p className="text-gray-600 mb-2">{playlist.description}</p>
                <p className="text-gray-400 text-sm">
                    {playlist.videos.length} videos
                </p>
                {playlist.owner && (
                    <p className="text-gray-500 text-sm mt-1">
                        Curated by You 😍
                    </p>
                )}
            </div>

            {/* Videos Grid */}
            {playlist.videos.length === 0 ? (
                <p className="italic text-gray-500">No videos in this playlist yet.</p>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {playlist.videos.map((video) => (
                        <motion.div
                            key={video._id}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer transition-all"
                            onClick={() => goToVideo(video._id)}
                        >
                            <div className="relative w-full h-48">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2">
                                    <h2 className="text-white font-semibold text-sm line-clamp-2">
                                        {video.title}
                                    </h2>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                    {formatDuration(video.duration)}
                                </div>
                                <div className="absolute top-2 left-2 bg-red-600 p-1 rounded-full">
                                    <Play className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {video.description}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">{video.views} views</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistDetail;
