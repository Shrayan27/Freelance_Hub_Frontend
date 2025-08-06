import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, User, Clock } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Conversation, User as UserType } from "../types";

const Messages: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserType }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get("/conversations");
      setConversations(response.data);

      // Fetch user details for each conversation
      const userIds = new Set<string>();
      response.data.forEach((conv: Conversation) => {
        if (conv.sellerId !== currentUser?._id) userIds.add(conv.sellerId);
        if (conv.buyerId !== currentUser?._id) userIds.add(conv.buyerId);
      });

      const userDetails: { [key: string]: UserType } = {};
      // Convert Set to Array for iteration
      const userIdArray = Array.from(userIds);
      for (const userId of userIdArray) {
        try {
          const userResponse = await api.get(`/users/${userId}`);
          userDetails[userId] = userResponse.data;
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
      setUsers(userDetails);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (conversation: Conversation) => {
    const otherUserId =
      conversation.sellerId === currentUser?._id
        ? conversation.buyerId
        : conversation.sellerId;
    return users[otherUserId];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Connect with buyers and sellers</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start a conversation by purchasing a service or creating a gig
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/gigs" className="btn-primary">
                  Browse Services
                </Link>
                {currentUser?.isSeller && (
                  <Link to="/add-gig" className="btn-outline">
                    Create Gig
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const isUnread = currentUser?.isSeller
                  ? !conversation.readBySeller
                  : !conversation.readByBuyer;

                return (
                  <Link
                    key={conversation._id}
                    to={`/message/${conversation._id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            {otherUser?.img ? (
                              <img
                                src={otherUser.img}
                                alt={otherUser.username}
                                className="w-12 h-12 rounded-full"
                              />
                            ) : (
                              <User size={24} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`text-sm font-medium ${
                                  isUnread ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {otherUser?.username || "Unknown User"}
                              </p>
                              {conversation.lastMessage && (
                                <p
                                  className={`text-sm truncate ${
                                    isUnread ? "text-gray-900" : "text-gray-500"
                                  }`}
                                >
                                  {conversation.lastMessage}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatDate(conversation.updatedAt)}
                              </span>
                            </div>
                          </div>
                          {isUnread && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                New message
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
