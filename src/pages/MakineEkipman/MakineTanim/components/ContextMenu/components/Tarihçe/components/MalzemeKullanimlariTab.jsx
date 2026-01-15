import React, { useEffect, useMemo, useState } from "react";
import { Input, Pagination, Spin, Typography } from "antd";
import { CalendarOutlined, DollarOutlined, InboxOutlined, SearchOutlined, SwapOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../api/http";
import IsEmriEditDrawer from "../../../../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";

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

function StatCard({ title, value, subtitle, icon, borderColor, backgroundColor }) {
  return (
    <div
      style={{
        background: backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        minHeight: 92,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {title}
        </Text>
        <div
          title={typeof value === "string" ? value : undefined}
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginTop: 6,
            color: "#111827",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
        {subtitle ? (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {subtitle}
          </Text>
        ) : null}
      </div>
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "#fff",
          border: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
        }}
      >
        {icon}
      </span>
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

export default function MalzemeKullanimlariTab({ makineId, startDate, endDate }) {
  const { t, i18n } = useTranslation();
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString(i18n.language, { year: "numeric", month: "2-digit", day: "2-digit" });
  };
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isEmriDrawerVisible, setIsEmriDrawerVisible] = useState(false);
  const [selectedIsEmriRow, setSelectedIsEmriRow] = useState(null);
  const pageSize = 10;
  const currency = t("paraBirimi", { defaultValue: "$" });
  const adetLabel = t("adet", { defaultValue: "adet" });

  useEffect(() => {
    if (!makineId || !startDate || !endDate) {
      setData(null);
      return;
    }
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get("GetMakineMalzemeKullanimList", {
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

  const materialList = data?.MalzemeListesi || [];

  const filteredList = useMemo(() => {
    if (!query) return materialList;
    const lowered = query.toLocaleLowerCase("tr");
    return materialList.filter((item) => {
      const fields = [item.MalzemeAdi, item.MalzemeKodu, item.Tip, item.IsEmriNo, item.IsEmriKonu, item.IsEmriTip].filter(Boolean).join(" ").toLocaleLowerCase("tr");
      return fields.includes(lowered);
    });
  }, [materialList, query]);

  useEffect(() => {
    setPage(1);
  }, [query, materialList.length]);

  const pagedList = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, page, pageSize]);

  const mostUsedParts = (data?.EnCokKullanilanMalzeme || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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
          <Text type="secondary">{t("makineTarihce.malzemeKullanimlari.veriYok")}</Text>
        </div>
      </Panel>
    );
  }

  const openIsEmriDrawer = (id) => {
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId) || parsedId <= 0) return;
    setSelectedIsEmriRow({ key: parsedId });
    setIsEmriDrawerVisible(true);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 12 }}>
          <div style={{ gridColumn: "span 3" }}>
            <StatCard
              title={t("makineTarihce.malzemeKullanimlari.toplamMalzeme")}
              value={`${data.ToplamAdet || 0} ${adetLabel}`}
              icon={<InboxOutlined />}
              borderColor="#bfdbfe"
              backgroundColor="#eff6ff"
            />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <StatCard
              title={t("makineTarihce.malzemeKullanimlari.toplamMaliyet")}
              value={`${currency}${formatMoney(data.ToplamMaliyet || 0)}`}
              icon={<DollarOutlined />}
              borderColor="#bbf7d0"
              backgroundColor="#ecfdf3"
            />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <StatCard
              title={t("makineTarihce.malzemeKullanimlari.sonKullanim")}
              value={formatDate(data.SonKullanimTarihi)}
              icon={<CalendarOutlined />}
              borderColor="#fde68a"
              backgroundColor="#fef9c3"
            />
          </div>
          <div style={{ gridColumn: "span 3" }}>
            <StatCard
              title={t("makineTarihce.malzemeKullanimlari.enCokKullanilan")}
              value={mostUsedParts[0] || "-"}
              subtitle={mostUsedParts[1]}
              icon={<SwapOutlined />}
              borderColor="#e2e8f0"
              backgroundColor="#f8fafc"
            />
          </div>
        </div>

        <Panel>
          <Input
            placeholder={t("makineTarihce.malzemeKullanimlari.ara")}
            prefix={<SearchOutlined />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ height: 44, borderRadius: 12, borderColor: "#e2e8f0" }}
          />
        </Panel>

        <Panel>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 1.6fr 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr",
                background: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                color: "#64748b",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <TableCell>{t("makineTarihce.malzemeKullanimlari.tarih")}</TableCell>
              <TableCell>{t("makineTarihce.malzemeKullanimlari.malzeme")}</TableCell>
              <TableCell>{t("makineTarihce.malzemeKullanimlari.tip")}</TableCell>
              <TableCell align="right">{t("makineTarihce.malzemeKullanimlari.miktar")}</TableCell>
              <TableCell>{t("makineTarihce.malzemeKullanimlari.birim")}</TableCell>
              <TableCell align="right">{t("makineTarihce.malzemeKullanimlari.birimFiyat")}</TableCell>
              <TableCell align="right">{t("makineTarihce.malzemeKullanimlari.toplam")}</TableCell>
              <TableCell>{t("makineTarihce.malzemeKullanimlari.isEmriNo")}</TableCell>
            </div>

            {pagedList.map((row, index) => {
              const isEmriId = Number(row.IsEmriId);
              const canOpen = Number.isFinite(isEmriId) && isEmriId > 0;
              return (
                <div
                  key={`${row.MalzemeKodu}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.1fr 1.6fr 1fr 0.7fr 0.7fr 0.9fr 0.9fr 0.9fr",
                    borderBottom: index === filteredList.length - 1 ? "none" : "1px solid #e2e8f0",
                    alignItems: "center",
                    background: "#fff",
                  }}
                >
                  <TableCell>{row.Tarih || "-"}</TableCell>
                  <TableCell>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 10,
                          background: "#f1f5f9",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <InboxOutlined />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: "#1f2937", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.MalzemeAdi || "-"}</div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {row.MalzemeKodu || "-"}
                        </Text>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{row.Tip || "-"}</TableCell>
                  <TableCell align="right">{Number.isFinite(row.Miktar) ? row.Miktar : "-"}</TableCell>
                  <TableCell>{row.Birim || "-"}</TableCell>
                  <TableCell align="right">
                    {currency}
                    {formatMoney(row.BirimFiyat || 0)}
                  </TableCell>
                  <TableCell align="right">
                    {currency}
                    {formatMoney(row.ToplamTutar || 0)}
                  </TableCell>
                  <TableCell>
                    {canOpen ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event?.stopPropagation();
                          openIsEmriDrawer(isEmriId);
                        }}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#0ea5e9",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 14,
                          textAlign: "left",
                          fontWeight: 500,
                        }}
                      >
                        {row.IsEmriNo || "-"}
                      </button>
                    ) : (
                      <span>{row.IsEmriNo || "-"}</span>
                    )}
                  </TableCell>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div style={{ padding: "16px", textAlign: "center" }}>
                <Text type="secondary">{t("makineTarihce.malzemeKullanimlari.veriYok")}</Text>
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Pagination current={page} pageSize={pageSize} total={filteredList.length} onChange={setPage} showSizeChanger={false} size="small" />
          </div>
        </Panel>
      </div>
      <IsEmriEditDrawer selectedRow={selectedIsEmriRow} onDrawerClose={() => setIsEmriDrawerVisible(false)} drawerVisible={isEmriDrawerVisible} onRefresh={() => {}} />
    </>
  );
}
