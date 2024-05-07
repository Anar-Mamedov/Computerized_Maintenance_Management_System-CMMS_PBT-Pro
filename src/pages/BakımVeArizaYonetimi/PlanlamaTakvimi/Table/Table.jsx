import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import AxiosInstance from "../../../../api/http";
import Filters from "./filter/Filters";
import { useFormContext } from "react-hook-form";
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

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    columnWidth: 50, // Checkbox sütununun genişliğini burada ayarlayın
    selectedRowKeys: [],
    onSelect: (record, selected, selectedRows, nativeEvent) => {
      let newSelectedRowKeys = [];
      if (record.children) {
        newSelectedRowKeys = selected
          ? [...rowSelection.selectedRowKeys, record.key, ...record.children.map((child) => child.key)]
          : rowSelection.selectedRowKeys.filter(
              (key) => ![record.key, ...record.children.map((child) => child.key)].includes(key)
            );
      } else {
        newSelectedRowKeys = selected
          ? [...rowSelection.selectedRowKeys, record.key]
          : rowSelection.selectedRowKeys.filter((key) => key !== record.key);
      }
      rowSelection.selectedRowKeys = newSelectedRowKeys;
      console.log(`selectedRowKeys: ${newSelectedRowKeys}`, "selectedRows: ", selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User", // Column configuration not to be checked
      name: record.name,
    }),
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
      </div>
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
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
