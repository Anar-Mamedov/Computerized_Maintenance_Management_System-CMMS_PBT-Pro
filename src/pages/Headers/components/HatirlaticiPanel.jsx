import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Typography, Spin, Divider, Modal, Button, Switch, Popover, Card, Alert } from "antd";
import { CloseOutlined, ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../api/http.jsx";

// Import modules to display in modal
import MakineTanim from "../../MakineEkipman/MakineTanim/MakineTanim.jsx";
import IsEmri from "../../BakımVeArizaYonetimi/IsEmri/IsEmri.jsx";
import OtomatikIsEmirleri from "../../BakımVeArizaYonetimi/OtomatikIsEmrileri/Index.jsx";
import MalzemeTanimlari from "../../Malzeme&DepoYonetimi/MalzemeTanimlari/MalzemeTanimlari.jsx";
import MalzemeTalepleri from "../../SatinalmaYonetimi/MalzemeTalepleri/MalzemeTalepleri.jsx";
import SatinalmaSiparisleri from "../../SatinalmaYonetimi/SatinalmaSiparisleri/SatinalmaSiparisleri.jsx";
import FiyatTeklifleri from "../../SatinalmaYonetimi/FiyatTeklifleri/FiyatTeklifleri.jsx";
import FirmaSozlesmeleri from "../../FirmaVeSozlesmeYonetimi/FirmaSozlesmeleri/FirmaSozlesmeleri.jsx";

const { Text } = Typography;

const AUTO_REFRESH_INTERVAL = 5 * 60; // 5 minutes

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #0091ff !important;
  }
`;

const PanelWrapper = styled.div`
  width: ${(props) => (props.$open ? "350px" : "0px")};
  min-width: ${(props) => (props.$open ? "350px" : "0px")};
  height: calc(100vh - 96px);
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  border-left: ${(props) => (props.$open ? "1px solid #f0f0f0" : "none")};
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$open ? "-2px 0 8px rgba(0, 0, 0, 0.06)" : "none")};
  z-index: 1000;
`;

const PanelContent = styled.div`
  padding: 16px;
  display: ${(props) => (props.$open ? "block" : "none")};
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 8px 12px;
  }

  .ant-card-head-title {
    font-weight: 600;
    font-size: 13px;
  }

  .ant-card-body {
    padding: 8px 12px;
  }
`;

const ReminderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
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
  height: 18px;
  border-radius: 2px;
  margin-right: 8px;
  background-color: ${(props) => {
    if (props.isCritical) return "#ef4444";
    if (props.isWarning) return "#f59e0b";
    if (props.isInfo) return "#3b82f6";
    return "#10b981";
  }};
`;

