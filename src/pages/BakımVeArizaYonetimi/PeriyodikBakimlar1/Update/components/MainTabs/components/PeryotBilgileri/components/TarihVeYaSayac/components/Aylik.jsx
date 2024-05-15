import React from "react";
import { InputNumber, Radio, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AyinGunleriSelect from "./AyinGunleriSelect.jsx";
import AyinHaftalari from "./AyinHaftalari.jsx";

const { Text } = Typography;

function Aylik(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const ayGroup = watch("ayGroup");

  return (
    <div style={{ display: "flex" }}>
      <Controller
        name="ayGroup"
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
            <Radio value={2}>Ayın</Radio>
            <Radio value={3}>Ayın</Radio>
          </Radio.Group>
        )}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Controller
            name="herAy"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={ayGroup !== 1}
              />
            )}
          />
          <Text> ayda bir</Text>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <AyinGunleriSelect />
          <Controller
            name="ayinGunleriBir"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={ayGroup !== 2}
              />
            )}
          />
          <Text> ayda bir</Text>
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <AyinHaftalari />
          <Controller
            name="ayinHafatlariBir"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                style={{ width: "70px" }}
                disabled={ayGroup !== 3}
              />
            )}
          />
          <Text> ayda bir</Text>
        </div>
      </div>
    </div>
  );
}

export default Aylik;
