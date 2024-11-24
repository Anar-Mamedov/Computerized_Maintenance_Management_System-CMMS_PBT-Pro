import React, { useState, useEffect } from "react";
import { Input, Table } from "antd";
import { useFormContext } from "react-hook-form";
import LokasyonTablo from "./components/LokasyonTablo";
import AxiosInstance from "../../../../../../api/http.jsx";
import { t } from "i18next";

function LokasyonYetkileri() {
  const { watch } = useFormContext();
  const [data, setData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentUserId = watch("siraNo");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  const columns = [
    {
      title: t("yetkiliOlunanLokasyon"),
      dataIndex: "lokasyon",
      key: "lokasyon",
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("tumYol"),
      dataIndex: "tumLokasyon",
      key: "tumLokasyon",
    },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const fetchData = async (page = 1, pageSize = 10, parameter = debouncedSearchText) => {
    try {
      const response = await AxiosInstance.get(`UserLocation/GetUserLocationList?userId=${currentUserId}&page=${page}&pageSize=${pageSize}&parameter=${parameter}`);
      const formattedData = response.data.list.map((item) => ({
        ...item,
        key: item.siraNo,
      }));
      setData(formattedData);
      setTotal(response.data.recordCount); // Adjusted to match the API response
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchData(currentPage, pageSize);
    }
  }, [currentUserId, currentPage, pageSize, refreshKey, debouncedSearchText]);

  useEffect(() => {
    setCurrentPage(1);
  }, [currentUserId]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Input placeholder={t("arama")} value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: 200 }} />
          <LokasyonTablo currentUserId={currentUserId} setRefreshKey={setRefreshKey} />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handleTableChange,
        }}
      />
    </div>
  );
}

export default LokasyonYetkileri;
