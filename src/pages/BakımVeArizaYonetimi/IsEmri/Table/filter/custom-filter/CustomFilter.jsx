import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Row,
  Typography,
  Select,
  Space,
  Input,
  DatePicker,
} from "antd";
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
    if (
      (startDate !== null && endDate !== null) ||
      (startDate === null && endDate === null)
    ) {
      handleSubmit();
    }
  }, [startDate, endDate]);
  // selectboxtan seçilen tarihlerin watch edilmesi ve set edilmesi sonu

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için bir durum
  const isFilterApplied =
    newObjectsAdded || filtersExist || startDate || endDate;

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
        <div
          style={{
            marginBottom: "20px",
            border: "1px solid #80808048",
            padding: "15px 10px",
            borderRadius: "8px",
          }}
        >
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
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.label || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={[
                    {
                      value: "ism.ISM_ISEMRI_NO",
                      label: "İş Emri No",
                    },
                    {
                      value: "ism.ISM_NOT",
                      label: "Not",
                    },
                    {
                      value: "ism.ISM_DUZENLEME_TARIH",
                      label: "Düzenleme Tarihi",
                    },
                    {
                      value: "ism.ISM_DUZENLEME_SAAT",
                      label: "Düzenleme Saati",
                    },
                    {
                      value: "ism.ISM_KONU",
                      label: "Konu",
                    },
                    {
                      value: "ism.ISM_PLAN_BASLAMA_TARIH",
                      label: "Planlanan Başlama Tarihi",
                    },
                    {
                      value: "ism.ISM_PLAN_BASLAMA_SAAT",
                      label: "Planlanan Başlama Saati",
                    },
                    {
                      value: "ism.ISM_PLAN_BITIS_TARIH",
                      label: "Planlanan Bitiş Tarihi",
                    },
                    {
                      value: "ism.ISM_PLAN_BITIS_SAAT",
                      label: "Planlanan Bitiş Saati",
                    },
                    {
                      value: "ism.ISM_BASLAMA_TARIH",
                      label: "Başlama Tarihi",
                    },
                    {
                      value: "ism.ISM_BASLAMA_SAAT",
                      label: "Başlama Saati",
                    },
                    {
                      value: "ism.ISM_BITIS_TARIH", // Assuming this should be updated to match the formatted data keys
                      label: "Bitiş Tarihi",
                    },
                    {
                      value: "ism.ISM_BITIS_SAAT", // Assuming this should be updated to match the formatted data keys
                      label: "Bitiş Saati",
                    },
                    {
                      value: "ism.ISM_SURE_CALISMA",
                      label: "İş Süresi",
                    },
                    {
                      value: "ism.ISM_TAMAMLANMA_ORAN",
                      label: "Tamamlama %",
                    },
                    {
                      value: "ism.ISM_GARANTI_KAPSAMINDA",
                      label: "Garanti",
                    },
                    {
                      value: "mkn.MKN_KOD",
                      label: "Makine Kodu",
                    },
                    {
                      value: "mkn.MKN_TANIM",
                      label: "Makine Tanımı",
                    },
                    // {
                    //   value: "MAKINE_PLAKA",
                    //   label: "Makine Plaka",
                    // },
                    {
                      value: "makine_durum.KOD_TANIM",
                      label: "Makine Durum",
                    },
                    {
                      value: "makine_tip.KOD_TANIM",
                      label: "Makine Tip",
                    },
                    {
                      value: "ekp.EKP_TANIM",
                      label: "Ekipman",
                    },
                    {
                      value: "kod_is_tip.KOD_TANIM",
                      label: "İş Tipi",
                    },
                    {
                      value: "kod_is_nedeni.KOD_TANIM",
                      label: "İş Nedeni",
                    },
                    {
                      value: "atl.ATL_TANIM",
                      label: "Atölye",
                    },
                    {
                      value: "tlm.TLM_TANIM",
                      label: "Talimat",
                    },
                    {
                      value: "soc.SOC_TANIM",
                      label: "Öncelik",
                    },
                    {
                      value: "ism.ISM_KAPANMA_YDK_TARIH",
                      label: "Kapanış Tarihi",
                    },
                    {
                      value: "ism.ISM_KAPANMA_YDK_SAAT",
                      label: "Kapanış Saati",
                    },
                    {
                      value: "tkv.TKV_TANIM",
                      label: "Takvim",
                    },
                    {
                      value: "msr.MAM_TANIM",
                      label: "Masraf Merkezi",
                    },
                    {
                      value: "car.CAR_TANIM",
                      label: "Firma",
                    },
                    {
                      value: "ist.IST_KOD", // Assuming this should be "ISM_IS_TALEP_KOD" based on the pattern but keeping original as no exact match
                      label: "İş Talep Kodu",
                    },
                    {
                      value: "isk.ISK_ISIM",
                      label: "İş Talep Eden",
                    },
                    {
                      value: "ism.ISM_IS_TARIH",
                      label: "İş Talep Tarihi",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_1",
                      label: "Özel Alan 1",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_2",
                      label: "Özel Alan 2",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_3",
                      label: "Özel Alan 3",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_4",
                      label: "Özel Alan 4",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_5",
                      label: "Özel Alan 5",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_6",
                      label: "Özel Alan 6",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_7",
                      label: "Özel Alan 7",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_8",
                      label: "Özel Alan 8",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_9",
                      label: "Özel Alan 9",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_10",
                      label: "Özel Alan 10",
                    },
                    {
                      value: "kod_ozel_11.KOD_TANIM",
                      label: "Özel Alan 11",
                    },
                    {
                      value: "kod_ozel_12.KOD_TANIM",
                      label: "Özel Alan 12",
                    },
                    {
                      value: "kod_ozel_13.KOD_TANIM",
                      label: "Özel Alan 13",
                    },
                    {
                      value: "kod_ozel_14.KOD_TANIM",
                      label: "Özel Alan 14",
                    },
                    {
                      value: "kod_ozel_15.KOD_TANIM",
                      label: "Özel Alan 15",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_16",
                      label: "Özel Alan 16",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_17",
                      label: "Özel Alan 17",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_18",
                      label: "Özel Alan 18",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_19",
                      label: "Özel Alan 19",
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_20",
                      label: "Özel Alan 20",
                    },
                    {
                      value: "kod_kat.KOD_TANIM",
                      label: "Bildirilen Kat",
                    },
                    {
                      value: "kod_bina.KOD_TANIM",
                      label: "Bildirilen Bina",
                    },
                    {
                      value: "prs.PRS_ISIM",
                      label: "Personel Adı",
                    },
                    {
                      value: "lok.LOK_TUM_YOL",
                      label: "Tam Lokasyon",
                    },
                    {
                      value: "ism.ISM_SAYAC_DEGER",
                      label: "Sayaç Değeri",
                    },
                    {
                      value: "ism.ISM_MAKINE_GUVENLIK_NOTU",
                      label: "Notlar",
                    },
                  ]}
                />
                <Input
                  placeholder="Arama Yap"
                  name={`input-${row.id}`} // Use a unique name for each input based on the row ID
                  value={inputValues[`input-${row.id}`] || ""} // Use the corresponding input value
                  onChange={(e) => handleInputChange(e, row.id)} // Pass the rowId to handleInputChange
                />
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
          }}
        >
          <PlusOutlined />
          Filtre ekle
        </Button>
      </Drawer>
    </>
  );
}
