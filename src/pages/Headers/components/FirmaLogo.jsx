import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../api/http.jsx";
import { Spin } from "antd";

function FirmaLogo(props) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get("ResimGetirById?id=1", {
          responseType: "blob",
        });
        const blob = new Blob([response], { type: "image/jpeg" });
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
      setLoading(false);
    };

    fetchImage();
  }, []);

  if (loading) {
    return <Spin />;
  } else if (imageUrl) {
    return <img src={imageUrl} alt="Firma Logo" style={{ height: "25px" }} />;
  } else {
    return null;
  }
}

export default FirmaLogo;
