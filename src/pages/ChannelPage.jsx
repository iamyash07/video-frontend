import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import { useParams, Link } from "react-router-dom";

export default function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const endpoint = username ? `/users/c/${username}` : `/users/c`;

  const fetchChannel = () => {
    api
      .get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setChannel(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChannel();
  }, [username]);

  const handleSubscribe = async () => {
    try {
      await api.post(
        `/subscriptions/subscribe/${channel._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChannel(); // refresh channel info
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await api.post(
        `/subscriptions/unsubscribe/${channel._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchChannel();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading channel...</p>;
  if (!channel) return <p className="text-center mt-10">Channel not found</p>;

  const isMe = channel?.isCurrentUser;
  const isSubscribed = channel?.isSubscribed;

  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow overflow-hidden">
      {/* COVER IMAGE */}
      <div className="w-full h-40 md:h-56 bg-gray-300 dark:bg-gray-700">
        {channel.coverImage?.url && (
          <img
            src={channel.coverImage.url}
            className="w-full h-full object-cover"
            alt="Cover"
          />
        )}
      </div>

      {/* CHANNEL HEADER */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <img
            src={channel.avatar?.url}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow"
            alt="Avatar"
          />

          {/* Name + Subscribers */}
          <div>
            <h1 className="text-2xl font-bold">{channel.fullName}</h1>
            <p className="text-gray-500 dark:text-gray-400">@{channel.username}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {channel.subscribersCount} subscribers
            </p>
          </div>
        </div>

        {/* SUBSCRIBE BUTTON */}
        {!isMe && (
          <div className="mt-4 md:mt-0">
            {!isSubscribed ? (
              <button
                onClick={handleSubscribe}
                className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
              >
                Subscribe
              </button>
            ) : (
              <button
                onClick={handleUnsubscribe}
                className="px-6 py-2 bg-gray-700 text-white rounded-full font-semibold hover:bg-gray-800"
              >
                Subscribed ✓
              </button>
            )}
          </div>
        )}
      </div>

      {/* CHANNEL VIDEOS */}
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Videos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channel.videos?.map((video) => (
            <Link
              to={`/video/${video._id}`}
              key={video._id}
              className="bg-gray-100 dark:bg-gray-800 p-3 rounded shadow hover:scale-[1.01] transition"
            >
              <img
                src={video.thumbnail?.url}
                alt={video.title}
                className="w-full h-36 object-cover rounded"
              />

              <h3 className="font-bold mt-2">{video.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {video.description}
              </p>

              <p className="text-xs mt-1 text-gray-400">{video.views} views</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
