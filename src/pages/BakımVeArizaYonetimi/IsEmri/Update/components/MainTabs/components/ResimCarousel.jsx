import React, { useEffect, useState, useRef } from "react";
import { Carousel, Image, Spin, message, Typography, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

const { Text } = Typography;

const ResimCarousel = () => {
  const { watch } = useFormContext();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const secilenIsEmriID = watch("secilenIsEmriID");
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchResimIdsAndImages = async () => {
      if (!secilenIsEmriID) return;
      setLoading(true);

      try {
        const resimIdResponse = await AxiosInstance.get(`GetResimIds?RefId=${secilenIsEmriID}&RefGrup=ISEMRI`);
        // API'den gelen response doğru şekilde işlenmelidir, burada doğrudan kullanılmıştır.
        const resimIDler = resimIdResponse; // API'den gelen response'a uygun şekilde ayarlayın

        const urls = await Promise.all(
          resimIDler.map(async (id) => {
            const resimResponse = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
              responseType: "blob",
            });
            return URL.createObjectURL(resimResponse); // Blob'dan URL oluştur
          })
        );

        setImageUrls(urls);
      } catch (error) {
        console.error("Resim ID'leri veya resimler alınırken bir hata oluştu:", error);
        message.error("Resimler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchResimIdsAndImages();
  }, [secilenIsEmriID]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "260px" }}>
        <Spin size="large" />
      </div>
    );
  }

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prev}
        style={{ position: "absolute", zIndex: 1, top: "50%", left: 0, transform: "translate(0, -50%)", opacity: 0.5 }}
      />
      <Carousel autoplay ref={carouselRef} style={{ width: "250px", margin: "auto" }}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index}>
              <Image src={url} alt={`Resim ${index}`} style={{ width: "100%", height: "260px", objectFit: "cover" }} />
            </div>
          ))
        ) : (
          <div>
            <Text>Resim bulunamadı.</Text>
          </div>
        )}
      </Carousel>
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={next}
        style={{ position: "absolute", zIndex: 1, top: "50%", right: 0, transform: "translate(0, -50%)", opacity: 0.5 }}
      />
    </div>
  );
};

export default ResimCarousel;
