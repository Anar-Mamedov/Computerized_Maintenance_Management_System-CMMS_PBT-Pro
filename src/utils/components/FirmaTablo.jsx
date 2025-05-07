import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { PlusOutlined, MinusOutlined, SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

const FirmaTablo = ({ workshopSelectedId, onSubmit, disabled }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  // State tanımlamaları
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  // Tablo kolonları
  const columns = [
    {
      title: "Firma Kodu",
      dataIndex: "CAR_KOD",
      key: "CAR_KOD",
      width: 150,
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Firma Ünvanı",
      dataIndex: "CAR_TANIM",
      key: "CAR_TANIM",
      width: 350,
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Firma Tipi",
      dataIndex: "CAR_TIP",
      key: "CAR_TIP",
      width: 150,
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Lokasyon",
      dataIndex: "CAR_LOKASYON",
      key: "CAR_LOKASYON",
      width: 150,
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Şehir",
      dataIndex: "CAR_SEHIR",
      key: "CAR_SEHIR",
      width: 150,
      render: (text) => (
        <div
          style={{
            lineHeight: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
  ];

  // Veri çekme fonksiyonu
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetFirmaList?pagingDeger=${currentPage}&search=${searchValue}`)
      .then((response) => {
        setPageSize(response.pageSize);
        const fetchedData = response.Firma_Liste.map((item) => ({
          ...item,
          key: item.TB_CARI_ID,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, [searchValue, currentPage]);

  // Arama işlemi
  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  // Modal açma kapama
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Modal açıldığında ve kapandığında çalışacak effect
  useEffect(() => {
    if (isModalVisible) {
      fetchData();
    } else {
      setSearchValue("");
      setCurrentPage(1);
      setSelectedRowKeys([]);
    }
  }, [isModalVisible]);

  // Sayfa değişikliğinde veri çekme
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData();
  };

  // Modal onay işlemi
  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue("firma", selectedData.CAR_TANIM);
      setValue("firmaID", selectedData.key);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  // Seçili firma ID'si değiştiğinde çalışacak effect
  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  // Satır seçimi değiştiğinde çalışacak fonksiyon
  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Firma seçimini temizleme
  const handleMinusClick = () => {
    setValue("firma", "");
    setValue("firmaID", "");
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name="firma"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              status={errors.firma ? "error" : ""}
              type="text" // Set the type to "text" for name input
              style={{ width: "100%", maxWidth: "630px" }}
              disabled
            />
          )}
        />
        <Controller
          name="firmaID"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              style={{ display: "none" }}
            />
          )}
        />
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}> - </Button>
        </div>
      </div>

      <Modal title="Firma Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1200} centered>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact style={{ width: "300px", marginBottom: "15px" }}>
            <Input
              placeholder="Ara..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onPressEnter={handleSearch}
              allowClear
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Ara
            </Button>
          </Space.Compact>
          <Table
            rowSelection={{
              type: "radio",
              selectedRowKeys,
              onChange: onRowSelectChange,
            }}
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              position: ["bottomRight"],
              current: currentPage,
              total: pageSize * 10,
              onChange: handlePageChange,
            }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default FirmaTablo;
