import React from "react";
import { InputNumber, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

function Gun(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  return (
    <div>
      <Text>Her </Text>
      <Controller
        name="gunlukGun"
        control={control}
        render={({ field }) => (
          <InputNumber {...field} min={0} style={{ width: "70px" }} />
        )}
      />
      <Text> günde bir</Text>
    </div>
  );
}

export default Gun;
