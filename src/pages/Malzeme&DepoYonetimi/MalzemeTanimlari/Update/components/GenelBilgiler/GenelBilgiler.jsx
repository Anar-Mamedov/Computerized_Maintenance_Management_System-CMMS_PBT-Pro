import React from "react";
import { Select, Input, Typography, Divider, InputNumber } from "antd";
import GirisFiyatiSelect from "./components/GirisFiyatiSelect";
import CikisiyatiSelect from "./components/CikisiyatiSelect";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text } = Typography;

function GenelBilgiler() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <div>
        <div>
          <Text>{t("fiyatBilgileri")}</Text>
          <Divider style={{ margin: "8px 0" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text>{t("girisFiyati")}</Text>
          <div style={{ display: "flex", alignItems: "center" }}>
            <GirisFiyatiSelect />
            <Controller name="girisFiyati" control={control} render={({ field }) => <InputNumber {...field} readOnly status={errors.girisFiyati ? "error" : ""} />} />
          </div>
        </div>
      </div>

      <CikisiyatiSelect />
    </div>
  );
}

export default GenelBilgiler;