const BadgePill = styled.span`
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  min-width: 24px;
  text-align: center;
  background-color: ${(props) => {
    if (props.isCritical) return "#ef4444";
    if (props.isWarning) return "#f59e0b";
    if (props.isInfo) return "#3b82f6";
    return "#10b981";
  }};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const HatirlaticiPanel = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  const [organize, setOrganize] = useState(() => localStorage.getItem("hatirlatici_organize") === "true");
  const [autoRefresh, setAutoRefresh] = useState(() => localStorage.getItem("hatirlatici_auto_refresh") === "true");
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL);
  const [filterOpen, setFilterOpen] = useState(false);

  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const handleOrganizeChange = (checked) => {
    setOrganize(checked);
    localStorage.setItem("hatirlatici_organize", checked.toString());
  };

  const handleAutoRefreshChange = (checked) => {
    setAutoRefresh(checked);
    localStorage.setItem("hatirlatici_auto_refresh", checked.toString());
    if (!checked) {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
      setCountdown(AUTO_REFRESH_INTERVAL);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const lan = localStorage.getItem("i18nextLng") || "tr";
      const response = await AxiosInstance.get(`GetHatirlaticilar?dil=${lan}`);
      setData(response);
    } catch (error) {
      console.error("Hatırlatıcı verisi alınırken hata:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on open
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  // Auto refresh timer
  useEffect(() => {
    if (autoRefresh && open) {
      setCountdown(AUTO_REFRESH_INTERVAL);

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return AUTO_REFRESH_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = setInterval(() => {
        fetchData();
      }, AUTO_REFRESH_INTERVAL * 1000);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(countdownRef.current);
      };
    } else {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
      setCountdown(AUTO_REFRESH_INTERVAL);
    }
  }, [autoRefresh, open, fetchData]);

  const handleManualRefresh = () => {
    fetchData();
    if (autoRefresh) {
      setCountdown(AUTO_REFRESH_INTERVAL);
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);

      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return AUTO_REFRESH_INTERVAL;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = setInterval(() => {
        fetchData();
      }, AUTO_REFRESH_INTERVAL * 1000);
    }
  };

  const reminderGroups = useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

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

  const totalCount = useMemo(() => {
    return reminderGroups.reduce((acc, group) => {
      return acc + Number(group?.ToplamKayit || 0);
    }, 0);
  }, [reminderGroups]);

  const filteredGroups = useMemo(() => {
    if (!organize) return reminderGroups;
    return reminderGroups
      .map((group) => {
        const activeItems = (group.Hatirlaticilar || []).filter((item) => Number(item.Deger) > 0);
        return {
          ...group,
          Hatirlaticilar: activeItems,
          ToplamKayit: activeItems.reduce((acc, it) => acc + Number(it.Deger || 0), 0),
        };
      })
      .filter((group) => group.ToplamKayit > 0);
  }, [reminderGroups, organize]);

  const getItemDescription = (item) => {
    return item?.Baslik || item?.Aciklama2 || item?.Aciklama || "";
  };

  const getItemSubDescription = (item) => {
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
    if (description.includes("Geçen") || description.includes("Arıza") || description.includes("Kritik")) {
      return { isCritical: true, isWarning: false, isInfo: false };
    }
    if (description.includes("Yaklaşan") || description.includes("Bekleyen")) {
      return { isCritical: false, isWarning: true, isInfo: false };
    }
    return { isCritical: false, isWarning: false, isInfo: false };
  };

  const handleItemClick = (item, group) => {
    let contentComponent = null;
    const title = getItemDescription(item);
    const grupId = Number(group?.GrupId);
    const siraId = Number(item?.SiraId);

    if (grupId === 1) {
      contentComponent = <MakineTanim hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
    } else if (grupId === 2) {
      if (siraId === 1 || siraId === 2 || siraId === 8) {
        contentComponent = <IsEmri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      } else {
        contentComponent = <OtomatikIsEmirleri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      }
    } else if (grupId === 3) {
      contentComponent = <MalzemeTanimlari hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
    } else if (grupId === 4) {
      if (siraId === 1 || siraId === 4) {
        contentComponent = <MalzemeTalepleri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      } else if (siraId === 2) {
        contentComponent = <SatinalmaSiparisleri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      } else if (siraId === 3) {
        contentComponent = <FiyatTeklifleri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      } else if (siraId === 5) {
        contentComponent = <FirmaSozlesmeleri hatirlaticiGrupId={grupId} hatirlaticiSiraId={siraId} />;
      }
    }

    if (contentComponent) {
      setModalTitle(title);
      setModalContent(contentComponent);
      setIsModalOpen(true);
    }
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
              <span style={{ fontSize: "12px", color: "#262626", fontWeight: 500 }}>{description}</span>
              {subDescription && <span style={{ fontSize: "10px", color: "#8c8c8c", marginTop: "2px" }}>{subDescription}</span>}
            </div>
          </div>
          <BadgePill isCritical={colors.isCritical} isWarning={colors.isWarning} isInfo={colors.isInfo}>
            {item?.Deger ?? 0}
          </BadgePill>
        </ReminderItem>
      );
    } catch (error) {
      console.error("Hatırlatıcı kaydı render edilirken hata:", error, item);
      return <Alert key={`item-error-${itemIndex}`} type="warning" showIcon message={t("hatirlatici.itemUnavailable")} style={{ marginBottom: 8 }} />;
    }
  };

  const renderReminderGroup = (group, groupIndex) => {
    try {
      const items = Array.isArray(group?.Hatirlaticilar) ? group.Hatirlaticilar : [];
      const groupTitle = group?.GrupAdi || t("hatirlatici.unknownGroup");
      const groupKey = group?.GrupId ?? `group-${groupIndex}`;
      const groupCount = Number(group?.ToplamKayit || items.length || 0);

      return (
        <StyledCard key={groupKey} title={`${groupTitle} (${groupCount})`} size="small">
          {items.length > 0 ? (
            items.map((item, itemIndex) => renderReminderItem(item, itemIndex, group))
          ) : (
            <div style={{ textAlign: "center", padding: "8px 0", color: "#bfbfbf", fontSize: "12px" }}>{t("hatirlatici.notFound")}</div>
          )}
        </StyledCard>
      );
    } catch (error) {
      console.error("Hatırlatıcı grubu render edilirken hata:", error, group);
      return (
        <StyledCard key={`group-error-${groupIndex}`} title={t("hatirlatici.unknownGroup")} size="small">
          <Alert type="warning" showIcon message={t("hatirlatici.renderWarning")} />
        </StyledCard>
      );
    }
  };

  const filterContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 180 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 13 }}>Organize et</Text>
        <Switch size="small" checked={organize} onChange={handleOrganizeChange} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 13 }}>Otomatik yenile</Text>
        <Switch size="small" checked={autoRefresh} onChange={handleAutoRefreshChange} />
      </div>
    </div>
  );

  return (
    <>
      <PanelWrapper $open={open}>
        <PanelContent $open={open}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Text strong style={{ fontSize: "15px" }}>
                {t("hatirlatmalar")} ({data?.genel_toplam ?? data?.toplam_hatirlatici ?? totalCount})
              </Text>
              <Popover content={filterContent} trigger="click" placement="bottomLeft" open={filterOpen} onOpenChange={setFilterOpen}>
                <Button type="text" size="small" icon={<FilterOutlined />} />
              </Popover>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {autoRefresh && <Text style={{ fontSize: 11, color: "#999", marginRight: 2 }}>{formatCountdown(countdown)}</Text>}
              <Button type="text" size="small" icon={<ReloadOutlined />} onClick={handleManualRefresh} loading={loading} />
              <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
            </div>
          </div>

          <Divider style={{ margin: "4px 0 12px" }} />

          <CustomSpin spinning={loading}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "24px" }}>
              {hasInvalidReminderData && <Alert type="warning" showIcon message={t("hatirlatici.renderWarning")} style={{ marginBottom: 12 }} />}
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, groupIndex) => renderReminderGroup(group, groupIndex))
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>{t("hatirlatici.notFound")}</div>
              )}
            </div>
          </CustomSpin>
        </PanelContent>
      </PanelWrapper>

      <Modal title={modalTitle} open={isModalOpen} width={1300} onCancel={() => setIsModalOpen(false)} footer={null} destroyOnClose centered>
        {modalContent}
      </Modal>
    </>
  );
};

HatirlaticiPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default HatirlaticiPanel;
