import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, Space } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren ve büyük küçük harf duyarsız hale getiren fonksiyon
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
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

const PersonelTablo = ({ workshopSelectedId, onSubmit, disabled, name1, isRequired }) => {
  const { t } = useTranslation();
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  // State tanımlamaları
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [allData, setAllData] = useState([]); // Tüm veriyi saklamak için
  const [filteredData, setFilteredData] = useState([]); // Filtrelenmiş veriyi saklamak için
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // Form alanı isimleri
  const fieldName = name1;
  const fieldIdName = `${name1}ID`;

  // Tablo kolonları
  const columns = [
    {
      title: t("personelKodu"),
      dataIndex: "PRS_PERSONEL_KOD",
      key: "PRS_PERSONEL_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: t("personelTanimi"),
      dataIndex: "PRS_ISIM",
      key: "PRS_ISIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("unvan"),
      dataIndex: "PRS_UNVAN",
      key: "PRS_UNVAN",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("departman"),
      dataIndex: "PRS_DEPARTMAN",
      key: "PRS_DEPARTMAN",
      width: 150,
      ellipsis: true,
    },
    {
      title: t("atolye"),
      dataIndex: "PRS_ATOLYE",
      key: "PRS_ATOLYE",
      width: 120,
      ellipsis: true,
    },
    {
      title: t("lokasyon"),
      dataIndex: "PRS_LOKASYON",
      key: "PRS_LOKASYON",
      width: 120,
      ellipsis: true,
    },
    {
      title: t("masrafMerkezi"),
      dataIndex: "PRS_MASRAF_MERKEZI",
      key: "PRS_MASRAF_MERKEZI",
      width: 150,
      ellipsis: true,
    },
  ];

  // API'den veri çekme fonksiyonu (sadece modal açıldığında bir kez çalışır)
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("Personel")
      .then((response) => {
        // API'den gelen veriyi tablo formatına dönüştür
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_PERSONEL_ID,
        }));

        setAllData(formattedData);
        setFilteredData(formattedData); // İlk başta tüm veriyi göster
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Frontend'de arama işlemi (API isteği yok)
  const handleSearch = useCallback(() => {
    if (!searchValue.trim()) {
      setFilteredData(allData);
      setCurrentPage(1);
      return;
    }

    const filtered = allData.filter((d) =>
      normalizeText(
        `${d.PRS_PERSONEL_KOD || ""} ${d.PRS_ISIM || ""} ${d.PRS_UNVAN || ""} ${d.PRS_DEPARTMAN || ""} ${d.PRS_ATOLYE || ""} ${d.PRS_LOKASYON || ""} ${d.PRS_MASRAF_MERKEZI || ""}`
      ).includes(normalizeText(searchValue))
    );

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchValue, allData]);

  // Arama değeri değiştiğinde otomatik arama yap
  useEffect(() => {
    if (allData.length > 0) {
      handleSearch();
    }
  }, [searchValue, handleSearch]);

  // Modal açma kapama
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Modal açıldığında veri çek, kapandığında temizle
  useEffect(() => {
    if (isModalVisible) {
      fetchData(); // Sadece modal açıldığında API isteği at
    } else {
      setSearchValue("");
      setCurrentPage(1);
      setSelectedRowKeys([]);
      setAllData([]);
      setFilteredData([]);
    }
  }, [isModalVisible, fetchData]);

  // Sayfa değişikliğinde sadece sayfa numarasını güncelle (API isteği yok)
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Sayfa boyutu değiştiğinde ilk sayfaya git
    }
  };

  // Modal onay işlemi
  const handleModalOk = () => {
    const selectedData = filteredData.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(fieldName, selectedData.PRS_ISIM);
      setValue(fieldIdName, selectedData.TB_PERSONEL_ID);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  // Seçili personel ID'si değiştiğinde çalışacak effect
  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  // Satır seçimi değiştiğinde çalışacak fonksiyon
  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Personel seçimini temizleme
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

      <Modal title={t("personelTanimlari")} open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1200} centered>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space.Compact style={{ width: "300px", marginBottom: "15px" }}>
            <Input placeholder="Ara..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} allowClear />
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
            dataSource={filteredData}
            loading={loading}
            scroll={{ y: "calc(100vh - 335px)" }}
            pagination={{
              position: ["bottomRight"],
              current: currentPage,
              pageSize,
              total: filteredData.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default PersonelTablo;
