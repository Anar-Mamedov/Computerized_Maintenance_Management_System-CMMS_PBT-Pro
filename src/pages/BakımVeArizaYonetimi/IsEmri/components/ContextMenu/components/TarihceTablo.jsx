import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Button, Empty, message, Modal, Spin } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../../api/http";
import MenuItem from "./MenuItem";

const getResponseList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.list)) return response.list;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const buildHistoryRows = (items) =>
  items
    .map((item, index) => ({
      key: `${item.TB_ISEMRI_LOG_ID ?? "history"}-${index}`,
      backendId: item.TB_ISEMRI_LOG_ID ?? null,
      isEmriId: item.ISL_ISEMRI_ID ?? null,
      date: item.ISL_TARIH ?? null,
      time: item.ISL_SAAT ?? null,
      action: item.ISL_ISLEM ?? "",
      description: item.ISL_ACIKLAMA ?? "",
      userId: item.ISL_KULLANICI_ID ?? null,
      user: item.ISL_KULLANICI ?? "",
    }))
    .sort((a, b) => {
      const aDateTime = dayjs(`${a.date ?? ""} ${a.time ?? ""}`);
      const bDateTime = dayjs(`${b.date ?? ""} ${b.time ?? ""}`);
      return bDateTime.valueOf() - aDateTime.valueOf();
    });

const formatDateTime = (date, time) => {
  const dateTime = dayjs(`${date ?? ""} ${time ?? ""}`);
  if (!dateTime.isValid()) return "";
  return dateTime.format("DD.MM.YYYY HH:mm");
};

export default function TarihceTablo({ selectedRows }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);

  const selectedRow = selectedRows?.[0];
  const selectedIsEmriId = selectedRow?.key;
  const selectedIsEmriNo = selectedRow?.ISEMRI_NO ?? "-";

  const modalSubtitle = useMemo(
    () =>
      t("workOrder.history.selectedRecord", {
        no: selectedIsEmriNo,
      }),
    [selectedIsEmriNo, t]
  );

  const openModal = async () => {
    if (!selectedIsEmriId) {
      return;
    }

    setIsModalOpen(true);
    setLoading(true);
    setHistoryRows([]);

    try {
      const response = await AxiosInstance.get(`IsEmriTarihce?ID=${selectedIsEmriId}`);
      setHistoryRows(buildHistoryRows(getResponseList(response)));
    } catch (error) {
      console.error("İş emri tarihçesi alınırken hata oluştu:", error);
      setHistoryRows([]);
      message.error(t("workOrder.history.fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <MenuItem icon={<HistoryOutlined />} title={t("workOrder.history.menuTitle")} description={t("workOrder.history.menuDescription")} onClick={openModal} />

      <Modal
        width={900}
        centered
        open={isModalOpen}
        title={
          <div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#1F3251", lineHeight: 1.25 }}>{t("workOrder.history.modalTitle")}</div>
            <div style={{ fontSize: "14px", color: "#60708A", marginTop: "8px" }}>{modalSubtitle}</div>
          </div>
        }
        onCancel={closeModal}
        footer={
          <Button onClick={closeModal} style={{ minWidth: 84 }}>
            {t("workOrder.history.close")}
          </Button>
        }
      >
        <div
          style={{
            borderTop: "1px solid #E7EDF5",
            margin: "0 -24px",
            padding: "18px 24px 0",
            minHeight: "320px",
          }}
        >
          <Spin spinning={loading}>
            {historyRows.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {historyRows.map((item, index) => (
                  <div
                    key={item.key}
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "18px",
                      border: "1px solid #D9E5F2",
                      borderRadius: "18px",
                      background: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        minWidth: "26px",
                        borderRadius: "50%",
                        border: "1px solid #D5DEEA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1F3251",
                        fontSize: "13px",
                        marginTop: "2px",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#1F3251" }}>{item.action || t("workOrder.history.emptyAction")}</span>
                        <span style={{ fontSize: "14px", color: "#60708A" }}>{formatDateTime(item.date, item.time)}</span>
                      </div>
                      <div style={{ fontSize: "14px", color: "#60708A" }}>
                        {t("workOrder.history.performedBy")} {item.user || "-"}
                      </div>
                      <div style={{ fontSize: "14px", color: "#334155", lineHeight: 1.55 }}>{item.description || t("workOrder.history.emptyDescription")}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "280px" }}>
                  <Empty description={t("workOrder.history.empty")} />
                </div>
              )
            )}
          </Spin>
        </div>
      </Modal>
    </>
  );
}

TarihceTablo.propTypes = {
  selectedRows: PropTypes.arrayOf(PropTypes.object),
};
