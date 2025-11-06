import React from "react";
import { Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function StatusButtons() {
  const { control, setValue, getValues } = useFormContext();

  const statusConfigs = [
    { name: "yok", label: "yok", color: "#52c41a" }, // green-6
    { name: "okunanDeger", label: "okunanDeger", color: "#52c41a" }, // gold-6
    { name: "artisDeger", label: "artisDeger", color: "#52c41a" }, // red-6
  ];

  const hexToRgba = (hex, alpha) => {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleSelect = (selectedName) => {
    statusConfigs.forEach(({ name }) => {
      const isSelected = name === selectedName;
      if (getValues(name) !== isSelected) {
        setValue(name, isSelected, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    });
  };

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {statusConfigs.map(({ name, label, color }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => (
            <Button
              type="default"
              onClick={() => handleSelect(name)}
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
