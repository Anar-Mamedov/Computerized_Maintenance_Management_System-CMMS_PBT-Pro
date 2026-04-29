import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, InputNumber, message, Modal, Select, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../../../api/http";

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const getResponseData = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const normalizeDepot = (item) => {
  const id = item.Id ?? item.TB_DEPO_ID ?? item.DEP_ID;

  return {
    ...item,
    key: id,
    value: id,
    label: item.Ad ?? item.Depo ?? item.DEP_TANIM ?? item.Tanim ?? "-",
  };
};

const normalizeStockMaterial = (item) => {
  const id = item.Id ?? item.TB_STOK_ID ?? item.STOK_ID ?? item.STK_ID;
  const unitPrice = normalizeNumber(item.BirimFiyat ?? item.STK_GIRIS_FIYAT_DEGERI ?? item.STK_MALIYET ?? item.Fiyat);

  return {
    ...item,
    key: id,
    stockId: id,
    code: item.Kod ?? item.STK_KOD ?? item.StokKod ?? "",
    name: item.MalzemeAdi ?? item.STK_TANIM ?? item.StokTanim ?? "",
    unitId: item.BirimId ?? item.BirimID ?? item.BirimKodId ?? item.STK_BIRIM_KOD_ID ?? item.IDM_BIRIM_KOD_ID ?? null,
    unit: item.Birim ?? item.STK_BIRIM ?? "",
    currentStock: normalizeNumber(item.GuncelStok ?? item.Stok ?? item.Miktar ?? item.STK_MIKTAR),
    unitPrice,
  };
};

