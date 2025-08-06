import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Conversation, User as UserType } from "../types";
import Chat from "../components/Chat";

const Message: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        let conversationId = id;
        console.log("Current conversation ID:", conversationId);
        console.log("Current user:", currentUser);

        // If no conversation ID, try to create one from gigId
        if (!conversationId) {
          const gigId = searchParams.get("gigId");
          console.log("Gig ID from params:", gigId);

          if (gigId && currentUser) {
            try {
              // Try to find existing conversation
              console.log("Trying to find existing conversation...");
              const response = await api.get(`/conversations/gig/${gigId}`);
              conversationId = response.data._id;
              console.log("Found existing conversation:", conversationId);
            } catch (error) {
              console.log(
                "No existing conversation found, creating new one..."
              );
              // Create new conversation
              const gigResponse = await api.get(`/gigs/single/${gigId}`);
              console.log("Gig data:", gigResponse.data);
              const newConversation = await api.post("/conversations", {
                to: gigResponse.data.userId,
              });
              conversationId = newConversation.data._id;
              console.log("Created new conversation:", conversationId);
            }
          }
        }

        if (conversationId) {
          console.log(
            "Fetching conversation and messages for ID:",
            conversationId
          );
          try {
            const [conversationResponse, messagesResponse] = await Promise.all([
              api.get(`/conversations/single/${conversationId}`),
              api.get(`/messages/${conversationId}`),
            ]);

            console.log("Conversation data:", conversationResponse.data);
            console.log("Messages data:", messagesResponse.data);

            setConversation(conversationResponse.data);

            // Get other user details
            const otherUserId =
              conversationResponse.data.sellerId === currentUser?._id
                ? conversationResponse.data.buyerId
                : conversationResponse.data.sellerId;

            console.log("Other user ID:", otherUserId);

            try {
              const userResponse = await api.get(`/users/${otherUserId}`);
              setOtherUser(userResponse.data);
              console.log("Other user data:", userResponse.data);
            } catch (error) {
              console.error("Error fetching other user:", error);
            }
          } catch (error) {
            console.error("Error fetching conversation or messages:", error);
          }
        } else {
          console.log("No conversation ID available");
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchConversation();
    }
  }, [id, searchParams, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!conversation || !otherUser) {
    const gigId = searchParams.get("gigId");

    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start a Conversation
          </h2>
          <p className="text-gray-600 mb-6">
            {gigId
              ? "Click below to start chatting with the seller about this gig."
              : "The conversation you're looking for doesn't exist."}
          </p>
          {gigId && currentUser && (
            <button
              onClick={async () => {
                try {
                  const gigResponse = await api.get(`/gigs/single/${gigId}`);
                  const newConversation = await api.post("/conversations", {
                    to: gigResponse.data.userId,
                  });
                  // Redirect to the new conversation
                  window.location.href = `/message/${newConversation.data._id}`;
                } catch (error) {
                  console.error("Error creating conversation:", error);
                }
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Chat
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)]">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
            <button
              onClick={() => window.history.back()}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {otherUser.img ? (
                  <img
                    src={otherUser.img}
                    alt={otherUser.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {otherUser.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {conversation.readBySeller && conversation.readByBuyer
                    ? "Online"
                    : "Last seen recently"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Component */}
          <div className="flex-1 overflow-hidden">
            <Chat
              conversationId={conversation._id}
              otherUser={{
                username: otherUser.username,
                img: otherUser.img,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
