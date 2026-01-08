import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http";

// Türkçe karakterleri normalize eden fonksiyon
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

const FirmaTablo = ({ workshopSelectedId, onSubmit, disabled, name1, isRequired }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Form alanları
  const fieldName = name1;
  const fieldIdName = `${name1}ID`;

  // Kolonlar
  const columns = [
    {
      title: "Firma Kodu",
      dataIndex: "CAR_KOD",
      key: "CAR_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Firma Tanımı",
      dataIndex: "CAR_TANIM",
      key: "CAR_TANIM",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Sektör",
      dataIndex: "CAR_SEKTOR",
      key: "CAR_SEKTOR",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Bölge",
      dataIndex: "CAR_BOLGE",
      key: "CAR_BOLGE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Şehir",
      dataIndex: "CAR_SEHIR",
      key: "CAR_SEHIR",
      width: 200,
      ellipsis: true,
    },
    {
      title: "İlçe",
      dataIndex: "CAR_ILCE",
      key: "CAR_ILCE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Telefon",
      dataIndex: "CAR_TEL1",
      key: "CAR_TEL1",
      width: 200,
      ellipsis: true,
    },
    {
      title: "E-posta",
      dataIndex: "CAR_EMAIL",
      key: "CAR_EMAIL",
      width: 250,
      ellipsis: true,
    },
  ];

  // Veri çekme
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetFirmaList?pagingDeger=${currentPage}&search=${searchValue}`)
      .then((response) => {
        const allData = response.Firma_Liste.map((item) => ({
          ...item,
          key: item.TB_CARI_ID,
        }));

        // Arama
        const filteredData = searchValue
          ? allData.filter((d) =>
              normalizeText(
                `${d.CAR_KOD || ""} ${d.CAR_TANIM || ""} ${d.CAR_SEKTOR || ""} ${d.CAR_BOLGE || ""} ${d.CAR_SEHIR || ""} ${d.CAR_ILCE || ""} ${d.CAR_TEL1 || ""} ${d.CAR_EMAIL || ""}`
              ).includes(normalizeText(searchValue))
            )
          : allData;

        setData(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, [searchValue, currentPage]);

  // Arama
  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  // Modal aç/kapat
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Modal açıkken veri çek
  useEffect(() => {
    if (isModalVisible) {
      fetchData();
    } else {
      setSearchValue("");
      setCurrentPage(1);
      setSelectedRowKeys([]);
    }
  }, [isModalVisible]);

  // Sayfa değişince
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData();
  };

  // Onayla
  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(fieldName, selectedData.CAR_TANIM);
      setValue(fieldIdName, selectedData.TB_CARI_ID);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Seçimi temizle
  const handleMinusClick = () => {
    setValue(fieldName, "");
    setValue(fieldIdName, "");
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={fieldName}
          control={control}
          rules={isRequired ? { required: "Bu alan zorunludur" } : {}}
          render={({ field }) => (
            <Input
              {...field}
              status={errors[fieldName] ? "error" : ""}
              type="text"
              style={{ width: "100%", maxWidth: "630px" }}
              disabled
            />
          )}
        />
        <Controller name={fieldIdName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}> - </Button>
        </div>
      </div>

      <Modal title="Firma Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1400} centered bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}>
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
              pageSize,
              total: data.length,
              onChange: handlePageChange,
            }}
            scroll={{ x: "max-content" }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default FirmaTablo;