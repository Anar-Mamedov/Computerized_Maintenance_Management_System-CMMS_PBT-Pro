import { Checkbox } from "antd";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ZorunluAlanlar() {
  const { control, watch, setValue } = useFormContext();

  const kontrolListesi = watch("kontrolListesi");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "250px" }}>
        <div>
          <Controller
            name="detayBilgiler"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} disabled onChange={(e) => field.onChange(e.target.checked)}>
                Detay Bilgiler
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="kontrolListesi"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Kontrol Listesi
              </Checkbox>
            )}
          />

          <Controller
            name="kontrolListesiZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!kontrolListesi} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
