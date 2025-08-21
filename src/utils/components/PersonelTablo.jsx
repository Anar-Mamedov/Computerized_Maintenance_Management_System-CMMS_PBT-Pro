import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
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

export default function PersonelTablo({ workshopSelectedId, onSubmit, disabled, nameField = "personelTanim", idField = "personelID"}) {
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

  const [searchTerm1, setSearchTerm1] = useState("");
  const [filteredData1, setFilteredData1] = useState([]);

  const columns = [
    {
      title: "Personel Kodu",
      dataIndex: "PRS_PERSONEL_KOD",
      key: "PRS_PERSONEL_KOD",
    },
    {
      title: "İsim",
      dataIndex: "PRS_ISIM",
      key: "PRS_ISIM",
    },
    {
      title: "Unvan",
      dataIndex: "PRS_UNVAN",
      key: "PRS_UNVAN",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`Personel`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_PERSONEL_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
      setSearchTerm1("");
      setFilteredData1(data);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(nameField, selectedData.PRS_ISIM);
      setValue(idField, selectedData.key);
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
    setValue(nameField, "");
    setValue(idField, "");
  };
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
  name={nameField}
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      status={errors[nameField] ? "error" : ""}
      type="text"
      style={{ width: "100%", maxWidth: "630px" }}
      disabled
    />
  )}
/>
        <Controller
  name={idField}
  control={control}
  render={({ field }) => (
    <Input
      {...field}
      type="text"
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
      <Modal width={1200} centered title="Personel Tanımları" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder="Arama..." value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={filteredData1.length > 0 || searchTerm1 ? filteredData1 : data}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
