import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Input, InputNumber, message, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../../../../../../api/http";

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

export default function CreateModal({ kapali, onRefresh, secilenIsEmriID, triggerButtonText, triggerButtonType = "link", triggerButtonClassName, triggerContainerClassName }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

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
    }
  };

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
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
      IDM_STOK_DUS: false,
      IDM_MALZEME_STOKTAN: false,
      IDM_STOK_TANIM: form.materialName,
      IDM_BIRIM: form.unit,
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
        <Form layout="vertical">
          <Form.Item label={t("workOrder.materialList.materialName")} required>
            <Input value={form.materialName} onChange={(event) => updateField("materialName", event.target.value)} />
          </Form.Item>
          <Form.Item label={t("workOrder.materialList.unit")}>
            <Input value={form.unit} onChange={(event) => updateField("unit", event.target.value)} />
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
