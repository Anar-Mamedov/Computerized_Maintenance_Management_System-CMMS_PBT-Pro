import React from "react";
import { InputNumber, Radio, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import YilinGunleriAylariSelect from "./YilinGunleriAylariSelect.jsx";

const { Text } = Typography;

function Yillik(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const yilGroup = watch("yilGroup");

  return (
    <div style={{ display: "flex" }}>
      <Controller
        name="yilGroup"
        control={control}
        render={({ field }) => (
          <Radio.Group
            {...field}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "5px 0 5px 0",
            }}
          >
            <Radio value={1}>Her</Radio>
            <Radio value={2}></Radio>
          </Radio.Group>
        )}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Controller
            name="herYil"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={yilGroup !== 1}
              />
            )}
          />
          <Text> yılda bir</Text>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <YilinGunleriAylariSelect />
          <Controller
            name="yillikTekrarSayisi"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={yilGroup !== 2}
              />
            )}
          />
          <Text> yılda bir</Text>
        </div>
      </div>
    </div>
  );
}

export default Yillik;
