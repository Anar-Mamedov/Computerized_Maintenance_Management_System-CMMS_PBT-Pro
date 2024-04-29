import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import { Controller, useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr"; // For Turkish locale
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import LokasyonTablo from "./components/LokasyonTablo";
import ZamanAraligi from "./components/ZamanAraligi";

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

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function CustomFilter({ onSubmit, isEmpty }) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);

  // Tarih seçimi yapıldığında veya filtreler eklenip kaldırıldığında düğmenin stilini değiştirmek için bir durum
  const isFilterApplied = !isEmpty;

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onCancle = () => {
    setOpen(false);
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
    setValue("timeRange", "all");
    setValue("startDate", null);
    setValue("endDate", null);
    handleSubmit();
  };

  const handleSubmit = () => {
    // Combine selected values, input values for each row, and date range
    const filterData = {};

    // Add date range to the filterData object if dates are selected
    if (watch("startDate")) {
      filterData.startDate = watch("startDate").format("YYYY-MM-DD");
    }
    if (watch("endDate")) {
      filterData.endDate = watch("endDate").format("YYYY-MM-DD");
    }
    if (watch("lokasyonID")) {
      filterData.lokasyonID = watch("lokasyonID");
    }

    console.log(filterData);
    // You can now submit or process the filterData object as needed.
    onSubmit(filterData);
    setOpen(false);
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
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
            <Button onClick={onCancle}>İptal</Button>
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
        width={430}
        placement="right"
        onClose={onClose}
        onCancel={onCancle}
        open={open}>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <StyledDivMedia
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "755px",
            }}>
            <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                <div
                  className="anar"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: "300px",
                    gap: "3px",
                  }}>
                  <Controller
                    name="lokasyonTanim"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "100%", maxWidth: "630px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="lokasyonID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ display: "none" }}
                      />
                    )}
                  />
                  <LokasyonTablo
                    onSubmit={(selectedData) => {
                      setValue("lokasyonTanim", selectedData.LOK_TANIM);
                      setValue("lokasyonID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleLokasyonMinusClick}> - </Button>
                </div>
              </div>
            </div>
          </StyledDivMedia>
          <ZamanAraligi />
          <div
            style={{ marginBottom: "20px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" }}>
            <div style={{ marginBottom: "10px" }}>
              <Text style={{ fontSize: "14px" }}>Tarih Aralığı</Text>
            </div>

            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <Controller
                name="startDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Başlangıç Tarihi"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    locale={dayjs.locale("tr")}
                  />
                )}
              />
              <Text style={{ fontSize: "14px" }}>-</Text>
              <Controller
                name="endDate"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Bitiş Tarihi"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    locale={dayjs.locale("tr")}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
