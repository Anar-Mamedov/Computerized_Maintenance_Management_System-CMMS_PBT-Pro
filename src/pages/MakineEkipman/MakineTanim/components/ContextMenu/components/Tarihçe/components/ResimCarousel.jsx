import React, { useEffect, useState, useRef } from "react";
import { Carousel, Image, Spin, message, Typography, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import styled from "styled-components";

const { Text } = Typography;

const CenteredDiv = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 110px !important;
`;
// Carousel komponenti için özel stil
const CustomCarousel = styled(Carousel)`
  .slick-dots {
    li {
      margin: 0 -2px; // Noktalar arası mesafeyi ayarlayın

      button {
        width: 10px; // Nokta genişliğini ayarlayın
        height: 3px; // Nokta yüksekliğini ayarlayın
      }

      &.slick-active {
        width: 19px; // Nokta genişliğini ayarlayın
        button {
          width: 13px; // Nokta genişliğini ayarlayın
        }
      }
    }
  }
`;

const ResimCarousel = ({ selectedRows }) => {
  const { watch } = useFormContext();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const secilenMakineID = selectedRows[0].key;
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchResimIdsAndImages = async () => {
      if (!secilenMakineID) return;
      setLoading(true);

      try {
        const resimIdResponse = await AxiosInstance.get(`GetResimIds?RefId=${secilenMakineID}&RefGrup=MAKINE`);
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
  }, [secilenMakineID]);

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
    <div style={{ position: "relative", width: "100px" }}>
      <Button
        shape="circle"
        icon={<LeftOutlined style={{ fontSize: "9px" }} />}
        onClick={prev}
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50%",
          left: 0,
          transform: "translate(0, -50%)",
          opacity: 0.5,
          padding: "0px",
          minWidth: "0px",
          width: "18px", // Küçültülmüş düğme genişliği
          height: "18px", // Küçültülmüş düğme yüksekliği
          fontSize: "10px", // Küçültülmüş font boyutu
        }}
      />
      <CustomCarousel autoplay ref={carouselRef} style={{ width: "100px", margin: "auto" }}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index}>
              <Image src={url} alt={`Resim ${index}`} style={{ width: "100px", height: "110px", objectFit: "cover" }} />
            </div>
          ))
        ) : (
          <CenteredDiv>
            <Text>Resim Yok</Text>
          </CenteredDiv>
        )}
      </CustomCarousel>
      <Button
        shape="circle"
        icon={<RightOutlined style={{ fontSize: "9px" }} />}
        onClick={next}
        style={{
          position: "absolute",
          zIndex: 1,
          top: "50%",
          right: 0,
          transform: "translate(0, -50%)",
          opacity: 0.5,
          padding: "0px",
          minWidth: "0px",
          width: "18px", // Küçültülmüş düğme genişliği
          height: "18px", // Küçültülmüş düğme yüksekliği
          fontSize: "10px", // Küçültülmüş font boyutu
        }}
      />
    </div>
  );
};

export default ResimCarousel;
