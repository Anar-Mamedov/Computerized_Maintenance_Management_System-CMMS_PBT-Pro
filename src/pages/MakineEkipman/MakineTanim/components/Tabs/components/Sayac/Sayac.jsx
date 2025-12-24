import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Empty, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../api/http.jsx";
import LocalizedDateText from "../../../../../../../utils/components/LocalizedDateText.jsx";
import ContextMenu from "./ContextMenu/ContextMenu.jsx";
import Edit from "./Edit.jsx";
import Insert from "./Insert.jsx";

const containerStyle = {
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #D9D4D5",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

const normalizeResponse = (response) => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

function Sayac({ selectedRowID = null }) {
  const { t, i18n } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditVisible, setEditVisible] = useState(false);
  const [rowInEdit, setRowInEdit] = useState(null);

  const EMPTY_VALUE = "-";
  const yesText = t("globalYes", { defaultValue: "Evet" });
  const noText = t("globalNo", { defaultValue: "Hayır" });
  const fetchErrorMessage = t("sayac.fetchError", { defaultValue: "Sayaç verileri alınamadı." });
  const noSelectionText = t("sayac.noSelection", { defaultValue: "Makine seçimi yapılmadı." });
  const emptyTableText = t("sayac.emptyState", { defaultValue: "Sayaç kaydı bulunmuyor." });

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language || "tr", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }),
    [i18n.language]
  );

  const formatNumber = useCallback(
    (value) => {
      if (value === null || value === undefined) {
        return EMPTY_VALUE;
      }
      const numericValue = typeof value === "number" ? value : Number(value);
      if (Number.isNaN(numericValue)) {
        return EMPTY_VALUE;
      }
      return numberFormatter.format(numericValue);
    },
    [numberFormatter]
  );

  const formatText = useCallback((value) => {
    if (value === null || value === undefined) {
      return EMPTY_VALUE;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length ? trimmed : EMPTY_VALUE;
    }
    return String(value);
  }, []);

  const formatBoolean = useCallback(
    (value) => {
      if (value === null || value === undefined) {
        return EMPTY_VALUE;
      }
      return value ? yesText : noText;
    },
    [noText, yesText]
  );

  const fetchCounters = useCallback(
    async (shouldCancel) => {
      const isCancelled = () => (typeof shouldCancel === "function" ? shouldCancel() : false);

      if (!selectedRowID) {
        if (isCancelled()) {
          return;
        }
        setRecords([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await AxiosInstance.get("GetMakineSayaclar", {
          params: { MakineID: selectedRowID },
        });

        if (isCancelled()) {
          return;
        }

        if (response?.has_error) {
          console.error(fetchErrorMessage, response?.message);
          setRecords([]);
          return;
        }

        const data = normalizeResponse(response);
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isCancelled()) {
          return;
        }
        console.error(fetchErrorMessage, err);
        setRecords([]);
      } finally {
        if (!isCancelled()) {
          setLoading(false);
        }
      }
    },
    [fetchErrorMessage, selectedRowID]
  );

  useEffect(() => {
    let cancelled = false;
    const shouldCancel = () => cancelled;
    fetchCounters(shouldCancel);
    return () => {
      cancelled = true;
    };
  }, [fetchCounters]);

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setEditVisible(false);
    setRowInEdit(null);
  }, [selectedRowID]);

  const tableData = useMemo(
    () =>
      records.map((item, index) => ({
        key: item.TB_SAYAC_ID ?? `${item.MES_REF_ID || "sayac"}-${index}`,
        ...item,
      })),
    [records]
  );

  useEffect(() => {
    if (!selectedRowKeys.length) {
      return;
    }

    const validKeys = new Set(tableData.map((item) => item.key));

    if (selectedRowKeys.every((key) => validKeys.has(key))) {
      return;
    }

    setSelectedRowKeys((prevKeys) => prevKeys.filter((key) => validKeys.has(key)));
    setSelectedRows((prevRows) => prevRows.filter((row) => validKeys.has(row.key)));
  }, [selectedRowKeys, tableData]);

  const handleRowSelectionChange = useCallback((newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(newSelectedRows);
  }, []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: handleRowSelectionChange,
    }),
    [handleRowSelectionChange, selectedRowKeys]
  );

  const refreshTableData = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    fetchCounters();
  }, [fetchCounters]);

  const handleOpenEdit = useCallback((row) => {
    setRowInEdit(row);
    setEditVisible(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditVisible(false);
    setRowInEdit(null);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t("sayac.counterDescription", { defaultValue: "Sayaç Tanımı" }),
        dataIndex: "MES_TANIM",
        key: "MES_TANIM",
        ellipsis: true,
        width: 150,
        render: (value, record) => {
          const formatted = formatText(value);
          if (formatted === EMPTY_VALUE) {
            return formatted;
          }
          return (
            <Typography.Link
              onClick={(event) => {
                event.preventDefault();
                handleOpenEdit(record);
              }}
            >
              {formatted}
            </Typography.Link>
          );
        },
      },
      {
        title: t("sayac.counterShape", { defaultValue: "Sayaç Şekli" }),
        dataIndex: "MES_SAYAC_SEKLI",
        key: "MES_SAYAC_SEKLI",
        ellipsis: true,
        width: 150,
        render: formatText,
      },
      {
        title: t("sayac.counterType", { defaultValue: "Sayaç Tipi" }),
        dataIndex: "MES_SAYAC_TIP",
        key: "MES_SAYAC_TIP",
        ellipsis: true,
        width: 150,
        render: formatText,
      },
      {
        title: t("sayac.unit", { defaultValue: "Birim" }),
        dataIndex: "MES_SAYAC_BIRIM",
        key: "MES_SAYAC_BIRIM",
        ellipsis: true,
        width: 150,
        render: formatText,
      },
      {
        title: t("sayac.currentValue", { defaultValue: "Güncel Değer" }),
        dataIndex: "MES_GUNCEL_DEGER",
        key: "MES_GUNCEL_DEGER",
        align: "right",
        width: 150,
        render: formatNumber,
      },
      {
        title: t("sayac.estimatedIncrease", { defaultValue: "Tahmini Artış" }),
        dataIndex: "MES_TAHMINI_ARTIS_DEGER",
        key: "MES_TAHMINI_ARTIS_DEGER",
        align: "right",
        width: 150,
        render: formatNumber,
      },
      {
        title: t("sayac.startDate", { defaultValue: "Başlangıç Tarihi" }),
        dataIndex: "MES_BASLANGIC_TARIH",
        key: "MES_BASLANGIC_TARIH",
        width: 150,
        render: (value) => <LocalizedDateText value={value} />,
      },
      {
        title: t("sayac.startTime", { defaultValue: "Başlangıç Saati" }),
        dataIndex: "MES_BASLANGIC_SAAT",
        key: "MES_BASLANGIC_SAAT",
        width: 150,
        render: (value) => <LocalizedDateText value={value} mode="time" />,
      },
      {
        title: t("sayac.startValue", { defaultValue: "Başlangıç Değeri" }),
        dataIndex: "MES_BASLANGIC_DEGER",
        key: "MES_BASLANGIC_DEGER",
        align: "right",
        width: 150,
        render: formatNumber,
      },
      {
        title: t("sayac.lastReading", { defaultValue: "Son Okuma" }),
        key: "MES_SON_OKUMA",
        width: 150,
        render: (_, record) => <LocalizedDateText value={record.MES_SON_OKUMA_TARIH} timeValue={record.MES_SON_OKUMA_SAAT} mode="datetime" />,
      },
      {
        title: t("sayac.isDefault", { defaultValue: "Varsayılan" }),
        dataIndex: "MES_VARSAYILAN",
        key: "MES_VARSAYILAN",
        width: 150,
        render: formatBoolean,
      },
      {
        title: t("sayac.isVirtual", { defaultValue: "Sanal Sayaç" }),
        dataIndex: "MES_SANAL_SAYAC",
        key: "MES_SANAL_SAYAC",
        width: 150,
        render: formatBoolean,
      },
      {
        title: t("sayac.virtualIncrease", { defaultValue: "Sanal Sayaç Artış" }),
        dataIndex: "MES_SANAL_SAYAC_ARTIS",
        key: "MES_SANAL_SAYAC_ARTIS",
        align: "right",
        width: 150,
        render: formatNumber,
      },
      {
        title: t("sayac.description", { defaultValue: "Açıklama" }),
        dataIndex: "MES_ACIKLAMA",
        key: "MES_ACIKLAMA",
        ellipsis: true,
        width: 150,
        render: formatText,
      },
    ],
    [formatBoolean, formatNumber, formatText, handleOpenEdit, t]
  );

  const tableLocale = useMemo(
    () => ({
      emptyText: emptyTableText,
    }),
    [emptyTableText]
  );

  if (!selectedRowID) {
    return (
      <div style={containerStyle}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={noSelectionText} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", gap: "10px" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
        <Insert onRefresh={refreshTableData} selectedMakineID={selectedRowID} />
      </div>

      <Table
        bordered
        size="small"
        loading={loading}
        dataSource={tableData}
        columns={columns}
        pagination={false}
        scroll={{ x: 100 }}
        locale={tableLocale}
        rowSelection={rowSelection}
      />
      <Edit selectedRow={rowInEdit} drawerVisible={isEditVisible} onDrawerClose={handleCloseEdit} onRefresh={refreshTableData} />
    </div>
  );
}

Sayac.propTypes = {
  selectedRowID: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Sayac;
