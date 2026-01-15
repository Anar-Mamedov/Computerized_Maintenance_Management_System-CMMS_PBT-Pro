import React, { useEffect, useMemo, useState } from "react";
import { Pagination, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../api/http";

const { Text } = Typography;

function formatMoney(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatExactValue(value) {
  if (value === null || value === undefined) {
    return "0";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Number.isFinite(value)) {
    return String(value);
  }
  return "0";
}

function getMonthlyDurationValue(item) {
  if (!item) {
    return 0;
  }
  if (Number.isFinite(item.ToplamSure)) {
    return item.ToplamSure;
  }
  if (Number.isFinite(item.ToplamTutar)) {
    return item.ToplamTutar;
  }
  return 0;
}

function TrendBadge({ value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const isUp = safeValue > 0;
  const isDown = safeValue < 0;
  const color = isUp ? "#16a34a" : isDown ? "#dc2626" : "#9ca3af";
  const arrow = isUp ? "↑" : isDown ? "↓" : "→";
  return (
    <div style={{ color, fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
      <span>{arrow}</span>
      <span>{Math.abs(safeValue)}%</span>
    </div>
  );
}

function Panel({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: "14px 16px",
        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MiniMetric({ label, value, color, border }) {
  return (
    <div
      style={{
        border: `1px solid ${border}`,
        background: color,
        borderRadius: 10,
        padding: "10px 12px",
        textAlign: "center",
      }}
    >
      <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
        {label}
      </Text>
      <div style={{ fontSize: 18, fontWeight: 600, marginTop: 4, color: "#111827" }}>{value}</div>
    </div>
  );
}

function SimpleBars({ items, getValue, getLabelValue, labelUnit }) {
  const max = Math.max(1, ...items.map((item) => getValue(item)));
  return (
    <div
      style={{
        border: "1px solid #eef2f7",
        borderRadius: 12,
        padding: "14px",
        display: "flex",
        gap: 10,
        alignItems: "flex-end",
        height: 190,
      }}
    >
      {items.map((item) => {
        const height = Math.round((getValue(item) / max) * 100);
        const labelValue = getLabelValue ? getLabelValue(item) : getValue(item);
        return (
          <div key={`${item.Ay}-${item.Yil}`} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#f3f4f6", borderRadius: 8, height: 120, display: "flex", alignItems: "flex-end" }}>
              <div style={{ width: "100%", height: `${height}%`, background: "#fbbf24", borderRadius: 8 }} />
            </div>
            <Text type="secondary" style={{ textAlign: "center", fontSize: 11 }}>
              {item.Ay} ({formatExactValue(labelValue)} {labelUnit})
            </Text>
          </div>
        );
      })}
    </div>
  );
}

export default function OzetTab({ makineId, startDate, endDate }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
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
        const response = await AxiosInstance.get("GetMakineOzetTab", {
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

  const bildirimler = data?.Bildirimler || {};
  const ariza = data?.ArizaIstatistikleri || {};
  const aylikDurusSureleri = data?.AylikDurusSureleri || data?.AylikMaliyetler || [];
  const operasyon = data?.OperasyonDurumu || {};
  const parcaAnalizi = data?.ParcaAnalizi || [];

  useEffect(() => {
    setPage(1);
  }, [parcaAnalizi.length]);

  const totalDuration = useMemo(() => aylikDurusSureleri.reduce((sum, item) => sum + getMonthlyDurationValue(item), 0), [aylikDurusSureleri]);
  const averageDuration = useMemo(() => (aylikDurusSureleri.length ? totalDuration / aylikDurusSureleri.length : 0), [totalDuration, aylikDurusSureleri.length]);

  const pagedParcaAnalizi = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return parcaAnalizi.slice(startIndex, startIndex + pageSize);
  }, [parcaAnalizi, page, pageSize]);

  if (loading) {
    return (
      <Panel style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin />
      </Panel>
    );
  }

  if (!data) {
    return (
      <Panel style={{ minHeight: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Text type="secondary">{t("makineTarihce.ozet.veriYok", { defaultValue: "Veri bulunamadı." })}</Text>
      </Panel>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 12 }}>
        <Panel style={{ gridColumn: "span 6" }}>
          <Text style={{ fontSize: 13, fontWeight: 600, display: "block" }}>{t("makineTarihce.ozet.bildirimler")}</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, marginTop: 10 }}>
            <MiniMetric label={t("makineTarihce.ozet.periyodik")} value={bildirimler.PeriyodikCount || 0} color="#eff6ff" border="#bfdbfe" />
            <MiniMetric label={t("makineTarihce.ozet.ariza")} value={bildirimler.ArizaCount || 0} color="#fef2f2" border="#fecaca" />
            <MiniMetric label={t("makineTarihce.ozet.bakim")} value={bildirimler.BakimCount || 0} color="#fef9c3" border="#fde68a" />
            <MiniMetric label={t("makineTarihce.ozet.talepler")} value={bildirimler.TalepCount || 0} color="#ecfdf3" border="#bbf7d0" />
          </div>
        </Panel>

        <Panel style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>{t("makineTarihce.ozet.arizaSikligiMtbf")}</Text>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{ariza.MTBF_Deger || 0}</div>
            <TrendBadge value={ariza.MTBF_Trend} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("saat")} ({Math.round((ariza.MTBF_Deger || 0) / 24)} {t("gun")})
          </Text>
        </Panel>

        <Panel style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: 600 }}>{t("makineTarihce.ozet.onarimSuresiMttr")}</Text>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 26, fontWeight: 600 }}>{ariza.MTTR_Deger || 0}</div>
            <TrendBadge value={ariza.MTTR_Trend} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("saat")}
          </Text>
        </Panel>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 12 }}>
        <Panel style={{ gridColumn: "span 7" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <Text style={{ fontSize: 14, fontWeight: 600, display: "block" }}>{t("makineTarihce.ozet.durusSureleri")}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t("makineTarihce.ozet.aylaraGore")}
              </Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                {t("makineTarihce.ozet.total")}
              </Text>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                {formatMoney(totalDuration)} {hourShort}
              </div>
              <Text type="secondary" style={{ fontSize: 11 }}>
                {t("makineTarihce.ozet.average")}: {formatMoney(averageDuration)} {hourShort}
              </Text>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <SimpleBars items={aylikDurusSureleri} getValue={getMonthlyDurationValue} getLabelValue={(item) => item?.ToplamTutar ?? 0} labelUnit={hourShort} />
          </div>
        </Panel>

        <Panel style={{ gridColumn: "span 5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Text style={{ fontSize: 14, fontWeight: 600, display: "block" }}>{t("makineTarihce.ozet.operasyonOzeti")}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t("makineTarihce.ozet.operasyonDurumu")}
              </Text>
            </div>
            <div style={{ textAlign: "right" }}>
              <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                {t("makineTarihce.ozet.toplamIsEmri")}
              </Text>
              <div style={{ fontSize: 20, fontWeight: 600, color: "#dc2626" }}>{operasyon.ToplamIsEmri || 0}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <KeyValue label={t("makineTarihce.ozet.tamamlanan")} value={operasyon.Tamamlanan || 0} />
            <KeyValue label={t("makineTarihce.ozet.devamEden")} value={operasyon.DevamEden || 0} />
            <KeyValue label={t("makineTarihce.ozet.beklemede")} value={operasyon.Beklemede || 0} />
            <KeyValue label={t("makineTarihce.ozet.ertelenen")} value={operasyon.Ertelenen || 0} />
          </div>

          <div style={{ marginTop: 16, borderTop: "1px solid #eef2f7", paddingTop: 12 }}>
            <Text style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 8 }}>{t("makineTarihce.ozet.sureler")}</Text>
            <KeyValue label={t("makineTarihce.ozet.arizaSuresi")} value={`${operasyon.ArizaSuresi || 0} ${hourShort}`} />
            <KeyValue label={t("makineTarihce.ozet.bakimSuresi")} value={`${operasyon.BakimSuresi || 0} ${hourShort}`} />
            <KeyValue label={t("makineTarihce.ozet.durusSuresi")} value={`${operasyon.DurusSuresi || 0} ${hourShort}`} />
          </div>
        </Panel>
      </div>

      <Panel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <Text style={{ fontSize: 14, fontWeight: 600, display: "block" }}>{t("makineTarihce.ozet.parcaMaliyetAnalizi")}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t("makineTarihce.ozet.malzemeTipineGore")}
            </Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t("makineTarihce.ozet.toplamLabel")}: {formatMoney(parcaAnalizi.reduce((sum, item) => sum + (item.Tutar || 0), 0))}
          </Text>
        </div>

        <div style={{ marginTop: 12, border: "1px solid #eef2f7", borderRadius: 12, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 0.6fr 0.8fr 0.3fr",
              background: "#f3f4f6",
              padding: "10px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "#4b5563",
            }}
          >
            <div>{t("makineTarihce.ozet.malzemeTipi")}</div>
            <div style={{ textAlign: "right" }}>{t("makineTarihce.ozet.miktar")}</div>
            <div style={{ textAlign: "right" }}>{t("makineTarihce.ozet.tutar")}</div>
            <div style={{ textAlign: "right" }}>{t("makineTarihce.ozet.yuzde")}</div>
          </div>
          {pagedParcaAnalizi.map((row) => (
            <div
              key={row.MalzemeTipi}
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 0.6fr 0.8fr 0.3fr",
                padding: "10px 12px",
                borderTop: "1px solid #eef2f7",
                fontSize: 13,
                color: "#1f2937",
              }}
            >
              <div>{row.MalzemeTipi}</div>
              <div style={{ textAlign: "right" }}>{row.Miktar}</div>
              <div style={{ textAlign: "right" }}>{formatMoney(row.Tutar)}</div>
              <div style={{ textAlign: "right" }}>{row.Yuzde}%</div>
            </div>
          ))}
          {parcaAnalizi.length === 0 && (
            <div style={{ padding: "12px", textAlign: "center" }}>
              <Text type="secondary">{t("makineTarihce.ozet.veriYok", { defaultValue: "Veri bulunamadı." })}</Text>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Pagination current={page} pageSize={pageSize} total={parcaAnalizi.length} onChange={setPage} showSizeChanger={false} size="small" />
        </div>
      </Panel>
    </div>
  );
}

function KeyValue({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
      <Text type="secondary" style={{ fontSize: 13 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 13, fontWeight: 600 }}>{value}</Text>
    </div>
  );
}
