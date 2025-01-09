import React, { useState, useEffect } from "react";
import { Button, Modal, Form, message, Input, InputNumber } from "antd";
import { useForm } from "antd/lib/form/Form";
import { t } from "i18next";
import AxiosInstance from "../../../../../../../../api/http";
import RaporGrupSelectbox from "./components/RaporGrupSelectbox";

function Guncelle({ selectedRows, refreshTableData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = useForm();
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const lan = localStorage.getItem("i18nextLng") || "tr";
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`RaporEdit?RaporID=${selectedRows[0].key}`);
      form.setFieldsValue({
        nameOfReport: response[0].RPR_TANIM,
        raporAciklama: response[0].RPR_ACIKLAMA,
        reportGroup: response[0].RPR_RAPOR_GRUP_TANIM,
        reportGroupID: response[0].RPR_RAPOR_GRUP_ID,
      });
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRows && saveModalVisible) {
      fetchData();
    }
  }, [selectedRows, saveModalVisible]);

  const handleSaveColumns = () => {
    setSaveModalVisible(true);
  };

  const onFinish = (values) => {
    // console.log("Success:", values);
    saveReport(values);
  };
  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  };

  const saveReport = async (values) => {
    const body = {
      TB_RAPOR_ID: selectedRows[0].key,
      RPR_TANIM: values.nameOfReport,
      RPR_ACIKLAMA: values.raporAciklama,
      RPR_RAPOR_GRUP_ID: values.reportGroupID,
    };
    try {
      const response = await AxiosInstance.post(`RaporUpdate`, body);
      if (response.status_code == 200 || response.status_code == 201 || response.status_code == 204) {
        message.success("Güncelleme Başarılı");
        setSaveModalVisible(false);
        refreshTableData();
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={handleSaveColumns}>
        Güncelle
      </div>

      <Modal title="Raporu Güncelle" centered width={500} open={saveModalVisible} onOk={() => form.submit()} onCancel={() => setSaveModalVisible(false)}>
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ display: "flex", flexWrap: "wrap", columnGap: "10px" }}
        >
          <Form.Item
            label="Rapor Adı"
            name="nameOfReport"
            style={{ width: "430px", marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: t("alanBosBirakilamaz"),
              },
            ]}
          >
            <Input placeholder={t("raporAdi")} />
          </Form.Item>

          <RaporGrupSelectbox form={form} />

          <Form.Item
            label="Açıklama"
            name="raporAciklama"
            style={{ width: "430px", marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: t("alanBosBirakilamaz"),
              },
            ]}
          >
            <Input.TextArea placeholder={t("aciklamaGir")} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Guncelle;
