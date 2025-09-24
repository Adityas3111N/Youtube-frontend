import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRelativeTime, formatNumber } from "../utils/formatDuration";
import { apiFetch } from "./Auth/apiFetch";
// Helper function to format large numbers (e.g., 1234567 -> 1.2M)


const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null); // Store logged-in user ID
  const [likeLoading, setLikeLoading] = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch video data
        const videoResponse = await fetch(`${BASE_API_URL}/videos/watch/${videoId}`, {
          credentials: "include", // important: sends cookies for JWT
        }); if (!videoResponse.ok) throw new Error(`HTTP error! status: ${videoResponse.status}`);
        const videoData = await videoResponse.json();
        setVideo(videoData?.data);

        // Fetch channel data
        if (videoData?.data?.owner?._id) {
          const channelResponse = await fetch(`${BASE_API_URL}/users/channel/${videoData.data.owner.userName}/${videoData.data.owner._id}`);
          if (!channelResponse.ok) throw new Error(`HTTP error! status: ${channelResponse.status}`);
          const channelData = await channelResponse.json();
          setChannel(channelData?.data);


        }

        // Fetch recommended videos
        const recommendedResponse = await fetch(`${BASE_API_URL}/videos?page=1&limit=10&sortBy=createdAt&order=desc`);
        if (!recommendedResponse.ok) throw new Error(`HTTP error! status: ${recommendedResponse.status}`);
        const recommendedData = await recommendedResponse.json();
        const otherVideos = recommendedData?.data?.videos?.filter(v => v._id !== videoId);
        setRecommendedVideos(otherVideos || []);

        // Fetch comments
        const commentsResponse = await fetch(`${BASE_API_URL}/comments?videoId=${videoId}`);
        if (!commentsResponse.ok) throw new Error(`HTTP error! status: ${commentsResponse.status}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData?.data?.comments || []);
      } catch (err) {
        console.error("Error loading data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [videoId, BASE_API_URL]);  // removed currentUserId

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/current-user`, { credentials: 'include' });
        if (res.ok) {
          const userData = await res.json();
          setCurrentUserId(userData?.data?._id);
        }
      } catch (err) {
        console.error("Error fetching current user:", err.message);
      }
    };

    fetchCurrentUser();
  }, [BASE_API_URL]);



  useEffect(() => {
    // console.log('Updated Current User ID:', currentUserId, comments[0]?.owner?._id);
    // console.log('true or false :', currentUserId && String(currentUserId) == String(comments[0]?.owner?._id))
  }, [currentUserId, comments]); // this fixed the bug that edit and delete buttons were not working.



  const handleLike = async () => {
    if (likeLoading) return; // prevent multiple clicks
    setLikeLoading(true);

    try {
      const res = await apiFetch(`/videos/like-video/${video._id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to like video");

      // update state based on backend response
      setVideo(prev => ({
        ...prev,
        likes: { ...prev.likes, count: data.data.totalLikes },
        dislikes: { ...prev.dislikes, count: data.data.totalDislikes },
        isLiked: data.data.isLiked,
        isDisliked: data.data.isDisliked
      }));
    } catch (err) {
      console.error(err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (dislikeLoading) return;
    setDislikeLoading(true);

    try {
      const res = await fetch(`${BASE_API_URL}/videos/dislike-video/${video._id}`, {
        method: "PATCH",
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to dislike video");

      setVideo(prev => ({
        ...prev,
        likes: { ...prev.likes, count: data.data.totalLikes },
        dislikes: { ...prev.dislikes, count: data.data.totalDislikes },
        isLiked: data.data.isLiked,
        isDisliked: data.data.isDisliked
      }));
    } catch (err) {
      console.error(err.message);
    } finally {
      setDislikeLoading(false);
    }
  };


  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${BASE_API_URL}/comments/add-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment, video: videoId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add comment');

      setComments(prev => [data.data, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err.message);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(`${BASE_API_URL}/comments/update-comment?commentId=${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: editContent })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update comment');

      setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: editContent } : c));
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('Error updating comment:', err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${BASE_API_URL}/comments/delete-comment?commentId=${commentId}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete comment');

      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err.message);
    }
  };

  //handle subscribe

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0); // if needed
  const [subLoading, setSubLoading] = useState(false);

  // Effect to fetch subscription status whenever channel or currentUserId changes
  useEffect(() => {
    if (!channel?._id || !currentUserId) return;


    const fetchSubscriptionStatus = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/subscription/status/${channel?._id}`, {
          credentials: "include", // important to send cookies for auth
        });

        const data = await res.json();
        console.log(data)

        if (res.ok && data.success) {
          setIsSubscribed(!!data.data.isSubscribed); // make sure it's boolean
          // Optional: if backend provides subscribersCount
        } else {
          console.error("Failed to fetch subscription status:", data.message);
          setIsSubscribed(false);
        }
      } catch (err) {
        console.error("Error fetching subscription status:", err.message);
        setIsSubscribed(false);
      }
    };

    fetchSubscriptionStatus();
  }, [channel?._id, currentUserId, BASE_API_URL]);

  useEffect(() => {
    if (channel) {
      setSubscribersCount(channel.subscribersCount || 0);
    }
  }, [channel]);
  console.log(isSubscribed)

  const handleSubscribe = async () => {
    if (!currentUserId) {
      alert("Please login to subscribe");
      return;
    }

    // Prevent multiple clicks while loading
    if (subLoading) return;

    try {
      setSubLoading(true);

      // Decide which API to call based on current state
      const endpoint = isSubscribed
        ? `${BASE_API_URL}/subscription/unSubscribe?channelId=${channel._id}`
        : `${BASE_API_URL}/subscription/subscribe?channelId=${channel._id}`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Update state only if backend confirms
      if (isSubscribed) {
        // Unsubscribing
        setIsSubscribed(false);
        setSubscribersCount((prev) => Math.max(prev - 1, 0)); // never go negative
      } else {
        // Subscribing
        setIsSubscribed(true);
        setSubscribersCount((prev) => prev + 1);
      }

    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubLoading(false);
    }
  };

  //views will be counted from hereeee guysss.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`${BASE_API_URL}/videos/${videoId}/views`, {
        method: "POST",
        credentials: "include", // so user session/cookie is sent
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => res.json())
        // .then((data) => {
        //   console.log("View added:", data);
        // })
        .catch((err) => {
          console.error("Error adding view:", err);
        });
    }, 3000); // waits 10s before counting a view

    return () => clearTimeout(timer); // cleanup if user leaves before 10s
  }, [videoId]);

  useEffect(() => {
    // Update watch history immediately on video load
    fetch(`${BASE_API_URL}/users/addWatchHistory/${videoId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      // .then((data) => console.log("History updated:", data))
      .catch((err) => console.error("Error updating history:", err));
  }, [videoId]);

  if (!video) return <div className="text-center mt-10 text-lg font-semibold">Loading video...</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Main Video Area */}
      <div className="flex-1 lg:w-2/3">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Title */}
        <h1 className="text-xl md:text-2xl font-bold mt-4 line-clamp-2">{video.title}</h1>

        {/* Video Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-3 border-b pb-3 border-gray-200">
          <div className="text-sm text-gray-700 mb-2 md:mb-0">
            <span>{formatNumber(video.views || 0)} views</span>
            <span className="mx-2">•</span>
            <span>{getRelativeTime(video.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="flex items-center rounded-full border border-gray-300 overflow-hidden">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-4 py-2 transition-colors duration-150
      ${video.isLiked ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600 hover:bg-gray-100"}
      ${likeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm font-medium">{formatNumber(video.likes?.count || 0)}</span>
              </button>

              <div className="w-px bg-gray-300"></div>

              <button
                onClick={handleDislike}
                disabled={dislikeLoading}
                className={`flex items-center gap-2 px-4 py-2 transition-colors duration-150
      ${video.isDisliked ? "bg-blue-50 text-blue-600" : "bg-white text-gray-600 hover:bg-gray-100"}
      ${dislikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span className="text-sm font-medium">{formatNumber(video.dislikes?.count || 0)}</span>
              </button>
            </div>

            <button className="flex items-center px-3 py-2 space-x-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <Share2 className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Share</span>
            </button>
            <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Info and Subscribe Button */}
        <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              onClick={() => navigate(`/users/channel/${video.owner?.userName}/${video.owner._id}`)}
              src={channel?.avatar || "https://via.placeholder.com/48"}
              alt={channel?.fullName || "Channel Avatar"}
              className="cursor-pointer w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <h2 className="font-semibold text-lg">
                {channel?.fullName || video.owner?.username || "Unknown Channel"}
              </h2>
              <p className="text-sm text-gray-600">
                {subscribersCount} subscribers
              </p>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={subLoading}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${isSubscribed
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-red-500 text-white hover:bg-red-600"
              }`}
          >
            {subLoading ? "..." : isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Description */}
        <div className="bg-gray-100 rounded-lg p-4 mt-4 text-gray-800 text-sm">
          <p className={showFullDescription ? "" : "line-clamp-3"}>
            {video.description}
          </p>
          {video.description && video.description.length > 200 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:underline mt-2 block"
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          {/* Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex items-start space-x-3">
              <img
                src={channel?.avatar || "https://via.placeholder.com/40"}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a public comment..."
                  className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:bg-gray-300 hover:bg-blue-600 transition-colors duration-200"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comment List */}
          {loading ? (
            <div className="text-center text-sm text-gray-500">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="bg-white p-4 border rounded shadow text-center text-sm text-gray-400">
              No comments yet. Be the first to comment!
            </div>
          ) : (

            <div className="space-y-4">

              {comments.map((comment) => (

                <div key={comment._id} className="flex space-x-3">
                  <img
                    src={comment.owner?.avatar || "https://via.placeholder.com/40"}
                    alt={comment.owner?.userName || "User"}
                    className="cursor-pointer w-10 h-10 rounded-full"
                    onClick={() => navigate(`/users/channel/${comment.owner?.userName}/${comment.owner._id}`)}
                  />
                  <div className="flex-1">
                    <div onClick={() => navigate(`/users/channel/${comment.owner?.userName}/${comment.owner._id}`)}
                      className="cursor-pointer flex items-center space-x-2">
                      <span className="text-sm font-medium">{comment.owner?.userName || "Unknown User"}</span>
                      <span className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</span>
                    </div>
                    {editingCommentId === comment._id ? (
                      <div className="mt-1">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditContent('');
                            }}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditComment(comment._id)}
                            disabled={!editContent.trim()}
                            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">{comment.content}</p>
                    )}
                    {currentUserId && String(currentUserId) == String(comment.owner?._id) && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditContent(comment.content);
                          }}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Videos */}
      <div className="w-full lg:w-1/3">
        <h3 className="text-md font-semibold mb-3">Recommended</h3>
        <div className="space-y-2">
          {recommendedVideos.map((vid) => (
            <div
              key={vid._id}
              className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition"
            >
              {/* Thumbnail */}
              <div
                className="w-2/5 aspect-video bg-gray-200 rounded-lg overflow-hidden flex-shrink-0"
                onClick={() => navigate(`/videos/watch/${vid._id}`)}
              >
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Video Info */}
              <div className="flex-1 overflow-hidden">
                <p
                  className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600"
                  onClick={() => navigate(`/videos/watch/${vid._id}`)}
                >
                  {vid.title}
                </p>

                <div className="flex items-center gap-2 mt-1">
                  {/* Channel Avatar */}
                  <img
                    src={vid.owner?.avatar || "/default-avatar.png"}
                    alt={vid.owner?.fullName || "Channel"}
                    className="w-5 h-5 rounded-full cursor-pointer"
                    onClick={() =>
                      navigate(`/users/channel/${vid.owner?.userName}/${vid.owner?._id}`)
                    }
                  />
                  <span
                    className="text-xs text-gray-600 truncate cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/users/channel/${vid.owner?.userName}/${vid.owner?._id}`)
                    }
                  >
                    {vid.owner?.fullName || "Unknown"}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-0.5">
                  {formatNumber(vid.views || 0)} views • {getRelativeTime(vid.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default VideoPlayerPage;