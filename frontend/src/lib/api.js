import axiosInstance from '../lib/axios.js';

export const signup = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  return response.data;
}

export const getAuthUser = async() => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch(error) {
    return null; // so reaccccccct navigates to login page when user logs out
  }
}

export const updateProfile = async (profileData) => {
  const response = await axiosInstance.post("/auth/bio", profileData);
  console.log("Profile updated:", response.data);
  return response.data;
}  

export const login = async (loginData) => {
  const response = await axiosInstance.post('/auth/login', loginData);
  return response.data;
}

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
}

export const getUserFriends = async () => {
  const response = await axiosInstance.get('/user/friends');
  console.log(response.data);
  return response.data.friends;
}

export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get('/user');
  return response.data.recommendedUsers;
}

export const getOutFriendGoingRequests = async () => {
  const response = await axiosInstance.get('/user/outgoing-friend-requests');
  return response.data.outgoingRequests;
}

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data.request;
}

export const getFriendRequests = async () => {
  const response = await axiosInstance.get('/user/friend-requests');
  return response.data;
}

export const acceptFriendRequest = async (id) => {
  const response = await axiosInstance.put(`/user/friend-request/accept/${id}`);
  return response.data;
};

export const rejectFriendRequest = async (id) => {
  const response = await axiosInstance.put(`/user/friend-request/reject/${id}`);
  return response.data;
};

export const cancelFriendRequest = async (id) => {
  const response = await axiosInstance.delete(`/user/friend-request/cancel/${id}`);
  return response.data;
};

export const getStreamToken = async () => {
  const response = await axiosInstance.get('/chat/token');
  console.log("Stream token response:", response.data);
  return response.data;
}