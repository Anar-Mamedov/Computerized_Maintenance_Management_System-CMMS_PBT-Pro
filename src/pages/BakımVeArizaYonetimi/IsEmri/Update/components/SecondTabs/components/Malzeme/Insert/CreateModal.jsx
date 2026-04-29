import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Input, InputNumber, message, Modal, Table } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../../../utils/components/KodIDSelectbox";

const initialForm = {
  materialName: "",
  unit: "",
  quantity: 1,
  unitPrice: 0,
  total: 0,
  stockDeduct: false,
};

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

const normalizeMaterial = (item) => ({
  key: item.TB_STOK_ID ?? item.Id ?? item.STOK_ID ?? item.STK_ID,
  code: item.STK_KOD ?? item.Kod ?? item.StokKod ?? "",
  name: item.STK_TANIM ?? item.MalzemeAdi ?? item.StokTanim ?? "",
});

export default function CreateModal({ kapali, onRefresh, secilenIsEmriID, triggerButtonText, triggerButtonType = "link", triggerButtonClassName, triggerContainerClassName }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMaterialModalVisible, setIsMaterialModalVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [materialData, setMaterialData] = useState([]);
  const [materialLoading, setMaterialLoading] = useState(false);
  const [selectedMaterialRowKeys, setSelectedMaterialRowKeys] = useState([]);
  const [saving, setSaving] = useState(false);
  const unitMethods = useForm({
    defaultValues: {
      unitCode: null,
      unitCodeID: "",
    },
  });

  useEffect(() => {
    const quantity = normalizeNumber(form.quantity);
    const unitPrice = normalizeNumber(form.unitPrice);
    const total = quantity * unitPrice;

    if (total !== form.total) {
      setForm((currentForm) => ({ ...currentForm, total }));
    }
  }, [form.quantity, form.unitPrice, form.total]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);

    if (!isModalVisible) {
      setForm(initialForm);
      setSelectedMaterialRowKeys([]);
      unitMethods.reset();
    }
  };

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const openMaterialSelectModal = () => {
    setIsMaterialModalVisible(true);
    setSelectedMaterialRowKeys([]);
    setMaterialLoading(true);

    AxiosInstance.get("GetDepoStok?depoID=0&stoklu=false")
      .then((response) => {
        setMaterialData(getResponseData(response).map(normalizeMaterial));
      })
      .catch((error) => {
        console.error("Malzeme listesi alınırken hata oluştu:", error);
        message.error(t("workOrder.materialList.stockLoadError"));
      })
      .finally(() => setMaterialLoading(false));
  };

  const handleMaterialSelect = () => {
    const selectedMaterial = materialData.find((item) => item.key === selectedMaterialRowKeys[0]);

    if (!selectedMaterial) {
      message.warning(t("workOrder.materialList.chooseMaterial"));
      return;
    }

    updateField("materialName", selectedMaterial.name);
    setIsMaterialModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!form.materialName?.trim()) {
      message.warning(t("workOrder.materialList.materialNameRequired"));
      return;
    }

    const body = {
      TB_ISEMRI_MLZ_ID: 0,
      IDM_ISEMRI_ID: secilenIsEmriID,
      IDM_STOK_ID: null,
      IDM_DEPO_ID: null,
      IDM_BIRIM_KOD_ID: Number(unitMethods.getValues("unitCodeID")) || null,
      IDM_STOK_DUS: false,
      IDM_MALZEME_STOKTAN: false,
      IDM_STOK_TANIM: form.materialName,
      IDM_BIRIM_FIYAT: normalizeNumber(form.unitPrice),
      IDM_MIKTAR: normalizeNumber(form.quantity),
      IDM_TUTAR: normalizeNumber(form.total),
    };

    setSaving(true);

    try {
      const response = await AxiosInstance.post("AddUpdateIsEmriMalzeme", body);

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(t("workOrder.materialList.saveSuccess"));
        setIsModalVisible(false);
        setForm(initialForm);
        unitMethods.reset();
        onRefresh?.();
      } else if (response.status_code === 401) {
        message.error(t("workOrder.materialList.noPermission"));
      } else {
        message.error(t("workOrder.materialList.saveError"));
      }
    } catch (error) {
      console.error("Malzeme ekleme sırasında hata oluştu:", error);
      message.error(t("workOrder.materialList.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={triggerContainerClassName}>
      <Button type={triggerButtonType} className={triggerButtonClassName} disabled={kapali} onClick={handleModalToggle}>
        {!triggerButtonText && <PlusOutlined />}
        {triggerButtonText || t("workOrder.materialList.manualMaterial")}
      </Button>

      <Modal
        width="640px"
        title={t("workOrder.materialList.addMaterialTitle")}
        open={isModalVisible}
        okText={t("workOrder.materialList.save")}
        cancelText={t("workOrder.materialList.cancel")}
        confirmLoading={saving}
        onOk={handleSubmit}
        onCancel={handleModalToggle}
      >
        <FormProvider {...unitMethods}>
          <Form layout="vertical">
            <Form.Item label={t("workOrder.materialList.materialName")} required>
              <Input.Group compact>
                <Input value={form.materialName} onChange={(event) => updateField("materialName", event.target.value)} style={{ width: "calc(100% - 40px)" }} />
                <Button icon={<SearchOutlined />} onClick={openMaterialSelectModal} />
              </Input.Group>
            </Form.Item>
            <Form.Item label={t("workOrder.materialList.unit")}>
              <KodIDSelectbox
                name1="unitCode"
                kodID={32001}
                isRequired={false}
                showDropdownAdd={false}
                placeholder={t("workOrder.materialList.unit")}
                onLabelChange={(label) => updateField("unit", label ?? "")}
              />
            </Form.Item>
            <Form.Item label={t("workOrder.materialList.quantity")}>
              <InputNumber min={0} style={{ width: "100%" }} value={form.quantity} onChange={(value) => updateField("quantity", value)} />
            </Form.Item>
            <Form.Item label={t("workOrder.materialList.unitPrice")}>
              <InputNumber min={0} decimalSeparator="." style={{ width: "100%" }} value={form.unitPrice} onChange={(value) => updateField("unitPrice", value)} />
            </Form.Item>
            <Form.Item label={t("workOrder.materialList.total")}>
              <InputNumber disabled style={{ width: "100%" }} value={form.total} />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={form.stockDeduct} disabled>
                {t("workOrder.materialList.stockDeduct")}
              </Checkbox>
            </Form.Item>
          </Form>
        </FormProvider>
      </Modal>
      <Modal
        width={900}
        centered
        title={t("workOrder.materialList.selectMaterialName")}
        open={isMaterialModalVisible}
        okText={t("workOrder.materialList.select")}
        cancelText={t("workOrder.materialList.cancel")}
        onOk={handleMaterialSelect}
        onCancel={() => setIsMaterialModalVisible(false)}
      >
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys: selectedMaterialRowKeys,
            onChange: (selectedKeys) => setSelectedMaterialRowKeys(selectedKeys.length ? [selectedKeys[0]] : []),
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
            position: ["bottomRight"],
          }}
          columns={[
            {
              title: t("workOrder.materialList.code"),
              dataIndex: "code",
              key: "code",
              width: 160,
              ellipsis: true,
            },
            {
              title: t("workOrder.materialList.materialName"),
              dataIndex: "name",
              key: "name",
              ellipsis: true,
            },
          ]}
          dataSource={materialData}
          loading={materialLoading}
          scroll={{ y: "calc(100vh - 360px)" }}
        />
      </Modal>
    </div>
  );
}

CreateModal.propTypes = {
  kapali: PropTypes.bool,
  onRefresh: PropTypes.func,
  secilenIsEmriID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  triggerButtonText: PropTypes.string,
  triggerButtonType: PropTypes.string,
  triggerButtonClassName: PropTypes.string,
  triggerContainerClassName: PropTypes.string,
};
