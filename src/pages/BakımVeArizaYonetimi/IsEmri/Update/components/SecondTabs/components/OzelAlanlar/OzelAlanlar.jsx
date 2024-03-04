import React from "react";
import OzelAlan1 from "./components/OzelAlan1";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "antd";

export default function OzelAlanlar() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "400px",
        }}>
        <OzelAlan1 />
        <Controller
          name="ozelAlan1"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              style={{ width: "250px" }}
            />
          )}
        />
      </div>
    </div>
  );
}
