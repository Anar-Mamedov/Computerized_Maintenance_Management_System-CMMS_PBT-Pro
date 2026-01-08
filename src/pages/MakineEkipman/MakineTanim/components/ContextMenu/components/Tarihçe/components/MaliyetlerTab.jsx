import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Spin, Typography } from "antd";
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

function StatCard({ title, value, subtitle, badge, percent, backgroundColor, borderColor, onClick, selected }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 16,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        cursor: "pointer",
        boxShadow: selected ? "0 0 0 2px rgba(59, 130, 246, 0.12)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {title}
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {badge}
        </Text>
      </div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>{value}</div>
      {subtitle ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {subtitle}
        </Text>
      ) : null}
      <div style={{ height: 6, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${percent}%`, height: "100%", background: "#9ca3af" }} />
      </div>
    </button>
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

function TypePill({ label, color }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${color || "#e2e8f0"}`,
        background: color || "#f8fafc",
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

export default function MaliyetlerTab({ makineId, startDate, endDate }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const currency = t("paraBirimi", { defaultValue: "$" });

  useEffect(() => {
    if (!makineId || !startDate || !endDate) {
      setData(null);
      return;
    }
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get("GetMakineMaliyetList", {
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

  const list = data?.MaliyetListesi || [];

  const filteredList = useMemo(() => {
    if (filter === "all") return list;
    return list.filter((item) => {
      const type = (item.Tur || "").toLocaleLowerCase("tr");
      if (filter === "parca") return type.includes("parça") || type.includes("parca");
      if (filter === "iscilik") return type.includes("işçilik") || type.includes("iscilik");
      if (filter === "disHizmet") return type.includes("dış") || type.includes("dis") || type.includes("hizmet");
      return true;
    });
  }, [list, filter]);

  useEffect(() => {
    setPage(1);
  }, [filter, list.length]);

  const pagedList = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, page, pageSize]);

  const totalCost = data?.ToplamMaliyet || 0;
  const totalCount = data?.ToplamKayit || 0;
  const averageCost = totalCount ? totalCost / totalCount : 0;

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
          <Text type="secondary">{t("makineTarihce.maliyetler.veriYok")}</Text>
        </div>
      </Panel>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 12 }}>
        <div style={{ gridColumn: "span 3" }}>
          <StatCard
            title={t("makineTarihce.maliyetler.toplamMaliyet")}
            value={`${currency}${formatMoney(totalCost)}`}
            subtitle={`${totalCount} ${t("makineTarihce.maliyetler.kayit")}`}
            badge={filter === "all" ? t("makineTarihce.maliyetler.secili") : t("makineTarihce.maliyetler.filtrele")}
            percent={100}
            backgroundColor="#ffffff"
            borderColor="#e5e7eb"
            onClick={() => setFilter("all")}
            selected={filter === "all"}
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <StatCard
            title={t("makineTarihce.maliyetler.parca")}
            value={`${currency}${formatMoney(data.ParcaOzet?.Tutar || 0)}`}
            subtitle={`%${data.ParcaOzet?.Yuzde || 0}`}
            badge={filter === "parca" ? t("makineTarihce.maliyetler.secili") : t("makineTarihce.maliyetler.filtrele")}
            percent={data.ParcaOzet?.Yuzde || 0}
            backgroundColor="#eef2ff"
            borderColor="#e0e7ff"
            onClick={() => setFilter("parca")}
            selected={filter === "parca"}
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <StatCard
            title={t("makineTarihce.maliyetler.iscilik")}
            value={`${currency}${formatMoney(data.IscilikOzet?.Tutar || 0)}`}
            subtitle={`%${data.IscilikOzet?.Yuzde || 0}`}
            badge={filter === "iscilik" ? t("makineTarihce.maliyetler.secili") : t("makineTarihce.maliyetler.filtrele")}
            percent={data.IscilikOzet?.Yuzde || 0}
            backgroundColor="#ecfdf3"
            borderColor="#bbf7d0"
            onClick={() => setFilter("iscilik")}
            selected={filter === "iscilik"}
          />
        </div>
        <div style={{ gridColumn: "span 3" }}>
          <StatCard
            title={t("makineTarihce.maliyetler.disHizmet")}
            value={`${currency}${formatMoney(data.DisHizmetOzet?.Tutar || 0)}`}
            subtitle={`%${data.DisHizmetOzet?.Yuzde || 0}`}
            badge={filter === "disHizmet" ? t("makineTarihce.maliyetler.secili") : t("makineTarihce.maliyetler.filtrele")}
            percent={data.DisHizmetOzet?.Yuzde || 0}
            backgroundColor="#fef3c7"
            borderColor="#fde68a"
            onClick={() => setFilter("disHizmet")}
            selected={filter === "disHizmet"}
          />
        </div>
      </div>

      <Panel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <Text style={{ fontSize: 15, fontWeight: 600 }}>{t("makineTarihce.maliyetler.detayBaslik")}</Text>
            <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
              {t("makineTarihce.maliyetler.detayAciklama")}
            </Text>
          </div>
          <Text type="secondary">{t("makineTarihce.maliyetler.gosterilen", { value: filteredList.length })}</Text>
        </div>

        <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 2fr 0.7fr 0.8fr 0.9fr 1fr",
              background: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              color: "#64748b",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <TableCell>{t("makineTarihce.maliyetler.tarih")}</TableCell>
            <TableCell>{t("makineTarihce.maliyetler.isEmriNo")}</TableCell>
            <TableCell>{t("makineTarihce.maliyetler.tur")}</TableCell>
            <TableCell>{t("makineTarihce.maliyetler.aciklama")}</TableCell>
            <TableCell align="right">{t("makineTarihce.maliyetler.miktar")}</TableCell>
            <TableCell>{t("makineTarihce.maliyetler.birim")}</TableCell>
            <TableCell align="right">{t("makineTarihce.maliyetler.tutar")}</TableCell>
            <TableCell>{t("makineTarihce.maliyetler.sorumlu")}</TableCell>
          </div>

          {pagedList.map((row, index) => (
            <div
              key={`${row.IsEmriId}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 2fr 0.7fr 0.8fr 0.9fr 1fr",
                borderBottom: index === filteredList.length - 1 ? "none" : "1px solid #e2e8f0",
                alignItems: "center",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <TableCell>{row.Tarih || "-"}</TableCell>
              <TableCell>
                <span style={{ color: "#0ea5e9", fontWeight: 500 }}>{row.IsEmriNo || "-"}</span>
              </TableCell>
              <TableCell>
                <TypePill label={row.Tur} color={row.TurRenk} />
              </TableCell>
              <TableCell>{row.Aciklama || "-"}</TableCell>
              <TableCell align="right">{Number.isFinite(row.Miktar) ? row.Miktar : "-"}</TableCell>
              <TableCell>{row.Birim || "-"}</TableCell>
              <TableCell align="right">
                {currency}
                {formatMoney(row.Tutar || 0)}
              </TableCell>
              <TableCell>{row.Sorumlu || "-"}</TableCell>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div style={{ padding: "16px", textAlign: "center" }}>
              <Text type="secondary">{t("makineTarihce.maliyetler.veriYok")}</Text>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={filteredList.length}
            onChange={setPage}
            showSizeChanger={false}
            size="small"
          />
        </div>
      </Panel>

      <Panel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text>{t("makineTarihce.maliyetler.toplamKayit", { value: totalCount })}</Text>
          <Text>
            {t("makineTarihce.maliyetler.toplamMaliyetAlt", { value: `${currency}${formatMoney(totalCost)}` })}
          </Text>
          <Text>
            {t("makineTarihce.maliyetler.ortalamaMaliyet", { value: `${currency}${formatMoney(averageCost)}` })}
          </Text>
        </div>
      </Panel>
    </div>
  );
}
