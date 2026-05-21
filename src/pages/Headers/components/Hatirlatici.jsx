import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Popover, Badge, Spin, Modal, Card, Alert } from "antd";
import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import YaklasanPeriyodikBakimlar from "./Tables/YaklasanPeriyodikBakimlar/PeryodikBakimlar.jsx";

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  break-inside: avoid;
  page-break-inside: avoid;

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
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #f0f0f0;
  }

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
  overflow-y: auto;
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
  column-width: 300px;
  column-gap: 16px;
`;

export default function HatirlaticiPopover({ hatirlaticiData = null, loading = false, open = false, setOpen }) {
  const { t } = useTranslation();
  const [hatirlaticiDataCount, setHatirlaticiDataCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const reminderGroups = useMemo(() => {
    return Array.isArray(hatirlaticiData?.data) ? hatirlaticiData.data : [];
  }, [hatirlaticiData?.data]);

  const hasInvalidReminderData = useMemo(() => {
    return reminderGroups.some((group) => {
      if (!Array.isArray(group?.Hatirlaticilar)) {
        return true;
      }

      return group.Hatirlaticilar.some((item) => typeof item?.Aciklama2 !== "string");
    });
  }, [reminderGroups]);

  useEffect(() => {
    const total = reminderGroups.reduce((acc, group) => {
      return acc + Number(group?.ToplamKayit || 0);
    }, 0);

    setHatirlaticiDataCount(total);
  }, [reminderGroups]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleItemClick = (item) => {
    let contentComponent;
    const title = item.Aciklama2;

    switch (item.SiraId) {
      case 5:
        contentComponent = <YaklasanPeriyodikBakimlar />;
        break;
      default:
        contentComponent = null;
        break;
    }

    if (contentComponent) {
      setModalTitle(title);
      setModalContent(contentComponent);
      setIsModalOpen(true);
      setOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const getItemDescription = (item) => {
    return typeof item?.Aciklama2 === "string" ? item.Aciklama2 : "";
  };

  const getColorForItem = (item) => {
    const description = getItemDescription(item);

    // API'den gelen Kritik alanını kullan
    if (item.Kritik === 1) {
      return { isCritical: true, isWarning: false };
    }

    // Kritik durumlar için kırmızı
    if (description.includes("Geçen") || description.includes("Arıza") || description.includes("Kritik")) {
      return { isCritical: true, isWarning: false };
    }
    // Uyarı durumları için sarı
    if (description.includes("Yaklaşan") || description.includes("Bekleyen")) {
      return { isCritical: false, isWarning: true };
    }
    // Normal durumlar için mavi
    return { isCritical: false, isWarning: false };
  };

  const renderReminderItem = (item, itemIndex) => {
    try {
      const colors = getColorForItem(item);
      const description = getItemDescription(item) || t("hatirlatici.itemUnavailable");
      const itemKey = item?.SiraId ?? `item-${itemIndex}`;

      return (
        <ReminderItem key={itemKey} onClick={() => handleItemClick(item)}>
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <ColorBar isCritical={colors.isCritical} isWarning={colors.isWarning} />
            <span style={{ fontSize: "13px", color: "#333" }}>{description}</span>
          </div>
          <BadgePill isCritical={colors.isCritical} isWarning={colors.isWarning}>
            {item?.Deger ?? 0}
          </BadgePill>
        </ReminderItem>
      );
    } catch (error) {
      console.error("Hatırlatıcı kaydı render edilirken hata oluştu:", error, item);

      return (
        <Alert
          key={`item-error-${itemIndex}`}
          type="warning"
          showIcon
          message={t("hatirlatici.itemUnavailable")}
          style={{ marginBottom: 8 }}
        />
      );
    }
  };

  const renderReminderGroup = (group, groupIndex) => {
    try {
      const items = Array.isArray(group?.Hatirlaticilar) ? group.Hatirlaticilar : [];
      const groupTitle = group?.GrupAdi || t("hatirlatici.unknownGroup");
      const totalCount = Number(group?.ToplamKayit || items.length || 0);
      const groupKey = group?.GrupId ?? `group-${groupIndex}`;

      return (
        <StyledCard key={groupKey} title={`${groupTitle} (${totalCount})`} size="small">
          {items.length > 0 ? (
            items.map((item, itemIndex) => renderReminderItem(item, itemIndex))
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0", color: "#999" }}>{t("hatirlatici.notFound")}</div>
          )}
        </StyledCard>
      );
    } catch (error) {
      console.error("Hatırlatıcı grubu render edilirken hata oluştu:", error, group);

      return (
        <StyledCard key={`group-error-${groupIndex}`} title={t("hatirlatici.unknownGroup")} size="small">
          <Alert type="warning" showIcon message={t("hatirlatici.renderWarning")} />
        </StyledCard>
      );
    }
  };

  const content = (
    <PopoverContent>
      <HeaderSection>
        {t("hatirlatmalar")} ({hatirlaticiData?.toplam_hatirlatici || 0})
      </HeaderSection>

      {loading ? (
        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : reminderGroups.length > 0 ? (
        <CardsGrid>
          {hasInvalidReminderData && (
            <Alert type="warning" showIcon message={t("hatirlatici.renderWarning")} style={{ marginBottom: 16, breakInside: "avoid" }} />
          )}
          {reminderGroups.map((group, groupIndex) => renderReminderGroup(group, groupIndex))}
        </CardsGrid>
      ) : (
        <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>{t("hatirlatici.notFound")}</div>
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

HatirlaticiPopover.propTypes = {
  hatirlaticiData: PropTypes.shape({
    toplam_hatirlatici: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        GrupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        GrupAdi: PropTypes.string,
        ToplamKayit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        Hatirlaticilar: PropTypes.arrayOf(
          PropTypes.shape({
            SiraId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            Aciklama2: PropTypes.string,
            Deger: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            Kritik: PropTypes.number,
          })
        ),
      })
    ),
  }),
  loading: PropTypes.bool,
  open: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
};
