import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Form, Input, InputNumber, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";
import KodIDSelectbox from "../../../../../../../../../utils/components/KodIDSelectbox";

const normalizeNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  return value === 1 || value === "1" || value === "true";
};

const buildInitialForm = (selectedRow) => ({
  id: selectedRow?.TB_ISEMRI_MLZ_ID ?? selectedRow?.key ?? 0,
  materialName: selectedRow?.MalzemeAdi ?? selectedRow?.IDM_STOK_TANIM ?? "",
  unitId: selectedRow?.BirimId ?? selectedRow?.BirimID ?? selectedRow?.BirimKodId ?? selectedRow?.IDM_BIRIM_KOD_ID ?? selectedRow?.STK_BIRIM_KOD_ID ?? null,
  unit: selectedRow?.Birim ?? selectedRow?.IDM_BIRIM ?? "",
  quantity: normalizeNumber(selectedRow?.Miktar ?? selectedRow?.IDM_MIKTAR),
  unitPrice: normalizeNumber(selectedRow?.BirimFiyat ?? selectedRow?.IDM_BIRIM_FIYAT),
  total: normalizeNumber(selectedRow?.Tutar ?? selectedRow?.IDM_TUTAR),
  stockId: selectedRow?.StokId ?? selectedRow?.StokID ?? selectedRow?.IDM_STOK_ID ?? selectedRow?.STOK_ID ?? null,
  warehouseId: selectedRow?.DepoId ?? selectedRow?.DepoID ?? selectedRow?.IDM_DEPO_ID ?? selectedRow?.DEPO_ID ?? null,
  warehouseName: selectedRow?.Depo ?? selectedRow?.IDM_DEPO ?? "",
  stockDeduct: normalizeBoolean(selectedRow?.StoktanDusen ?? selectedRow?.IDM_STOK_DUS),
  materialFromStock: normalizeBoolean(selectedRow?.MalzemeStoktan ?? selectedRow?.IDM_MALZEME_STOKTAN ?? selectedRow?.StoktanDusen ?? selectedRow?.IDM_STOK_DUS),
});

export default function EditModal({ selectedRow, isModalVisible, onModalClose, onRefresh, secilenIsEmriID }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(buildInitialForm(selectedRow));
  const [saving, setSaving] = useState(false);
  const unitMethods = useForm({
    defaultValues: {
      unitCode: null,
      unitCodeID: "",
    },
  });

  useEffect(() => {
    if (isModalVisible && selectedRow) {
      const nextForm = buildInitialForm(selectedRow);
      setForm(nextForm);
      unitMethods.reset({
        unitCode: nextForm.unitId ?? null,
        unitCodeID: nextForm.unitId ?? "",
      });
    }
  }, [isModalVisible, selectedRow, unitMethods]);

  useEffect(() => {
    const quantity = normalizeNumber(form.quantity);
    const unitPrice = normalizeNumber(form.unitPrice);
    const total = quantity * unitPrice;

    if (total !== form.total) {
      setForm((currentForm) => ({ ...currentForm, total }));
    }
  }, [form.quantity, form.unitPrice, form.total]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.materialName?.trim()) {
      message.warning(t("workOrder.materialList.materialNameRequired"));
      return;
    }

    const body = {
      TB_ISEMRI_MLZ_ID: form.id,
      IDM_ISEMRI_ID: secilenIsEmriID,
      IDM_STOK_ID: form.stockId,
      IDM_DEPO_ID: form.warehouseId,
      IDM_BIRIM_KOD_ID: form.unitId,
      IDM_STOK_DUS: form.stockDeduct,
      IDM_MALZEME_STOKTAN: form.materialFromStock,
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
        onModalClose();
        onRefresh?.();
      } else if (response.status_code === 401) {
        message.error(t("workOrder.materialList.noPermission"));
      } else {
        message.error(t("workOrder.materialList.saveError"));
      }
    } catch (error) {
      console.error("Malzeme güncelleme sırasında hata oluştu:", error);
      message.error(t("workOrder.materialList.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      width="640px"
      title={t("workOrder.materialList.editMaterialTitle")}
      open={isModalVisible}
      okText={t("workOrder.materialList.save")}
      cancelText={t("workOrder.materialList.cancel")}
      confirmLoading={saving}
      onOk={handleSubmit}
      onCancel={onModalClose}
    >
      <Form layout="vertical">
        <Form.Item label={t("workOrder.materialList.materialName")} required>
          <Input value={form.materialName} disabled={form.materialFromStock} onChange={(event) => updateField("materialName", event.target.value)} />
        </Form.Item>
        <Form.Item label={t("workOrder.materialList.warehouse")}>
          <Input value={form.warehouseName} disabled />
        </Form.Item>
        <Form.Item label={t("workOrder.materialList.unit")}>
          {form.materialFromStock ? (
            <Input value={form.unit} disabled />
          ) : (
            <FormProvider {...unitMethods}>
              <KodIDSelectbox
                name1="unitCode"
                kodID={32001}
                isRequired={false}
                showDropdownAdd={false}
                placeholder={t("workOrder.materialList.unit")}
                onLabelChange={(label) => updateField("unit", label ?? "")}
                onChange={(value) => updateField("unitId", value ?? null)}
              />
            </FormProvider>
          )}
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
  );
}

EditModal.propTypes = {
  selectedRow: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isModalVisible: PropTypes.bool,
  onModalClose: PropTypes.func,
  onRefresh: PropTypes.func,
  secilenIsEmriID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
