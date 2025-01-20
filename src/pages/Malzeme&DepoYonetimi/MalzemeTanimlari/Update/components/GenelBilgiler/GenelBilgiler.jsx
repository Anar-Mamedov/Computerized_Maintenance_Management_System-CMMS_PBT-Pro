import React from "react";
import { Select, Input, Typography, Divider, InputNumber } from "antd";
import GirisFiyatiSelect from "./components/GirisFiyatiSelect";
import CikisiyatiSelect from "./components/CikisiyatiSelect";
import FiyatGirisleri from "./components/FiyatGirisleri/FiyatGirisleri";
import NumberInput from "../../../../../../utils/components/NumberInput";
import KdvSelect from "./components/KdvSelect";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

const { Text } = Typography;

function GenelBilgiler({ selectedRowID }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ width: "500px" }}>
        <div>
          <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("fiyatBilgileri")}</Text>
          <Divider style={{ margin: "8px 0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "370px", justifyContent: "space-between" }}>
              <Text>{t("girisFiyati")}</Text>
              <div style={{ display: "flex", alignItems: "center", width: "250px", gap: "10px" }}>
                <GirisFiyatiSelect />
                <Controller name="girisFiyati" control={control} render={({ field }) => <InputNumber {...field} readOnly status={errors.girisFiyati ? "error" : ""} />} />
              </div>
            </div>
            <FiyatGirisleri selectedRowID={selectedRowID} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "370px" }}>
            <Text>{t("cikisFiyati")}</Text>
            <div style={{ display: "flex", alignItems: "center", width: "250px", gap: "10px" }}>
              <CikisiyatiSelect />
              <Controller name="cikisFiyati" control={control} render={({ field }) => <InputNumber {...field} readOnly status={errors.cikisFiyati ? "error" : ""} />} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: "500px" }}>
        <div>
          <Text style={{ color: "#0062ff", fontWeight: "500", fontSize: "14px" }}>{t("detayBilgileri")}</Text>
          <Divider style={{ margin: "8px 0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "370px", justifyContent: "space-between" }}>
              <Text>{t("KDV")} (%)</Text>
              <div style={{ display: "flex", alignItems: "center", width: "250px", gap: "10px" }}>
                <div style={{ width: "100px" }}>
                  <NumberInput name1="kdv" isRequired={false} minNumber={0} maxNumber={100} />
                </div>
                <div style={{ width: "140px" }}>
                  <KdvSelect />
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "370px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "220px", justifyContent: "space-between" }}>
              <Text>{t("OTV")} (%)</Text>
              <div style={{ display: "flex", alignItems: "center", width: "100px", gap: "10px" }}>
                <NumberInput name1="otv" isRequired={false} minNumber={0} maxNumber={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenelBilgiler;
