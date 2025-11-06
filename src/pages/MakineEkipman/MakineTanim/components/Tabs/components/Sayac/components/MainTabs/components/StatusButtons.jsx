import React from "react";
import { Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function StatusButtons() {
  const { control } = useFormContext();

  const statusConfigs = [
    { name: "sayacAktif", label: "aktif", color: "#52c41a" }, // green-6
    {
      name: "sayacVarsayilan",
      label: "varsayilan",
      color: "#1890ff",
      disabled: true,
    }, // blue-6
  ];

  const hexToRgba = (hex, alpha) => {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {statusConfigs.map(({ name, label, color, disabled }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => (
            <Button
              type="default"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  field.onChange(!field.value);
                }
              }}
              aria-pressed={field.value}
              style={
                field.value
                  ? {
                      color: color,
                      borderColor: color,
                      backgroundColor: hexToRgba(color, 0.12),
                    }
                  : undefined
              }
            >
              {t(label)}
            </Button>
          )}
        />
      ))}
    </div>
  );
}

export default StatusButtons;
