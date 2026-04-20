import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker } from "antd";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import "./style.css";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

const { Text } = Typography;

const StyledCloseOutlined = styled(CloseOutlined)`
  svg {
    width: 10px;
    height: 10px;
  }
`;

const CloseButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #80808048;
  cursor: pointer;
`;

export default function CustomFilter({ onSubmit }) {
  const { watch, setValue } = useFormContext();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  // Drawer açıldığında mevcut durumu yedeklemek için state'ler
  const [backupRows, setBackupRows] = useState([]);
  const [backupInputValues, setBackupInputValues] = useState({});
  const [backupSelectedValues, setBackupSelectedValues] = useState({});
  const [backupStartDate, setBackupStartDate] = useState(null);
  const [backupEndDate, setBackupEndDate] = useState(null);

  // Form üzerinden tarihleri direkt olarak izleyelim
  const formStartDate = watch("startDate");
  const formEndDate = watch("endDate");

  // Form üzerindeki tarihlerden component state'ini güncelleyelim
  const [startDate, setStartDate] = useState(formStartDate ? dayjs(formStartDate) : null);
  const [endDate, setEndDate] = useState(formEndDate ? dayjs(formEndDate) : null);

  // Referans değişkenleri
  const initialRenderRef = useRef(true);
  const isUpdatingRef = useRef(false);

  // Component mount edildiğinde initial render flag'ini kaldır
  useEffect(() => {
    initialRenderRef.current = false;
    return () => {};
  }, []);

  // Form üzerindeki tarih değişikliklerini takip edip component state'ini güncelleyelim
  useEffect(() => {
    // İlk render'da veya tarih değişikliği bizim tarafımızdan yapılıyorsa işlem yapma
    if (initialRenderRef.current || isUpdatingRef.current) {
      return;
    }

    if (formStartDate) {
      setStartDate(dayjs(formStartDate));
    } else {
      setStartDate(null);
    }
  }, [formStartDate]);

  useEffect(() => {
    // İlk render'da veya tarih değişikliği bizim tarafımızdan yapılıyorsa işlem yapma
    if (initialRenderRef.current || isUpdatingRef.current) {
      return;
    }

    if (formEndDate) {
      setEndDate(dayjs(formEndDate));
    } else {
      setEndDate(null);
    }
  }, [formEndDate]);

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için durum
  const isFilterApplied = newObjectsAdded || filtersExist || startDate || endDate;

  const handleSelectChange = (value, rowId) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [rowId]: value,
    }));
  };

  const showDrawer = () => {
    // Drawer açılmadan önce mevcut durumu yedekle
    setBackupRows([...rows]);
    setBackupInputValues({ ...inputValues });
    setBackupSelectedValues({ ...selectedValues });
    setBackupStartDate(startDate);
    setBackupEndDate(endDate);

    setOpen(true);
  };

  const onClose = () => {
    // Uygula düğmesine basmadan drawer kapatılırsa, yedeklenen değerlere geri dön
    setRows([...backupRows]);
    setInputValues({ ...backupInputValues });
    setSelectedValues({ ...backupSelectedValues });

    // Form ve component state'inde tarih değerlerini eski haline getir
    isUpdatingRef.current = true;

    // Tarih değerlerini eski haline getir
    setStartDate(backupStartDate);
    setEndDate(backupEndDate);

    // Form değerlerini de güncelle
    setValue("startDate", backupStartDate ? backupStartDate.format("YYYY-MM-DD") : null);
    setValue("endDate", backupEndDate ? backupEndDate.format("YYYY-MM-DD") : null);

    // Filtre durumlarını kontrol et ve güncelle
    const filtersRemaining = backupRows.length > 0;
    setFiltersExist(filtersRemaining);
    setNewObjectsAdded(filtersRemaining);

    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 10);

    setOpen(false);
  };

  const handleSubmit = () => {
    // Drawer kapatılıp filtreler uygulandığında, yeni backup değerlerini kaydet
    setBackupRows([...rows]);
    setBackupInputValues({ ...inputValues });
    setBackupSelectedValues({ ...selectedValues });
    setBackupStartDate(startDate);
    setBackupEndDate(endDate);

    // Filtre verilerini hazırla
    const filterData = rows.reduce((acc, row) => {
      const selectedValue = selectedValues[row.id] || "";
      const inputValue = inputValues[`input-${row.id}`] || "";
      if (selectedValue && inputValue) {
        acc[selectedValue] = inputValue;
      }
      return acc;
    }, {});

    // ZamanAraligi bileşeninden gelen özel bir sinyal (removeDateFilters = true) var mı diye kontrol et
    // Bu sinyal, "Tümü" seçeneği için gelir ve tarih filtrelerinin kaldırılması gerektiğini belirtir
    if (filterData.removeDateFilters) {
      // removeDateFilters özelliğini kaldır, çünkü bu sadece bir sinyal
      delete filterData.removeDateFilters;
    } else {
      // Sadece null olmayan tarihleri ekle
      if (startDate) {
        filterData.startDate = startDate.format("YYYY-MM-DD");
      }

      if (endDate) {
        filterData.endDate = endDate.format("YYYY-MM-DD");
      }
    }

    // Filtreleri uygula ve drawer'ı kapat
    onSubmit(filterData);
    setOpen(false);
  };

  const handleCancelClick = (rowId) => {
    setRows((prevRows) => {
      const newRows = prevRows.filter((row) => row.id !== rowId);
      const filtersRemaining = newRows.length > 0;

      setFiltersExist(filtersRemaining);
      if (!filtersRemaining) {
        setNewObjectsAdded(false);
      }

      return newRows;
    });

    // Temizlenmesi gereken inputValues ve selectedValues'ları temizle
    setInputValues((prev) => {
      const newInputValues = { ...prev };
      delete newInputValues[`input-${rowId}`];
      return newInputValues;
    });

    setSelectedValues((prev) => {
      const newSelectedValues = { ...prev };
      delete newSelectedValues[rowId];
      return newSelectedValues;
    });
  };

  const handleInputChange = (e, rowId) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`input-${rowId}`]: e.target.value,
    }));
  };

  const handleAddFilterClick = () => {
    const newRow = { id: Date.now() };
    setRows((prevRows) => [...prevRows, newRow]);
    setNewObjectsAdded(true);
    setFiltersExist(true);
  };

  // DatePicker değişiklikleri için fonksiyonlar
  const handleStartDateChange = (date) => {
    isUpdatingRef.current = true;
    setStartDate(date);
    // Form değerine de yansıtalım
    setValue("startDate", date ? date.format("YYYY-MM-DD") : null);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 10);
  };

  const handleEndDateChange = (date) => {
    isUpdatingRef.current = true;
    setEndDate(date);
    // Form değerine de yansıtalım
    setValue("endDate", date ? date.format("YYYY-MM-DD") : null);
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 10);
  };

  return (
    <>
      <Button
        onClick={showDrawer}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: isFilterApplied ? "#EBF6FE" : "#ffffffff",
        }}
        className={isFilterApplied ? "#ff0000-dot-button" : ""}
      >
        <FilterOutlined />
        <span style={{ marginRight: "5px" }}>Filtreler</span>
        {isFilterApplied && <span className="blue-dot"></span>}
      </Button>
      <Drawer
        extra={
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              Uygula
            </Button>
          </Space>
        }
        title={
          <span>
            <FilterOutlined style={{ marginRight: "8px" }} /> Filtreler
          </span>
        }
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div style={{ marginBottom: "20px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" }}>
          <div style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Tarih Aralığı</Text>
          </div>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <DatePicker style={{ width: "100%" }} placeholder="Başlangıç Tarihi" value={startDate} onChange={handleStartDateChange} locale={dayjs.locale("tr")} />
            <Text style={{ fontSize: "14px" }}>-</Text>
            <DatePicker style={{ width: "100%" }} placeholder="Bitiş Tarihi" value={endDate} onChange={handleEndDateChange} locale={dayjs.locale("tr")} />
          </div>
        </div>

        {rows.map((row) => (
          <Row
            key={row.id}
            style={{
              marginBottom: "10px",
              border: "1px solid #80808048",
              padding: "15px 10px",
              borderRadius: "8px",
            }}
          >
            <Col span={24}>
              <Col
                span={24}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Yeni Filtre</Text>
                <CloseButton onClick={() => handleCancelClick(row.id)}>
                  <StyledCloseOutlined />
                </CloseButton>
              </Col>
              <Col span={24} style={{ marginBottom: "10px" }}>
                <Select
                  style={{ width: "100%", marginBottom: "10px" }}
                  showSearch
                  placeholder={`Seçim Yap`}
                  optionFilterProp="children"
                  onChange={(value) => handleSelectChange(value, row.id)}
                  value={selectedValues[row.id] || undefined}
                  filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                  options={[
                    {
                      value: "IST_TANIMI",
                      label: "Konu",
                    },
                    {
                      value: "IST_TALEP_EDEN_ADI",
                      label: "Talep Eden",
                    },
                    {
                      value: "IST_MAKINE_TANIM",
                      label: "Makine Tanım",
                    },
                    {
                      value: "IST_ACIKLAMA",
                      label: "Açıklama",
                    },
                  ]}
                />
              </Col>
              <Col span={24}>
                <Input placeholder="Değer girin" value={inputValues[`input-${row.id}`] || ""} onChange={(e) => handleInputChange(e, row.id)} />
              </Col>
            </Col>
          </Row>
        ))}

        <Button onClick={handleAddFilterClick} icon={<PlusOutlined />} style={{ width: "100%" }}>
          Filtre Ekle
        </Button>
      </Drawer>
    </>
  );
}
