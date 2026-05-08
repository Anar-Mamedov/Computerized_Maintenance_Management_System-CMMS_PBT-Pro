import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Spin, Table, message } from "antd";
import { useFormContext } from "react-hook-form";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../../../api/http";

const createProcedureRowKey = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `procedure-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

const mapProcedureItem = (item) => ({
  ...item,
  key: createProcedureRowKey(),
  backendId: item.TB_IS_TANIM_ID ?? item.id ?? null,
  IST_KOD: String(item.IST_KOD ?? item.kod ?? "").trim(),
  IST_TANIM: String(item.IST_TANIM ?? item.tanim ?? "").trim(),
  IST_TIP: item.IST_TIP ?? item.ist_tip ?? null,
  IST_TIP_KOD_ID: item.IST_TIP_KOD_ID ?? item.ist_tip_kod_id ?? null,
  IST_NEDEN: item.IST_NEDEN ?? item.ist_neden ?? null,
  IST_NEDEN_KOD_ID: item.IST_NEDEN_KOD_ID ?? item.ist_neden_kod_id ?? null,
});

export default function ProsedurTablo({ workshopSelectedId, onSubmit }) {
  const { watch } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isEmriTipiID = watch("isEmriTipiID");
  const columns = [
    {
      title: "Prosedür Kodu",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 180,
      ellipsis: true,
      render: (_, record) => record.IST_KOD || record.kod || "",
    },
    {
      title: "Prosedür Tanımı",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      ellipsis: true,
      render: (_, record) => record.IST_TANIM || record.tanim || "",
    },
  ];

  const filteredData = useMemo(() => {
    const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase();
    if (!normalizedSearchTerm) {
      return data;
    }

    return data.filter((item) => {
      return [item.IST_KOD, item.IST_TANIM].some((value) => value && normalizeText(String(value)).toLowerCase().includes(normalizedSearchTerm));
    });
  }, [data, searchTerm]);

  const fetchProcedures = async () => {
    if (!isEmriTipiID) {
      message.warning(t("onceIsEmriTipiSeciniz"));
      return false;
    }

    setLoading(true);
    try {
      const query = new URLSearchParams({
        tipId: String(isEmriTipiID),
      });

      const response = await AxiosInstance.get(`GetProsedur?${query.toString()}`);

      if (response?.has_error) {
        message.warning(response.message || response.error_message || t("islemBasarisiz"));
        return false;
      }

      const fetchedData = Array.isArray(response?.PROSEDUR_LISTE) ? response.PROSEDUR_LISTE.map(mapProcedureItem) : [];
      setData(fetchedData);
      return true;
    } catch (error) {
      console.error("API Error:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = async () => {
    if (!isModalVisible) {
      const loaded = await fetchProcedures();
      if (!loaded) {
        return;
      }
      setSelectedRowKeys([]);
      setSearchTerm("");
      setIsModalVisible(true);
      return;
    }

    setIsModalVisible(false);
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);

    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!workshopSelectedId) {
      setSelectedRowKeys([]);
      return;
    }

    const matchedRow = data.find((item) => item.backendId === workshopSelectedId);
    setSelectedRowKeys(matchedRow ? [matchedRow.key] : []);
  }, [data, workshopSelectedId]);

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal width={1200} centered title="" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Spin spinning={loading}>
          <Input placeholder="Arama..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "300px", marginBottom: "15px" }} />
          <Table
            rowKey="key"
            rowSelection={{
              type: "radio",
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys.length ? [keys[0]] : []),
            }}
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            scroll={{
              y: "calc(100vh - 360px)",
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
}
