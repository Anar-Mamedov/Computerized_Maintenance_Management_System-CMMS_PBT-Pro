import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Empty, Modal, Table, Tooltip, message } from "antd";
import { useTranslation } from "react-i18next";
import { LuCheck, LuX } from "react-icons/lu";
import AxiosInstance from "../../../api/http";
import { useDashboard } from "./dashboardContext";
import downloadCsv from "./downloadCsv";
import useAutoTableScroll, { TABLE_FILL_INNER } from "./useAutoTableScroll";
import ApprovalRejectModal from "./ApprovalRejectModal";
import WidgetCard from "./WidgetCard";
import { COLORS } from "./theme";
import IsEmriEditDrawer from "../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";
import IsTalebiEditDrawer from "../../YardimMasasi/IsTalepleri/Update/EditDrawer.jsx";
import MalzemeTalebiEditDrawer from "../../SatinalmaYonetimi/MalzemeTalepleri/Update/EditDrawer.jsx";
import TeklifKarsilastirma from "../../SatinalmaYonetimi/MalzemeTalepleri/components/ContextMenu/components/Teklif/components/TeklifKarsilastirma.jsx";

// ONAY_ONYTANIM_ID, kodun tıklandığında hangi detay ekranının açılacağını belirler.
const DETAY_TIPLERI = { IS_EMRI: 1, IS_TALEBI: 2, MALZEME_TALEBI: 3, TEKLIF: 4 };

// Bekleyen onay sayısı çok değiştiği için tablo alanı içeriğe göre hesaplanır:
// az kayıtta kart şişmez, çok kayıtta üst sınırda kalıp kaydırılır.
const SATIR_YUKSEKLIGI = 40;
const TABLO_BASLIK_YUKSEKLIGI = 44;
const EN_AZ_TABLO_ALANI = 140;
const EN_COK_TABLO_ALANI = 340;

