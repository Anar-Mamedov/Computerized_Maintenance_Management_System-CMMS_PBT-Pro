import React from "react";
import { Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

function OtelemeKurali() {
  const { control } = useFormContext();
  const { t } = useTranslation();

  const options = [
    {
      value: 0,
      label: t("periodicMaintenance.postponementRule.actualOption"),
    },
    {
      value: 1,
      label: t("periodicMaintenance.postponementRule.plannedOption"),
    },
  ];

  return (
    <div
      style={{
        marginLeft: "36px",
        marginTop: "16px",
        paddingTop: "12px",
        width: "420px",
        borderTop: "1px solid #f0f0f0",
      }}
    >
      <Text strong>{t("periodicMaintenance.postponementRule.title")}</Text>
      <Text
        type="secondary"
        style={{
          display: "block",
          marginTop: "4px",
          marginBottom: "10px",
        }}
      >
        {t("periodicMaintenance.postponementRule.description")}
      </Text>
      <Controller
        name="PBK_OTELEME_KURALI"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            value={Number(field.value) === 1 ? 1 : 0}
            options={options}
            style={{ width: "360px" }}
          />
        )}
      />
    </div>
  );
}

export default OtelemeKurali;
