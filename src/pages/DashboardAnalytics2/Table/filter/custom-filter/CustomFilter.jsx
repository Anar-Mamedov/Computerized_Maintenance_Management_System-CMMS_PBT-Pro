import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import "./style.css";

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
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({}); // Input değerlerini saklamak için bir state kullanıyoruz
  const [filters, setFilters] = useState({});
  const [filterValues, setFilterValues] = useState({});

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});

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
    // Combine selected values and input values for each row
    const rowData = rows.map((row) => ({
      selectedValue: selectedValues[row.id] || "",
      inputValue: inputValues[`input-${row.id}`] || "",
    }));

    // Filter out rows where both selectedValue and inputValue are empty
    const filteredData = rowData.filter(({ selectedValue, inputValue }) => {
      return selectedValue !== "" || inputValue !== "";
    });

    if (filteredData.length > 0) {
      // Convert the filteredData array to the desired JSON format
      const json = filteredData.reduce((acc, { selectedValue, inputValue }) => {
        return {
          ...acc,
          [selectedValue]: inputValue,
        };
      }, {});

      console.log(json);
      // You can now submit or process the json object as needed.
      onSubmit(json);
    } else {
      // Handle the case where there are no non-empty filters (optional)
      console.log("No filters to submit.");
    }
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
          backgroundColor: newObjectsAdded || filtersExist ? "#EBF6FE" : "#ffffffff",
        }}
        className={newObjectsAdded ? "#ff0000-dot-button" : ""}>
        <FilterOutlined />
        <span style={{ marginRight: "5px" }}>Filtreler</span>
        {newObjectsAdded && <span className="blue-dot"></span>}
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
                      value: "ISM_ISEMRI_NO",
                      label: "İş Emri No",
                    },

                    {
                      value: "ISM_DISARIDAKI_NOT",
                      label: "Not",
                    },
                    {
                      value: "ISM_DUZENLEME_TARIH",
                      label: "Düzenleme Tarihi",
                    },
                    {
                      value: "ISM_DUZENLEME_SAAT",
                      label: "Düzenleme Saati",
                    },
                    {
                      value: "ISM_KONU",
                      label: "Konu",
                    },

                    {
                      value: "ISM_PLAN_BASLAMA_TARIH",
                      label: "Planlanan Başlama Tarihi",
                    },
                    {
                      value: "ISM_PLAN_BASLAMA_SAAT",
                      label: "Planlanan Başlama Saati",
                    },
                    {
                      value: "ISM_PLAN_BITIS_TARIH",
                      label: "Planlanan Bitiş Tarihi",
                    },
                    {
                      value: "ISM_PLAN_BITIS_SAAT",
                      label: "Planlanan Bitiş Saati",
                    },
                    {
                      value: "ISM_BASLAMA_TARIH",
                      label: "Başlama Tarihi",
                    },
                    {
                      value: "ISM_BASLAMA_SAAT",
                      label: "Başlama Saati",
                    },
                    {
                      value: "ISM_BITIS_TARIH",
                      label: "Bitiş Tarihi",
                    },
                    {
                      value: "ISM_BITIS_SAAT",
                      label: "Bitiş Saati",
                    },
                    {
                      value: "ISM_IS_SURESI",
                      label: "İş Süresi",
                    },
                    {
                      value: "ISM_TAMAMLANMA",
                      label: "Tamamlama %",
                    },
                    {
                      value: "ISM_GARANTI",
                      label: "Garanti",
                    },
                    {
                      value: "ISM_MAKINE_KODU",
                      label: "Makine Kodu",
                    },
                    {
                      value: "ISM_MAKINE_TANIMI",
                      label: "Makine Tanımı",
                    },
                    {
                      value: "ISM_MAKINE_PLAKA",
                      label: "Makine Plaka",
                    },
                    {
                      value: "ISM_MAKINE_DURUM",
                      label: "Makine Durum",
                    },
                    {
                      value: "ISM_MAKINE_TIP",
                      label: "Makine Tip",
                    },
                    {
                      value: "ISM_EKIPMAN",
                      label: "Ekipman",
                    },
                    {
                      value: "ISM_IS_TIPI",
                      label: "İş Tipi",
                    },
                    {
                      value: "ISM_IS_NEDENI",
                      label: "İş Nedeni",
                    },
                    {
                      value: "ISM_ATOLYE",
                      label: "Atölye",
                    },
                    {
                      value: "ISM_TALIMAT",
                      label: "Talimat",
                    },
                    {
                      value: "ISM_ONCELIK",
                      label: "Öncelik",
                    },
                    {
                      value: "ISM_KAPANIS_TARIHI",
                      label: "Kapanış Tarihi",
                    },
                    {
                      value: "ISM_KAPANIS_SAATI",
                      label: "Kapanış Saati",
                    },
                    {
                      value: "ISM_TAKVIM",
                      label: "Takvim",
                    },
                    {
                      value: "ISM_MASRAF_MERKEZI",
                      label: "Masraf Merkezi",
                    },
                    {
                      value: "ISM_FIRMA",
                      label: "Firma",
                    },
                    {
                      value: "ISM_IS_TALEP_KOD",
                      label: "İş Talep Kodu",
                    },
                    {
                      value: "ISM_IS_TALEP_EDEN",
                      label: "İş Talep Eden",
                    },
                    {
                      value: "ISM_IS_TALEP_TARIH",
                      label: "İş Talep Tarihi",
                    },
                    {
                      value: "ISM_OZEL_ALAN_1",
                      label: "Özel Alan 1",
                    },
                    {
                      value: "ISM_OZEL_ALAN_2",
                      label: "Özel Alan 2",
                    },
                    {
                      value: "ISM_OZEL_ALAN_3",
                      label: "Özel Alan 3",
                    },
                    {
                      value: "ISM_OZEL_ALAN_4",
                      label: "Özel Alan 4",
                    },
                    {
                      value: "ISM_OZEL_ALAN_5",
                      label: "Özel Alan 5",
                    },
                    {
                      value: "ISM_OZEL_ALAN_6",
                      label: "Özel Alan 6",
                    },
                    {
                      value: "ISM_OZEL_ALAN_7",
                      label: "Özel Alan 7",
                    },
                    {
                      value: "ISM_OZEL_ALAN_8",
                      label: "Özel Alan 8",
                    },
                    {
                      value: "ISM_OZEL_ALAN_9",
                      label: "Özel Alan 9",
                    },
                    {
                      value: "ISM_OZEL_ALAN_10",
                      label: "Özel Alan 10",
                    },
                    {
                      value: "ISM_OZEL_ALAN_11",
                      label: "Özel Alan 11",
                    },
                    {
                      value: "ISM_OZEL_ALAN_12",
                      label: "Özel Alan 12",
                    },
                    {
                      value: "ISM_OZEL_ALAN_13",
                      label: "Özel Alan 13",
                    },
                    {
                      value: "ISM_OZEL_ALAN_14",
                      label: "Özel Alan 14",
                    },
                    {
                      value: "ISM_OZEL_ALAN_15",
                      label: "Özel Alan 15",
                    },
                    {
                      value: "ISM_OZEL_ALAN_16",
                      label: "Özel Alan 16",
                    },
                    {
                      value: "ISM_OZEL_ALAN_17",
                      label: "Özel Alan 17",
                    },
                    {
                      value: "ISM_OZEL_ALAN_18",
                      label: "Özel Alan 18",
                    },
                    {
                      value: "ISM_OZEL_ALAN_19",
                      label: "Özel Alan 19",
                    },
                    {
                      value: "ISM_OZEL_ALAN_20",
                      label: "Özel Alan 20",
                    },
                    {
                      value: "ISM_BILDIRILEN_KAT",
                      label: "Bildirilen Kat",
                    },
                    {
                      value: "ISM_BILDIRILEN_BINA",
                      label: "Bildirilen Bina",
                    },
                    {
                      value: "ISM_PERSONEL_ADI",
                      label: "Personel Adı",
                    },
                    {
                      value: "ISM_TAM_LOKASYON",
                      label: "Tam Lokasyon",
                    },
                    {
                      value: "ISM_GUNCEL_SAYAC_DEGER",
                      label: "Sayaç Değeri",
                    },
                    {
                      value: "ISM_ICERDEKI_NOT",
                      label: "Notlar",
                    },
                    {
                      value: "test",
                      label: "Açıklama",
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
          }}>
          <PlusOutlined />
          Filtre ekle
        </Button>
      </Drawer>
    </>
  );
}
