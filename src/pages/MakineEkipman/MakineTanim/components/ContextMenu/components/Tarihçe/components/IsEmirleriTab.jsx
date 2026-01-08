import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Spin, Typography } from "antd";
import {
  AlertOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

function formatMoney(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
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

function TipTag({ label, color }) {
  const normalized = (label || "").toLocaleLowerCase("tr");
  let Icon = FileTextOutlined;
  if (normalized.includes("arıza")) Icon = AlertOutlined;
  if (normalized.includes("periyodik")) Icon = CalendarOutlined;
  if (normalized.includes("planlı") || normalized.includes("planli")) Icon = ToolOutlined;
  if (normalized.includes("talep")) Icon = ClockCircleOutlined;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${color || "#e5e7eb"}`,
        background: color || "#f8fafc",
        color: "#1f2937",
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      <Icon style={{ fontSize: 14 }} />
      {label || "-"}
    </span>
  );
}

function DurumTag({ label, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${color || "#e5e7eb"}`,
        background: color || "#f8fafc",
        color: "#1f2937",
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color || "#9ca3af" }} />
      {label || "-"}
    </span>
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

export default function IsEmirleriTab({ makineId, startDate, endDate }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const currency = t("paraBirimi", { defaultValue: "$" });
  const hourShort = t("saatKisaltma", { defaultValue: "sa" });

  useEffect(() => {
    if (!makineId || !startDate || !endDate) {
      setData(null);
      return;
    }
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get("GetMakineIsEmirleriList", {
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

  const isEmirleri = data?.IsEmirleri || [];

  useEffect(() => {
    setPage(1);
  }, [isEmirleri.length]);

  const statusCounts = useMemo(() => {
    const counts = {
      tamamlanan: 0,
      devamEden: 0,
      bekleyen: 0,
      iptal: 0,
    };
    isEmirleri.forEach((row) => {
      const status = (row.Durum || "").toLocaleLowerCase("tr");
      if (status.includes("tamam")) counts.tamamlanan += 1;
      else if (status.includes("devam")) counts.devamEden += 1;
      else if (status.includes("bekle")) counts.bekleyen += 1;
      else if (status.includes("iptal")) counts.iptal += 1;
    });
    return counts;
  }, [isEmirleri]);

  const pagedList = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return isEmirleri.slice(startIndex, startIndex + pageSize);
  }, [isEmirleri, page, pageSize]);

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
          <Text type="secondary">{t("makineTarihce.isEmirleri.veriYok")}</Text>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: 600 }}>{t("makineTarihce.isEmirleri.baslik")}</Text>
        <Text type="secondary">
          {t("makineTarihce.isEmirleri.sureLabel")}: {data.ToplamSure || "-"} • {t("makineTarihce.isEmirleri.maliyetLabel")}:{" "}
          {currency}
          {formatMoney(data.ToplamMaliyet || 0)}
        </Text>
      </div>

      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr 1.2fr 1.2fr 1.3fr 1.1fr 0.7fr 0.8fr 0.9fr",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <TableCell>{t("makineTarihce.isEmirleri.isEmriNo")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.tip")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.baslikCol")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.durum")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.baslangic")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.bitis")}</TableCell>
          <TableCell align="right">{t("makineTarihce.isEmirleri.sure")}</TableCell>
          <TableCell align="right">{t("makineTarihce.isEmirleri.maliyet")}</TableCell>
          <TableCell>{t("makineTarihce.isEmirleri.sorumlu")}</TableCell>
        </div>

        {pagedList.map((row, index) => (
          <div
            key={row.TB_ISEMRI_ID || index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr 1.2fr 1.2fr 1.3fr 1.1fr 0.7fr 0.8fr 0.9fr",
              borderBottom: index === isEmirleri.length - 1 ? "none" : "1px solid #e2e8f0",
              alignItems: "center",
              background: "#fff",
            }}
          >
            <TableCell>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#0ea5e9",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 14,
                  textAlign: "left",
                }}
              >
                {row.ISM_ISEMRI_NO || "-"}
              </button>
            </TableCell>
            <TableCell>
              <TipTag label={row.Tip} color={row.TipRenk} />
            </TableCell>
            <TableCell>{row.Baslik || "-"}</TableCell>
            <TableCell>
              <DurumTag label={row.Durum} color={row.DurumRenk} />
            </TableCell>
            <TableCell>{row.Baslangic || "-"}</TableCell>
            <TableCell>{row.Bitis || "-"}</TableCell>
            <TableCell align="right">{Number.isFinite(row.Sure) ? `${row.Sure} ${hourShort}` : "-"}</TableCell>
            <TableCell align="right">
              {currency}
              {formatMoney(row.Maliyet || 0)}
            </TableCell>
            <TableCell>{row.Sorumlu || "-"}</TableCell>
          </div>
        ))}
      </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, gap: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("makineTarihce.isEmirleri.ipucu")}
          </Text>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={isEmirleri.length}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statusCounts.tamamlanan > 0 && <StatusPill color="#dcfce7" text={t("makineTarihce.isEmirleri.tamamlanan")} value={statusCounts.tamamlanan} />}
            {statusCounts.devamEden > 0 && <StatusPill color="#fef3c7" text={t("makineTarihce.isEmirleri.devamEden")} value={statusCounts.devamEden} />}
            {statusCounts.bekleyen > 0 && <StatusPill color="#e2e8f0" text={t("makineTarihce.isEmirleri.bekleyen")} value={statusCounts.bekleyen} />}
            {statusCounts.iptal > 0 && <StatusPill color="#fee2e2" text={t("makineTarihce.isEmirleri.iptal")} value={statusCounts.iptal} />}
        </div>
      </div>
    </Panel>
  );
}

function StatusPill({ color, text, value }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        borderRadius: 999,
        background: color,
        border: "1px solid #e5e7eb",
        fontSize: 12,
        fontWeight: 500,
        color: "#475569",
      }}
    >
      {text}: {value}
    </span>
  );
}
