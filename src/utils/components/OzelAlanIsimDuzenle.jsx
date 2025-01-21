import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import AxiosInstance from "../../api/http";
import { t } from "i18next";

function OzelAlanIsimDuzenle({ labelValue, onClose, onSuccess, fieldNumber, OzelForm }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ozelAlan: labelValue });
  }, [labelValue, form]);

  const handleSubmit = async (values) => {
    try {
      const response = await AxiosInstance.post("OzelAlanTopicGuncelle", {
        [`OZL_OZEL_ALAN_${fieldNumber}`]: values.ozelAlan,
        OZL_FORM: OzelForm,
      });

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(t("islemBasarili"));
        onSuccess();
      } else {
        message.error(t("islemBasarisiz"));
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(t("birHataOlustu"));
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="ozelAlan" rules={[{ required: true, message: t("buAlanZorunludur") }]}>
        <Input placeholder={t("ozelAlanAdiniGiriniz")} />
      </Form.Item>
      <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0px" }}>
        <Button type="primary" htmlType="submit">
          {t("kaydet")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default OzelAlanIsimDuzenle;
