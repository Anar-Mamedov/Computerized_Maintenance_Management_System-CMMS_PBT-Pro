import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Popover, Badge, Spin, Modal, Card, Alert } from "antd";
import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import YaklasanPeriyodikBakimlar from "./Tables/YaklasanPeriyodikBakimlar/PeryodikBakimlar.jsx";
import MakineTanim from "../../MakineEkipman/MakineTanim/MakineTanim.jsx";
import IsEmri from "../../BakımVeArizaYonetimi/IsEmri/IsEmri.jsx";
import OtomatikIsEmirleri from "../../BakımVeArizaYonetimi/OtomatikIsEmrileri/Index.jsx";
import MalzemeTanimlari from "../../Malzeme&DepoYonetimi/MalzemeTanimlari/MalzemeTanimlari.jsx";

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
  padding: 10px 12px;
  margin: 6px 0;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fafafa;
    border-color: #d9d9d9;
    transform: translateX(4px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ColorBar = styled.div`
  width: 4px;
  height: 20px;
  border-radius: 2px;
  margin-right: 12px;
  background-color: ${(props) => {
    if (props.isCritical) return "#ef4444"; // modern red (Kritik: 1)
    if (props.isWarning) return "#f59e0b"; // modern orange/amber (Kritik: 2)
    if (props.isInfo) return "#3b82f6"; // modern blue (Kritik: 3)
    return "#10b981"; // modern green
  }};
`;

const BadgePill = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  min-width: 28px;
  text-align: center;
  background-color: ${(props) => {
    if (props.isCritical) return "#ef4444";
    if (props.isWarning) return "#f59e0b";
    if (props.isInfo) return "#3b82f6";
    return "#10b981";
  }};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

      return group.Hatirlaticilar.some((item) => {
        return typeof item?.Baslik !== "string" && typeof item?.Aciklama2 !== "string";
      });
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

  const handleItemClick = (item, group) => {
    let contentComponent = null;
    const title = getItemDescription(item);
    const grupId = Number(group?.GrupId);
    const siraId = Number(item?.SiraId);

    if (grupId === 1) {
      contentComponent = (
        <MakineTanim 
          hatirlaticiGrupId={grupId} 
          hatirlaticiSiraId={siraId} 
        />
      );
    } else if (grupId === 2) {
      if (siraId === 1 || siraId === 2 || siraId === 8) {
        contentComponent = (
          <IsEmri 
            hatirlaticiGrupId={grupId} 
            hatirlaticiSiraId={siraId} 
          />
        );
      } else {
        contentComponent = (
          <OtomatikIsEmirleri 
            hatirlaticiGrupId={grupId} 
            hatirlaticiSiraId={siraId} 
          />
        );
      }
    } else if (grupId === 3) {
      contentComponent = (
        <MalzemeTanimlari 
          hatirlaticiGrupId={grupId} 
          hatirlaticiSiraId={siraId} 
        />
      );
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
    return item?.Baslik || item?.Aciklama2 || item?.Aciklama || "";
  };

  const getItemSubDescription = (item) => {
    // If Baslik is used for main description, Aciklama can be used for sub-description
    if (item?.Baslik && item?.Aciklama) {
      return item.Aciklama;
    }
    return "";
  };

  const getColorForItem = (item) => {
    if (item.Kritik === 1) {
      return { isCritical: true, isWarning: false, isInfo: false };
    }
    if (item.Kritik === 2) {
      return { isCritical: false, isWarning: true, isInfo: false };
    }
    if (item.Kritik === 3) {
      return { isCritical: false, isWarning: false, isInfo: true };
    }

    const description = getItemDescription(item);
    // Fallback logic
    if (description.includes("Geçen") || description.includes("Arıza") || description.includes("Kritik")) {
      return { isCritical: true, isWarning: false, isInfo: false };
    }
    if (description.includes("Yaklaşan") || description.includes("Bekleyen")) {
      return { isCritical: false, isWarning: true, isInfo: false };
    }
    return { isCritical: false, isWarning: false, isInfo: false };
  };

  const renderReminderItem = (item, itemIndex, group) => {
    try {
      const colors = getColorForItem(item);
      const description = getItemDescription(item) || t("hatirlatici.itemUnavailable");
      const subDescription = getItemSubDescription(item);
      const itemKey = item?.SiraId ?? `item-${itemIndex}`;

      return (
        <ReminderItem key={itemKey} onClick={() => handleItemClick(item, group)}>
          <div style={{ display: "flex", alignItems: "center", flex: 1, marginRight: "8px" }}>
            <ColorBar isCritical={colors.isCritical} isWarning={colors.isWarning} isInfo={colors.isInfo} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", color: "#262626", fontWeight: 500 }}>{description}</span>
              {subDescription && (
                <span style={{ fontSize: "11px", color: "#8c8c8c", marginTop: "2px" }}>{subDescription}</span>
              )}
            </div>
          </div>
          <BadgePill isCritical={colors.isCritical} isWarning={colors.isWarning} isInfo={colors.isInfo}>
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
            items.map((item, itemIndex) => renderReminderItem(item, itemIndex, group))
          ) : (
            <div style={{ textAlign: "center", padding: "12px 0", color: "#bfbfbf" }}>{t("hatirlatici.notFound")}</div>
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
        {t("hatirlatmalar")} ({hatirlaticiData?.genel_toplam ?? hatirlaticiData?.toplam_hatirlatici ?? hatirlaticiDataCount})
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
    genel_toplam: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    data: PropTypes.arrayOf(
      PropTypes.shape({
        GrupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        GrupAdi: PropTypes.string,
        ToplamKayit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        Hatirlaticilar: PropTypes.arrayOf(
          PropTypes.shape({
            SiraId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
            Baslik: PropTypes.string,
            Aciklama: PropTypes.string,
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
