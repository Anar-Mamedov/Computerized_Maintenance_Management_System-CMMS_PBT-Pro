import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Space, message, Input, InputNumber, Popconfirm, Popover, Typography, Spin } from "antd";
import { PlusOutlined, MoreOutlined, DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useForm, FormProvider, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../../api/http.jsx";
import FirmaTablo from "../../../../../../utils/components/FirmaTablo";
import { t } from "i18next";

const { Text } = Typography;
const { TextArea } = Input;

const defaultValues = {
  tedarikciKod: "",
  tedarikciFirma: "",
  tedarikciFirmaId: null,
  birimFiyat: null,
  indirimOrani: null,
  tedarikSuresiGun: null,
  minSiparisMiktar: null,
  aciklama: "",
};

function TedarikciModal({ open, tedarikciId, stokId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(tedarikciId);
  const methods = useForm({ defaultValues });
  const { control, reset, setValue, setError, clearErrors } = methods;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!isEdit) {
      reset(defaultValues);
      return;
    }

    const fetchTedarikci = async () => {
      setLoading(true);
      try {
        const response = await AxiosInstance.get(`GetStokTedarikciById?id=${tedarikciId}`);
        const data = response?.data ?? {};
        reset({
          tedarikciKod: data?.STT_CARI_KOD ?? data?.CAR_KOD ?? data?.STT_CARI_ID ?? "",
          tedarikciFirma: data?.ST_CARI_TANIM ?? data?.STT_CARI_TANIM ?? data?.CAR_TANIM ?? "",
          tedarikciFirmaId: data?.STT_CARI_ID ?? data?.CAR_ID ?? null,
          birimFiyat: data?.STT_FIYAT ?? null,
          indirimOrani: data?.STT_INDIRIM_ORAN ?? null,
          tedarikSuresiGun: data?.STT_TEDARIK_SURESI_GUN ?? null,
          minSiparisMiktar: data?.STT_MIN_SIPARIS_MIKTAR ?? null,
          aciklama: data?.STT_ACIKLAMA ?? "",
        });
      } catch (error) {
        console.error("Tedarikçi bilgisi çekilirken hata oluştu:", error);
        message.error(t("islemBasarisiz"));
      } finally {
        setLoading(false);
      }
    };

    fetchTedarikci();
  }, [open, isEdit, tedarikciId, reset]);

  const onSubmit = async (data) => {
    if (!data.tedarikciFirmaId) {
      setError("tedarikciFirma", { type: "manual", message: t("alanBosBirakilamaz") });
      message.error(t("alanBosBirakilamaz"));
      return;
    }
    if (!stokId) {
      message.error(t("islemBasarisiz"));
      return;
    }

    const body = {
      TB_STOK_TEDARIKCI_ID: tedarikciId || 0,
      STT_STOK_ID: stokId,
      STT_CARI_ID: data.tedarikciFirmaId,
      STT_FIYAT: data.birimFiyat,
      STT_INDIRIM_ORAN: data.indirimOrani,
      STT_TEDARIK_SURESI_GUN: data.tedarikSuresiGun,
      STT_ACIKLAMA: data.aciklama,
      ...(data.minSiparisMiktar !== null && data.minSiparisMiktar !== undefined ? { STT_MIN_SIPARIS_MIKTAR: data.minSiparisMiktar } : {}),
    };

    try {
      const response = await AxiosInstance.post("UpsertStokTedarikci", body);
      if ([200, 201, 202].includes(response.status_code)) {
        message.success(t("islemBasarili"));
        onRefresh();
        reset(defaultValues);
        onClose();
      } else {
        message.error(t("islemBasarisiz"));
      }
    } catch (error) {
      console.error("Tedarikçi kaydedilirken hata oluştu:", error);
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
        width={600}
        centered
        destroyOnClose
        title={isEdit ? t("tedarikciGuncelleme") : t("tedarikciEkleme")}
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
                <Text>{t("tedarikciKodu")}</Text>
                <Controller
                  name="tedarikciKod"
                  control={control}
                  render={({ field }) => <Input {...field} style={{ width: 340 }} />}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontWeight: 600 }}>{t("tedarikciFirma")}</Text>
                <div style={{ width: 340 }}>
                  <FirmaTablo
                    firmaFieldName="tedarikciFirma"
                    firmaIdFieldName="tedarikciFirmaId"
                    onSubmit={(selectedData) => {
                      setValue("tedarikciKod", selectedData?.CAR_KOD ?? "");
                      clearErrors("tedarikciFirma");
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text>{t("birimFiyat")}</Text>
                <Controller
                  name="birimFiyat"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: 340 }} min={0} />}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text>{t("indirimOrani")}</Text>
                <Controller
                  name="indirimOrani"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: 340 }} min={0} max={100} />}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text>{t("tedarikSuresiGun")}</Text>
                <Controller
                  name="tedarikSuresiGun"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: 340 }} min={0} />}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text>{t("minSiparisMiktar")}</Text>
                <Controller
                  name="minSiparisMiktar"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: 340 }} min={0} />}
                />
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Text>{t("aciklama")}</Text>
                <Controller
                  name="aciklama"
                  control={control}
                  render={({ field }) => <TextArea {...field} style={{ width: 340 }} rows={3} />}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>
    </FormProvider>
  );
}

