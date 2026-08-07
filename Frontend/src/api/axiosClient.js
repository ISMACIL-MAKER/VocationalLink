import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://vocationallink.onrender.com/api"  || "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

let refreshPromise = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (status !== 401 || isAuthEndpoint || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axiosClient
          .post("/auth/refresh")
          .finally(() => {
            refreshPromise = null;
          });
      }
      const { data } = await refreshPromise;
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      clearSession();
      window.location.href = "/Login";
      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
