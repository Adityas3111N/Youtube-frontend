import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/videoCard'

const categories = [
    "🧠 Master Plans & Mind Games",
    "🎭 Psychology of Power",
    "🧘 Discipline Under Fire",
    "📖 The Art of Rebellion",
    "🎯 Ethics & Strategy",
    "👥 Building the Perfect Crew",
    "♟️ Every Move is Calculated",
    "🏗️ Heist Architecture",
    "💨 Vanish Like a Ghost",
    "🕯️ Silence in the Storm"
];


const HomePage = () => {

    const navigate = useNavigate();


    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState({ by: 'createdAt', order: 'desc' });
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeNav, setActiveNav] = useState('Home');
    const [avatar, setAvatar] = useState('');

    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;


    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoading(true);

            try {
                const res = await fetch(`${BASE_API_URL}/videos?page=${[page]}&limit=10&sortBy=${sort.by}&order=${sort.order}`);
                if (!res.ok) throw new error('failed to fetch');
                const data = await res.json();
                console.log(data);
                setVideos(data.data.videos);
                setTotalPages(data.data.totalPages);
                setPage(data.data.currentPage);
            } catch (error) {
                setError(error.message);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchVideos();

    }, [page, sort, selectedCategory]);


    return (
        <div className="relative min-h-screen font-inter text-gray-900">
            {sidebarExpanded && <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSidebarExpanded(false)}></div>}

            <main className={`transition-all duration-300 ease-in-out relative ${sidebarExpanded ? 'ml-40' : 'ml-0'}`}>

                <div className="px-6 mb-6 overflow-x-auto scrollbar-hide py-3 bg-white/70 backdrop-blur-md sticky top-[64px] z-10">
                    <div className="flex space-x-3">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${cat === selectedCategory ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!sidebarExpanded) setSelectedCategory(cat);
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="px-6 pb-6">
                    {isLoading ? <p>Loading...</p> : error ? <p className="text-red-600">{error}</p> : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {videos.map(video => (
                                    <VideoCard key={video._id} video={video} />
                                ))}

                            </div>
                            <div className="flex justify-center items-center mt-6 space-x-4">
                                <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Prev</button>
                                <span className="text-sm">Page {page} of {totalPages}</span>
                                <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50">Next</button>
                            </div>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePage;
