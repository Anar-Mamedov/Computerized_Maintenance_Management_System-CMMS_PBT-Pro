import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Empty, Form, Input, InputNumber, Modal, Row, Select, Space, Spin, Typography, message } from "antd";
import { CalendarOutlined, ClockCircleOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../api/http";
import { formatNumberWithSeparators, getNumberSeparatorsByLanguage, parseLocalizedNumber } from "../../../utils/numberLocale";

const { Text } = Typography;
const { TextArea } = Input;

const MONTH_COUNT = 12;

export default function EkipmanAylikCalismaSureleri() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recordsByMonth, setRecordsByMonth] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMonth, setActiveMonth] = useState(null);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 31 }, (_, index) => currentYear - 15 + index);
  }, []);

  const months = useMemo(() => Array.from({ length: MONTH_COUNT }, (_, index) => index + 1), []);
  const currentLang = (i18n.language || "tr").split("-")[0];
  const { decimal } = getNumberSeparatorsByLanguage(currentLang);

  const getMonthLabel = useCallback(
    (month) => {
      if (!month) return "";
      return new Intl.DateTimeFormat(i18n.language || "tr", { month: "long" }).format(new Date(selectedYear, month - 1, 1));
    },
    [i18n.language, selectedYear]
  );

  const fetchMonthlyRecords = useCallback(
    async (year) => {
      try {
        setLoading(true);
        const response = await AxiosInstance.get(`GetAylikCalismaListesi?yil=${year}`);

        if (response?.has_error) {
          message.error(response?.status || t("ekipmanAylikCalisma.fetchError"));
          setRecordsByMonth({});
          return;
        }

        const records = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        const nextMap = records.reduce((acc, item) => {
          const month = Number(item?.Ay);
          if (month >= 1 && month <= 12) {
            acc[month] = item;
          }
          return acc;
        }, {});

        setRecordsByMonth(nextMap);
      } catch (error) {
        console.error("Failed to fetch aylik calisma listesi:", error);
        message.error(t("ekipmanAylikCalisma.fetchError"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchMonthlyRecords(selectedYear);
  }, [selectedYear, fetchMonthlyRecords]);

  const openModalForMonth = (month) => {
    const existingRecord = recordsByMonth[month];
    form.setFieldsValue({
      calismaSaati: existingRecord?.CalismaSaati ?? null,
      aciklama: existingRecord?.Aciklama ?? "",
    });
    setActiveMonth(month);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveMonth(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!activeMonth) return;

      const existingRecord = recordsByMonth[activeMonth];
      const body = {
        TB_CALISMA_AYLIK_ID: existingRecord?.TB_CALISMA_AYLIK_ID || 0,
        Yil: selectedYear,
        Ay: activeMonth,
        CalismaSaati: Number(values.calismaSaati),
        Aciklama: (values.aciklama || "").trim(),
      };

      setSaving(true);
      const response = await AxiosInstance.post("AddUpdateAylikCalisma", body);

      if (response?.has_error || (response?.status_code && Number(response.status_code) >= 400)) {
        message.error(response?.status || t("ekipmanAylikCalisma.saveError"));
        return;
      }

      message.success(response?.status || t("ekipmanAylikCalisma.saveSuccess"));
      closeModal();
      fetchMonthlyRecords(selectedYear);
    } catch (error) {
      if (error?.errorFields) return;
      console.error("Failed to save aylik calisma:", error);
      message.error(t("ekipmanAylikCalisma.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <Space size={12} wrap>
          <Text strong>{t("ekipmanAylikCalisma.yearSelectLabel")}:</Text>
          <Select value={selectedYear} style={{ width: 140 }} onChange={setSelectedYear} options={yearOptions.map((year) => ({ value: year, label: year }))} />
        </Space>
      </div>

      {loading ? (
        <div style={{ minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {months.map((month) => {
            const record = recordsByMonth[month];
            const hasRecord = Boolean(record);

            return (
              <Col key={month} xs={24} sm={12} md={8} xl={6}>
                <Card
                  title={
                    <Space>
                      <CalendarOutlined />
                      <span>{getMonthLabel(month)}</span>
                    </Space>
                  }
                  size="small"
                  style={{ height: "100%" }}
                  styles={{ body: { minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "space-between" } }}
                >
                  {hasRecord ? (
                    <Space direction="vertical" size={6} style={{ width: "100%" }}>
                      <Text>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        {t("ekipmanAylikCalisma.workPrefix")}: {formatNumberWithSeparators(record.CalismaSaati, currentLang)} {t("ekipmanAylikCalisma.hourUnit")}
                      </Text>
                      <Text type="secondary" ellipsis={{ tooltip: record.Aciklama || "-" }}>
                        {t("ekipmanAylikCalisma.descriptionLabel")}: {record.Aciklama || "-"}
                      </Text>
                    </Space>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("ekipmanAylikCalisma.noData")} styles={{ image: { height: 40 }, description: { marginBottom: 0 } }} />
                  )}

                  <Button type={hasRecord ? "default" : "primary"} icon={hasRecord ? <EditOutlined /> : <PlusOutlined />} block onClick={() => openModalForMonth(month)}>
                    {hasRecord ? t("ekipmanAylikCalisma.updateButton") : t("ekipmanAylikCalisma.addHours")}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title={t("ekipmanAylikCalisma.modalTitle", { month: getMonthLabel(activeMonth), year: selectedYear })}
        open={modalOpen}
        onCancel={closeModal}
        onOk={handleSave}
        okText={t("ekipmanAylikCalisma.saveButton")}
        cancelText={t("ekipmanAylikCalisma.cancelButton")}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label={t("ekipmanAylikCalisma.yearMonthLabel")}>
            <Space>
              <Input value={selectedYear} disabled style={{ width: 120 }} />
              <Input value={getMonthLabel(activeMonth)} disabled style={{ width: 180 }} />
            </Space>
          </Form.Item>

          <Form.Item
            label={t("ekipmanAylikCalisma.workHourLabel")}
            name="calismaSaati"
            rules={[
              { required: true, message: t("ekipmanAylikCalisma.requiredValidation") },
              { type: "number", min: 0, message: t("ekipmanAylikCalisma.minValidation") },
            ]}
          >
            <InputNumber
              min={0}
              step={0.5}
              decimalSeparator={decimal}
              formatter={(value) => formatNumberWithSeparators(value, currentLang)}
              parser={(value) => parseLocalizedNumber(value, currentLang)}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label={t("ekipmanAylikCalisma.descriptionLabel")} name="aciklama">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
