import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import KodIDSelectbox from "../../../../../../utils/components/KodIDSelectbox";
import ProsedurTipi from "../../../../../../utils/components/ProsedurTipi";
import ProsedurNedeni from "../../../../../../utils/components/ProsedurNedeni";
import PersonelSelectbox from "../../../../../../utils/components/PersonelSelectbox";
import AtolyeSelectbox from "../../../../../../utils/components/AtolyeSelectbox";
import MasrafMerkeziSelectbox from "../../../../../../utils/components/MasrafMerkeziSelectbox";
import AxiosInstance from "../../../../../../api/http";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

dayjs.locale("tr"); // use Turkish locale

const { Text, Link } = Typography;

const SELECTBOX_FIELDS = {
  "makine_tip.KOD_TANIM": 32501,
  "kod_ozel_11.KOD_TANIM": 50010,
  "kod_ozel_12.KOD_TANIM": 50011,
  "kod_ozel_13.KOD_TANIM": 32822,
  "kod_ozel_14.KOD_TANIM": 32823,
  "kod_ozel_15.KOD_TANIM": 32824,
  "ism.ISM_SONUCLANDIRMA": 32802,
  "makine_durum.KOD_TANIM": 32505,
  "kod_bina.KOD_TANIM": 32954,
  "kod_kat.KOD_TANIM": 32955,
};

const CUSTOM_COMPONENT_MAP = {
  "kod_is_tip.KOD_TANIM": ProsedurTipi,
  "kod_is_nedeni.KOD_TANIM": ProsedurNedeni,
  "prs.PRS_ISIM": PersonelSelectbox,
  "atl.ATL_TANIM": AtolyeSelectbox,
  "msr.MAM_TANIM": MasrafMerkeziSelectbox,
};

const DATE_FIELDS = new Set([
  "ism.ISM_DUZENLEME_TARIH",
  "ism.ISM_PLAN_BASLAMA_TARIH",
  "ism.ISM_PLAN_BITIS_TARIH",
  "ism.ISM_BASLAMA_TARIH",
  "ism.ISM_BITIS_TARIH",
  "ism.ISM_KAPANMA_YDK_TARIH",
  "ism.ISM_IS_TARIH",
]);

const TIME_FIELDS = new Set([
  "ism.ISM_DUZENLEME_SAAT",
  "ism.ISM_PLAN_BASLAMA_SAAT",
  "ism.ISM_PLAN_BITIS_SAAT",
  "ism.ISM_BASLAMA_SAAT",
  "ism.ISM_BITIS_SAAT",
  "ism.ISM_KAPANMA_YDK_SAAT",
]);

const getSelectboxFieldName = (rowId, fieldKey) => `filter-${rowId}-${fieldKey.replace(/[^a-zA-Z0-9]/g, "_")}`;

