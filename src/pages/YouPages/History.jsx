import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { groupByDate } from "../../utils/formatDuration";
import VideoCard from "../../components/videoCard"; // <-- import your reusable card

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/history`, {
          credentials: "include",
        });
        const data = await res.json();
        setHistory(data.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const groupedHistory = groupByDate(history);

  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white shadow-sm flex items-center space-x-3">
        <Clock className="w-6 h-6 text-red-500" />
        <h1 className="text-xl font-semibold text-gray-900">Watch History</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-10">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : history.length ? (
          Object.entries(groupedHistory).map(([label, items]) => (
            <div key={label} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">{label}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <VideoCard key={item._id} video={item.video} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Clock className="w-12 h-12 mb-3 text-gray-400" />
            <p className="text-lg font-medium">No watch history yet</p>
            <p className="text-sm">Videos you watch will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
