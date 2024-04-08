import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import dayjs from "dayjs";

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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectedTimeRange, setSelectedTimeRange] = useState("all"); // Varsayılan olarak "Tümü" seçili

  // Create a state variable to store selected values for each row
  const [selectedValues, setSelectedValues] = useState({});

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

  useEffect(() => {
    // Component yüklendiğinde "Tümü" için gerekli işlevi çalıştır
    handleTimeRangeChange("all");
  }, []);

  const handleTimeRangeChange = (value) => {
    let startDate;
    let endDate;

    switch (value) {
      case "all":
        startDate = null;
        endDate = null;
        break;
      case "today":
        startDate = dayjs().subtract(1, "day");
        endDate = dayjs();
        break;
      case "thisWeek":
        startDate = dayjs().subtract(1, "week");
        endDate = dayjs();
        break;
      case "thisMonth":
        startDate = dayjs().subtract(1, "month");
        endDate = dayjs();
        break;
      case "thisYear":
        startDate = dayjs().startOf("year");
        endDate = dayjs();
        break;
      case "lastMonth":
        startDate = dayjs().subtract(1, "month");
        endDate = dayjs();
        break;
      case "last3Months":
        startDate = dayjs().subtract(3, "months");
        endDate = dayjs();
        break;
      case "last6Months":
        startDate = dayjs().subtract(6, "months");
        endDate = dayjs();
        break;
      default:
        startDate = null;
        endDate = null;
    }

    setStartDate(startDate);
    setEndDate(endDate);
    setSelectedTimeRange(value); // Seçili zaman aralığını güncelle
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
            />
            <Text style={{ fontSize: "14px" }}>-</Text>
            <DatePicker style={{ width: "100%" }} placeholder="Bitiş Tarihi" value={endDate} onChange={setEndDate} />
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Text style={{ fontSize: "14px" }}>Zaman Aralığı</Text>
          <Select
            style={{ width: "100%", marginTop: "10px" }}
            value={selectedTimeRange} // Seçili değeri bu şekilde ayarlayın
            placeholder="Seçim Yap"
            onChange={handleTimeRangeChange}
            options={[
              { value: "all", label: "Tümü" },
              { value: "today", label: "Bugün" },
              { value: "thisWeek", label: "Bu Hafta" },
              { value: "thisMonth", label: "Bu Ay" },
              { value: "thisYear", label: "Bu Yıl" },
              { value: "lastMonth", label: "Son 1 Ay" },
              { value: "last3Months", label: "Son 3 Ay" },
              { value: "last6Months", label: "Son 6 Ay" },
            ]}
          />
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
                      value: "IST_TALEP_EDEN_ADI",
                      label: "Talep Eden",
                    },
                    {
                      value: "IST_DEPARTMAN",
                      label: "Departman",
                    },
                    {
                      value: "IST_BILDIREN_LOKASYON",
                      label: "Lokasyon",
                    },
                    {
                      value: "IST_TIP_TANIM",
                      label: "Talep Tipi",
                    },
                    {
                      value: "IST_MAKINE_KOD",
                      label: "Makine Kodu",
                    },
                    {
                      value: "IST_MAKINE_TANIM",
                      label: "Makine Tanımı",
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
