import React from "react";
import PropTypes from "prop-types";
import AxiosInstance from "../../../../../../../api/http";
import { message, Typography } from "antd";
import { t } from "i18next";

const { Text } = Typography;

export default function IsEmriOlustur({ selectedRows, refreshTableData, hidePopover, onWorkOrderCreated }) {
  const handleCreate = async () => {
    let createdWorkOrder = null;

    for (const row of selectedRows) {
      try {
        const body = {
          PBakimId: row.BakimID,
          MakineId: row.MakineID,
          Tarih: row.PlanlamaTarih,
        };

        const response = await AxiosInstance.post(`IsEmriOlustur`, body);
        console.log("İşlem başarılı:", response);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success(t("islemBasarili"));
          createdWorkOrder = {
            id: response.IsEmriId,
            code: response.IsEmriNo,
          };
        } else if (response.status_code === 401) {
          message.error(t("workOrder.planLater.noPermission"));
        } else {
          message.error(t("islemBasarisiz"));
        }
      } catch (error) {
        console.error("İş emri oluşturulurken hata oluştu:", error);
        message.error(t("islemBasarisiz"));
      }
    }

    if (createdWorkOrder?.id) {
      refreshTableData();
      hidePopover();
      onWorkOrderCreated(createdWorkOrder);
    }
  };

  return (
    <div>
      <Text style={{ cursor: "pointer" }} onClick={handleCreate}>
        {t("isEmriOlustur")}
      </Text>
    </div>
  );
}

IsEmriOlustur.propTypes = {
  selectedRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshTableData: PropTypes.func.isRequired,
  hidePopover: PropTypes.func.isRequired,
  onWorkOrderCreated: PropTypes.func.isRequired,
};
