import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

function formatMoney(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatDuration(value, hourShort, minuteShort) {
  if (!Number.isFinite(value)) return "-";
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} ${hourShort} ${minutes} ${minuteShort}`;
  }
  return `${minutes} ${minuteShort}`;
}

function Panel({ children }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
      }}
    >
      {children}
    </div>
  );
}

function TableCell({ children, align = "left" }) {
  return (
    <div
      style={{
        padding: "14px 12px",
        textAlign: align,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: "#334155",
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function TypePill({ label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        color: "#475569",
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {label || "-"}
    </span>
  );
}

export default function YapilanIsciliklerTab({ makineId, startDate, endDate }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const currency = t("paraBirimi", { defaultValue: "$" });
  const hourShort = t("saatKisaltma", { defaultValue: "sa" });
  const minuteShort = t("dakikaKisaltma", { defaultValue: "dk" });

  useEffect(() => {
    if (!makineId || !startDate || !endDate) {
      setData(null);
      return;
    }
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get("GetMakineYapilanIscilikList", {
          params: { makineId, startDate, endDate },
        });
        if (active) {
          setData(response || null);
        }
      } catch (error) {
        if (active) {
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [makineId, startDate, endDate]);

  const list = data?.IscilikListesi || [];

  useEffect(() => {
    setPage(1);
  }, [list.length]);

  const totalDurationLabel = useMemo(() => {
    const totalHours = list.reduce((sum, row) => sum + (Number.isFinite(row.Sure) ? row.Sure : 0), 0);
    if (!totalHours) return "-";
    return formatDuration(totalHours, hourShort, minuteShort);
  }, [list, hourShort, minuteShort]);

  const totalCostLabel = useMemo(() => {
    const totalCost = list.reduce((sum, row) => sum + (Number.isFinite(row.Maliyet) ? row.Maliyet : 0), 0);
    if (!totalCost) return "-";
    return `${currency}${formatMoney(totalCost)}`;
  }, [list, currency]);

  const pagedList = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return list.slice(startIndex, startIndex + pageSize);
  }, [list, page, pageSize]);

  if (loading) {
    return (
      <Panel>
        <div style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </div>
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel>
        <div style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Text type="secondary">{t("makineTarihce.yapilanIscilikler.veriYok")}</Text>
        </div>
      </Panel>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Panel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: 600 }}>{t("makineTarihce.yapilanIscilikler.baslik")}</Text>
          <Text type="secondary">{t("makineTarihce.yapilanIscilikler.kompaktGorunum")}</Text>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", marginTop: 12 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1.1fr 2fr 1fr 0.8fr 0.8fr",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <TableCell>{t("makineTarihce.yapilanIscilikler.tarih")}</TableCell>
            <TableCell>{t("makineTarihce.yapilanIscilikler.isEmriNo")}</TableCell>
            <TableCell>{t("makineTarihce.yapilanIscilikler.iscilikTuru")}</TableCell>
            <TableCell>{t("makineTarihce.yapilanIscilikler.aciklama")}</TableCell>
            <TableCell>{t("makineTarihce.yapilanIscilikler.personel")}</TableCell>
            <TableCell align="right">{t("makineTarihce.yapilanIscilikler.sure")}</TableCell>
            <TableCell align="right">{t("makineTarihce.yapilanIscilikler.maliyet")}</TableCell>
          </div>

          {pagedList.map((row, index) => {
            const description = row.IsTanimi || row.Aciklama || row.Konu || "-";
            return (
              <div
                key={`${row.KontrolListId}-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1.1fr 2fr 1fr 0.8fr 0.8fr",
                  borderBottom: index === list.length - 1 ? "none" : "1px solid #e2e8f0",
                  alignItems: "center",
                  background: "#fff",
                }}
              >
                <TableCell>{row.Tarih || "-"}</TableCell>
                <TableCell>
                  <span style={{ color: "#0ea5e9", fontWeight: 500 }}>{row.IsEmriNo || "-"}</span>
                </TableCell>
                <TableCell>
                  <TypePill label={row.IsEmriTipi} />
                </TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>{row.Personel || "-"}</TableCell>
                <TableCell align="right">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <ClockCircleOutlined style={{ color: "#94a3b8" }} />
                    {formatDuration(row.Sure, hourShort, minuteShort)}
                  </span>
                </TableCell>
                <TableCell align="right">
                  {Number.isFinite(row.Maliyet) ? `${currency}${formatMoney(row.Maliyet)}` : "-"}
                </TableCell>
              </div>
            );
          })}

          {list.length === 0 && (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <Text type="secondary">{t("makineTarihce.yapilanIscilikler.veriYok")}</Text>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={list.length}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
          />
        </div>
      </Panel>

      <Panel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text>{t("makineTarihce.yapilanIscilikler.toplamKayit", { value: data.ToplamIslemSayisi || 0 })}</Text>
          <Text>{t("makineTarihce.yapilanIscilikler.toplamSure", { value: totalDurationLabel })}</Text>
          <Text>{t("makineTarihce.yapilanIscilikler.toplamMaliyet", { value: totalCostLabel })}</Text>
        </div>
      </Panel>
    </div>
  );
}
