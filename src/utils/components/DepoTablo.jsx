import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
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

const DepoTablo = ({
  workshopSelectedId,
  onSubmit,
  disabled,
  name1,
  isRequired,
  placeholder = "Seçim Yapınız",
  style = {},
  inputStyle = {},
  showClearButton = true,
  multiSelect = false,
}) => {
  const {
    control,
    watch,
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
      title: "Depo Kodu",
      dataIndex: "DEP_KOD",
      key: "DEP_KOD",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Depo Tanımı",
      dataIndex: "DEP_TANIM",
      key: "DEP_TANIM",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Sorumlu Personel",
      dataIndex: "SORUMLU_PERSONEL",
      key: "SORUMLU_PERSONEL",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Atölye",
      dataIndex: "ATOLYE_TANIM",
      key: "ATOLYE_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON_TANIM",
      key: "LOKASYON_TANIM",
      width: 200,
      ellipsis: true,
    },
  ];

  // Veri çekme fonksiyonu
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetDepo?DEP_MODUL_NO=1")
      .then((response) => {
        // API'den gelen veriyi tablo formatına dönüştür
        const allData = response.map((item) => ({
          ...item,
          key: item.TB_DEPO_ID,
        }));

        // Arama metni varsa filtrele
        const filteredData = searchValue
          ? allData.filter((d) =>
              normalizeText(`${d.DEP_KOD || ""} ${d.DEP_TANIM || ""} ${d.SORUMLU_PERSONEL || ""} ${d.ATOLYE_TANIM || ""} ${d.LOKASYON_TANIM || ""}`).includes(
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
  }, [isModalVisible, fetchData]);

  // Sayfa değişikliğinde veri çekme
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData();
  };

  // Modal onay işlemi
  const handleModalOk = () => {
    const selectedRows = data.filter((item) => selectedRowKeys.includes(item.key));

    if (multiSelect) {
      const selectedIds = selectedRows.map((item) => item.TB_DEPO_ID);
      const selectedNames = selectedRows.map((item) => item.DEP_TANIM).filter(Boolean);

      setValue(fieldName, selectedNames.join(", "));
      setValue(fieldIdName, selectedIds);
      onSubmit && onSubmit(selectedRows);
    } else {
      const selectedData = selectedRows[0];
      if (selectedData) {
        setValue(fieldName, selectedData.DEP_TANIM);
        setValue(fieldIdName, selectedData.TB_DEPO_ID);
        onSubmit && onSubmit(selectedData);
      }
    }

    setIsModalVisible(false);
  };

  // Seçili firma ID'si değiştiğinde çalışacak effect
  useEffect(() => {
    if (multiSelect) {
      setSelectedRowKeys(Array.isArray(workshopSelectedId) ? workshopSelectedId : []);
    } else {
      setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
    }
  }, [workshopSelectedId, multiSelect]);

  // Satır seçimi değiştiğinde çalışacak fonksiyon
  const onRowSelectChange = (selectedKeys) => {
    if (multiSelect) {
      setSelectedRowKeys(selectedKeys);
    } else {
      setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
    }
  };

  // Firma seçimini temizleme
  const handleMinusClick = () => {
    setValue(fieldName, "");
    setValue(fieldIdName, multiSelect ? [] : "");
  };

  const depoValue = watch(fieldName);
  const hasDepoValue = Array.isArray(depoValue) ? depoValue.length > 0 : !!depoValue;

  return (
    <div style={{ width: "100%", ...style }}>
      <div style={{ width: "100%" }}>
        <Controller
          name={fieldName}
          control={control}
          rules={isRequired ? { required: "Bu alan zorunludur" } : {}}
          render={({ field }) => (
            <Input
              {...field}
              status={errors[fieldName] ? "error" : ""}
              type="text"
              style={{ width: "100%", maxWidth: "630px", ...inputStyle }}
              placeholder={placeholder}
              readOnly
              suffix={
                hasDepoValue && showClearButton ? (
                  <CloseOutlined
                    style={{ color: "#8c8c8c", cursor: "pointer", fontSize: "12px" }}
                    onClick={handleMinusClick}
                  />
                ) : (
                  <PlusOutlined
                    style={{ color: disabled ? "#d9d9d9" : "#0091ff", cursor: disabled ? "not-allowed" : "pointer", fontSize: "12px" }}
                    onClick={disabled ? undefined : handleModalToggle}
                  />
                )
              }
            />
          )}
        />
        <Controller
          name={fieldIdName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={Array.isArray(field.value) ? field.value.join(",") : field.value ?? ""}
              type="text"
              style={{ display: "none" }}
            />
          )}
        />
      </div>

      <Modal title="Depo Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1200} centered>
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
              type: multiSelect ? "checkbox" : "radio",
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

export default DepoTablo;
