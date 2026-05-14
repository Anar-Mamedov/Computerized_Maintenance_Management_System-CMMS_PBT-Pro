import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";
import { t } from "i18next";
import PropTypes from "prop-types";

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

export default function AtolyeTablo({ workshopSelectedId, onSubmit, disabled, nameFields = { tanim: "atolyeTanim", id: "atolyeID" }, isRequired, placeholder }) {
  const {
    control,
    watch,
    setValue,
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
      title: "Atölye Kodu",
      dataIndex: "ATL_KOD",
      key: "ATL_KOD",
    },
    {
      title: "Atölye Tanımı",
      dataIndex: "ATL_TANIM",
      key: "ATL_TANIM",
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`AtolyeList`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_ATOLYE_ID,
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
      setValue(nameFields.tanim, selectedData.ATL_TANIM);
      setValue(nameFields.id, selectedData.key);
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
    setValue(nameFields.tanim, "");
    setValue(nameFields.id, "");
  };

  const atolyeValue = watch(nameFields.tanim);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={nameFields.tanim}
          control={control}
          rules={isRequired ? { required: t("alanBosBirakilamaz") } : {}}
          render={({ field }) => (
            <Input
              {...field}
              status={errors[nameFields.tanim] ? "error" : ""}
              type="text"
              style={{ width: "100%" }}
              readOnly
              placeholder={placeholder}
              suffix={
                atolyeValue ? (
                  <CloseOutlined style={{ color: "#8c8c8c", cursor: "pointer", fontSize: "12px" }} onClick={handleMinusClick} />
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
          name={nameFields.id}
          control={control}
          render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />}
        />
      </div>
      <Modal width={1200} centered title={t("atolyeTanimlari", { defaultValue: "Atölye Tanımları" })} open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input placeholder={t("arama", { defaultValue: "Arama..." })} value={searchTerm1} onChange={handleSearch1} style={{ width: "300px", marginBottom: "15px" }} />
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

AtolyeTablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  disabled: PropTypes.bool,
  nameFields: PropTypes.shape({
    tanim: PropTypes.string,
    id: PropTypes.string,
  }),
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
};
