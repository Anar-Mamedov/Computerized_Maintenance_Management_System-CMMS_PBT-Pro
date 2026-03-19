import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, Spin } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import "./style.css";
import AxiosInstance from "../../../../../../api/http";

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

// ID bazlı selectbox kullanan filtre tipleri
const ID_BASED_FILTERS = ["marka", "model", "atolye"];

export default function CustomFilter({ onSubmit }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [filters, setFilters] = useState({});

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});

  // ID bazlı filtreler için çoklu seçim değerleri
  const [selectedIdValues, setSelectedIdValues] = useState({});

  // Dropdown options cache
  const [markaOptions, setMarkaOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [atolyeOptions, setAtolyeOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState({});

  const fetchMarkaOptions = async () => {
    if (markaOptions.length > 0) return;
    setLoadingOptions((prev) => ({ ...prev, marka: true }));
    try {
      const response = await AxiosInstance.get("GetMakineMarks");
      if (response && response.Makine_Marka_List) {
        setMarkaOptions(response.Makine_Marka_List);
      }
    } catch (error) {
      console.error("Error fetching marka data:", error);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, marka: false }));
    }
  };

  const fetchModelOptions = async () => {
    if (modelOptions.length > 0) return;
    setLoadingOptions((prev) => ({ ...prev, model: true }));
    try {
      const response = await AxiosInstance.get("GetMakineModelByMarkaId?markaId=0");
      if (response && response.Makine_Model_List) {
        setModelOptions(response.Makine_Model_List);
      }
    } catch (error) {
      console.error("Error fetching model data:", error);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, model: false }));
    }
  };

  const fetchAtolyeOptions = async () => {
    if (atolyeOptions.length > 0) return;
    setLoadingOptions((prev) => ({ ...prev, atolye: true }));
    try {
      const response = await AxiosInstance.get("AtolyeList");
      if (response) {
        setAtolyeOptions(response);
      }
    } catch (error) {
      console.error("Error fetching atolye data:", error);
    } finally {
      setLoadingOptions((prev) => ({ ...prev, atolye: false }));
    }
  };

  const handleSelectChange = (value, rowId) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [rowId]: value,
    }));
    // Filtre tipi değiştiğinde eski değerleri sıfırla
    setInputValues((prev) => ({ ...prev, [`input-${rowId}`]: "" }));
    setSelectedIdValues((prev) => ({ ...prev, [rowId]: [] }));

    // ID bazlı filtrelerde verileri çek
    if (value === "marka") {
      fetchMarkaOptions();
    } else if (value === "model") {
      fetchModelOptions();
    } else if (value === "atolye") {
      fetchAtolyeOptions();
    }
  };

  const handleIdValueChange = (values, rowId) => {
    setSelectedIdValues((prev) => ({ ...prev, [rowId]: values }));
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const rowData = rows.map((row) => {
      const selectedValue = selectedValues[row.id] || "";
      const isIdBased = ID_BASED_FILTERS.includes(selectedValue);

      if (isIdBased) {
        return {
          selectedValue,
          inputValue: selectedIdValues[row.id] || [],
          isIdBased: true,
        };
      }
      return {
        selectedValue,
        inputValue: inputValues[`input-${row.id}`] || "",
        isIdBased: false,
      };
    });

    const filteredData = rowData.filter(({ selectedValue, inputValue }) => {
      if (!selectedValue) return false;
      if (Array.isArray(inputValue)) return inputValue.length > 0;
      return inputValue !== "";
    });

    if (filteredData.length > 0) {
      const json = filteredData.reduce((acc, { selectedValue, inputValue }) => {
        return {
          ...acc,
          [selectedValue]: inputValue,
        };
      }, {});

      onSubmit(json);
    } else {
      onSubmit("");
    }
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
      [newRow.id]: "",
    }));
  };

  const getIdBasedOptions = (filterType) => {
    if (filterType === "marka") {
      return markaOptions.map((item) => ({
        value: item.TB_MARKA_ID,
        label: item.MRK_MARKA,
      }));
    } else if (filterType === "model") {
      return modelOptions.map((item) => ({
        value: item.TB_MODEL_ID,
        label: item.MDL_MODEL,
      }));
    } else if (filterType === "atolye") {
      return atolyeOptions
        .filter((item) => item?.TB_ATOLYE_ID !== undefined && item?.TB_ATOLYE_ID !== null)
        .map((item) => {
          const name = item?.ATL_TANIM?.trim();
          const code = item?.ATL_KOD?.trim();
          const label = [code, name].filter(Boolean).join(" - ") || name || code || "";
          return {
            value: item.TB_ATOLYE_ID,
            label,
          };
        });
    }
    return [];
  };

  const isLoadingForFilter = (filterType) => {
    if (filterType === "marka") return loadingOptions.marka;
    if (filterType === "model") return loadingOptions.model;
    if (filterType === "atolye") return loadingOptions.atolye;
    return false;
  };

  const fetchOptionsForFilter = (filterType) => {
    if (filterType === "marka") fetchMarkaOptions();
    else if (filterType === "model") fetchModelOptions();
    else if (filterType === "atolye") fetchAtolyeOptions();
  };

  const isFilterApplied = newObjectsAdded || filtersExist;

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
        {rows.map((row) => {
          const currentFilterType = selectedValues[row.id];
          const isIdBased = ID_BASED_FILTERS.includes(currentFilterType);

          return (
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
                    placeholder="Seçim Yap"
                    optionFilterProp="children"
                    onChange={(value) => handleSelectChange(value, row.id)}
                    value={selectedValues[row.id] || undefined}
                    filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                    options={[
                      {
                        value: "mkn.MKN_KOD",
                        label: "Makine Kodu",
                      },
                      {
                        value: "mkn.MKN_TANIM",
                        label: "Makine Tanımı",
                      },
                      {
                        value: "marka",
                        label: "Marka",
                      },
                      {
                        value: "model",
                        label: "Model",
                      },
                      {
                        value: "mkn.MKN_SERI_NO",
                        label: "Seri No",
                      },
                      {
                        value: "atolye",
                        label: "Atölye",
                      },
                    ]}
                  />
                  {/* Text bazlı filtreler için Input */}
                  {currentFilterType && !isIdBased && (
                    <Input
                      placeholder="Arama Yap"
                      name={`input-${row.id}`}
                      value={inputValues[`input-${row.id}`] || ""}
                      onChange={(e) => handleInputChange(e, row.id)}
                    />
                  )}
                  {/* ID bazlı filtreler için çoklu seçim Select */}
                  {currentFilterType && isIdBased && (
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      showSearch
                      allowClear
                      placeholder="Seçim Yapınız"
                      optionFilterProp="label"
                      filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                      value={selectedIdValues[row.id] || []}
                      onChange={(values) => handleIdValueChange(values, row.id)}
                      loading={isLoadingForFilter(currentFilterType)}
                      notFoundContent={isLoadingForFilter(currentFilterType) ? <Spin size="small" /> : null}
                      onDropdownVisibleChange={(dropdownOpen) => {
                        if (dropdownOpen) {
                          fetchOptionsForFilter(currentFilterType);
                        }
                      }}
                      options={getIdBasedOptions(currentFilterType)}
                    />
                  )}
                </Col>
              </Col>
            </Row>
          );
        })}
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
