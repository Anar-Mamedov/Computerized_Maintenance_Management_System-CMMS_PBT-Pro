import axios from "axios";

const normalizeBaseURL = (url) => String(url || "").replace(/\/+$/, "");
const createApiBaseURL = (url) => `${normalizeBaseURL(url)}/api/`;
const createPdfBaseURL = (url) => `${normalizeBaseURL(url)}/FormRapor/`;

// `localStorage`'dan baseURL alınıyor
const baseURL = localStorage.getItem("baseURL") || import.meta.env.VITE_API_BASE_URL;

const AxiosInstance = axios.create({
  baseURL: createApiBaseURL(baseURL), // baseURL artık dinamik
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
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.removeItem("login");
      sessionStorage.removeItem("login");
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
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  request.headers.Authorization = `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`;
  if (user) {
    // user objesi varsa
    request.headers["User-Id"] = user.userId; // User-Id başlığını ekliyoruz
  }
  // request.headers["User-Id"] = localStorage.getItem("userId");
  return request;
});

// burdan sonrasini sil
const PdfAxiosInstance = axios.create({
  baseURL: createPdfBaseURL(baseURL),
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
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.removeItem("login");
      sessionStorage.removeItem("login");
      // localStorage.removeItem("userId");
      window.location.href = "/auth"; // `/auth` sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

PdfAxiosInstance.interceptors.request.use(function (request) {
  const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
  request.headers.Authorization = `Bearer ${localStorage.getItem("token") || sessionStorage.getItem("token")}`;
  if (user) {
    // user objesi varsa
    request.headers["User-Id"] = user.userId; // User-Id başlığını ekliyoruz
  }
  // request.headers["User-Id"] = localStorage.getItem("userId");
  return request;
});
export { PdfAxiosInstance };
// burdan qeder sil

export const setApiBaseURL = (nextBaseURL) => {
  const normalizedBaseURL = normalizeBaseURL(nextBaseURL);

  if (!normalizedBaseURL) {
    return;
  }

  AxiosInstance.defaults.baseURL = createApiBaseURL(normalizedBaseURL);
  PdfAxiosInstance.defaults.baseURL = createPdfBaseURL(normalizedBaseURL);
};

export default AxiosInstance;
