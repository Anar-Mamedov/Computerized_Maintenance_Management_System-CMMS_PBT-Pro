import React from "react";
import PropTypes from "prop-types";
import { Space } from "antd";
import { SwapRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import FullDatePicker from "../../../utils/components/FullDatePicker";
import { COLORS } from "./theme";

/**
 * Widget içi "Özel Tarih" seçimi için başlangıç/bitiş tarih ikilisi.
 * Alanlar react-hook-form üzerinden yönetilir.
 */
export default function WidgetDateRange({ startFieldName, endFieldName }) {
  const { t } = useTranslation();

  return (
    <Space size={6} style={{ width: 290 }}>
      <span style={{ display: "inline-block", width: 128 }}>
        <FullDatePicker name1={startFieldName} showError={false} allowClear={false} placeholder={t("baslangicTarihi")} />
      </span>
      <SwapRightOutlined style={{ color: COLORS.muted }} />
      <span style={{ display: "inline-block", width: 128 }}>
        <FullDatePicker name1={endFieldName} showError={false} allowClear={false} placeholder={t("bitisTarihi")} />
      </span>
    </Space>
  );
}

WidgetDateRange.propTypes = {
  startFieldName: PropTypes.string.isRequired,
  endFieldName: PropTypes.string.isRequired,
};
