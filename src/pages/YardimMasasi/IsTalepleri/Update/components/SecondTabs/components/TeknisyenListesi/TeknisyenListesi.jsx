import React, { useCallback, useEffect, useState } from "react";
import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Spin, Switch, Table, TimePicker, message } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";
import AxiosInstance from "../../../../../../../../api/http";

dayjs.extend(customParseFormat);

const DATE_REQUEST_FORMAT = "YYYY-MM-DD";
const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";
const TIME_FORMAT = "HH:mm";
const PERSONEL_LOADING_CONTENT = (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "8px 0" }}>
    <Spin size="small" />
  </div>
);

const toDayjsDate = (value) => {
  if (!value) {
    return null;
  }

  const formats = [DATE_REQUEST_FORMAT, DATE_DISPLAY_FORMAT];
  for (const format of formats) {
    const parsed = dayjs(value, format);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

const toDayjsTime = (value) => {
  if (!value) {
    return null;
  }

  const formats = [TIME_FORMAT, "HH:mm:ss"];
  for (const format of formats) {
    const parsed = dayjs(value, format);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  const fallback = dayjs(value);
  return fallback.isValid() ? fallback : null;
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value === 1;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return false;
};

const getResponseRecord = (response) => {
  const responseData = response && Object.prototype.hasOwnProperty.call(response, "data") ? response.data : response;

  if (Array.isArray(responseData)) {
    return responseData[0] ?? null;
  }

  return responseData ?? null;
};

export default function TeknisyenListesi({ disabled }) {
  const { watch } = useFormContext();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [personelOptions, setPersonelOptions] = useState([]);
  const [personelLoading, setPersonelLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(0);
  const [saving, setSaving] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const secilenTalepID = watch("secilenTalepID");

  const fetchTeknisyenler = useCallback(() => {
    if (!secilenTalepID) {
      setData([]);
      return;
    }
    setLoading(true);
    AxiosInstance.get(`GetIsTalepTeknisyenList?isTalepId=${secilenTalepID}`)
      .then((response) => {
        const list = Array.isArray(response) ? response : [];
        const fetchedData = list.map((item) => ({
          ...item,
          key: item.TB_IS_TALEBI_TEKNISYEN_ID,
          code: item.ITK_PERSONEL_ISIM ?? item.TEKNISYEN_ADI,
          subject: item.ITK_VARDIYA_TANIM ?? item.ITK_VARDIYA,
          workdays: item.ITK_SURE,
          description: item.ITK_SAAT_UCRETI,
          fifthcolumn: item.ITK_FAZLA_MESAI_VAR,
          sixthcolumn: item.ITK_FAZLA_MESAI_SURE,
          ITK_MALIYET: item.ITK_MALIYET,
        }));
        setData(fetchedData);
        setSelectedRowKeys([]);
        setSelectedRows([]);
      })
      .catch((error) => {
        console.error("Teknisyen listesi alınamadı:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenTalepID]);

  useEffect(() => {
    fetchTeknisyenler();
  }, [fetchTeknisyenler]);

  const loadPersonelOptions = useCallback(async () => {
    setPersonelOptions([]);
    setPersonelLoading(true);
    try {
      const response = await AxiosInstance.get("Personel");
      const list = Array.isArray(response) ? response : [];
      const mapped = list
        .filter((item) => item?.TB_PERSONEL_ID !== undefined && item?.TB_PERSONEL_ID !== null)
        .map((item) => {
          const name = item?.PRS_ISIM?.trim();
          const code = item?.PRS_PERSONEL_KOD?.trim();
          return {
            value: item.TB_PERSONEL_ID,
            label: [code, name].filter(Boolean).join(" - ") || name || code || `#${item.TB_PERSONEL_ID}`,
            name,
          };
        });
      setPersonelOptions(mapped);
      return mapped;
    } catch (error) {
      console.error("Personel listesi alınamadı:", error);
      return [];
    } finally {
      setPersonelLoading(false);
    }
  }, []);

  const resolvePersonelId = (record) => {
    const direct = record.ITK_TEKNISYEN_ID ?? record.ITK_PERSONEL_ID ?? record.TB_PERSONEL_ID ?? record.ITK_REF_ID;
    if (direct !== undefined && direct !== null && direct !== "") {
      return direct;
    }
    return null;
  };

  const createPersonelOptionFromRecord = (record) => {
    const personelId = resolvePersonelId(record);
    if (personelId === null || personelId === undefined || personelId === "") {
      return null;
    }

    const name = String(record.ITK_PERSONEL_ISIM ?? record.PRS_ISIM ?? record.PERSONEL_ISIM ?? record.TEKNISYEN_ADI ?? "").trim();
    const code = String(record.ITK_PERSONEL_KOD ?? record.PRS_PERSONEL_KOD ?? record.PERSONEL_KOD ?? "").trim();

    return {
      value: personelId,
      label: [code, name].filter(Boolean).join(" - ") || name || code || `#${personelId}`,
      name,
    };
  };

  const setTeknisyenFormValues = (record) => {
    const personelOption = createPersonelOptionFromRecord(record);

    if (personelOption) {
      setPersonelOptions((prevOptions) => {
        const exists = prevOptions.some((option) => String(option.value) === String(personelOption.value));
        return exists ? prevOptions : [personelOption, ...prevOptions];
      });
    }

    form.setFieldsValue({
      ITK_TEKNISYEN_ID: resolvePersonelId(record),
      ITK_BASLAMA_TARIHI: toDayjsDate(record.ITK_BASLAMA_TARIHI ?? record.ITK_TARIH),
      ITK_BASLAMA_SAATI: toDayjsTime(record.ITK_BASLAMA_SAATI ?? record.ITK_SAAT),
      ITK_SURE: record.ITK_SURE ?? null,
      ITK_SAAT_UCRETI: record.ITK_SAAT_UCRETI ?? null,
      ITK_MALIYET: record.ITK_MALIYET ?? null,
      ITK_FAZLA_MESAI_VAR: normalizeBoolean(record.ITK_FAZLA_MESAI_VAR),
    });
  };

  const openAddModal = () => {
    setEditingId(0);
    form.resetFields();
    form.setFieldsValue({ ITK_FAZLA_MESAI_VAR: false });
    setIsModalVisible(true);
  };

  const openEditModal = async (record) => {
    const teknisyenId = record.TB_IS_TALEBI_TEKNISYEN_ID || record.key;
    if (!teknisyenId) {
      message.warning(t("teknisyenKaydiSecilemedi", { defaultValue: "Teknisyen kaydı seçilemedi." }));
      return;
    }

    setEditingId(teknisyenId);
    form.resetFields();
    setIsModalVisible(true);
    setDetailLoading(true);

    try {
      const response = await AxiosInstance.get(`GetIsTalepTeknisyen?id=${teknisyenId}`);
      const detailRecord = getResponseRecord(response);

      if (!detailRecord) {
        message.warning(t("teknisyenKaydiBulunamadi", { defaultValue: "Teknisyen kaydı bulunamadı." }));
        return;
      }

      setEditingId(detailRecord.TB_IS_TALEBI_TEKNISYEN_ID || teknisyenId);
      setTeknisyenFormValues(detailRecord);
    } catch (error) {
      console.error("Teknisyen bilgileri alınamadı:", error);
      message.error(t("teknisyenBilgileriAlinamadi", { defaultValue: "Teknisyen bilgileri alınamadı." }));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingId(0);
    form.resetFields();
  };

  const handleSave = async () => {
    if (!secilenTalepID) {
      message.warning(t("isTalebiSecilmeli", { defaultValue: "Önce bir iş talebi seçilmelidir." }));
      return;
    }

    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      return;
    }

    const payload = {
      TB_IS_TALEBI_TEKNISYEN_ID: editingId || 0,
      ITK_IS_TALEBI_ID: secilenTalepID,
      ITK_TEKNISYEN_ID: values.ITK_TEKNISYEN_ID,
      ITK_BASLAMA_TARIHI: values.ITK_BASLAMA_TARIHI ? dayjs(values.ITK_BASLAMA_TARIHI).format(DATE_REQUEST_FORMAT) : null,
      ITK_BASLAMA_SAATI: values.ITK_BASLAMA_SAATI ? dayjs(values.ITK_BASLAMA_SAATI).format(TIME_FORMAT) : null,
      ITK_SURE: values.ITK_SURE ?? null,
      ITK_SAAT_UCRETI: values.ITK_SAAT_UCRETI ?? null,
      ITK_MALIYET: values.ITK_MALIYET ?? null,
      ITK_FAZLA_MESAI_VAR: Boolean(values.ITK_FAZLA_MESAI_VAR),
    };

    setSaving(true);
    try {
      const response = await AxiosInstance.post("KaydetIsTalepTeknisyen", payload);
      if (response?.has_error) {
        message.error(response?.status || t("kayitBasarisiz", { defaultValue: "Kayıt başarısız." }));
        return;
      }
      message.success(response?.status || t("kayitBasarili", { defaultValue: "Kayıt başarılı." }));
      closeModal();
      fetchTeknisyenler();
    } catch (error) {
      console.error("Teknisyen kaydedilemedi:", error);
      message.error(t("kayitBasarisiz", { defaultValue: "Kayıt başarısız." }));
    } finally {
      setSaving(false);
    }
  };

  // Seçili teknisyenleri toplu siler (iş emri ekranındaki kontrol listesi gibi).
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      return;
    }
    setDeleting(true);
    let failCount = 0;
    for (const row of selectedRows) {
      const id = row.TB_IS_TALEBI_TEKNISYEN_ID;
      if (!id) {
        continue;
      }
      try {
        const response = await AxiosInstance.post(`SilIsTalepTeknisyen?id=${id}`);
        if (response?.has_error) {
          failCount += 1;
        }
      } catch (error) {
        console.error("Teknisyen silinemedi:", error);
        failCount += 1;
      }
    }

    if (failCount === 0) {
      message.success(t("silmeBasarili", { defaultValue: "Kayıt silindi." }));
    } else {
      message.error(t("baziKayitlarSilinemedi", { defaultValue: "Bazı kayıtlar silinemedi." }));
    }

    setDeleting(false);
    fetchTeknisyenler();
  };

  const renderBool = (value) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {value ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
    </div>
  );

  const columns = [
    {
      title: "Personel Adı",
      dataIndex: "code",
      key: "code",
      width: 180,
      ellipsis: true,
      render: (text, record) =>
        disabled ? (
          text
        ) : (
          <span style={{ cursor: "pointer", color: "#1677ff", fontWeight: 600 }} onClick={() => openEditModal(record)}>
            {text}
          </span>
        ),
    },
    { title: "Vardiya", dataIndex: "subject", key: "subject", width: 150, ellipsis: true },
    { title: "Çalışma Süresi", dataIndex: "workdays", key: "workdays", width: 130, ellipsis: true },
    { title: "Saat Ücreti", dataIndex: "description", key: "description", width: 130, ellipsis: true },
    { title: "Fazla Mesai", dataIndex: "fifthcolumn", key: "fifthcolumn", width: 110, ellipsis: true, render: renderBool },
    { title: "Mesai Süresi", dataIndex: "sixthcolumn", key: "sixthcolumn", width: 130, ellipsis: true },
    { title: "Mesai Ücreti", dataIndex: "ITK_FAZLA_MESAI_UCRET", key: "ITK_FAZLA_MESAI_UCRET", width: 130, ellipsis: true },
    { title: "Maliyet", dataIndex: "ITK_MALIYET", key: "ITK_MALIYET", width: 130, ellipsis: true },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 12 }}>
        {selectedRows.length >= 1 && (
          <Popconfirm
            title={t("silmeOnay", { defaultValue: "Seçili teknisyenleri silmek istediğinize emin misiniz?" })}
            okText={t("evet", { defaultValue: "Evet" })}
            cancelText={t("hayir", { defaultValue: "Hayır" })}
            onConfirm={handleBulkDelete}
            disabled={disabled}
          >
            <Button danger icon={<DeleteOutlined />} loading={deleting} disabled={disabled}>
              {t("sil", { defaultValue: "Sil" })} ({selectedRows.length})
            </Button>
          </Popconfirm>
        )}
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal} disabled={disabled || !secilenTalepID}>
          {t("teknisyenEkle", { defaultValue: "Teknisyen Ekle" })}
        </Button>
      </div>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            setSelectedRows(rows);
          },
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 1100, y: "calc(100vh - 360px)" }}
      />

      <Modal
        title={editingId ? t("teknisyenGuncelle", { defaultValue: "Teknisyen Güncelle" }) : t("teknisyenEkle", { defaultValue: "Teknisyen Ekle" })}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        confirmLoading={saving || detailLoading}
        okButtonProps={{ disabled: detailLoading }}
        okText={t("kaydet", { defaultValue: "Kaydet" })}
        cancelText={t("iptal", { defaultValue: "İptal" })}
        width={520}
        centered
        forceRender
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ITK_TEKNISYEN_ID"
            label={t("personel", { defaultValue: "Personel" })}
            rules={[{ required: true, message: t("personelSecZorunlu", { defaultValue: "Personel seçimi zorunludur." }) }]}
          >
            <Select
              showSearch
              allowClear
              loading={personelLoading}
              placeholder={t("secimYapiniz", { defaultValue: "Seçim Yapınız" })}
              optionFilterProp="label"
              options={personelOptions}
              notFoundContent={personelLoading ? PERSONEL_LOADING_CONTENT : undefined}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  loadPersonelOptions();
                }
              }}
              filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item name="ITK_BASLAMA_TARIHI" label={t("baslamaTarihi", { defaultValue: "Başlama Tarihi" })} style={{ flex: 1 }}>
              <DatePicker format={DATE_DISPLAY_FORMAT} style={{ width: "100%" }} placeholder={DATE_DISPLAY_FORMAT} />
            </Form.Item>
            <Form.Item name="ITK_BASLAMA_SAATI" label={t("baslamaSaati", { defaultValue: "Başlama Saati" })} style={{ flex: 1 }}>
              <TimePicker format={TIME_FORMAT} style={{ width: "100%" }} placeholder={TIME_FORMAT} />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <Form.Item name="ITK_SURE" label={t("sure", { defaultValue: "Süre" })} style={{ flex: 1 }}>
              <InputNumber min={0} step={0.5} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="ITK_SAAT_UCRETI" label={t("saatUcreti", { defaultValue: "Saat Ücreti" })} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="ITK_MALIYET" label={t("maliyet", { defaultValue: "Maliyet" })} style={{ flex: 1 }}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="ITK_FAZLA_MESAI_VAR" label={t("fazlaMesai", { defaultValue: "Fazla Mesai" })} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

TeknisyenListesi.propTypes = {
  disabled: PropTypes.bool,
};
