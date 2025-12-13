import React from "react";
import { Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";

function StatusButtons() {
  const { control } = useFormContext();
  const BUTTON_GRID_COLUMNS = 2;

  const statusConfigs = [
    { name: "makineAktif", label: "aktif", color: "#52c41a" }, // green-6
    { name: "makineKalibrasyon", label: "kalibrasyon", color: "#faad14" }, // gold-6
    { name: "kritikMakine", label: "kritikEkipman", color: "#f5222d" }, // red-6
    { name: "makineGucKaynagi", label: "gucKaynagi", color: "#722ed1" }, // purple-6
    { name: "makineIsBildirimi", label: "isBildirimi", color: "#1890ff" }, // blue-6
    { name: "makineOtonomBakim", label: "otonomBakim", color: "#13c2c2" }, // cyan-6
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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BUTTON_GRID_COLUMNS}, minmax(0, 1fr))`,
        gap: "8px",
        width: "100%",
      }}
    >
      {statusConfigs.map(({ name, label, color }) => (
        <Controller
          key={name}
          name={name}
          control={control}
          render={({ field }) => (
            <Button
              type="default"
              onClick={() => field.onChange(!field.value)}
              aria-pressed={field.value}
              style={{
                width: "100%",
                ...(field.value
                  ? {
                      color: color,
                      borderColor: color,
                      backgroundColor: hexToRgba(color, 0.12),
                    }
                  : null),
              }}
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
