import React, { useEffect, useState, useRef } from "react";
import { Carousel, Image, Spin, Typography, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../api/http";
import styled from "styled-components";
import { t } from "i18next";
import { CiImageOn } from "react-icons/ci";

const { Text } = Typography;

const CenteredDiv = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  height: 180px !important;
  flex-direction: column;
  gap: 8px;
`;

// Carousel komponenti için özel stil
const CustomCarousel = styled(Carousel)`
  .slick-slide {
    text-align: center;
  }

  .slick-slide > div {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .slick-dots {
    li {
      margin: 0 -2px;

      button {
        width: 10px;
        height: 3px;
      }

      &.slick-active {
        width: 19px;
        button {
          width: 13px;
        }
      }
    }
  }
`;

const ResimCarousel = ({ makineID, refreshKey }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchResimIdsAndImages = async () => {
      if (!makineID) return;
      setLoading(true);

      try {
        const resimIdResponse = await AxiosInstance.get(`GetResimIds?RefId=${makineID}&RefGrup=MAKINE`);
        const resimIDler = resimIdResponse.data || resimIdResponse;

        if (Array.isArray(resimIDler) && resimIDler.length > 0) {
          const urls = await Promise.all(
            resimIDler.map(async (id) => {
              const resimResponse = await AxiosInstance.get(`ResimGetirById?id=${id}`, {
                responseType: "blob",
              });
              return URL.createObjectURL(resimResponse);
            })
          );
          setImageUrls(urls);
        } else {
          setImageUrls([]);
        }
      } catch (error) {
        console.error("Resim ID'leri veya resimler alınırken bir hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResimIdsAndImages();
  }, [makineID, refreshKey]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "180px" }}>
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

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setPreviewOpen(true);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {imageUrls.length > 0 ? (
        <>
          <Button
            shape="circle"
            icon={<LeftOutlined style={{ fontSize: "12px" }} />}
            onClick={prev}
            style={{
              position: "absolute",
              zIndex: 1,
              top: "50%",
              left: 5,
              transform: "translate(0, -50%)",
              opacity: 0.7,
              padding: "0px",
              minWidth: "0px",
              width: "24px",
              height: "24px",
            }}
          />
          <CustomCarousel autoplay ref={carouselRef} style={{ width: "100%", height: "100%" }}>
            {imageUrls.map((url, index) => (
              <div key={index} style={{ width: "100%", height: "180px", textAlign: "center" }}>
                <Image
                  src={url}
                  alt={`Resim ${index}`}
                  style={{ height: "180px", maxWidth: "100%", objectFit: "contain", borderRadius: "6px", cursor: "pointer" }}
                  preview={false}
                  onClick={() => handleImageClick(index)}
                />
              </div>
            ))}
          </CustomCarousel>
          <Button
            shape="circle"
            icon={<RightOutlined style={{ fontSize: "12px" }} />}
            onClick={next}
            style={{
              position: "absolute",
              zIndex: 1,
              top: "50%",
              right: 5,
              transform: "translate(0, -50%)",
              opacity: 0.7,
              padding: "0px",
              minWidth: "0px",
              width: "24px",
              height: "24px",
            }}
          />

          {/* Controlled preview with unique images */}
          <div style={{ display: "none" }}>
            <Image.PreviewGroup
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                current: currentIndex,
                onChange: (index) => setCurrentIndex(index),
              }}
              items={imageUrls.map((url) => ({ src: url }))}
            />
          </div>
        </>
      ) : (
        <div className="w-full min-h-[180px] border-2 border-dashed border-[#d9d9d9] rounded-[6px] flex items-center justify-center bg-[#fafafa]">
          <CenteredDiv>
            <CiImageOn className="text-[28px] text-[#bfbfbf]" />
            <Text type="secondary">{t("resimBulunamadi")}</Text>
          </CenteredDiv>
        </div>
      )}
    </div>
  );
};

export default ResimCarousel;
