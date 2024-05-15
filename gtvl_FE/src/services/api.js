import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HOST = "https://bebebe14172.pythonanywhere.com/";
export const BASE_MEDIA_URL = `${HOST}media/`;

export const endpoints = {
  jobs: "/api/jobs/",
  jobDetails: (jobId) => `/api/jobs/${jobId}/`,
  employerProfile: "/api/employers/",
  candidateProfile: "/api/applicants/",
  applications: "/api/applications/",
  applyToJob: (jobId) => `/api/jobs/${jobId}/applications/`,
  login: "/o/token/",
  currentUser: "/api/users/me/",
  register: "/api/users/",
  searchApplicants: "/api/applicants/search/",
};

// Instance Axios cho các request không cần authentication
const apiClient = axios.create({
  baseURL: HOST,
  validateStatus: (status) => status >= 200 && status < 500,
});

// Instance Axios cho các request cần authentication
export const authApi = axios.create({
  baseURL: HOST,
});

authApi.interceptors.request.use(async (config) => {
  if (config.url !== endpoints.login) {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token in interceptor:", token);
      console.log("Headers in interceptor:", config.headers);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      console.log("Response data:", response.data);
      return response.data;
    } else {
      console.error("Lỗi server:", response.status, response.data);
      throw new Error("Lỗi server");
    }
  },
  (error) => {
    console.error("Lỗi API:", error);
    if (error.response) {
      const { status, data } = error.response;
      // Xử lý các status code khác
    } else if (error.request) {
      console.error("Không nhận được response");
    } else {
      console.error("Lỗi:", error.message);
    }
    return Promise.reject(error);
  }
);

export const getUserProfile = async () => {
  try {
    const response = await authApi.get(endpoints.currentUser); // Sử dụng authApi
    console.log("User profile response:", response.data);

    const userData = { ...response.data };
    userData.avatar = BASE_MEDIA_URL + userData.avatar;

    return userData;
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    throw error;
  }
};

export const getJobs = async () => {
  try {
    const response = await apiClient.get(endpoints.jobs); // Sử dụng apiClient
    console.log("Jobs response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
  }
};

export const searchApplicants = async (searchTerm) => {
  try {
    const response = await apiClient.get(endpoints.searchApplicants, {
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi tìm kiếm ứng viên:", error);
    throw error;
  }
};

export default apiClient;
