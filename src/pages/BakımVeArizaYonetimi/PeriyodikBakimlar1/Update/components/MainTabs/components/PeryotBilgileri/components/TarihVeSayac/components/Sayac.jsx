import React from "react";
import { InputNumber, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import Birim from "./Birim.jsx";

const { Text } = Typography;

function Sayac(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginTop: "10px",
      }}
    >
      <div
        style={{ width: "138px", display: "flex", justifyContent: "center" }}
      >
        <Text>Sayaç</Text>
      </div>

      <Text>Her </Text>
      <Controller
        name="sayacSayisi"
        control={control}
        render={({ field }) => (
          <InputNumber {...field} min={0} style={{ width: "70px" }} />
        )}
      />
      <Birim />
    </div>
  );
}

export default Sayac;
