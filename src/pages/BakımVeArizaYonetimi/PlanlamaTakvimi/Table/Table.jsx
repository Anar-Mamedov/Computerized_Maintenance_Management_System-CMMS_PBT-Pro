import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Popover } from "antd";
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

const generateColumns = (startDate, endDate, data) => {
  const icons = {
    Planlanan: <FcPlanner style={{ fontSize: "20px" }} />,
    Yaklaşan: <FcExpired style={{ fontSize: "20px" }} />,
    "Süresi Geçmiş": <FcHighPriority style={{ fontSize: "20px" }} />,
    Yapılmadı: <FcCancel style={{ fontSize: "20px" }} />,
    "Devam Eden": <FcFlashAuto style={{ fontSize: "20px" }} />,
    "Zamanında Yapılan": <FcOk style={{ fontSize: "20px" }} />,
    "Gecikmeli Yapılan": <FcLeave style={{ fontSize: "20px" }} />,
    "İptal Edilen": <FcDisclaimer style={{ fontSize: "20px" }} />,
  };

  const getIconForValue = (value) => {
    return icons[value] || value;
  };
  const renderFunction = (text, record, column) => {
    const keyPart = record.key.split("-").shift();

    // keyPart değerine göre veriyi ara
    const foundRecord = data.find((item) => item.key === keyPart);

    // Eşleşen kaydın machine değerini al
    const machineValue = foundRecord ? foundRecord.machine : "Kayıt bulunamadı";

    // Sütunun veri indeksini al
    const date = dayjs(column.dataIndex, "YYYY-MM-DD").format("DD.MM.YYYY");

    return (
      <Popover
        content={
          <div>
            {`Makine: ${machineValue}`}
            <br />
            {`Bakım: ${record.machine}`}
            <br />
            {`Durum: ${text}`}
            <br />
            {`Tarih: ${date}`}
          </div>
        }
        title="Hücre Detayı"
        trigger="click">
        <div style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {getIconForValue(text)}
        </div>
      </Popover>
    );
  };

  const columnsObject = {
    "": {
      title: "",
      dataIndex: "machine",
      key: "machine",
      fixed: "left",
      width: 300,
      ellipsis: true,
    },
  };

  let currentDay = dayjs(startDate);

  while (currentDay <= dayjs(endDate)) {
    const month = currentDay.format("MMMM YYYY");
    const week = `Hafta ${currentDay.week()}`;
    const day = currentDay.format("dddd");
    const formattedDay = currentDay.format("YYYY-MM-DD");

    if (!columnsObject[month]) {
      columnsObject[month] = {
        title: month,
        ellipsis: true,
        children: [
          {
            title: week,
            ellipsis: true,
            children: [
              {
                title: day,
                dataIndex: formattedDay,
                key: formattedDay,
                width: 45,
                ellipsis: true,
                render: (text, record, rowIndex) =>
                  renderFunction(text, record, { dataIndex: formattedDay, key: formattedDay }),
              },
            ],
          },
        ],
      };
    } else {
      const monthColumn = columnsObject[month];
      if (!monthColumn.children.some((child) => child.title === week)) {
        monthColumn.children.push({
          title: week,
          ellipsis: true,
          children: [
            {
              title: day,
              dataIndex: formattedDay,
              key: formattedDay,
              width: 45,
              ellipsis: true,
              render: (text, record, rowIndex) =>
                renderFunction(text, record, { dataIndex: formattedDay, key: formattedDay }),
            },
          ],
        });
      } else {
        const weekColumn = monthColumn.children.find((child) => child.title === week);
        weekColumn.children.push({
          title: day,
          dataIndex: formattedDay,
          key: formattedDay,
          width: 45,
          ellipsis: true,
          render: (text, record, rowIndex) =>
            renderFunction(text, record, { dataIndex: formattedDay, key: formattedDay }),
        });
      }
    }

    currentDay = currentDay.add(1, "day");
  }

  return Object.values(columnsObject);
};

const MainTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState(); // Tabloda gösterilecek veri

  const columns = startDate && endDate ? generateColumns(startDate, endDate, data) : [];

  const { setValue } = useFormContext();
  const [loading, setLoading] = useState(true);

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

          let currentDay = startDateDayjs;
          for (let i = 1; i <= daysDiff + 1; i++) {
            const day = currentDay.format("YYYY-MM-DD");
            child[day] = item[i]; // günleri sayı olarak al
            currentDay = currentDay.add(1, "day");
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
          size="small"
          columns={columns}
          bordered
          dataSource={data}
          expandable={{
            expandedRowKeys, // Use this instead of defaultExpandedRowKeys to control dynamically
            onExpandedRowsChange: setExpandedRowKeys,
          }}
          scroll={{ y: "calc(100vh - 460px)" }}
          // pagination={false}
        />
      </Spin>
    </>
  );
};

export default MainTable;
