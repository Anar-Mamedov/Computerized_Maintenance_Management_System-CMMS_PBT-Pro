import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Space, message, Input, Switch, Popconfirm, Popover, Typography, QRCode, Spin } from "antd";
import { PlusOutlined, MoreOutlined, DeleteOutlined, QrcodeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useForm, FormProvider, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http.jsx";
import { t } from "i18next";

const { Text } = Typography;

const defaultValues = {
  barkodNo: "",
  aktif: true,
};

const BARKOD_TIPI = "EAN13";
const KONTROL_BITI = true;

function BarkodModal({ open, barkodId, stokId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(barkodId);
  const methods = useForm({ defaultValues });
  const { control, reset } = methods;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!isEdit) {
      reset(defaultValues);
      return;
    }

    const fetchBarkod = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetStokBarkodById?barkodID=${barkodId}`);
        reset({
          barkodNo: response?.STB_BARKODNO ?? "",
          aktif: response?.STB_AKTIF ?? true,
        });
      } catch (error) {
        console.error("Barkod bilgisi çekilirken hata oluştu:", error);
        message.error(t("islemBasarisiz"));
      } finally {
        setLoading(false);
      }
    };

    fetchBarkod();
  }, [open, isEdit, barkodId, reset]);

  const onSubmit = async (data) => {
    if (!stokId) {
      message.error(t("islemBasarisiz"));
      return;
    }

    const body = {
      TB_STOK_BARKOD_ID: barkodId || 0,
      STB_STOK_ID: stokId,
      STB_BARKODNO: data.barkodNo,
      STB_TIP: BARKOD_TIPI,
      STB_KONTROL_BITI: KONTROL_BITI,
      STB_AKTIF: data.aktif,
    };

    try {
      const response = await AxiosInstance.post("UpsertStokBarkod", body);
      if ([200, 201, 202].includes(response.status_code)) {
        message.success(t("islemBasarili"));
        onRefresh();
        reset(defaultValues);
        onClose();
      } else {
        message.error(t("islemBasarisiz"));
      }
    } catch (error) {
      console.error("Barkod kaydedilirken hata oluştu:", error);
      message.error(t("islemBasarisiz"));
    }
  };

  const handleCancel = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Modal
        width={520}
        centered
        destroyOnClose
        title={isEdit ? t("barkodGuncelleme") : t("barkodEkleme")}
        open={open}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button onClick={handleCancel}>{t("iptal")}</Button>
            <Button
              type="submit"
              onClick={methods.handleSubmit(onSubmit)}
              style={{
                backgroundColor: "#2bc770",
                borderColor: "#2bc770",
                color: "#ffffff",
              }}
            >
              {isEdit ? t("guncelle") : t("kaydet")}
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: 600 }}>{t("barkodNo")}</Text>
                <Controller
                  name="barkodNo"
                  control={control}
                  rules={{ required: t("barkodNoZorunlu") }}
                  render={({ field, fieldState: { error } }) => (
                    <Input {...field} status={error ? "error" : ""} style={{ width: 280 }} placeholder={t("barkodNo")} />
                  )}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: 600 }}>{t("aktif")}</Text>
                <Controller name="aktif" control={control} render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />} />
              </div>
            </div>
          </form>
        )}
      </Modal>
    </FormProvider>
  );
}

function BarkodEtiketModal({ open, loading, barkod, onClose }) {
  const barkodNo = barkod?.STB_BARKODNO ?? "";
  const barkodTipi = barkod?.STB_TIP ?? "";

  return (
    <Modal width={420} centered title={t("barkodEtiketi")} open={open} onCancel={onClose} footer={null}>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <QRCode value={barkodNo || " "} size={200} />
          <Text>{`${t("barkodNo")}: ${barkodNo || "-"}`}</Text>
          {barkodTipi ? <Text type="secondary">{`${t("barkodTipi")}: ${barkodTipi}`}</Text> : null}
        </div>
      )}
    </Modal>
  );
}

function BarkodContextMenu({ selectedRows, onDelete, onLabel }) {
  const [visible, setVisible] = useState(false);
  const selectionCount = selectedRows.length;

  const handleDelete = async () => {
    await onDelete();
    setVisible(false);
  };

  const handleLabel = () => {
    onLabel();
    setVisible(false);
  };

  const content =
    selectionCount >= 1 ? (
      <Space direction="vertical" size={0}>
        <Popconfirm
          title={t("silmeOnayBaslik")}
          description={t("silmeOnayMesaj")}
          onConfirm={handleDelete}
          okText={t("globalYes")}
          cancelText={t("globalNo")}
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <Button type="link" danger icon={<DeleteOutlined />} style={{ paddingLeft: 0 }}>
            {t("sil")}
          </Button>
        </Popconfirm>
        <Button type="link" icon={<QrcodeOutlined />} style={{ paddingLeft: 0 }} onClick={handleLabel}>
          {t("barkodEtiketi")}
        </Button>
      </Space>
    ) : (
      <Text type="secondary">{t("secimYapiniz")}</Text>
    );

  return (
    <Popover placement="bottom" content={content} trigger="click" open={visible} onOpenChange={setVisible}>
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 5px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          height: "32px",
        }}
      >
        {selectionCount >= 1 && <Text style={{ color: "white", marginLeft: "3px" }}>{selectionCount}</Text>}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}

export default function Barkodlar({ selectedRowID }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalState, setModalState] = useState({ open: false, barkodId: null });
  const [etiketState, setEtiketState] = useState({ open: false, loading: false, barkod: null });

  const fetchBarkodList = async () => {
    if (!selectedRowID) {
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosInstance.get("GetStokBarkodList", {
        params: { stokId: selectedRowID },
      });
      const mappedData = response.map((item) => ({
        ...item,
        key: item.TB_STOK_BARKOD_ID,
        barkodNo: item.STB_BARKODNO,
      }));
      setData(mappedData);
    } catch (error) {
      console.error("Barkod listesi çekilirken hata oluştu:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarkodList();
  }, [selectedRowID]);

  const handleRefresh = () => {
    fetchBarkodList();
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows);
  };

  const handleOpenCreate = () => {
    setModalState({ open: true, barkodId: null });
  };

  const handleOpenEdit = (record) => {
    setModalState({ open: true, barkodId: record.key });
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    let hasError = false;
    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.get(`DeleteStokBarkod?barkodID=${row.key}`);
        if (![200, 201, 202].includes(response.status_code)) {
          hasError = true;
        }
      } catch (error) {
        console.error("Barkod silinirken hata oluştu:", error);
        hasError = true;
      }
    }

    if (hasError) {
      message.error(t("islemBasarisiz"));
    } else {
      message.success(t("islemBasarili"));
    }
    handleRefresh();
  };

  const handleLabel = async () => {
    if (selectedRows.length !== 1) {
      message.warning(t("tekBarkodSeciniz"));
      return;
    }

    const barkodId = selectedRows[0].key;
    setEtiketState({ open: true, loading: true, barkod: null });

    try {
      const response = await AxiosInstance.get(`GetStokBarkodById?barkodID=${barkodId}`);
      setEtiketState({ open: true, loading: false, barkod: response });
    } catch (error) {
      console.error("Barkod etiketi alınırken hata oluştu:", error);
      const fallbackBarkod = selectedRows[0]?.barkodNo;
      if (fallbackBarkod) {
        setEtiketState({ open: true, loading: false, barkod: { STB_BARKODNO: fallbackBarkod } });
      } else {
        message.error(t("islemBasarisiz"));
        setEtiketState({ open: false, loading: false, barkod: null });
      }
    }
  };

  const columns = [
    {
      title: t("barkodNo"),
      dataIndex: "barkodNo",
      key: "barkodNo",
      render: (text, record) => <a onClick={() => handleOpenEdit(record)}>{text}</a>,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px" }}>
        <BarkodContextMenu selectedRows={selectedRows} onDelete={handleDelete} onLabel={handleLabel} />
        <Button type="primary" onClick={handleOpenCreate} icon={<PlusOutlined />}>
          {t("yeniBarkod")}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        loading={loading}
        pagination={{
          pageSize: 10,
          total: data.length,
          showSizeChanger: true,
          showTotal: (total) => `${total}`,
        }}
      />
      <BarkodModal open={modalState.open} barkodId={modalState.barkodId} stokId={selectedRowID} onClose={() => setModalState({ open: false, barkodId: null })} onRefresh={handleRefresh} />
      <BarkodEtiketModal open={etiketState.open} loading={etiketState.loading} barkod={etiketState.barkod} onClose={() => setEtiketState({ open: false, loading: false, barkod: null })} />
    </div>
  );
}
