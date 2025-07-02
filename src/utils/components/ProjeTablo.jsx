import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
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

const ProjeTablo = ({ workshopSelectedId, onSubmit, disabled, name1, isRequired }) => {
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
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Form alanı isimleri
  const fieldName = name1;
  const fieldIdName = `${name1}ID`;

  // Tablo kolonları
  const columns = [
    {
      title: "Proje Kodu",
      dataIndex: "PRJ_KOD",
      key: "PRJ_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Proje Tanımı",
      dataIndex: "PRJ_TANIM",
      key: "PRJ_TANIM",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Proje Yöneticisi",
      dataIndex: "PRJ_YONETICI",
      key: "PRJ_YONETICI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Firma",
      dataIndex: "PRJ_FIRMA",
      key: "PRJ_FIRMA",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "PRJ_LOKASYON",
      key: "PRJ_LOKASYON",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "PRJ_MASRAF_MERKEZ",
      key: "PRJ_MASRAF_MERKEZ",
      width: 150,
      ellipsis: true,
    },
  ];

  // Veri çekme fonksiyonu
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetProjeList")
      .then((response) => {
        // API'den gelen veriyi tablo formatına dönüştür
        const allData = response.Proje_Liste.map((item) => ({
          ...item,
          key: item.TB_PROJE_ID,
        }));

        // Arama metni varsa filtrele
        const filteredData = searchValue
          ? allData.filter((d) =>
              normalizeText(`${d.PRJ_KOD || ""} ${d.PRJ_TANIM || ""} ${d.PRJ_YONETICI || ""} ${d.PRJ_FIRMA || ""} ${d.PRJ_LOKASYON || ""} ${d.PRJ_MASRAF_MERKEZ || ""}`).includes(
                normalizeText(searchValue)
              )
            )
          : allData;

        setData(filteredData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, [searchValue]);

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
      setValue(fieldName, selectedData.PRJ_TANIM);
      setValue(fieldIdName, selectedData.TB_PROJE_ID);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  // Seçili proje ID'si değiştiğinde çalışacak effect
  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  // Satır seçimi değiştiğinde çalışacak fonksiyon
  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Proje seçimini temizleme
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
          render={({ field }) => <Input {...field} status={errors[fieldName] ? "error" : ""} type="text" style={{ width: "100%", maxWidth: "630px" }} disabled />}
        />
        <Controller name={fieldIdName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}> - </Button>
        </div>
      </div>

      <Modal title="Proje Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1400} centered>
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
          />
        </Space>
      </Modal>
    </div>
  );
};

export default ProjeTablo;
