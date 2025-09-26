import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

const FirmaTablo = ({ workshopSelectedId, onSubmit, onClear, disabled, firmaFieldName = "firma", firmaIdFieldName = "firmaID" }) => {
  const { t } = useTranslation();
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
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Tablo kolonları
  const columns = [
    {
      title: t("company.code", { defaultValue: "Firma Kodu" }),
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
      title: t("company.title", { defaultValue: "Firma Ünvanı" }),
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
      title: t("company.type", { defaultValue: "Firma Tipi" }),
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
      title: t("company.location", { defaultValue: "Lokasyon" }),
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
      title: t("company.city", { defaultValue: "Şehir" }),
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
    AxiosInstance.get(`GetFirmaList?pagingDeger=${currentPage}&search=${debouncedSearchTerm}`)
      .then((response) => {
        const pageSz = response?.pageSize ?? 0;
        const list = Array.isArray(response?.Firma_Liste) ? response.Firma_Liste : [];
        setPageSize(pageSz);
        const fetchedData = list.map((item) => ({
          ...item,
          key: item.TB_CARI_ID,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      })
      .finally(() => setLoading(false));
  }, [debouncedSearchTerm, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Modal açma kapama
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Modal açıldığında ve kapandığında çalışacak effect
  useEffect(() => {
    if (isModalVisible) {
      fetchData();
    } else {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setCurrentPage(1);
      setSelectedRowKeys([]);
    }
  }, [isModalVisible, fetchData]);

  // Fetch when debounced search changes or page changes while modal is open
  useEffect(() => {
    if (isModalVisible) {
      fetchData();
    }
  }, [debouncedSearchTerm, currentPage, isModalVisible, fetchData]);

  // Sayfa değişikliğinde veri çekme
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Modal onay işlemi
  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(firmaFieldName, selectedData.CAR_TANIM);
      setValue(firmaIdFieldName, selectedData.key);
      onSubmit?.(selectedData);
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
    setValue(firmaFieldName, "");
    setValue(firmaIdFieldName, "");
    onClear && onClear();
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={firmaFieldName}
          control={control}
          render={({ field }) => <Input {...field} status={errors[firmaFieldName] ? "error" : ""} type="text" style={{ width: "100%", maxWidth: "630px" }} disabled />}
        />
        <Controller name={firmaIdFieldName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMinusClick}>-</Button>
        </div>
      </div>

      <Modal title={t("company.titleModal", { defaultValue: "Firma Tanımları" })} open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1200} centered>
        <Input
          style={{ width: "300px", marginBottom: "15px" }}
          placeholder={t("search.placeholder", { defaultValue: "Ara..." })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />
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
      </Modal>
    </div>
  );
};

FirmaTablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  firmaFieldName: PropTypes.string,
  firmaIdFieldName: PropTypes.string,
};

export default FirmaTablo;
