import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker } from "antd";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import EkipmanSelect from "./EkipmanSelect";
import AxiosInstance from "../../../../../../api/http";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

const { Text, Link } = Typography;

// Bu iki alan serbest metin degil, ID bazli secim yapar; degerleri liste API'sinin
// kok seviyedeki `lokasyonlar` / `makineler` alanlarina tasinir.
const LOKASYON_ALANI = "lokasyonlar";
const EKIPMAN_ALANI = "makineler";

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

export default function CustomFilter({ onSubmit, baslangicLokasyonIds, baslangicMakineIds }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({}); // Input değerlerini saklamak için bir state kullanıyoruz
  const [filters, setFilters] = useState({});
  const [filterValues, setFilterValues] = useState({});

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // selectboxtan seçilen tarihlerin watch edilmesi ve set edilmesi
  const startDateSelected = watch("startDate");
  const endDateSelected = watch("endDate");

  useEffect(() => {
    if (startDateSelected === null) {
      setStartDate(null);
    } else {
      setStartDate(dayjs(startDateSelected));
    }
    if (endDateSelected === null) {
      setEndDate(null);
    } else {
      setEndDate(dayjs(endDateSelected));
    }
  }, [startDateSelected, endDateSelected]);

  useEffect(() => {
    if ((startDate !== null && endDate !== null) || (startDate === null && endDate === null)) {
      handleSubmit();
    }
  }, [startDate, endDate]);
  // selectboxtan seçilen tarihlerin watch edilmesi ve set edilmesi sonu

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});
  // Lokasyon ve ekipman satirlari serbest metin yerine ID tutar.
  const [idValues, setIdValues] = useState({});

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için bir durum
  const isFilterApplied = newObjectsAdded || filtersExist || startDate || endDate;

  const handleSelectChange = (value, rowId) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [rowId]: value,
    }));
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    // Combine selected values, input values for each row, and date range
    const filterData = rows.reduce((acc, row) => {
      const selectedValue = selectedValues[row.id] || "";

      // Lokasyon/ekipman satirlari ID dizisi uretir; ayni alanda birden fazla satir varsa birlestirilir.
      if (selectedValue === LOKASYON_ALANI || selectedValue === EKIPMAN_ALANI) {
        const ids = idValues[row.id] || [];
        if (ids.length) {
          acc[selectedValue] = [...new Set([...(acc[selectedValue] || []), ...ids])];
        }
        return acc;
      }

      const inputValue = inputValues[`input-${row.id}`] || "";
      if (selectedValue && inputValue) {
        acc[selectedValue] = inputValue;
      }
      return acc;
    }, {});

    // Add date range to the filterData object if dates are selected
    if (startDate) {
      filterData.startDate = startDate.format("YYYY-MM-DD");
    }
    if (endDate) {
      filterData.endDate = endDate.format("YYYY-MM-DD");
    }

    console.log(filterData);
    // You can now submit or process the filterData object as needed.
    onSubmit(filterData);
    setOpen(false);
  };

  const handleCancelClick = (rowId) => {
    setFilters({});
    setIdValues((state) => {
      const kalan = { ...state };
      delete kalan[rowId];
      return kalan;
    });
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowId));

    const filtersRemaining = rows.length > 1;
    setFiltersExist(filtersRemaining);
    if (!filtersRemaining) {
      setNewObjectsAdded(false);
    }
    onSubmit("");
  };

  const handleInputChange = (e, rowId) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`input-${rowId}`]: e.target.value,
    }));
  };

  // Dashboard widget'indan gelindiginde lokasyon ve ekipman filtreleri URL'den gelir.
  // Bu degerler icin otomatik olarak birer filtre satiri acilip secimleri isaretlenir.
  const lokasyonAnahtari = JSON.stringify(baslangicLokasyonIds || []);
  const makineAnahtari = JSON.stringify(baslangicMakineIds || []);

  useEffect(() => {
    const lokasyonIds = JSON.parse(lokasyonAnahtari);
    const makineIds = JSON.parse(makineAnahtari);
    if (!lokasyonIds.length && !makineIds.length) return;

    const yeniSatirlar = [];
    const yeniSecimler = {};
    const yeniIdler = {};

    if (lokasyonIds.length) {
      const satirId = "dashboard-lokasyon";
      yeniSatirlar.push({ id: satirId });
      yeniSecimler[satirId] = LOKASYON_ALANI;
      yeniIdler[satirId] = lokasyonIds;
      setValue(`customFiltreLokasyonID-${satirId}`, lokasyonIds);

      // Modal acilmadan da secili lokasyonun adi gorunsun.
      AxiosInstance.get("GetLokasyonList")
        .then((response) => {
          const adlar = (response || []).filter((item) => lokasyonIds.includes(item.TB_LOKASYON_ID)).map((item) => item.LOK_TANIM);
          if (adlar.length) setValue(`customFiltreLokasyonTanim-${satirId}`, adlar.join(", "));
        })
        .catch((error) => console.error("Lokasyon adı çözülemedi:", error));
    }

    if (makineIds.length) {
      const satirId = "dashboard-ekipman";
      yeniSatirlar.push({ id: satirId });
      yeniSecimler[satirId] = EKIPMAN_ALANI;
      yeniIdler[satirId] = makineIds;
    }

    setRows((prevRows) => {
      const korunanlar = prevRows.filter((row) => !String(row.id).startsWith("dashboard-"));
      return [...yeniSatirlar, ...korunanlar];
    });
    setSelectedValues((state) => ({ ...state, ...yeniSecimler }));
    setIdValues((state) => ({ ...state, ...yeniIdler }));
    setFiltersExist(true);
    setNewObjectsAdded(true);
  }, [lokasyonAnahtari, makineAnahtari, setValue]);

  const handleAddFilterClick = () => {
    const newRow = { id: Date.now() };
    setRows((prevRows) => [...prevRows, newRow]);

    setNewObjectsAdded(true);
    setFiltersExist(true);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [newRow.id]: "", // Set an empty input value for the new row
    }));
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
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
        className={isFilterApplied ? "#ff0000-dot-button" : ""}>
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
        open={open}>
        <div style={{ marginBottom: "20px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" }}>
          <div style={{ marginBottom: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Tarih Aralığı</Text>
          </div>

          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Başlangıç Tarihi"
              value={startDate}
              onChange={setStartDate}
              locale={dayjs.locale("tr")}
            />
            <Text style={{ fontSize: "14px" }}>-</Text>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Bitiş Tarihi"
              value={endDate}
              onChange={setEndDate}
              locale={dayjs.locale("tr")}
            />
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
            }}>
            <Col span={24}>
              <Col
                span={24}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
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
                  onSearch={onSearch}
                  filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                  options={[
                    {
                      value: "isk.ISK_ISIM",
                      label: "Talep Eden",
                    },
                    {
                      value: "kod_departman.KOD_TANIM",
                      label: "Departman",
                    },
                    {
                      value: LOKASYON_ALANI,
                      label: "Lokasyon",
                    },
                    {
                      value: EKIPMAN_ALANI,
                      label: "Ekipman",
                    },
                    {
                      value: "kod_tip.KOD_TANIM",
                      label: "Talep Tipi",
                    },
                    {
                      value: "mkn.MKN_KOD",
                      label: "Makine Kodu",
                    },
                    {
                      value: "mkn.MKN_TANIM",
                      label: "Makine Tanımı",
                    },
                  ]}
                />
                {selectedValues[row.id] === LOKASYON_ALANI ? (
                  // Lokasyon modal olarak acilir; secim TB_LOKASYON_ID uzerinden tutulur.
                  <LokasyonTablo
                    multiple
                    workshopSelectedId={idValues[row.id] || []}
                    lokasyonFieldName={`customFiltreLokasyonTanim-${row.id}`}
                    lokasyonIdFieldName={`customFiltreLokasyonID-${row.id}`}
                    placeholder="Lokasyon Seçin"
                    onSubmit={(secilenler) => setIdValues((state) => ({ ...state, [row.id]: secilenler.map((item) => item.key) }))}
                    onClear={() => setIdValues((state) => ({ ...state, [row.id]: [] }))}
                  />
                ) : selectedValues[row.id] === EKIPMAN_ALANI ? (
                  // Ekipman dashboard'daki gibi aranabilir selectbox; secim TB_MAKINE_ID uzerinden tutulur.
                  <EkipmanSelect value={idValues[row.id] || []} onChange={(ids) => setIdValues((state) => ({ ...state, [row.id]: ids }))} />
                ) : (
                  <Input
                    placeholder="Arama Yap"
                    name={`input-${row.id}`} // Use a unique name for each input based on the row ID
                    value={inputValues[`input-${row.id}`] || ""} // Use the corresponding input value
                    onChange={(e) => handleInputChange(e, row.id)} // Pass the rowId to handleInputChange
                  />
                )}
              </Col>
            </Col>
          </Row>
        ))}
        <Button
          type="primary"
          onClick={handleAddFilterClick}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}>
          <PlusOutlined />
          Filtre ekle
        </Button>
      </Drawer>
    </>
  );
}
