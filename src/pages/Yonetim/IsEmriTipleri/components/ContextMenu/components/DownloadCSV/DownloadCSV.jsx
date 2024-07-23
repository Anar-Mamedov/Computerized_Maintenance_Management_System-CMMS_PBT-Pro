import React from "react";
import { Input, Table, Spin, Button } from "antd";
import { CheckOutlined, CloseOutlined, SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function DownloadCSV({ selectedRows }) {
  // Define the CSV download function
  const downloadCSV = () => {
    const csvHeader = Object.keys(selectedRows[0])
      .map((field) => `"${field}"`)
      .join(",");
    const csvRows = selectedRows.map((row) =>
      Object.values(row)
        .map((value) => `"${typeof value === "string" ? value.replace(/"/g, '""') : value}"`)
        .join(",")
    );
    const csvData = [csvHeader, ...csvRows].join("\r\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `export-${dayjs().format("YYYYMMDD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Row selection setup and columns definitions are omitted for brevity

  return (
    <div>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        type="submit"
        icon={<DownloadOutlined />}
        onClick={downloadCSV}
        disabled={!selectedRows.length}>
        CSV İndir
      </Button>
    </div>
  );
}
