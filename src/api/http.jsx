import axios from "axios";

// `localStorage`'dan baseURL alınıyor
const baseURL =
  localStorage.getItem("baseURL") || import.meta.env.VITE_API_BASE_URL;

const AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/`, // baseURL artık dinamik
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
      localStorage.removeItem("login");
      // localStorage.removeItem("userId");
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth"; // `/auth` sayfasına yönlendir
      }
      // window.location.href = "/auth"; // `/auth` sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(function (request) {
  const user = JSON.parse(localStorage.getItem("user"));
  request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  if (user) {
    // user objesi varsa
    request.headers["User-Id"] = user.userId; // User-Id başlığını ekliyoruz
  }
  // request.headers["User-Id"] = localStorage.getItem("userId");
  return request;
});

// burdan sonrasini sil
const PdfAxiosInstance = axios.create({
  baseURL: `${baseURL}/FormRapor/`,
  // headers: {
  //   Authorization: import.meta.env.VITE_API_AUTHORIZATION,
  // },
});

PdfAxiosInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("login");
      // localStorage.removeItem("userId");
      window.location.href = "/auth"; // `/auth` sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

PdfAxiosInstance.interceptors.request.use(function (request) {
  const user = JSON.parse(localStorage.getItem("user"));
  request.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  if (user) {
    // user objesi varsa
    request.headers["User-Id"] = user.userId; // User-Id başlığını ekliyoruz
  }
  // request.headers["User-Id"] = localStorage.getItem("userId");
  return request;
});
export { PdfAxiosInstance };
// burdan qeder sil

export default AxiosInstance;
