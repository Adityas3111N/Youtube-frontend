import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlaylistById } from "./PlaylistApis";
import VideoCard from "../../components/VideoCard"; // ✅ import reusable card

const PlaylistDetail = () => {
    const { playlistId } = useParams();
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
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                    {playlist.videos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PlaylistDetail;
