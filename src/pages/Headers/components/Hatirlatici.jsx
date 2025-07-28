import React, { useEffect, useState } from "react";
import { Button, Collapse, Popover, Badge, Spin, Modal, Card, Row, Col } from "antd";
import { BellOutlined, RightOutlined } from "@ant-design/icons";
import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";
import YaklasanPeriyodikBakimlar from "./Tables/YaklasanPeriyodikBakimlar/PeryodikBakimlar.jsx";

const StyledCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0px 10px !important;
  }

  .ant-collapse-header {
    padding: 5px 10px !important;
  }

  .ant-collapse-header-text {
    color: #0239de !important;
  }
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 16px;
  }

  .ant-card-head-title {
    font-weight: 600;
    font-size: 14px;
  }

  .ant-card-body {
    padding: 12px 16px;
  }
`;

const ReminderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

const ColorBar = styled.div`
  width: 4px;
  height: 16px;
  border-radius: 2px;
  margin-right: 12px;
  background-color: ${(props) => {
    if (props.isCritical) return "#ff4d4f";
    if (props.isWarning) return "#faad14";
    return "#1890ff";
  }};
`;

const BadgePill = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  background-color: ${(props) => {
    if (props.isCritical) return "#ff4d4f";
    if (props.isWarning) return "#faad14";
    return "#1890ff";
  }};
`;

const PopoverContent = styled.div`
  display: flex;
  max-height: calc(100vh - 100px);
  /* width: 100%; */
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px 0;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  overflow: auto;
  max-height: calc(100vh - 200px);
  align-items: start;
`;

export default function HatirlaticiPopover({ hatirlaticiData, loading, open, setOpen }) {
  const [hatirlaticiDataCount, setHatirlaticiDataCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (hatirlaticiData?.data) {
      const total = hatirlaticiData.data.reduce((acc, group) => {
        return acc + group.ToplamKayit;
      }, 0);
      setHatirlaticiDataCount(total);
    }
  }, [hatirlaticiData]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleItemClick = (title, contentComponent) => {
    setModalTitle(title);
    setModalContent(contentComponent);
    setIsModalOpen(true);
    setOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const getColorForItem = (item) => {
    // API'den gelen Kritik alanını kullan
    if (item.Kritik === 1) {
      return { isCritical: true, isWarning: false };
    }

    // Kritik durumlar için kırmızı
    if (item.Aciklama2.includes("Geçen") || item.Aciklama2.includes("Arıza") || item.Aciklama2.includes("Kritik")) {
      return { isCritical: true, isWarning: false };
    }
    // Uyarı durumları için sarı
    if (item.Aciklama2.includes("Yaklaşan") || item.Aciklama2.includes("Bekleyen")) {
      return { isCritical: false, isWarning: true };
    }
    // Normal durumlar için mavi
    return { isCritical: false, isWarning: false };
  };

  const content = (
    <PopoverContent>
      <HeaderSection>Hatırlatıcı ({hatirlaticiData?.toplam_hatirlatici || 0})</HeaderSection>

      {loading ? (
        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : hatirlaticiData?.data ? (
        <CardsGrid>
          {hatirlaticiData.data.map((group) => (
            <StyledCard key={group.GrupId} title={`${group.GrupAdi} (${group.ToplamKayit})`} size="small">
              {group.Hatirlaticilar.map((item) => {
                const colors = getColorForItem(item);
                return (
                  <ReminderItem key={item.SiraId}>
                    <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <ColorBar isCritical={colors.isCritical} isWarning={colors.isWarning} />
                      <span style={{ fontSize: "13px", color: "#333" }}>{item.Aciklama2}</span>
                    </div>
                    <BadgePill isCritical={colors.isCritical} isWarning={colors.isWarning}>
                      {item.Deger}
                    </BadgePill>
                  </ReminderItem>
                );
              })}
            </StyledCard>
          ))}
        </CardsGrid>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>Hatırlatıcı bulunamadı</div>
      )}
    </PopoverContent>
  );

  return (
    <>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        overlayStyle={{
          width: "1200px",
          maxWidth: "90vw",
        }}
      >
        <Badge size="small" count={hatirlaticiDataCount}>
          {loading ? <Spin /> : <FaRegCalendarAlt style={{ fontSize: "22px", cursor: "pointer" }} />}
        </Badge>
      </Popover>
      <Modal title={modalTitle} open={isModalOpen} width={1300} onCancel={handleModalClose} footer={null}>
        {modalContent}
      </Modal>
    </>
  );
}
