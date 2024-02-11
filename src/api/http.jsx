import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: import.meta.env.VITE_API_AUTHORIZATION,
  },
});

AxiosInstance.interceptors.response.use(
  function (response) {
    // response.code === 401 ->

    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    // navigate to login

    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(function (request) {
  // request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  // request.headers["User-Id"] = localStorage.getItem("userId");

  return request;
});

export default AxiosInstance;
