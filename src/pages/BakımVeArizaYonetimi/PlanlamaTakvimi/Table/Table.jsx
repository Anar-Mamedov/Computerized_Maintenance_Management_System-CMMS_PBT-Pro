import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import AxiosInstance from "../../../../api/http";
import Filters from "./filter/Filters";
import { useFormContext } from "react-hook-form";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import weekOfYear from "dayjs/plugin/weekOfYear";
import {
  FcOk,
  FcLeave,
  FcHighPriority,
  FcExpired,
  FcCancel,
  FcFlashAuto,
  FcPlanner,
  FcDisclaimer,
} from "react-icons/fc";

dayjs.locale("tr");
dayjs.extend(weekOfYear);

const { Text } = Typography;

const generateColumns = (startDate, endDate) => {
  const getIconForValue = (value) => {
    const style = { fontSize: "20px" }; // İkon boyutunu ayarla
    switch (value) {
      case "Planlanan":
        return <FcPlanner style={style} />;
      case "Yaklaşan":
        return <FcExpired style={style} />;
      case "Süresi Geçmiş":
        return <FcHighPriority style={style} />;
      case "Yapılmadı":
        return <FcCancel style={style} />;
      case "Devam Eden":
        return <FcFlashAuto style={style} />;
      case "Zamanında Yapılan":
        return <FcOk style={style} />;
      case "Gecikmeli Yapılan":
        return <FcLeave style={style} />;
      case "İptal Edilen":
        return <FcDisclaimer style={style} />;
      default:
        return value;
    }
  };
  const columns = [
    {
      title: "",
      dataIndex: "machine",
      key: "machine",
      fixed: "left",
      width: 300,
      ellipsis: true,
    },
  ];
  let currentDay = dayjs(startDate);

  while (currentDay <= dayjs(endDate)) {
    const month = currentDay.format("MMMM YYYY");
    const week = `Hafta ${currentDay.week()}`;
    const day = currentDay.format("dddd");

    if (!columns.some((column) => column.title === month)) {
      columns.push({
        title: month,
        ellipsis: true,
        children: [
          {
            title: week,
            ellipsis: true,
            children: [
              {
                title: day,
                dataIndex: currentDay.format("YYYY-MM-DD"),
                key: currentDay.format("YYYY-MM-DD"),
                width: 45,
                ellipsis: true,
                render: (text) => (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {getIconForValue(text)}
                  </div>
                ),
              },
            ],
          },
        ],
      });
    } else {
      const monthColumn = columns.find((column) => column.title === month);
      if (!monthColumn.children.some((child) => child.title === week)) {
        monthColumn.children.push({
          title: week,
          ellipsis: true,
          children: [
            {
              title: day,
              dataIndex: currentDay.format("YYYY-MM-DD"),
              key: currentDay.format("YYYY-MM-DD"),
              width: 45,
              ellipsis: true,
              render: (text) => (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {getIconForValue(text)}
                </div>
              ),
            },
          ],
        });
      } else {
        const weekColumn = monthColumn.children.find((child) => child.title === week);
        weekColumn.children.push({
          title: day,
          dataIndex: currentDay.format("YYYY-MM-DD"),
          key: currentDay.format("YYYY-MM-DD"),
          width: 45,
          ellipsis: true,
          render: (text) => (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              {getIconForValue(text)}
            </div>
          ),
        });
      }
    }

    currentDay = currentDay.add(1, "day");
  }

  return columns;
};

const MainTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = startDate && endDate ? generateColumns(startDate, endDate) : [];

  const { setValue } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(); // Tabloda gösterilecek veri
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body);
  }, [body]);

  // ana tablo api isteği için kullanılan useEffect son

  // arama işlemi için kullanılan useEffect son

  const fetchEquipmentData = async (body) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { filters = {} } = body || {};

    setLoading(true);

    // filters objesi boşsa API isteği atma ve loading animasyonunu durdur
    if (Object.keys(filters).length === 0) {
      setLoading(false);
      return;
    }

    try {
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(`PeriyodikBakimPlanlamaTakvimi`, filters);
      if (response) {
        const responseObject = JSON.parse(response);
        // Gelen veriyi formatla ve state'e ata
        const groupedData = responseObject.reduce((acc, item) => {
          if (!acc[item.MAKINE_ID]) {
            acc[item.MAKINE_ID] = {
              key: item.MAKINE_ID, // Her bir satır için benzersiz bir key değeri atayın
              machine: item.MAKINE_TANIM,
              children: [],
            };
          }
          let child = {
            key: `${item.MAKINE_ID}-${item.PBAKIM_ID}`, // Her bir çocuk için benzersiz bir key değeri atayın
            // PBAKIM_ID: item.PBAKIM_ID,
            machine: item.BAKIM_TANIM,
          };
          const startDateDayjs = dayjs(startDate);
          const endDateDayjs = dayjs(endDate);
          const daysDiff = endDateDayjs.diff(startDateDayjs, "day");

          for (let i = 1; i <= daysDiff + 1; i++) {
            const day = startDateDayjs.add(i - 1, "day").format("YYYY-MM-DD");
            child[day] = item[i]; // günleri sayı olarak al
          }
          acc[item.MAKINE_ID].children.push(child);
          return acc;
        }, {});
        const newData = Object.values(groupedData);
        setData(newData);

        // Set expanded rows: Assuming that each group's key is at item.MAKINE_ID
        setExpandedRowKeys(newData.map((item) => item.key)); // Set all parent keys
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        // İnternet bağlantısı var
        message.error("Hata Mesajı: " + error.message);
      } else {
        // İnternet bağlantısı yok
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  // filtreleme işlemi için kullanılan useEffect
  const handleBodyChange = useCallback((type, newBody) => {
    setStartDate(newBody.baslamaTarihi);
    setEndDate(newBody.bitisTarihi);
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
  }, []);
  // filtreleme işlemi için kullanılan useEffect son

  // tablodaki verileri gruplara göre ve toplu olarak seçmek işlemi

  // rowSelection object indicates the need for row selection
  const handleSelect = (record, selected, selectedRows) => {
    const childKeys = record.children ? record.children.map((child) => child.key) : [];
    const childRows = record.children || [];
    if (selected) {
      setSelectedRowKeys((prev) => Array.from(new Set([...prev, record.key, ...childKeys])));
      setSelectedRows((prev) => Array.from(new Set([...prev, record, ...childRows])));
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== record.key && !childKeys.includes(key)));
      setSelectedRows((prev) =>
        prev.filter((row) => row.key !== record.key && !childKeys.map((child) => child.key).includes(row.key))
      );
    }
  };

  const handleSelectAll = (selected, selectedRows, changeRows) => {
    const allKeys = selectedRows.map((row) => row.key);
    const allRows = selectedRows;
    if (selected) {
      setSelectedRowKeys(allKeys);
      setSelectedRows(allRows);
    } else {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  };

  const rowSelection = {
    columnWidth: 50,
    selectedRowKeys,
    onSelect: handleSelect,
    onSelectAll: handleSelectAll,
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Bu satır gerekliyse
      name: record.name,
    }),
  };

  // tablodaki verileri gruplara göre ve toplu olarak seçmek işlemi son

  const downloadCSV = () => {
    if (!data || data.length === 0) {
      message.warning("İndirilecek veri yok.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const headers = {};

    // Initialize the headers with the static 'Machine' column
    const initialHeader = []; // The first header for the 'machine' data

    // Safely retrieve and organize all unique headers for months, weeks, and days.
    columns.forEach((col) => {
      if (col.children) {
        col.children.forEach((weekCol) => {
          if (weekCol.children) {
            weekCol.children.forEach((dayCol) => {
              const month = col.title;
              const week = weekCol.title;
              const day = dayCol.title;

              if (!headers[month]) {
                headers[month] = {};
              }
              if (!headers[month][week]) {
                headers[month][week] = [];
              }
              if (!headers[month][week].includes(day)) {
                headers[month][week].push(day);
              }
            });
          }
        });
      }
    });

    // Build the header rows for CSV
    const monthRow = initialHeader; // Start with the 'Machine' column
    const weekRow = [""]; // Keep the first cell empty under 'Machine'
    const dayRow = [""]; // Keep the first cell empty under 'Machine'

    Object.keys(headers).forEach((month) => {
      const weeks = headers[month];
      const monthSpan = Object.keys(weeks).reduce((acc, week) => acc + weeks[week].length, 0);
      monthRow.push(`${month}${columnDelimiter.repeat(monthSpan - 1)}`);

      Object.keys(weeks).forEach((week) => {
        const dayCount = weeks[week].length;
        weekRow.push(`${week}${columnDelimiter.repeat(dayCount - 1)}`);
        dayRow.push(...weeks[week].map((day) => `"${day.replace(/"/g, '""')}"`));
      });
    });

    // Append rows to CSV content
    csvContent += monthRow.join(columnDelimiter) + lineDelimiter;
    csvContent += weekRow.join(columnDelimiter) + lineDelimiter;
    csvContent += dayRow.join(columnDelimiter) + lineDelimiter;

    // Add data rows
    data.forEach((parentRow) => {
      // For parent rows
      const parentRowData = [`"${parentRow.machine.replace(/"/g, '""')}"`];
      columns.forEach((col) => {
        if (col.children) {
          col.children.forEach((weekCol) => {
            if (weekCol.children) {
              weekCol.children.forEach((dayCol) => {
                const cellValue = parentRow[dayCol.dataIndex] || "";
                parentRowData.push(`"${cellValue.replace(/"/g, '""')}"`);
              });
            }
          });
        }
      });
      csvContent += parentRowData.join(columnDelimiter) + lineDelimiter;

      // If there are child rows
      if (parentRow.children && parentRow.children.length > 0) {
        parentRow.children.forEach((childRow) => {
          const childRowData = [`"${childRow.machine.replace(/"/g, '""')}"`];
          columns.forEach((col) => {
            if (col.children) {
              col.children.forEach((weekCol) => {
                if (weekCol.children) {
                  weekCol.children.forEach((dayCol) => {
                    const cellValue = childRow[dayCol.dataIndex] || "";
                    childRowData.push(`"${cellValue.replace(/"/g, '""')}"`);
                  });
                }
              });
            }
          });
          csvContent += childRowData.join(columnDelimiter) + lineDelimiter;
        });
      }
    });

    // Create and Download CSV File
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log("selectedRows", selectedRows);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}>
        <Filters onChange={handleBodyChange} />
        {/* <ContextMenu selectedRows={selectedRows} /> */}
        <Button onClick={downloadCSV} type="primary" style={{ marginBottom: "10px" }}>
          CSV İndir
        </Button>
      </div>
      <Spin spinning={loading}>
        <Table
          // rowSelection={rowSelection}
          size="small"
          columns={columns}
          bordered
          dataSource={data}
          expandable={{
            expandedRowKeys, // Use this instead of defaultExpandedRowKeys to control dynamically
            onExpandedRowsChange: setExpandedRowKeys,
          }}
          scroll={{ y: "calc(100vh - 460px)" }}
          pagination={false}
        />
      </Spin>
    </>
  );
};

export default MainTable;
