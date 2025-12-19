// src/api/friendsApi.js
import api from "./api";

/* FRIENDS */
export const getFriends = () => api.get("/friends");

export const getPendingRequests = () => api.get("/friends/requests");

export const getSentRequests = () => api.get("/friends/requests/sent");

/* ACTIONS */
export const sendFriendRequest = (friendUserId) =>
  api.post("/friends/request", { friendUserId });

export const acceptFriendRequest = (requestId) =>
  api.post(`/friends/accept/${requestId}`);

export const rejectFriendRequest = (requestId) =>
  api.post(`/friends/reject/${requestId}`);

export const removeFriend = (friendUserId) =>
  api.delete(`/friends/remove/${friendUserId}`);

/* SEARCH */
export const searchUsers = (query) =>
  api.get(`/users/search?q=${encodeURIComponent(query)}`);

export const openConversation = (friendUserId) =>
  api.post(`/conversations/with/${friendUserId}`);

