import React, { useEffect, useState } from "react";
import { getPlaylists, createPlaylist, deletePlaylist } from "./PlaylistApis";
import { Plus, Trash2, Music4, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const res = await getPlaylists();
      const playlistsWithThumbs = await Promise.all(
        (res.data || []).map(async (pl) => {
          if (pl.videos && pl.videos.length > 0) {
            try {
              const videoRes = await fetch(`${BASE_API_URL}/videos/watch/${pl.videos[0]}`);
              const videoData = await videoRes.json();
              pl.firstThumbnail = videoData.data.thumbnail;
            } catch (err) {
              console.error("Error fetching video thumbnail:", err);
              pl.firstThumbnail = null;
            }
          } else {
            pl.firstThumbnail = null;
          }
          return pl;
        })
      );
      setPlaylists(playlistsWithThumbs);
    } catch (err) {
      console.error("Error fetching playlists:", err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newName || !newDesc) return alert("Enter name and description");
    try {
      const res = await createPlaylist(newName, newDesc);
      if (res.success) {
        // Add thumbnail as null for now; you can fetch it later
        res.data.firstThumbnail = null;
        setPlaylists([res.data, ...playlists]);
        setNewName("");
        setNewDesc("");
        setShowModal(false);
      } else {
        alert(res.message || "Error creating playlist");
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
      alert("Error creating playlist");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this playlist?")) return;
    try {
      await deletePlaylist(id);
      setPlaylists(playlists.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          🎶 Your Playlists
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-2xl shadow hover:opacity-90 transition z-50"
        >
          <Plus size={18} /> New Playlist
        </button>
      </div>

      {/* Loader / Empty */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-32"></div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-500 mt-20">
          <FolderOpen size={60} className="mb-4" />
          <p className="italic text-lg">No playlists yet — create your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((pl) => (
            <Link to={`/playlists/${pl._id}`} key={pl._id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="group bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-80"
              >
                {/* Thumbnail */}
                {pl.firstThumbnail ? (
                  <img
                    src={pl.firstThumbnail}
                    alt={pl.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                    Thumbnail
                  </div>
                )}

                {/* Playlist Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{pl.name}</h2>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[2.5rem]">
                      {pl.description}
                    </p>

                    {/* 👇 Added video count */}
                    <p className="text-xs text-gray-500 mt-2">
                      {pl.videos?.length || 0} videos
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4">
                    <Music4 className="text-blue-500" size={20} />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(pl._id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>

          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
              <input
                type="text"
                placeholder="Playlist name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playlists;
