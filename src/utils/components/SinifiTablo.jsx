import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, message, Popconfirm } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
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

export default function SinifiTablo({ workshopSelectedId, onSubmit, disabled }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newInputValue, setNewInputValue] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateRecordId, setUpdateRecordId] = useState(null);

  console.log(selectedRowData);

  const columns = [
    {
      title: "Sınıf Tanımı",
      dataIndex: "SST_TANIM",
      key: "SST_TANIM",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    return AxiosInstance.get(`GetStokSınıf`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_STOK_SINIF_ID,
        }));
        setData(fetchedData);
        setFilteredData1(searchTerm1 ? filteredData1 : fetchedData);
        return fetchedData; // Return the data for chaining
      })
      .catch((error) => {
        console.error("Veri çekme hatası:", error);
        message.error("Veri çekme işlemi başarısız oldu.");
      })
      .finally(() => setLoading(false));
  }, [searchTerm1]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch(); // Fetch fresh data when opening the modal
      setSelectedRowKeys([]);
      setSelectedRowData(null);
      setSearchTerm1("");
      setFilteredData1([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue("sinifTanim", selectedData.SST_TANIM);
      setValue("sinifID", selectedData.key);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
    // Reset selections after closing
    setSelectedRowKeys([]);
    setSelectedRowData(null);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys, selectedRows) => {
    // setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);

    setSelectedRowKeys(selectedKeys);
    // Store the complete data of the selected row
    const selectedData = data.find((item) => item.key === selectedKeys[0]);
    setSelectedRowData(selectedData);
  };

  // Arama işlevselliği için handleSearch fonksiyonları
  const handleSearch1 = (e) => {
    const value = e.target.value;
    setSearchTerm1(value);
    const normalizedSearchTerm = normalizeText(value);
    if (value) {
      const filtered = data.filter((item) =>
        Object.keys(item).some((key) => item[key] && normalizeText(item[key].toString()).toLowerCase().includes(normalizedSearchTerm.toLowerCase()))
      );
      setFilteredData1(filtered);
    } else {
      setFilteredData1(data);
    }
  };

  const handleMinusClick = () => {
    setValue("sinifTanim", "");
    setValue("sinifID", "");
  };

  // Add these functions to handle the new modal
  const handleAddModalToggle = (editMode = false) => {
    if (isAddModalVisible) {
      // Modal kapanıyorsa
      setIsAddModalVisible(false);
      setIsEditMode(false);
      setNewInputValue("");
      setUpdateRecordId(null);
    } else {
      // Modal açılıyorsa
      setIsAddModalVisible(true);
      setIsEditMode(editMode);
      if (!editMode) {
        // Yeni kayıt ekleme
        setNewInputValue("");
        setUpdateRecordId(null);
      }
    }
  };

  const handleAddModalOk = () => {
    // Here you can handle the submission of the new input value
    // For example, make an API call or update state
    Submit();
  };

  const Submit = async () => {
    if (!newInputValue.trim()) {
      message.warning("Lütfen sınıf adı giriniz.");
      return;
    }

    try {
      setLoading(true);
      const Body = {
        TB_STOK_SINIF_ID: isEditMode ? updateRecordId : 0,
        SST_TANIM: newInputValue,
      };

      const response = await AxiosInstance.post("AddUpdateStokSınıf", Body);

      if (response.status_code === 200 || response.status_code === 201) {
        message.success(isEditMode ? "Güncelleme Başarılı." : "Ekleme Başarılı.");
        setIsAddModalVisible(false);
        setIsEditMode(false);
        setNewInputValue("");
        setUpdateRecordId(null); // Reset update ID
        await fetch(); // Tabloyu yenile
      } else if (response.status_code === 401) {
        message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
      } else {
        message.error(isEditMode ? "Güncelleme Başarısız." : "Ekleme Başarısız.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("İşlem başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRowData) {
      try {
        const response = await AxiosInstance.post(`DeleteStokSınıf?TB_STOK_SINIF_ID=${selectedRowData.TB_STOK_SINIF_ID}`);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Silme Başarılı.");
          // Clear selections and update data
          setSelectedRowKeys([]);
          setSelectedRowData(null);
          // Remove the deleted item from the data array
          setData((prevData) => prevData.filter((item) => item.TB_STOK_SINIF_ID !== selectedRowData.TB_STOK_SINIF_ID));
          // Also update filtered data if it exists
          setFilteredData1((prevData) => prevData.filter((item) => item.TB_STOK_SINIF_ID !== selectedRowData.TB_STOK_SINIF_ID));
          fetch(); // Refresh the data from server
        } else {
          message.error("Silme Başarısız.");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        message.error("Silme Başarısız.");
      }
    }
  };

  // Tablo satırına tıklama handler'ı
  const onRow = (record) => ({
    onClick: () => {
      // Güncelleme modalını aç ve verileri set et
      setIsAddModalVisible(true);
      setIsEditMode(true);
      setNewInputValue(record.SST_TANIM);
      // Güncelleme için gerekli ID'yi sakla
      setUpdateRecordId(record.TB_STOK_SINIF_ID); // Yeni state ekle
    },
  });

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name="sinifTanim"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              status={errors.sinifTanim ? "error" : ""}
              type="text" // Set the type to "text" for name input
              style={{ width: "100%", maxWidth: "630px" }}
              disabled
            />
          )}
        />
        <Controller
          name="sinifID"
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
      <Modal width={1200} centered title="Sınıf Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px" }} />
          <div style={{ display: "flex", gap: "5px" }}>
            <Button type="primary" onClick={() => handleAddModalToggle(false)}>
              <PlusOutlined /> Yeni Kayıt
            </Button>
            <Popconfirm title="Silme İşlemi" description="Silmek istediğinizden emin misiniz?" onConfirm={handleDelete} okText="Evet" cancelText="Hayır">
              <Button type="primary" danger disabled={!selectedRowData}>
                <DeleteOutlined />
                Sil
              </Button>
            </Popconfirm>
          </div>
        </div>

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
          loading={loading}
          onRow={onRow}
        />
      </Modal>

      {/* Ekleme/Güncelleme modalı */}
      <Modal title={isEditMode ? "Kayıt Güncelle" : "Yeni Kayıt Ekle"} open={isAddModalVisible} onOk={handleAddModalOk} onCancel={() => handleAddModalToggle()}>
        <Input placeholder="Değer giriniz" value={newInputValue} onChange={(e) => setNewInputValue(e.target.value)} />
      </Modal>
    </div>
  );
}
