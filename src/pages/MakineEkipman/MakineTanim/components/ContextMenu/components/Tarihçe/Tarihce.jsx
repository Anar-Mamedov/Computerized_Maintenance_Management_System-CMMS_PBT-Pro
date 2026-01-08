import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Select, Typography } from "antd";
import { BarChartOutlined, DollarOutlined, FileTextOutlined, InboxOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../api/http";
import OzetTab from "./components/OzetTab";
import IsEmirleriTab from "./components/IsEmirleriTab";
import MalzemeKullanimlariTab from "./components/MalzemeKullanimlariTab";
import YapilanIsciliklerTab from "./components/YapilanIsciliklerTab";
import MaliyetlerTab from "./components/MaliyetlerTab";

import "dayjs/locale/tr";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import "dayjs/locale/az";

dayjs.extend(localizedFormat);

const { Text } = Typography;

const TAB_ITEMS = [
  { key: "ozet", labelKey: "makineTarihce.tabOzet", icon: BarChartOutlined },
  { key: "isEmirleri", labelKey: "makineTarihce.tabIsEmirleri", icon: FileTextOutlined },
  { key: "malzemeKullanimlari", labelKey: "makineTarihce.tabMalzemeKullanimlari", icon: InboxOutlined },
  { key: "yapilanIscilikler", labelKey: "makineTarihce.tabYapilanIscilikler", icon: TeamOutlined },
  { key: "maliyetler", labelKey: "makineTarihce.tabMaliyetler", icon: DollarOutlined },
];

const TIME_RANGE_OPTIONS = [
  { value: "buHafta", labelKey: "timeRange.buHafta" },
  { value: "buAy", labelKey: "timeRange.buAy" },
  { value: "gecenAy", labelKey: "timeRange.gecenAy" },
  { value: "son3Ay", labelKey: "timeRange.son3Ay" },
  { value: "son6Ay", labelKey: "timeRange.son6Ay" },
  { value: "buYil", labelKey: "timeRange.buYil" },
  { value: "gecenYil", labelKey: "timeRange.gecenYil" },
];

export default function TarihceTablo({ selectedRows = [] }) {
  const { t, i18n } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_ITEMS[0].key);
  const [timeRange, setTimeRange] = useState("son3Ay");
  const [generalInfo, setGeneralInfo] = useState(null);

  const selectedMachine = selectedRows[0] || {};
  const makineId = selectedMachine.TB_MAKINE_ID || selectedMachine.MKN_ID || selectedMachine.MakineId;

  useEffect(() => {
    if (isModalVisible) {
      setActiveTab(TAB_ITEMS[0].key);
      setTimeRange("son3Ay");
    }
  }, [isModalVisible]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!isModalVisible || !makineId) {
      setGeneralInfo(null);
      return;
    }

    let active = true;
    const fetchGeneralInfo = async () => {
      try {
        const response = await AxiosInstance.get("GetMakineGenelBilgi", { params: { makineId } });
        if (!active) return;
        const info = response?.MakineBilgi || response?.Makine || response?.data || response || null;
        setGeneralInfo(info);
      } catch (error) {
        if (active) {
          setGeneralInfo(null);
        }
      }
    };

    fetchGeneralInfo();
    return () => {
      active = false;
    };
  }, [isModalVisible, makineId]);

  const resolveValue = (...values) => values.find((value) => value !== undefined && value !== null && String(value).trim() !== "");

  const headerCode = resolveValue(generalInfo?.Kod, generalInfo?.KOD, selectedMachine.MKN_KOD);
  const headerName = resolveValue(generalInfo?.Tanim, generalInfo?.TANIM, selectedMachine.MKN_TANIM);
  const headerText = [headerCode, headerName].filter(Boolean).join(" ");
  const locationText = resolveValue(generalInfo?.Lokasyon, generalInfo?.LOKASYON, selectedMachine.MKN_LOKASYON) || "-";
  const typeText = resolveValue(generalInfo?.Tip, generalInfo?.TIP, selectedMachine.MKN_TIP) || "-";
  const statusText = resolveValue(generalInfo?.Durum, generalInfo?.DURUM, selectedMachine.MKN_DURUM) || "-";
  const locale = i18n.language || "tr";
  const formatDateValue = (value) => {
    if (!value) return "-";
    const parsed = dayjs(value);
    if (!parsed.isValid()) return String(value);
    return parsed.locale(locale).format("L");
  };

  const lastMaintenanceValue = resolveValue(
    generalInfo?.SonBakimTarihi,
    generalInfo?.SON_BAKIM_TARIHI,
    generalInfo?.SonBakim,
    generalInfo?.SON_BAKIM,
    selectedMachine.MKN_SON_BAKIM,
    selectedMachine.MKN_SON_BAKIM_TARIH,
    selectedMachine.MKN_SON_BAKIM_TARIHI
  );
  const nextMaintenanceValue = resolveValue(
    generalInfo?.SonrakiBakimTarihi,
    generalInfo?.SONRAKI_BAKIM_TARIHI,
    generalInfo?.SonrakiBakim,
    generalInfo?.SONRAKI_BAKIM,
    selectedMachine.MKN_SONRAKI_BAKIM,
    selectedMachine.MKN_SONRAKI_BAKIM_TARIH,
    selectedMachine.MKN_SONRAKI_BAKIM_TARIHI
  );

  const lastMaintenance = formatDateValue(lastMaintenanceValue);
  const nextMaintenance = formatDateValue(nextMaintenanceValue);
  const subtitleText = [headerCode, locationText, typeText].filter(Boolean).join(" · ");

  const dateRange = useMemo(() => {
    const today = dayjs();
    switch (timeRange) {
      case "buHafta":
        return { startDate: today.startOf("week"), endDate: today };
      case "buAy":
        return { startDate: today.startOf("month"), endDate: today };
      case "gecenAy": {
        const prev = today.subtract(1, "month");
        return { startDate: prev.startOf("month"), endDate: prev.endOf("month") };
      }
      case "son6Ay":
        return { startDate: today.subtract(6, "month"), endDate: today };
      case "buYil":
        return { startDate: today.startOf("year"), endDate: today };
      case "gecenYil": {
        const prev = today.subtract(1, "year");
        return { startDate: prev.startOf("year"), endDate: prev.endOf("year") };
      }
      case "son3Ay":
      default:
        return { startDate: today.subtract(3, "month"), endDate: today };
    }
  }, [timeRange]);

  const startDate = dateRange.startDate.format("YYYY-MM-DD");
  const endDate = dateRange.endDate.format("YYYY-MM-DD");

  return (
    <div>
      <Button style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }} onClick={handleModalToggle} type="text">
        {t("tarihce")}
      </Button>
      <Modal
        width={1600}
        centered
        destroyOnClose
        title={t("ekipmanTarihcesi")}
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

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <Text style={{ fontSize: 14, fontWeight: 600, display: "block" }}>{t("makineTarihce.genelDurum")}</Text>
                <Text type="secondary" style={{ display: "block", marginTop: 2 }}>
                  {subtitleText || "-"}
                </Text>
              </div>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                style={{ minWidth: 140 }}
                options={TIME_RANGE_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.labelKey) }))}
              />
            </div>

            {activeTab === "ozet" && <OzetTab makineId={makineId} startDate={startDate} endDate={endDate} />}
            {activeTab === "isEmirleri" && <IsEmirleriTab makineId={makineId} startDate={startDate} endDate={endDate} />}
            {activeTab === "malzemeKullanimlari" && <MalzemeKullanimlariTab makineId={makineId} startDate={startDate} endDate={endDate} />}
            {activeTab === "yapilanIscilikler" && <YapilanIsciliklerTab makineId={makineId} startDate={startDate} endDate={endDate} />}
            {activeTab === "maliyetler" && <MaliyetlerTab makineId={makineId} startDate={startDate} endDate={endDate} />}
            {activeTab !== "ozet" && activeTab !== "isEmirleri" && activeTab !== "malzemeKullanimlari" && activeTab !== "yapilanIscilikler" && activeTab !== "maliyetler" && (
              <div style={{ minHeight: 520 }} />
            )}
          </div>
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
