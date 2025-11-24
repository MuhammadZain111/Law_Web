import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Plus, Search, X, User, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "../../hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function LiveChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [initialMessage, setInitialMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Get auth token and user info
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const getUserId = () => {
    try {
      const token = getAuthToken();
      if (!token) return null;
      const [, payload] = String(token).split(".");
      if (!payload) return null;
      const json = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")) || "{}"
      );
      return json?.id || json?.userId || null;
    } catch (_e) {
      return null;
    }
  };

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = getAuthToken();
    const userId = getUserId();

    if (!token || !userId) {
      toast({
        title: "Authentication required",
        description: "Please login to use chat",
      });
      return;
    }

    const newSocket = io(API_BASE_URL, {
      auth: {
        token,
        userId,
      },
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setConnectionStatus("connected");
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnectionStatus("disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setConnectionStatus("error");
    });

    // Listen for new messages
    newSocket.on("new_message", (data) => {
      if (data.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, data.message]);
      }
      // Update conversation list
      fetchConversations();
    });

    // Listen for typing indicators
    newSocket.on("user_typing", (data) => {
      // Handle typing indicator if needed
      console.log("User typing:", data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch conversations");

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;

    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE_URL}/api/v1/messages/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
        // Join chat room
        if (socket) {
          socket.emit("join_chat", chatId);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch available users for starting conversation
  const fetchAvailableUsers = async () => {
    try {
      console.log("🚀 fetchAvailableUsers called - Starting...");
      const token = getAuthToken();
      const userId = getUserId();
      const userType = localStorage.getItem("userType");
      
      console.log("🔍 Fetching available users - userId:", userId, "userType:", userType);
      console.log("🔍 API URL will be:", `${API_BASE_URL}/api/v1/users`);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Failed to fetch users - status:", response.status, "error:", errorData);
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data = await response.json();
      console.log("📥 Available users response:", data);
      
      if (data.success) {
        const users = data.users || [];
        console.log(`✅ Found ${users.length} available users from API:`, users);
        console.log(`📋 Users details:`, users.map(u => ({
          _id: u._id?.toString(),
          name: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
          email: u.email
        })));
        
        // Remove duplicates based on _id to ensure unique users
        const uniqueUsers = [];
        const seenIds = new Set();
        const seenEmails = new Set();
        
        for (const user of users) {
          const userId = user._id?.toString() || user.id?.toString();
          const userEmail = user.email?.toLowerCase().trim();
          
          // Check by ID first (most reliable)
          if (userId && !seenIds.has(userId)) {
            seenIds.add(userId);
            if (userEmail) seenEmails.add(userEmail);
            uniqueUsers.push(user);
            console.log(`✅ Added user:`, {
              _id: userId,
              name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
              email: user.email
            });
          } else if (userEmail && !seenEmails.has(userEmail) && !userId) {
            // Fallback: check by email if no ID
            seenEmails.add(userEmail);
            uniqueUsers.push(user);
            console.log(`✅ Added user by email:`, user.email);
          } else if (!userId && !userEmail) {
            console.warn("⚠️ User without ID or email found:", user);
          } else {
            console.log(`⚠️ Duplicate user skipped:`, {
              _id: userId,
              email: userEmail,
              name: `${user.firstname || ""} ${user.lastname || ""}`.trim()
            });
          }
        }
        
        console.log(`✅ After deduplication: ${uniqueUsers.length} unique users`);
        console.log(`📋 Final unique users list:`, uniqueUsers.map(u => ({
          _id: u._id?.toString(),
          name: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
          email: u.email
        })));
        
        setAvailableUsers(uniqueUsers);
        
        if (users.length === 0) {
          console.warn("⚠️ No users available. This might be because:");
          console.warn("1. No appointments exist for this lawyer");
          console.warn("2. Clients from appointments are not registered as users");
        }
      } else {
        console.error("❌ API returned success: false", data);
        setAvailableUsers([]);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users. Please try again.",
        variant: "destructive",
      });
      setAvailableUsers([]);
    }
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat && selectedChat._id) {
      console.log("🔄 Chat selected, loading messages for:", selectedChat._id);
      fetchMessages(selectedChat._id);
      // Join chat room via socket
      if (socket) {
        socket.emit("join_chat", selectedChat._id);
        console.log("🔌 Joining chat room:", selectedChat._id);
      }
    } else {
      console.log("🔄 No chat selected, clearing messages");
      setMessages([]);
    }
  }, [selectedChat?._id, socket]); // Only depend on chat ID to avoid unnecessary re-renders

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const messageText = inputMessage.trim();
    setInputMessage("");

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/v1/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chatId: selectedChat._id,
          message: messageText,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        fetchConversations(); // Update conversation list
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
      });
      setInputMessage(messageText); // Restore message on error
    }
  };

  // Handle starting new conversation
  const handleStartConversation = async () => {
    console.log("🚀 handleStartConversation called - selectedUser:", selectedUser);
    
    if (!selectedUser) {
      console.error("❌ No user selected");
      toast({
        title: "Error",
        description: "Please select a user from the dropdown",
        variant: "destructive",
      });
      return;
    }
    
    console.log("✅ User selected, proceeding with chat creation:", {
      selectedUserId: selectedUser._id?.toString() || selectedUser.id?.toString(),
      selectedUserName: `${selectedUser?.firstname || ""} ${selectedUser?.lastname || ""}`.trim()
    });

    try {
      const token = getAuthToken();
      const userId = getUserId();
      
      // Get userType from localStorage (stored during login)
      const userType = localStorage.getItem("userType") || "user";
      console.log("🔍 Starting conversation - userId:", userId, "userType:", userType, "selectedUser:", selectedUser);

      // Determine lawyerId and clientId based on current user's role
      let lawyerId, clientId;
      
      // Get selected user ID (try multiple possible fields)
      const selectedUserId = selectedUser._id || selectedUser.id || null;
      
      if (!selectedUserId) {
        console.error("❌ Selected user missing ID:", selectedUser);
        throw new Error("Selected user ID is missing. Please select a user again.");
      }
      
      // Convert to string for consistency
      const selectedUserIdStr = selectedUserId.toString();
      const userIdStr = userId?.toString();
      
      console.log("🔍 User IDs - lawyer:", userIdStr, "client:", selectedUserIdStr, "selectedUser:", selectedUser);
      
      if (userType === "lawyer" || userType === "Lawyer") {
        // Current user is lawyer, selected user is client
        lawyerId = userIdStr;
        clientId = selectedUserIdStr;
      } else {
        // Current user is client/user, selected user should be lawyer
        lawyerId = selectedUserIdStr;
        clientId = userIdStr;
      }

      console.log("📤 Creating chat - lawyerId:", lawyerId, "clientId:", clientId, "userType:", userType);
      
      // Validate IDs before sending
      if (!lawyerId || !clientId) {
        throw new Error("Missing lawyer or client ID");
      }
      
      if (lawyerId === clientId) {
        throw new Error("Lawyer and client cannot be the same person");
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lawyerId,
          clientId,
        }),
      });

      const responseData = await response.json();
      console.log("📥 Chat creation response:", responseData);

      if (!response.ok) {
        const errorMessage = responseData.message || "Failed to create chat";
        console.error("❌ Chat creation failed:", {
          status: response.status,
          message: errorMessage,
          lawyerId,
          clientId,
          selectedUser
        });
        
        // Show specific error message
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw new Error(errorMessage);
      }

      if (responseData.success) {
        const newChat = responseData.chat;
        console.log("✅ Chat created successfully:", newChat);
        
        // Set the selected chat first
        setSelectedChat(newChat);
        
        // Close modal and reset form
        setShowStartModal(false);
        setSelectedUser(null);
        setInitialMessage("");
        
        // Fetch conversations to update the list
        await fetchConversations();
        
        // Load messages for the new chat
        if (newChat._id) {
          console.log("📥 Loading messages for chat:", newChat._id);
          await fetchMessages(newChat._id);
          
          // Join chat room via socket
          if (socket && newChat._id) {
            socket.emit("join_chat", newChat._id);
            console.log("🔌 Joined chat room:", newChat._id);
          }
        }
        
        // Send initial message if provided
        if (initialMessage.trim()) {
          setInputMessage(initialMessage.trim());
          // Wait a bit for chat to be fully set up before sending
          setTimeout(() => {
            handleSendMessage();
          }, 300);
        }
        
        toast({
          title: "Success",
          description: `Chat started with ${selectedUser?.firstname || selectedUser?.email || 'client'}`,
        });
      } else {
        throw new Error(responseData.message || "Failed to create chat");
      }
    } catch (error) {
      console.error("❌ Error starting conversation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  // Open start conversation modal
  const handleOpenStartModal = () => {
    console.log("🚀 Opening start conversation modal");
    // Reset selected user when opening modal
    setSelectedUser(null);
    setInitialMessage("");
    setShowStartModal(true);
    // Fetch available users when modal opens
    console.log("📥 Fetching available users...");
    fetchAvailableUsers();
  };

  // Get other participant name
  const getOtherParticipant = (chat) => {
    const userId = getUserId();
    const userType = localStorage.getItem("userType");
    
    // Handle both populated and non-populated chat objects
    const lawyerId = chat.lawyerId?._id || chat.lawyerId;
    const clientId = chat.clientId?._id || chat.clientId;
    const currentUserIdStr = userId?.toString();
    
    // Convert to strings for comparison
    const lawyerIdStr = lawyerId?.toString();
    const clientIdStr = clientId?.toString();
    
    console.log("🔍 Getting other participant:", {
      userId: currentUserIdStr,
      userType,
      lawyerId: lawyerIdStr,
      clientId: clientIdStr,
      chatLawyerId: chat.lawyerId,
      chatClientId: chat.clientId
    });
    
    // Safety check: ensure lawyerId and clientId are different
    if (lawyerIdStr && clientIdStr && lawyerIdStr === clientIdStr) {
      console.error("❌ ERROR: lawyerId and clientId are the same!", {
        lawyerId: lawyerIdStr,
        clientId: clientIdStr
      });
      // Return null to prevent incorrect display
      return null;
    }
    
    // If current user is lawyer, return client
    if (userType === "lawyer" || userType === "Lawyer") {
      // Verify current user is the lawyer in this chat
      if (currentUserIdStr && lawyerIdStr && currentUserIdStr === lawyerIdStr) {
        const other = chat.clientId;
        console.log("✅ Lawyer detected, returning client:", {
          _id: other?._id?.toString() || other?.toString(),
          name: other?.firstname || other?.email || 'Unknown'
        });
        return other;
      } else {
        console.warn("⚠️ Current user is lawyer but doesn't match chat lawyerId");
        return chat.clientId;
      }
    }
    
    // If current user is client, return lawyer
    if (currentUserIdStr && clientIdStr && currentUserIdStr === clientIdStr) {
      const other = chat.lawyerId;
      console.log("✅ Client detected, returning lawyer:", {
        _id: other?._id?.toString() || other?.toString(),
        name: other?.firstname || other?.email || 'Unknown'
      });
      return other;
    }
    
    // Fallback: if userType is lawyer, return client; otherwise return lawyer
    if (userType === "lawyer" || userType === "Lawyer") {
      return chat.clientId;
    }
    
    return chat.lawyerId;
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const other = getOtherParticipant(conv);
    const name = other?.firstname + " " + other?.lastname || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const currentUserId = getUserId();

  return (
    <div className="flex w-full h-full bg-gray-50 relative" style={{ height: '100%', maxHeight: '100%', overflow: 'hidden' }}>
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button
              onClick={handleOpenStartModal}
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, overflowY: 'auto' }}>
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isSelected = selectedChat?._id === conv._id;
              const unreadCount =
                JSON.parse(localStorage.getItem("user") || "{}")?.userType ===
                "lawyer"
                  ? conv.unreadCount?.lawyer || 0
                  : conv.unreadCount?.client || 0;

              return (
                <div
                  key={conv._id}
                  onClick={() => setSelectedChat(conv)}
                  className={`p-3 cursor-pointer hover:bg-amber-50 transition-colors border-l-4 ${
                    isSelected 
                      ? "bg-amber-50 border-amber-600" 
                      : "border-transparent hover:border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {other?.firstname?.[0]?.toUpperCase() ||
                        other?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {other?.firstname} {other?.lastname}
                        </p>
                        {conv.lastMessageAt && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTime(conv.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane - Messages */}
      <div className="flex-1 flex flex-col" style={{ minHeight: 0, height: '100%', overflow: 'hidden' }}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                {(() => {
                  const other = getOtherParticipant(selectedChat);
                  const displayName = `${other?.firstname || ""} ${other?.lastname || ""}`.trim() || other?.email || "Unknown";
                  const initial = other?.firstname?.[0]?.toUpperCase() || other?.email?.[0]?.toUpperCase() || "U";
                  
                  return (
                    <>
                      <div className="h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base text-gray-900 truncate">
                          {displayName}
                        </p>
                        {other?.email && (
                          <p className="text-xs text-gray-500 truncate">
                            {other.email}
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Connection Status Banner */}
            {connectionStatus !== "connected" && (
              <div className="bg-amber-600 text-white px-4 py-2 text-sm text-center flex-shrink-0">
                {connectionStatus === "error" ? (
                  <span>Connection failed - refresh page</span>
                ) : (
                  <span>Connecting...</span>
                )}
              </div>
            )}

            {/* Messages Area */}
            <div 
              className="flex-1 p-6 bg-gray-50" 
              style={{ 
                scrollBehavior: 'smooth',
                minHeight: 0,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                position: 'relative'
              }}
            >
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <div className="space-y-3 pb-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId?._id === currentUserId || msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                            isOwn
                              ? "bg-amber-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {msg.message}
                          </p>
                          <p
                            className={`text-xs mt-1.5 ${
                              isOwn ? "text-amber-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
            </div>
          </div>
                    );
                  })}
        <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
        <Input
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 rounded-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim()}
                  className="rounded-full h-10 w-10 p-0 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
          <Send className="h-4 w-4" />
        </Button>
      </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-700 mb-1">No conversation selected</p>
              <p className="text-sm text-gray-500">Select a conversation or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Start Conversation Modal */}
      {showStartModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStartModal(false);
              setSelectedUser(null);
              setInitialMessage("");
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Start Conversation</h3>
              </div>
              <button
                onClick={() => {
                  setShowStartModal(false);
                  setSelectedUser(null);
                  setInitialMessage("");
                }}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Select Client */}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Select a person to message
                </label>
                
                <Select
                  value={selectedUser ? (selectedUser._id?.toString() || selectedUser.id?.toString() || "") : ""}
                  onValueChange={(value) => {
                    console.log("🔍 onValueChange triggered with value:", value);
                    console.log("🔍 Available users count:", availableUsers.length);
                    console.log("🔍 All available user IDs:", availableUsers.map(u => ({
                      _id: u._id?.toString(),
                      id: u.id?.toString(),
                      name: `${u.firstname || ""} ${u.lastname || ""}`.trim()
                    })));
                    
                    // Value should be _id string - find exact match
                    const valueStr = value?.toString();
                    
                    // Find user by exact _id match only (most reliable)
                    const user = availableUsers.find(u => {
                      const uId = u._id?.toString();
                      const uIdAlt = u.id?.toString();
                      
                      // Exact match only - no email matching to avoid conflicts
                      const matches = uId === valueStr || uIdAlt === valueStr;
                      if (matches) {
                        console.log("✅ Found matching user:", {
                          value: valueStr,
                          uId,
                          uIdAlt,
                          user: u
                        });
                      }
                      return matches;
                    });
                    
                    if (user) {
                      console.log("✅ Selected user:", {
                        _id: user._id?.toString(),
                        name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
                        email: user.email
                      });
                      setSelectedUser(user);
                    } else {
                      console.error("❌ User not found for value:", value);
                      console.error("❌ Available user IDs:", availableUsers.map(u => ({
                        _id: u._id?.toString(),
                        id: u.id?.toString(),
                        name: `${u.firstname || ""} ${u.lastname || ""}`.trim()
                      })));
                      setSelectedUser(null);
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white hover:border-gray-300 transition-colors">
                    <SelectValue placeholder="Select a person...">
                      {selectedUser ? (
                          <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-semibold">
                              {selectedUser?.firstname?.[0]?.toUpperCase() || selectedUser?.email?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="text-gray-900">
                              {`${selectedUser?.firstname || ""} ${selectedUser?.lastname || ""}`.trim() || selectedUser?.email || "Selected"}
                            </span>
                          </div>
                      ) : (
                        <span className="text-gray-500">Select a person...</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent 
                    className="max-h-72 w-[var(--radix-select-trigger-width)] min-w-[350px] z-[10000] bg-white shadow-2xl border border-gray-200 rounded-lg mt-1"
                    position="popper"
                  >
                    {availableUsers.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        <p className="font-medium mb-1">No clients available</p>
                        <p className="text-xs">Clients with confirmed appointments will appear here</p>
                        <p className="text-xs mt-2 text-gray-400">
                          Only clients whose appointments have been confirmed are shown here.
                        </p>
                        <p className="text-xs mt-2 text-amber-600">
                          Make sure clients are registered users and appointments are confirmed.
                        </p>
                      </div>
                    ) : (
                      availableUsers.map((user, index) => {
                        // Use _id as primary (convert to string) - MUST be unique
                        const userId = user._id?.toString() || user.id?.toString();
                        
                        if (!userId) {
                          console.error("❌ User missing _id:", user);
                          return null; // Skip users without ID
                        }
                        
                        const displayName = `${user?.firstname || ""} ${user?.lastname || ""}`.trim() || user?.email || "Unknown";
                        
                        // Use only _id as value - this ensures unique matching
                        const userValue = userId;
                        const itemKey = `user-${userId}`; // Unique key for React
                        
                        return (
                          <SelectItem
                            key={itemKey}
                            value={userValue}
                            className="cursor-pointer py-3 px-4 hover:bg-amber-50 focus:bg-amber-50"
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="h-10 w-10 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                                {user?.firstname?.[0]?.toUpperCase() ||
                                  user?.email?.[0]?.toUpperCase() ||
                                  "U"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900">
                                  {displayName}
                                </p>
                                {user?.email && (
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Message Input */}
              <div>
                <label className="text-sm font-semibold text-gray-800 mb-2 block">
                  Message (Optional)
                </label>
                <textarea
                  placeholder="Say something..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm bg-gray-50/50 hover:bg-gray-50 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-medium"
                  onClick={() => {
                    setShowStartModal(false);
                    setSelectedUser(null);
                    setInitialMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    console.log("🔘 Start Chat button clicked");
                    console.log("🔍 Current selectedUser state:", selectedUser);
                    console.log("🔍 Available users:", availableUsers.length);
                    handleStartConversation();
                  }}
                  disabled={!selectedUser}
                >
                  {selectedUser ? `Start Chat with ${selectedUser?.firstname || selectedUser?.email || 'Client'}` : 'Please select a person first'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