function TedarikciContextMenu({ selectedRows, onDelete }) {
  const [visible, setVisible] = useState(false);
  const selectionCount = selectedRows.length;

  const handleDelete = async () => {
    await onDelete();
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

export default function Tedarikciler({ selectedRowID }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalState, setModalState] = useState({ open: false, tedarikciId: null });

  const fetchTedarikciList = async () => {
    if (!selectedRowID) {
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosInstance.get("GetStokTedarikciList", {
        params: { stokId: selectedRowID },
      });
      if (response?.status_code === 401) {
        message.error(t("buSayfayaErisimYetkinizBulunmamaktadir"));
        return;
      }

      const list = Array.isArray(response?.data) ? response.data : [];
      const mappedData = list.map((item) => ({
        ...item,
        key: item.TB_STOK_TEDARIKCI_ID ?? item.STT_ID ?? item.id ?? item.key,
        tedarikciKod: item.STT_CARI_ID ?? item.STT_CARI_KOD ?? item.CAR_KOD ?? item.tedarikciKod ?? "",
        tedarikciFirma: item.ST_CARI_TANIM ?? item.STT_CARI_TANIM ?? item.CAR_TANIM ?? item.tedarikciFirma ?? "",
        marka: item.STT_MARKA ?? item.MARKA ?? item.STT_MARKA_ID ?? "",
        birimFiyat: item.STT_FIYAT ?? item.birimFiyat ?? item.FIYAT,
        indirimOrani: item.STT_INDIRIM_ORAN ?? item.indirimOrani ?? item.INDIRIM_ORAN,
        tedarikSuresi: item.STT_TEDARIK_SURESI_GUN ?? item.tedarikSuresiGun ?? item.TEDARIK_SURESI_GUN,
        minSiparisMiktar: item.STT_MIN_SIPARIS_MIKTAR ?? item.minSiparisMiktar ?? item.MIN_SIPARIS_MIKTAR,
      }));
      setData(mappedData);
    } catch (error) {
      console.error("Tedarikçi listesi çekilirken hata oluştu:", error);
      message.error(t("islemBasarisiz"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTedarikciList();
  }, [selectedRowID]);

  const handleRefresh = () => {
    fetchTedarikciList();
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows);
  };

  const handleOpenCreate = () => {
    setModalState({ open: true, tedarikciId: null });
  };

  const handleOpenEdit = (record) => {
    setModalState({ open: true, tedarikciId: record.key });
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }

    let hasError = false;
    for (const row of selectedRows) {
      try {
        const response = await AxiosInstance.get(`DeleteStokTedarikci?id=${row.key}`);
        if (![200, 201, 202].includes(response.status_code)) {
          hasError = true;
        }
      } catch (error) {
        console.error("Tedarikçi silinirken hata oluştu:", error);
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

  const columns = [
    {
      title: t("tedarikciKodu"),
      dataIndex: "tedarikciKod",
      key: "tedarikciKod",
      render: (text, record) => <a onClick={() => handleOpenEdit(record)}>{text}</a>,
    },
    {
      title: t("tedarikciFirma"),
      dataIndex: "tedarikciFirma",
      key: "tedarikciFirma",
    },
    {
      title: t("marka"),
      dataIndex: "marka",
      key: "marka",
    },
    {
      title: t("birimFiyat"),
      dataIndex: "birimFiyat",
      key: "birimFiyat",
    },
    {
      title: t("indirimOrani"),
      dataIndex: "indirimOrani",
      key: "indirimOrani",
    },
    {
      title: t("tedarikSuresiGun"),
      dataIndex: "tedarikSuresi",
      key: "tedarikSuresi",
    },
    {
      title: t("minSiparisMiktar"),
      dataIndex: "minSiparisMiktar",
      key: "minSiparisMiktar",
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "flex-end", marginBottom: "10px" }}>
        <TedarikciContextMenu selectedRows={selectedRows} onDelete={handleDelete} />
        <Button type="primary" onClick={handleOpenCreate} icon={<PlusOutlined />}>
          {t("yeniTedarikci")}
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
      <TedarikciModal
        open={modalState.open}
        tedarikciId={modalState.tedarikciId}
        stokId={selectedRowID}
        onClose={() => setModalState({ open: false, tedarikciId: null })}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
