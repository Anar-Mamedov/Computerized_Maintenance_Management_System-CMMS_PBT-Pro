import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import AxiosInstance from "../../../../api/http";
import Filters from "./filter/Filters";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.locale("tr");
dayjs.extend(weekOfYear);

const { Text } = Typography;

const generateColumns = (startDate, endDate) => {
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
                width: 70,
                ellipsis: true,
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
              width: 70,
              ellipsis: true,
            },
          ],
        });
      } else {
        const weekColumn = monthColumn.children.find((child) => child.title === week);
        weekColumn.children.push({
          title: day,
          dataIndex: currentDay.format("YYYY-MM-DD"),
          key: currentDay.format("YYYY-MM-DD"),
          width: 70,
          ellipsis: true,
        });
      }
    }

    currentDay = currentDay.add(1, "day");
  }

  return columns;
};

const MainTable = ({ data }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const columns = startDate && endDate ? generateColumns(startDate, endDate) : [];
  const { setValue } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDataCount, setTotalDataCount] = useState(0); // Tüm veriyi tutan state
  const [pageSize, setPageSize] = useState(10); // Başlangıçta sayfa başına 10 kayıt göster

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body, currentPage, pageSize);
  }, [body, currentPage, pageSize]);

  // ana tablo api isteği için kullanılan useEffect son

  // arama işlemi için kullanılan useEffect son

  const fetchEquipmentData = async (body, page, size) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(
        `getIsEmriFullList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`,
        filters
      );
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.list.map((item) => ({
          ...item,
          key: item.TB_ISEMRI_ID,
          // Diğer alanlarınız...
        }));
        // setData(formattedData);
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
    setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla
  }, []);
  // filtreleme işlemi için kullanılan useEffect son

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
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
            maxWidth: "935px",
            flexWrap: "wrap",
          }}>
          <Filters onChange={handleBodyChange} />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} bordered dataSource={data} scroll={{ y: "calc(100vh - 380px)" }} />
      </Spin>
    </>
  );
};

export default MainTable;
