const BASE_API_URL = `${import.meta.env.VITE_BASE_API_URL}/playlist`;
const USER_API_URL = `${import.meta.env.VITE_BASE_API_URL}/users`;
import { fetchWithAuth } from "../../services/apiClient";

export const createPlaylist = async (name, description) => {
  const res = await fetchWithAuth(`/playlist/create-playlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });
  return res.json();
};

export const getPlaylistById = async (playlistId) => {
  const res = await fetchWithAuth(`/playlist/${playlistId}`);
  return res.json();
};

export const getPlaylists = async () => {
  const res = await fetchWithAuth(`/playlist`);
  return res.json();
};

export const deletePlaylist = async (playlistId) => {
  const res = await fetchWithAuth(`/playlist/delete-playlist/${playlistId}`, {
    method: "POST"
  });
  return res.json();
};

export const addVideoToPlaylist = async (playlistId, videoId) => {
  const res = await fetchWithAuth(`/playlist/add-video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlistId, videoId }),
  });
  return res.json();
};

export const removeVideoFromPlaylist = async (playlistId, videoId) => {
  const res = await fetchWithAuth(`/playlist/remove-video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playlistId, videoId }),
  });
  return res.json();
};


// Get history count
export const getHistoryCount = async () => {
  const res = await fetchWithAuth(`/users/history`);
  const data = await res.json();
  return data?.data?.length || 0;
};

// Get playlists count
export const getPlaylistCount = async () => {
  const res = await getPlaylists();
  return res?.data?.length || 0;
};

// Get watch later count
export const getWatchLaterCount = async () => {
  const res = await fetchWithAuth(`/users/watch-later`);
  const data = await res.json();
  return data?.data?.length || 0;
};

// Get liked videos count
export const getLikedVideosCount = async () => {
  const res = await fetchWithAuth(`/users/liked-videos`);
  const data = await res.json();
  return data?.data?.length || 0;
};
