import AxiosInstance from "../../../api/http";

// Lastik ekranları ATS'den taşındı ve axios yanıtını ({ data }) şeklinde bekliyor.
// PBT AxiosInstance yanıt yerine doğrudan veriyi döndürdüğü için veri burada tekrar { data } içine alınır.
const wrapResponse = (request) => request.then((data) => ({ data }));

const LastikHttp = {
  get: (url, config) => wrapResponse(AxiosInstance.get(url, config)),
  post: (url, data, config) => wrapResponse(AxiosInstance.post(url, data, config)),
  put: (url, data, config) => wrapResponse(AxiosInstance.put(url, data, config)),
  delete: (url, config) => wrapResponse(AxiosInstance.delete(url, config)),
};

export default LastikHttp;
