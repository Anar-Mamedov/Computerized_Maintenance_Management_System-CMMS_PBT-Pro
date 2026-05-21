import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin } from "antd";
import AxiosInstance from "../../../../../api/http";
import { useFormContext } from "react-hook-form";

const { Option } = Select;

const AtolyeFilter = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setValue, watch } = useFormContext();

  // Ana formdaki "AtolyeIds" array'ini dinliyoruz kanka
  const currentSelectedIds = watch("AtolyeIds") || [];

  useEffect(() => {
    if (open) {
      setLoading(true);
      AxiosInstance.get("AtolyeList")
        .then((response) => {
          const resData = response?.data || response;
          const formattedOptions = resData.map((item) => ({
            key: item.TB_ATOLYE_ID.toString(),
            value: `${item.ATL_KOD}, ${item.ATL_TANIM}`,
          }));
          setOptions(formattedOptions);
        })
        .catch((error) => {
          console.error("Atölye API Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  const handleChange = (selectedKeys) => {
    // Doğrudan ID'lerden oluşan array'i "AtolyeIds" alanına set ediyoruz
    setValue("AtolyeIds", selectedKeys);
  };

  const handleSubmit = () => {
    setOpen(false);
  };

  const handleCancelClick = () => {
    setValue("AtolyeIds", []);
    setOpen(false);
  };

  const content = (
    <div style={{ width: "300px" }}>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={handleCancelClick}>İptal</Button>
        <Button type="primary" onClick={handleSubmit}>
          Uygula
        </Button>
      </div>
      <div style={{ padding: "10px" }}>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Ara..."
          value={currentSelectedIds}
          onChange={handleChange}
          allowClear
          notFoundContent={
            loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40px" }}>
                <Spin size="small" />
              </div>
            ) : null
          }
        >
          {options.map((option) => (
            <Option key={option.key} value={option.key}>
              {option.value}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
      <Button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        Atölye
        <div
          style={{
            marginLeft: "5px",
            background: "#006cb8",
            borderRadius: "50%",
            width: "17px",
            height: "17px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "11px"
          }}
        >
          {currentSelectedIds.length}
        </div>
      </Button>
    </Popover>
  );
};

export default AtolyeFilter;