import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, Table, Input, Space, DatePicker, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../api/http";

const DATE_FORMAT = "YYYY-MM-DD";
const DURUM_IDS = [1, 2, 6];
const DISPLAY_DATE_FORMATS = {
  tr: "DD.MM.YYYY",
  az: "DD.MM.YYYY",
  ru: "DD.MM.YYYY",
  en: "MM/DD/YYYY",
};

const SiparisTablo = ({ workshopSelectedId, onSubmit, disabled, name1, isRequired }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { i18n } = useTranslation();

  const displayDateFormat = useMemo(() => {
    const storedLanguage = typeof window !== "undefined" ? localStorage.getItem("i18nextLng") : null;
    const language = (i18n?.language || storedLanguage || "tr").split("-")[0];
    return DISPLAY_DATE_FORMATS[language] || DISPLAY_DATE_FORMATS.tr;
  }, [i18n?.language]);

  // State tanımlamaları
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState(() => dayjs().subtract(3, "month"));
  const [endDate, setEndDate] = useState(() => dayjs());
  const [totalCount, setTotalCount] = useState(0);

  // Form alanı isimleri
  const fieldName = name1;
  const fieldIdName = `${name1}ID`;

  // Tablo kolonları
  const columns = [
    {
      title: "Sipariş Kodu",
      dataIndex: "SSP_SIPARIS_KODU",
      key: "SSP_SIPARIS_KODU",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Sipariş Tarihi",
      dataIndex: "SSP_SIPARIS_TARIHI",
      key: "SSP_SIPARIS_TARIHI",
      width: 150,
      ellipsis: true,
      render: (value) => (value ? dayjs(value).format(displayDateFormat) : "-"),
    },
    {
      title: "Teslim Tarihi",
      dataIndex: "SSP_TESLIM_TARIHI",
      key: "SSP_TESLIM_TARIHI",
      width: 150,
      ellipsis: true,
      render: (value) => (value ? dayjs(value).format(displayDateFormat) : "-"),
    },
    {
      title: "Firma",
      dataIndex: "SSP_FIRMA",
      key: "SSP_FIRMA",
      width: 220,
      ellipsis: true,
    },
    {
      title: "Durum",
      dataIndex: "SSP_DURUM",
      key: "SSP_DURUM",
      width: 160,
      ellipsis: true,
    },
    {
      title: "Başlık",
      dataIndex: "SSP_BASLIK",
      key: "SSP_BASLIK",
      ellipsis: true,
    },
  ];

  const disabledStartDate = (current) => {
    if (!current || !endDate) {
      return false;
    }
    return current.isAfter(endDate, "day");
  };

  const disabledEndDate = (current) => {
    if (!current || !startDate) {
      return false;
    }
    return current.isBefore(startDate, "day");
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
  };

  // Veri çekme fonksiyonu
  const fetchData = useCallback(
    async ({ page = 1, start = startDate, end = endDate, keyword = searchValue } = {}) => {
      if (!start || !end) {
        message.warning("Lütfen başlangıç ve bitiş tarihlerini seçiniz.");
        return;
      }

      setCurrentPage(page);
      setLoading(true);

      try {
        const payload = {
          durumId: DURUM_IDS,
          baslangicTarihi: start.format(DATE_FORMAT),
          bitisTarihi: end.format(DATE_FORMAT),
          kelime: typeof keyword === "string" ? keyword.trim() : "",
        };

        const response = await AxiosInstance.post(`GetSatinalmaSiparisList?pagingDeger=${page}&pageSize=${pageSize}`, payload);

        const list = Array.isArray(response?.siparis_listesi) ? response.siparis_listesi : [];

        setData(
          list.map((item) => ({
            ...item,
            key: item.TB_SATINALMA_SIPARIS_ID,
          }))
        );
        setTotalCount(Number(response?.kayit_sayisi) || list.length);
      } catch (error) {
        console.error("Error fetching purchase order data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchValue, startDate, endDate]
  );

  // Arama işlemi
  const handleSearch = () => {
    fetchData({ page: 1, start: startDate, end: endDate, keyword: searchValue });
  };

  // Modal açma kapama
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
  };

  // Modal açıldığında ve kapandığında çalışacak effect
  useEffect(() => {
    if (isModalVisible) {
      fetchData({ page: 1, start: startDate, end: endDate, keyword: searchValue });
    } else {
      setSearchValue("");
      setCurrentPage(1);
      setSelectedRowKeys([]);
      setStartDate(dayjs().subtract(3, "month"));
      setEndDate(dayjs());
      setData([]);
      setTotalCount(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible]);

  // Sayfa değişikliğinde veri çekme
  const handlePageChange = (page) => {
    fetchData({ page, start: startDate, end: endDate, keyword: searchValue });
  };

  // Modal onay işlemi
  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(fieldName, selectedData.SSP_SIPARIS_KODU || "");
      setValue(fieldIdName, selectedData.TB_SATINALMA_SIPARIS_ID);
      onSubmit?.(selectedData);
    }
    setIsModalVisible(false);
  };

  // Seçili sipariş ID'si değiştiğinde çalışacak effect
  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  // Satır seçimi değiştiğinde çalışacak fonksiyon
  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // Sipariş seçimini temizleme
  const handleMinusClick = () => {
    setValue(fieldName, "");
    setValue(fieldIdName, "");
    setSelectedRowKeys([]);
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
          <Button onClick={handleMinusClick} disabled={disabled}>
            -
          </Button>
        </div>
      </div>

      <Modal title="Satınalma Siparişleri" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} width={1400} centered>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space wrap style={{ width: "100%", marginBottom: "15px" }}>
            <Space.Compact style={{ minWidth: "200px" }}>
              <Input
                placeholder="Ara..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                style={{ width: "100%", maxWidth: "200px" }}
                onPressEnter={handleSearch}
                allowClear
              />
            </Space.Compact>

            <DatePicker
              placeholder="Başlangıç Tarihi"
              format={displayDateFormat}
              value={startDate}
              onChange={handleStartDateChange}
              disabledDate={disabledStartDate}
              allowClear
              style={{ minWidth: "170px" }}
            />
            <DatePicker
              placeholder="Bitiş Tarihi"
              format={displayDateFormat}
              value={endDate}
              onChange={handleEndDateChange}
              disabledDate={disabledEndDate}
              allowClear
              style={{ minWidth: "170px" }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Ara
            </Button>
          </Space>
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
              total: totalCount,
              onChange: handlePageChange,
            }}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default SiparisTablo;
