import React, { useEffect, useState } from "react";
import { Modal, Table, Input, message, Button } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http";
import PropTypes from "prop-types";
import { t } from "i18next";

export default function EkipmanTablo({
  onSubmit,
  onClear,
  disabled,
  ekipmanFieldName = "anaEkipmanTanim",
  ekipmanIdFieldName = "anaEkipmanID",
  isRequired = false,
}) {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [allSelectedRows, setAllSelectedRows] = useState([]); // Kodları hafızada tutmak için
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns = [
    { title: "Ekipman Bilgisi", dataIndex: "MKN_TANIM", key: "MKN_TANIM" },
    { title: "Ekipman Kodu", dataIndex: "MKN_KOD", key: "MKN_KOD" },
    { title: "Lokasyon", dataIndex: "MKN_LOKASYON", key: "MKN_LOKASYON" },
  ];

  const fetchMakineler = async (page = pagination.current, keyword = searchTerm) => {
    setLoading(true);
    try {
      const url = `GetMakineFullList?parametre=${keyword}&pagingDeger=${page}&pageSize=${pagination.pageSize}&isAktif=1`;
      const response = await AxiosInstance.post(url);
      
      if (response) {
        const formattedData = (response.makine_listesi || []).map((item) => ({
          ...item,
          key: item.TB_MAKINE_ID,
        }));
        
        setData(formattedData);
        setPagination((prev) => ({
          ...prev,
          current: page,
          total: response.kayit_sayisi || 0,
        }));
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalToggle = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      fetchMakineler(1, "");
    }
  };

  const handleTableChange = (newPagination) => {
    fetchMakineler(newPagination.current, searchTerm);
  };

  const handleSearch = () => {
    fetchMakineler(1, searchTerm);
  };

  const handleModalOk = () => {
    // Seçilenlerin kodlarını virgülle birleştirip inputa yazdırıyoruz
    const selectedCodes = allSelectedRows.map(row => row.MKN_KOD).join(", ");
    
    setValue(ekipmanIdFieldName, selectedRowKeys);
    setValue(ekipmanFieldName, selectedCodes);
    
    if (onSubmit) onSubmit(selectedRowKeys);
    setIsModalVisible(false);
  };

  const handleClear = () => {
    setSelectedRowKeys([]);
    setAllSelectedRows([]);
    setValue(ekipmanFieldName, "");
    setValue(ekipmanIdFieldName, []);
    
    // Çarpıya basınca listeyi temizleyip isteği tetikliyoruz
    if (onClear) onClear();
    if (onSubmit) onSubmit([]); 
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, selectedRows) => {
      setSelectedRowKeys(keys);
      // Farklı sayfalardaki seçimleri koruyarak allSelectedRows güncelleme
      setAllSelectedRows((prevRows) => {
        const otherPagesRows = prevRows.filter(prev => !data.some(d => d.key === prev.key));
        return [...otherPagesRows, ...selectedRows];
      });
    },
    preserveSelectedRowKeys: true,
  };

  const ekipmanValue = watch(ekipmanFieldName);

  return (
    <div style={{ width: "100%" }}>
      <Controller
        name={ekipmanFieldName}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Ekipman Seç"
            status={errors[ekipmanFieldName] ? "error" : ""}
            readOnly
            // Boyut ve genişlik ayarları kaldırıldı, default haline döndü
            suffix={
              ekipmanValue ? (
                <CloseOutlined onClick={handleClear} style={{ cursor: "pointer" }} />
              ) : (
                <PlusOutlined
                  onClick={disabled ? undefined : handleModalToggle}
                  style={{ color: disabled ? "#d9d9d9" : "#0091ff", cursor: disabled ? "not-allowed" : "pointer" }}
                />
              )
            }
          />
        )}
      />

      <Modal
        width="1000px"
        title="Ekipman Seçimi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <Input
            placeholder="Kod veya Tanım ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
            allowClear
          />
          <Button type="primary" onClick={handleSearch}>Ara</Button>
          <div style={{ minWidth: "150px", alignSelf: "center", textAlign: "right" }}>
            <b>{selectedRowKeys.length}</b> seçim yapıldı
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            ...pagination,
            showSizeChanger: false,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          onChange={handleTableChange}
          scroll={{ y: 400 }}
        />
      </Modal>
    </div>
  );
}