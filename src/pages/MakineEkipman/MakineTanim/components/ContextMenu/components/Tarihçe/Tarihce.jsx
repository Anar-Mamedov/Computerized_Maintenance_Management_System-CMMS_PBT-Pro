import React, { useEffect, useState } from "react";
import { Button, Modal, Typography } from "antd";
import { BarChartOutlined, DollarOutlined, FileTextOutlined, InboxOutlined, TeamOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const TAB_ITEMS = [
  { key: "ozet", labelKey: "makineTarihce.tabOzet", icon: BarChartOutlined },
  { key: "isEmirleri", labelKey: "makineTarihce.tabIsEmirleri", icon: FileTextOutlined },
  { key: "malzemeKullanimlari", labelKey: "makineTarihce.tabMalzemeKullanimlari", icon: InboxOutlined },
  { key: "yapilanIscilikler", labelKey: "makineTarihce.tabYapilanIscilikler", icon: TeamOutlined },
  { key: "maliyetler", labelKey: "makineTarihce.tabMaliyetler", icon: DollarOutlined },
];

export default function TarihceTablo({ selectedRows = [] }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_ITEMS[0].key);

  const selectedMachine = selectedRows[0] || {};

  useEffect(() => {
    if (isModalVisible) {
      setActiveTab(TAB_ITEMS[0].key);
    }
  }, [isModalVisible]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const headerText = [selectedMachine.MKN_KOD, selectedMachine.MKN_TANIM].filter(Boolean).join(" ");
  const locationText = selectedMachine.MKN_LOKASYON || "-";
  const typeText = selectedMachine.MKN_TIP || "-";
  const statusText = selectedMachine.MKN_DURUM || "-";
  const lastMaintenance =
    selectedMachine.MKN_SON_BAKIM || selectedMachine.MKN_SON_BAKIM_TARIH || selectedMachine.MKN_SON_BAKIM_TARIHI || "-";
  const nextMaintenance =
    selectedMachine.MKN_SONRAKI_BAKIM || selectedMachine.MKN_SONRAKI_BAKIM_TARIH || selectedMachine.MKN_SONRAKI_BAKIM_TARIHI || "-";

  return (
    <div>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        onClick={handleModalToggle}
        type="text"
      >
        {t("tarihce")}
      </Button>
      <Modal
        width={1200}
        centered
        destroyOnClose
        title={t("makineTarihce")}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}
        styles={{
          content: { background: "#f5f5f5" },
          header: { background: "#f5f5f5" },
          body: { background: "#f5f5f5" },
          footer: { background: "#f5f5f5" },
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div
            style={{
              width: 300,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid #eef2f7" }}>
              <Text style={{ fontSize: 16, fontWeight: 600, display: "block" }}>{headerText || "-"}</Text>
              <Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                {t("lokasyon")}: {locationText}
              </Text>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                <InfoBox label={t("tip")} value={typeText} />
                <InfoBox label={t("durum")} value={statusText} />
                <InfoBox label={t("sonBakim")} value={lastMaintenance} />
                <InfoBox label={t("sonrakiBakim")} value={nextMaintenance} />
              </div>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
              {TAB_ITEMS.map((tab) => {
                const isActive = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: isActive ? "1px solid #c7dbff" : "1px solid transparent",
                      background: isActive ? "#eff6ff" : "transparent",
                      color: isActive ? "#2563eb" : "#4b5563",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: isActive ? "#e0ecff" : "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? "#2563eb" : "#9ca3af",
                        fontSize: 16,
                      }}
                    >
                      <Icon />
                    </span>
                    <span>{t(tab.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 520 }} />
        </div>
      </Modal>
    </div>
  );
}

function InfoBox({ label, value }) {
  const safeValue = value || "-";
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "10px 12px",
        background: "#fff",
        minWidth: 0,
        width: "100%",
      }}
    >
      <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
        {label}
      </Text>
      <div
        title={safeValue}
        style={{
          fontSize: 13,
          fontWeight: 600,
          display: "block",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          maxWidth: "100%",
          marginTop: 4,
        }}
      >
        {safeValue}
      </div>
    </div>
  );
}
