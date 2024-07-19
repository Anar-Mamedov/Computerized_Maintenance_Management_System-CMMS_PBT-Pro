import React, { useEffect, useState } from "react";
import AxiosInstance from "../../api/http";

function UserIdControl(props) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`getIDebu`); // API URL'niz
        setUserId(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setUserId("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, []);

  return <div>{userId}</div>;
}

export default UserIdControl;
