import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // headers: {
  //   Authorization: import.meta.env.VITE_API_AUTHORIZATION,
  // },
});

AxiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // localStorage.removeItem("userId");
      window.location.href = "/auth"; // `/auth` sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(function (request) {
  request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  // request.headers["User-Id"] = localStorage.getItem("userId");
  return request;
});

export default AxiosInstance;
