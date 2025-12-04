import React, { useCallback, useMemo } from "react";
import AxiosInstance from "../../../../../../api/http";
import { message, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

export default function Sil({ selectedRows, refreshTableData, disabled, hidePopover, icon, iconColor, title, description }) {
  const rows = useMemo(() => (Array.isArray(selectedRows) ? selectedRows : []), [selectedRows]);
  const isDisabled = disabled || rows.length === 0;

  const handleDelete = useCallback(async () => {
    if (rows.length === 0) return;

    const successStatuses = new Set([200, 201, 202]);
    try {
      const results = await Promise.allSettled(
        rows.map((row) => AxiosInstance.get(`VehicleServices/DeleteVehicleService?sId=${row.key}&vId=${row.aracId}&pId=${row.bakimId}`)),
      );

      const successes = results.filter((result) => result.status === "fulfilled" && successStatuses.has(result.value?.data?.statusCode)).length;
      const failures = results.length - successes;

      if (successes) {
        message.success(`${successes} kayıt silindi.`);
      }
      if (failures) {
        message.error(`${failures} kayıt silinemedi.`);
      }

      refreshTableData?.();
      hidePopover?.();
    } catch (error) {
      message.error("Silme işlemi sırasında bir sorun oluştu.");
    }
  }, [hidePopover, refreshTableData, rows]);

  return (
    <div style={isDisabled ? { display: "none" } : {}}>
      <Popconfirm
        title="Silme İşlemi"
        description="Bu öğeyi silmek istediğinize emin misiniz?"
        onConfirm={handleDelete}
        okText="Evet"
        cancelText="Hayır"
        icon={
          <QuestionCircleOutlined
            style={{
              color: "red",
            }}
          />
        }
      >
        <div
          className="menu-item-hover"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            cursor: "pointer",
            padding: "10px 12px",
            transition: "background-color 0.3s",
            width: "100%",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div>{icon && <span style={{ color: iconColor, fontSize: "18px", marginTop: "4px" }}>{icon}</span>}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {title && <span style={{ fontWeight: "500", color: "#262626", fontSize: "14px", lineHeight: "1.2" }}>{title}</span>}
            {description && <span style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "4px", lineHeight: "1.4" }}>{description}</span>}
          </div>
        </div>
      </Popconfirm>
    </div>
  );
}
