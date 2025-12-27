import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, message, Modal, Row, Spin, Table, Typography } from "antd";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../api/http";
import LocalizedDateText from "../../../../../utils/components/LocalizedDateText.jsx";

const { Text } = Typography;

const getDateTimeLabel = (dateValue, timeValue, locale) => {
  const dateText = dateValue ? dayjs(dateValue).locale(locale).format("L") : "";
  const timeText = timeValue ? String(timeValue) : "";
  if (dateText && timeText) {
    return `${dateText} ${timeText}`;
  }
  return dateText || timeText || "-";
};

function HistoryModal({ open, onClose, record }) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const sayacId = record?.SayacId;

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language || "tr", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [i18n.language]
  );

  useEffect(() => {
    if (!open) {
      setHistoryData([]);
      return;
    }

    if (!sayacId) {
      setHistoryData([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    AxiosInstance.get(`GetSayacTarihce?sayacId=${sayacId}`)
      .then((response) => {
        if (!isMounted) {
          return;
        }
        const list = Array.isArray(response?.data) ? response.data : [];
        setHistoryData(list);
        if (response?.status_code !== 200) {
          message.error(t("sayacGuncelleme.historyFetchError", { defaultValue: "Sayaç tarihçesi alınamadı." }));
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        console.error("Failed to load sayac tarihce:", error);
        message.error(t("sayacGuncelleme.historyFetchError", { defaultValue: "Sayaç tarihçesi alınamadı." }));
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, sayacId, t]);

  const tableData = useMemo(
    () =>
      historyData.map((item, index) => ({
        ...item,
        key: item.TarihceId ?? `${item.Tarih}-${item.Saat}-${index}`,
      })),
    [historyData]
  );

  const chartData = useMemo(() => {
    const locale = i18n.language || "tr";
    return historyData
      .map((item) => {
        const dateTime = `${item.Tarih || ""} ${item.Saat || "00:00"}`.trim();
        return {
          label: getDateTimeLabel(item.Tarih, item.Saat, locale),
          value: Number(item.OkunanDeger),
          sortKey: dayjs(dateTime).valueOf(),
        };
      })
      .filter((item) => Number.isFinite(item.value))
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [historyData, i18n.language]);

  const latestRecord = useMemo(() => {
    if (!historyData.length) {
      return null;
    }
    return historyData.reduce((latest, item) => {
      const latestDate = dayjs(`${latest.Tarih || ""} ${latest.Saat || "00:00"}`.trim());
      const nextDate = dayjs(`${item.Tarih || ""} ${item.Saat || "00:00"}`.trim());
      return nextDate.isAfter(latestDate) ? item : latest;
    }, historyData[0]);
  }, [historyData]);

  const currentValue = record?.GuncelDeger ?? latestRecord?.OkunanDeger ?? null;
  const currentDate = record?.SonOkumaTarih ?? latestRecord?.Tarih ?? null;
  const currentTime = record?.SonOkumaSaat ?? latestRecord?.Saat ?? null;

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return "-";
    }
    return numberFormatter.format(numericValue);
  };

  const columns = useMemo(
    () => [
      {
        title: t("sayacGuncelleme.historyDateTime", { defaultValue: "Tarih-Saat" }),
        dataIndex: "Tarih",
        key: "Tarih",
        render: (_, item) => <LocalizedDateText value={item.Tarih} timeValue={item.Saat} mode="datetime" />,
      },
      {
        title: t("sayacGuncelleme.historyValue", { defaultValue: "Değer" }),
        dataIndex: "OkunanDeger",
        key: "OkunanDeger",
        render: (value) => formatNumber(value),
      },
      {
        title: t("sayacGuncelleme.historyDiff", { defaultValue: "Fark" }),
        dataIndex: "Fark",
        key: "Fark",
        render: (value) => formatNumber(value),
      },
      {
        title: t("aciklama", { defaultValue: "Açıklama" }),
        dataIndex: "Aciklama",
        key: "Aciklama",
        render: (value) => (value ? String(value) : "-"),
      },
      {
        title: t("sayacGuncelleme.historyUser", { defaultValue: "İşlem Yapan" }),
        dataIndex: "IslemYapan",
        key: "IslemYapan",
        render: (value) => (value ? String(value) : "-"),
      },
    ],
    [t]
  );

  const recordLabel = [record?.MakineKodu, record?.SayacTanim].filter(Boolean).join(" ");
  const baseTitle = t("sayacGuncelleme.historyTitle", { defaultValue: "Sayaç Tarihçesi" });
  const modalTitle = recordLabel ? `${baseTitle} - ${recordLabel}` : baseTitle;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      title={modalTitle}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Text type="secondary">
          {t("sayacGuncelleme.historySubtitle", { defaultValue: "Son 50 hareket" })}
        </Text>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={8}>
            <Card size="small">
              <Text type="secondary">{t("sayac.currentValue", { defaultValue: "Current Value" })}</Text>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{formatNumber(currentValue)}</div>
              <div style={{ color: "#8c8c8c" }}>
                <LocalizedDateText value={currentDate} timeValue={currentTime} mode="datetime" />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Text type="secondary">{t("sayacGuncelleme.historyCount", { defaultValue: "Kayıt Sayısı" })}</Text>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{formatNumber(historyData.length)}</div>
              <div style={{ color: "#8c8c8c" }}>{t("sayacGuncelleme.historySubtitle", { defaultValue: "Son 50 hareket" })}</div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small">
              <Text type="secondary">{t("sayac", { defaultValue: "Sayaç" })}</Text>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{record?.SayacTanim || "-"}</div>
              <div style={{ color: "#8c8c8c" }}>{record?.Periyot || "-"}</div>
            </Card>
          </Col>
        </Row>

        <Card size="small" style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <Text strong>{t("sayacGuncelleme.historyChartTitle", { defaultValue: "Zaman İçinde Sayaç Değeri" })}</Text>
            <Text type="secondary">{t("sayacGuncelleme.historyChartSubtitle", { defaultValue: "Son kayıtlar üzerinden trend" })}</Text>
          </div>
          <div style={{ width: "100%", height: 200 }}>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    labelStyle={{ fontSize: 12 }}
                    formatter={(value, name) => [formatNumber(value), name]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={t("sayacGuncelleme.historyChartValueLabel", { defaultValue: "Değer" })}
                    stroke="#1677ff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("sayacGuncelleme.historyEmpty", { defaultValue: "Tarihçe kaydı bulunamadı." })} />
            )}
          </div>
        </Card>

        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          size="small"
          locale={{ emptyText: t("sayacGuncelleme.historyEmpty", { defaultValue: "Tarihçe kaydı bulunamadı." }) }}
          scroll={{ y: 260 }}
        />
      </Spin>
    </Modal>
  );
}

export default HistoryModal;