export default function PendingApprovals({ onHide }) {
  const { t } = useTranslation();
  const { refreshKey } = useDashboard();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  // Aynı anda yalnızca bir detay açılır; hangi tipin açıldığını kayıtla birlikte tutarız.
  const [detay, setDetay] = useState(null);
  const [reddedilecek, setReddedilecek] = useState(null);

  const dogalTabloAlani = Math.min(Math.max(rows.length * SATIR_YUKSEKLIGI + TABLO_BASLIK_YUKSEKLIGI, EN_AZ_TABLO_ALANI), EN_COK_TABLO_ALANI);
  const { containerRef, scrollY, wrapperStyle } = useAutoTableScroll(dogalTabloAlani);

  const reload = useCallback(() => setLocalRefreshKey((previous) => previous + 1), []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const response = await AxiosInstance.get("BekleyenOnaylar");
        const list = Array.isArray(response) ? response : [];
        if (!cancelled) {
          // Backend ID'leri tekrarlayabildiği için render anahtarı ayrıca üretilir.
          setRows(list.map((item, index) => ({ ...item, clientKey: `onay-${item.TB_ONAYLAR_ID ?? item.ONAY_TABLO_ID}-${index}` })));
        }
      } catch (error) {
        console.error("Bekleyen onaylar alınamadı:", error);
        if (!cancelled) {
          setRows([]);
          setHasError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [refreshKey, localRefreshKey]);

  // Onayla/Reddet uçları aynı yanıt sözleşmesini kullanır.
  const sonucuBildir = (response) => {
    if (response?.status_code === 200 || response?.status_code === 201) {
      message.success(t("islemBasarili"));
      reload();
      return true;
    }
    message.error(response?.status_code === 401 ? t("buIslemeYetkinizYok") : t("islemBasarisiz"));
    return false;
  };

  const onayla = async (record) => {
    try {
      // API'ye her zaman backend'in verdiği gerçek ID gönderilir.
      const response = await AxiosInstance.post(`Onayla?ONAY_TABLO_ID=${record.ONAY_TABLO_ID}`);
      sonucuBildir(response);
    } catch (error) {
      console.error("Onaylama başarısız:", error);
      message.error(t("islemBasarisiz"));
    }
  };

  const reddet = async (aciklama) => {
    try {
      const response = await AxiosInstance.post("Reddet", { ONAY_TABLO_ID: reddedilecek.ONAY_TABLO_ID, ONAY_RED_ACIKLAMA: aciklama });
      if (sonucuBildir(response)) setReddedilecek(null);
    } catch (error) {
      console.error("Reddetme başarısız:", error);
      message.error(t("islemBasarisiz"));
    }
  };

  // Detay ekranları kaydı `key` alanı üzerinden okuduğu için o alan ONAY_TABLO_ID ile doldurulur.
  const detayAc = (record) => setDetay({ tip: record.ONAY_ONYTANIM_ID, record: { ...record, key: record.ONAY_TABLO_ID } });

  const handleDownload = () =>
    downloadCsv(
      "bekleyen-onaylar",
      [t("kod"), t("onayTipi")],
      rows.map((row) => [row.ONAY_TABLO_KOD, row.ONY_TANIM])
    );

  const columns = [
    {
      title: t("kod"),
      dataIndex: "ONAY_TABLO_KOD",
      key: "kod",
      ellipsis: true,
      render: (value, record) => (
        <Button type="link" style={{ padding: 0, height: "auto" }} onClick={() => detayAc(record)}>
          {value}
        </Button>
      ),
    },
    { title: t("onayTipi"), dataIndex: "ONY_TANIM", key: "onayTipi", ellipsis: true },
    {
      title: t("islem"),
      key: "islem",
      align: "right",
      width: 108,
      render: (value, record) => (
        <span style={{ display: "inline-flex", gap: 6 }}>
          <Tooltip title={t("onayla")}>
            <Button size="small" aria-label={t("onayla")} icon={<LuCheck size={15} />} style={{ color: COLORS.green, borderColor: COLORS.green }} onClick={() => onayla(record)} />
          </Tooltip>
          <Tooltip title={t("reddet")}>
            <Button size="small" danger aria-label={t("reddet")} icon={<LuX size={15} />} onClick={() => setReddedilecek(record)} />
          </Tooltip>
        </span>
      ),
    },
  ];

  return (
    <WidgetCard
      title={t("bekleyenOnaylarim")}
      subtitle={t("onayiniziBekleyenKayitlar")}
      loading={loading}
      hasError={hasError}
      bodyPadding={0}
      onRefresh={reload}
      onDownload={rows.length ? handleDownload : undefined}
      onHide={onHide}
      extra={
        <span style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 13, color: COLORS.muted, whiteSpace: "nowrap" }}>
          {t("bekleyen")} <strong style={{ color: COLORS.text }}>{rows.length}</strong>
        </span>
      }
    >
      {!loading && !hasError && rows.length === 0 ? (
        <div style={{ padding: 24 }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("bekleyenOnayYok")} />
        </div>
      ) : (
        // Tablo kartta kalan alanı doldurur; kaydırma yüksekliği dış kutudan ölçülür.
        <div style={wrapperStyle}>
          <div ref={containerRef} style={TABLE_FILL_INNER}>
            <Table size="small" rowKey="clientKey" columns={columns} dataSource={rows} pagination={false} scroll={{ y: scrollY }} locale={{ emptyText: t("bekleyenOnayYok") }} />
          </div>
        </div>
      )}

      {detay?.tip === DETAY_TIPLERI.IS_EMRI && <IsEmriEditDrawer selectedRow={detay.record} drawerVisible onDrawerClose={() => setDetay(null)} onRefresh={reload} />}
      {detay?.tip === DETAY_TIPLERI.IS_TALEBI && <IsTalebiEditDrawer selectedRow={detay.record} drawerVisible onDrawerClose={() => setDetay(null)} onRefresh={reload} />}
      {detay?.tip === DETAY_TIPLERI.MALZEME_TALEBI && <MalzemeTalebiEditDrawer selectedRow={detay.record} drawerVisible onDrawerClose={() => setDetay(null)} onRefresh={reload} />}

      <Modal
        title={t("teklifKarsilastirma")}
        open={detay?.tip === DETAY_TIPLERI.TEKLIF}
        onCancel={() => {
          setDetay(null);
          reload();
        }}
        footer={null}
        width="95vw"
        style={{ top: 20 }}
        destroyOnClose
      >
        {detay?.tip === DETAY_TIPLERI.TEKLIF && (
          <TeklifKarsilastirma
            teklifIds={[detay.record.key]}
            teklifDurumlari={[{ teklifId: detay.record.key, durumID: 2 }]}
            fisNo={detay.record.ONAY_TABLO_KOD}
            fisId={detay.record.key}
            disabled={false}
            onDurumGuncelle={reload}
          />
        )}
      </Modal>

      <ApprovalRejectModal open={Boolean(reddedilecek)} record={reddedilecek} onCancel={() => setReddedilecek(null)} onConfirm={reddet} />
    </WidgetCard>
  );
}

PendingApprovals.propTypes = {
  onHide: PropTypes.func,
};
