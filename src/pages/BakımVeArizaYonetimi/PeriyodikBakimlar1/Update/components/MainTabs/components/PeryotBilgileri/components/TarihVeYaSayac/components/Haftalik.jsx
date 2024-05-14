import React from "react";
import { InputNumber, Typography, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

export default function Haftalik(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <Text>Her </Text>
        <Controller
          name="haftalik"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} min={0} style={{ width: "70px" }} />
          )}
        />
        <Text> haftada bir</Text>
      </div>
      <div>
        <Text style={{ textDecoration: "underline" }}>
          Bakımın Gerçekleşeceği Günler
        </Text>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr 1fr",
          gap: "10px",
          gridAutoFlow: "column",
        }}
      >
        <Controller
          name="pazartesi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Pazartesi
            </Checkbox>
          )}
        />
        <Controller
          name="sali"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Salı
            </Checkbox>
          )}
        />
        <Controller
          name="carsamba"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Çarşamba
            </Checkbox>
          )}
        />
        <Controller
          name="persembe"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Perşembe
            </Checkbox>
          )}
        />
        <Controller
          name="cuma"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Cuma
            </Checkbox>
          )}
        />
        <Controller
          name="cumartesi"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Cumartesi
            </Checkbox>
          )}
        />
        <Controller
          name="pazar"
          control={control}
          defaultValue={false} // or true if you want it checked by default
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            >
              Pazar
            </Checkbox>
          )}
        />
      </div>
    </div>
  );
}