const CUSTOM_FIELD_LABEL_MAP = {
  "ism.ISM_OZEL_ALAN_1": "OZL_OZEL_ALAN_1",
  "ism.ISM_OZEL_ALAN_2": "OZL_OZEL_ALAN_2",
  "ism.ISM_OZEL_ALAN_3": "OZL_OZEL_ALAN_3",
  "ism.ISM_OZEL_ALAN_4": "OZL_OZEL_ALAN_4",
  "ism.ISM_OZEL_ALAN_5": "OZL_OZEL_ALAN_5",
  "ism.ISM_OZEL_ALAN_6": "OZL_OZEL_ALAN_6",
  "ism.ISM_OZEL_ALAN_7": "OZL_OZEL_ALAN_7",
  "ism.ISM_OZEL_ALAN_8": "OZL_OZEL_ALAN_8",
  "ism.ISM_OZEL_ALAN_9": "OZL_OZEL_ALAN_9",
  "ism.ISM_OZEL_ALAN_10": "OZL_OZEL_ALAN_10",
  "kod_ozel_11.KOD_TANIM": "OZL_OZEL_ALAN_11",
  "kod_ozel_12.KOD_TANIM": "OZL_OZEL_ALAN_12",
  "kod_ozel_13.KOD_TANIM": "OZL_OZEL_ALAN_13",
  "kod_ozel_14.KOD_TANIM": "OZL_OZEL_ALAN_14",
  "kod_ozel_15.KOD_TANIM": "OZL_OZEL_ALAN_15",
  "ism.ISM_OZEL_ALAN_16": "OZL_OZEL_ALAN_16",
  "ism.ISM_OZEL_ALAN_17": "OZL_OZEL_ALAN_17",
  "ism.ISM_OZEL_ALAN_18": "OZL_OZEL_ALAN_18",
  "ism.ISM_OZEL_ALAN_19": "OZL_OZEL_ALAN_19",
  "ism.ISM_OZEL_ALAN_20": "OZL_OZEL_ALAN_20",
};

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
    getValues,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({}); // Input değerlerini saklamak için bir state kullanıyoruz
  const [dateValues, setDateValues] = useState({});
  const [timeValues, setTimeValues] = useState({});
  const [filters, setFilters] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [customFieldNames, setCustomFieldNames] = useState(null);

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

  useEffect(() => {
    const fetchCustomFieldLabels = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI");
        if (response) {
          setCustomFieldNames(response);
        }
      } catch (error) {
        console.error("Özel alan etiketleri alınırken hata oluştu:", error);
      }
    };

    fetchCustomFieldLabels();
  }, []);

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için bir durum
  const isFilterApplied = newObjectsAdded || filtersExist || startDate || endDate;

  const isSelectboxField = (fieldKey) => Boolean(SELECTBOX_FIELDS[fieldKey]);
  const isCustomComponentField = (fieldKey) => Boolean(CUSTOM_COMPONENT_MAP[fieldKey]);
  const isDateField = (fieldKey) => DATE_FIELDS.has(fieldKey);
  const isTimeField = (fieldKey) => TIME_FIELDS.has(fieldKey);

  const clearDynamicField = (rowId, fieldKey) => {
    if (!fieldKey) return;
    if (isSelectboxField(fieldKey) || isCustomComponentField(fieldKey)) {
      const fieldName = getSelectboxFieldName(rowId, fieldKey);
      setValue(fieldName, null);
      setValue(`${fieldName}ID`, null);
    }
    if (isDateField(fieldKey)) {
      setDateValues((prev) => {
        const updated = { ...prev };
        delete updated[rowId];
        return updated;
      });
      setInputValues((prev) => {
        const updated = { ...prev };
        delete updated[`input-${rowId}`];
        return updated;
      });
    }
    if (isTimeField(fieldKey)) {
      setTimeValues((prev) => {
        const updated = { ...prev };
        delete updated[rowId];
        return updated;
      });
      setInputValues((prev) => {
        const updated = { ...prev };
        delete updated[`input-${rowId}`];
        return updated;
      });
    }
  };

  const renderCustomComponent = (rowId, fieldKey) => {
    const Component = CUSTOM_COMPONENT_MAP[fieldKey];
    if (!Component) return null;
    const fieldName = getSelectboxFieldName(rowId, fieldKey);
    return <Component fieldName={fieldName} fieldIdName={`${fieldName}ID`} fieldRequirements={{}} selectStyle={{ width: "100%" }} />;
  };

  const getCustomOptionLabel = (fieldKey, fallbackLabel) => {
    const responseKey = CUSTOM_FIELD_LABEL_MAP[fieldKey];
    if (responseKey && customFieldNames?.[responseKey]) {
      return customFieldNames[responseKey];
    }
    return fallbackLabel;
  };

  const handleSelectChange = (value, rowId) => {
    setSelectedValues((prevSelectedValues) => {
      const prevValue = prevSelectedValues[rowId];
      if (prevValue && prevValue !== value) {
        clearDynamicField(rowId, prevValue);
      }

      return {
        ...prevSelectedValues,
        [rowId]: value,
      };
    });
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const formValues = getValues();
    // Combine selected values, input values for each row, and date range
    const filterData = rows.reduce((acc, row) => {
      const selectedValue = selectedValues[row.id] || "";
      let inputValue = "";

      if (isSelectboxField(selectedValue) || isCustomComponentField(selectedValue)) {
        const fieldName = getSelectboxFieldName(row.id, selectedValue);
        inputValue = formValues?.[fieldName] || "";
      } else {
        inputValue = inputValues[`input-${row.id}`] || "";
      }

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
    const selectedValue = selectedValues[rowId];
    clearDynamicField(rowId, selectedValue);

    setSelectedValues((prevSelectedValues) => {
      const updatedValues = { ...prevSelectedValues };
      delete updatedValues[rowId];
      return updatedValues;
    });

    setInputValues((prevInputValues) => {
      const updatedInputs = { ...prevInputValues };
      delete updatedInputs[`input-${rowId}`];
      return updatedInputs;
    });

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

  const handleDateChange = (value, rowId) => {
    setDateValues((prevDates) => {
      const updated = { ...prevDates };
      if (value) {
        updated[rowId] = value;
      } else {
        delete updated[rowId];
      }
      return updated;
    });
    setInputValues((prevInputValues) => {
      const updated = { ...prevInputValues };
      if (value) {
        updated[`input-${rowId}`] = value.format("YYYY-MM-DD");
      } else {
        delete updated[`input-${rowId}`];
      }
      return updated;
    });
  };

  const handleTimeChange = (value, rowId) => {
    setTimeValues((prevTimes) => {
      const updated = { ...prevTimes };
      if (value) {
        updated[rowId] = value;
      } else {
        delete updated[rowId];
      }
      return updated;
    });
    setInputValues((prevInputValues) => {
      const updated = { ...prevInputValues };
      if (value) {
        updated[`input-${rowId}`] = value.format("HH:mm");
      } else {
        delete updated[`input-${rowId}`];
      }
      return updated;
    });
  };

  const handleAddFilterClick = () => {
    const newRow = { id: Date.now() };
    setRows((prevRows) => [...prevRows, newRow]);

    setNewObjectsAdded(true);
    setFiltersExist(true);
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`input-${newRow.id}`]: "", // Set an empty input value for the new row
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
            <DatePicker style={{ width: "100%" }} placeholder="Başlangıç Tarihi" value={startDate} onChange={setStartDate} locale={dayjs.locale("tr")} />
            <Text style={{ fontSize: "14px" }}>-</Text>
            <DatePicker style={{ width: "100%" }} placeholder="Bitiş Tarihi" value={endDate} onChange={setEndDate} locale={dayjs.locale("tr")} />
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
                  filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
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
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_1", "Özel Alan 1"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_2",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_2", "Özel Alan 2"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_3",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_3", "Özel Alan 3"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_4",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_4", "Özel Alan 4"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_5",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_5", "Özel Alan 5"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_6",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_6", "Özel Alan 6"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_7",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_7", "Özel Alan 7"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_8",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_8", "Özel Alan 8"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_9",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_9", "Özel Alan 9"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_10",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_10", "Özel Alan 10"),
                    },
                    {
                      value: "kod_ozel_11.KOD_TANIM",
                      label: getCustomOptionLabel("kod_ozel_11.KOD_TANIM", "Özel Alan 11"),
                    },
                    {
                      value: "kod_ozel_12.KOD_TANIM",
                      label: getCustomOptionLabel("kod_ozel_12.KOD_TANIM", "Özel Alan 12"),
                    },
                    {
                      value: "kod_ozel_13.KOD_TANIM",
                      label: getCustomOptionLabel("kod_ozel_13.KOD_TANIM", "Özel Alan 13"),
                    },
                    {
                      value: "kod_ozel_14.KOD_TANIM",
                      label: getCustomOptionLabel("kod_ozel_14.KOD_TANIM", "Özel Alan 14"),
                    },
                    {
                      value: "kod_ozel_15.KOD_TANIM",
                      label: getCustomOptionLabel("kod_ozel_15.KOD_TANIM", "Özel Alan 15"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_16",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_16", "Özel Alan 16"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_17",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_17", "Özel Alan 17"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_18",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_18", "Özel Alan 18"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_19",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_19", "Özel Alan 19"),
                    },
                    {
                      value: "ism.ISM_OZEL_ALAN_20",
                      label: getCustomOptionLabel("ism.ISM_OZEL_ALAN_20", "Özel Alan 20"),
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
                      value: "ism.ISM_SAYAC_DEGER",
                      label: "Sayaç Değeri",
                    },
                    {
                      value: "ism.ISM_MAKINE_GUVENLIK_NOTU",
                      label: "Notlar",
                    },
                    {
                      value: "ism.ISM_SONUCLANDIRMA",
                      label: "Sonuç",
                    },
                  ]}
                />
                {isCustomComponentField(selectedValues[row.id]) ? (
                  renderCustomComponent(row.id, selectedValues[row.id])
                ) : isSelectboxField(selectedValues[row.id]) ? (
                  <KodIDSelectbox
                    name1={getSelectboxFieldName(row.id, selectedValues[row.id])}
                    kodID={SELECTBOX_FIELDS[selectedValues[row.id]]}
                    isRequired={false}
                    style={{ width: "100%" }}
                  />
                ) : isDateField(selectedValues[row.id]) ? (
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Tarih Seçiniz"
                    value={dateValues[row.id] || null}
                    format="YYYY-MM-DD"
                    onChange={(value) => handleDateChange(value, row.id)}
                  />
                ) : isTimeField(selectedValues[row.id]) ? (
                  <TimePicker
                    needConfirm={false}
                    style={{ width: "100%" }}
                    placeholder="Saat Seçiniz"
                    value={timeValues[row.id] || null}
                    format="HH:mm"
                    onChange={(value) => handleTimeChange(value, row.id)}
                  />
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
          }}
        >
          <PlusOutlined />
          Filtre ekle
        </Button>
      </Drawer>
    </>
  );
}