export default function MalzemeTablo({ kapali, onRefresh, secilenIsEmriID, triggerButtonText, triggerButtonClassName, triggerContainerClassName }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [depotOptions, setDepotOptions] = useState([]);
  const [selectedDepotId, setSelectedDepotId] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [data, setData] = useState([]);
  const [loadingDepots, setLoadingDepots] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDepots = useCallback(() => {
    setLoadingDepots(true);
    AxiosInstance.get("GetKullaniciDepolari")
      .then((response) => {
        const fetchedData = getResponseData(response).map(normalizeDepot);
        setDepotOptions(fetchedData);
      })
      .catch((error) => {
        console.error("Depo listesi alınırken hata oluştu:", error);
        message.error(t("workOrder.materialList.stockLoadError"));
      })
      .finally(() => setLoadingDepots(false));
  }, [t]);

  const fetchMaterials = useCallback(() => {
    if (!selectedDepotId) {
      setData([]);
      return;
    }

    setLoadingMaterials(true);
    AxiosInstance.get(`GetDepoMalzemeleri?depoId=${selectedDepotId}`)
      .then((response) => {
        const fetchedData = getResponseData(response).map(normalizeStockMaterial);
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Depo malzemeleri alınırken hata oluştu:", error);
        message.error(t("workOrder.materialList.stockLoadError"));
      })
      .finally(() => setLoadingMaterials(false));
  }, [selectedDepotId, t]);

  useEffect(() => {
    if (isModalVisible) {
      fetchDepots();
    }
  }, [fetchDepots, isModalVisible]);

  useEffect(() => {
    if (isModalVisible) {
      fetchMaterials();
    }
  }, [fetchMaterials, isModalVisible]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);

    if (!isModalVisible) {
      setSelectedDepotId(undefined);
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setQuantities({});
      setData([]);
    }
  };

  const onRowSelectChange = (selectedKeys, selectedRecords) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedRows(selectedRecords);
    setQuantities((currentQuantities) =>
      selectedRecords.reduce(
        (accumulator, record) => ({
          ...accumulator,
          [record.key]: currentQuantities[record.key] || 1,
        }),
        {}
      )
    );
  };

  const updateQuantity = (record, value) => {
    setQuantities((currentQuantities) => ({ ...currentQuantities, [record.key]: normalizeNumber(value) }));
  };

  const handleSave = async () => {
    if (!selectedDepotId) {
      message.warning(t("workOrder.materialList.chooseWarehouse"));
      return;
    }

    if (!selectedRows.length) {
      message.warning(t("workOrder.materialList.chooseMaterial"));
      return;
    }

    const body = selectedRows.map((row) => {
      const quantity = normalizeNumber(quantities[row.key] || 1);
      const unitPrice = normalizeNumber(row.unitPrice);

      return {
        TB_ISEMRI_MLZ_ID: 0,
        IDM_ISEMRI_ID: secilenIsEmriID,
        IDM_STOK_ID: row.stockId,
        IDM_DEPO_ID: selectedDepotId,
        IDM_BIRIM_KOD_ID: row.unitId,
        IDM_STOK_DUS: true,
        IDM_MALZEME_STOKTAN: true,
        IDM_STOK_TANIM: row.name,
        IDM_BIRIM_FIYAT: unitPrice,
        IDM_MIKTAR: quantity,
        IDM_TUTAR: quantity * unitPrice,
      };
    });

    setSaving(true);

    try {
      const response = await AxiosInstance.post("AddTopluIsEmriMalzeme", body);

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(t("workOrder.materialList.saveSuccess"));
        setIsModalVisible(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        setQuantities({});
        onRefresh?.();
      } else if (response.status_code === 401) {
        message.error(t("workOrder.materialList.noPermission"));
      } else {
        message.error(t("workOrder.materialList.saveError"));
      }
    } catch (error) {
      console.error("Toplu malzeme ekleme sırasında hata oluştu:", error);
      message.error(t("workOrder.materialList.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: t("workOrder.materialList.code"),
      dataIndex: "code",
      key: "code",
      width: 140,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.materialName"),
      dataIndex: "name",
      key: "name",
      width: 260,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.unit"),
      dataIndex: "unit",
      key: "unit",
      width: 110,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.currentStock"),
      dataIndex: "currentStock",
      key: "currentStock",
      width: 120,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.unitPrice"),
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 130,
      ellipsis: true,
    },
    {
      title: t("workOrder.materialList.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 130,
      render: (_, record) => <InputNumber min={0} style={{ width: "100%" }} value={quantities[record.key] || 1} onChange={(value) => updateQuantity(record, value)} />,
    },
  ];

  return (
    <div className={triggerContainerClassName}>
      <Button className={triggerButtonClassName} disabled={kapali} onClick={handleModalToggle}>
        {!triggerButtonText && <PlusOutlined />}
        {triggerButtonText || t("workOrder.materialList.selectFromStock")}
      </Button>
      <Modal
        width={1100}
        centered
        title={t("workOrder.materialList.selectFromStock")}
        open={isModalVisible}
        okText={t("workOrder.materialList.addSelected")}
        cancelText={t("workOrder.materialList.cancel")}
        confirmLoading={saving}
        onOk={handleSave}
        onCancel={handleModalToggle}
      >
        <Select
          allowClear
          showSearch
          loading={loadingDepots}
          value={selectedDepotId}
          options={depotOptions}
          optionFilterProp="label"
          placeholder={t("workOrder.materialList.chooseWarehouse")}
          style={{ width: 320, marginBottom: 12 }}
          onChange={(value) => {
            setSelectedDepotId(value);
            setSelectedRowKeys([]);
            setSelectedRows([]);
            setQuantities({});
          }}
        />
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            position: ["bottomRight"],
          }}
          columns={columns}
          dataSource={data}
          loading={loadingMaterials}
          scroll={{
            x: 890,
            y: "calc(100vh - 420px)",
          }}
        />
      </Modal>
    </div>
  );
}

MalzemeTablo.propTypes = {
  kapali: PropTypes.bool,
  onRefresh: PropTypes.func,
  secilenIsEmriID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  triggerButtonText: PropTypes.string,
  triggerButtonClassName: PropTypes.string,
  triggerContainerClassName: PropTypes.string,
};
