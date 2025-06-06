import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin } from "antd";
import AxiosInstance from "../../../../../api/http";
import { Controller, useFormContext } from "react-hook-form";

const { Option } = Select;

const AtolyeFilter = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const handleChange = (selectedValues) => {
    // Seçilen değerlerin id'lerini kullanarak selectedIds dizisini güncelle
    const newSelectedIds = selectedValues
      .map((value) => {
        const option = options.find((option) => option.value === value);
        return option ? option.key : null;
      })
      .filter((id) => id !== null); // null değerleri filtrele
    setSelectedIds(newSelectedIds);
  };

  useEffect(() => {
    if (open) {
      setLoading(true); // API isteği başladığında loading true yap
      AxiosInstance.get("AtolyeList")
        .then((response) => {
          // API'den gelen veriye göre options dizisini oluştur
          const options = response.map((item) => ({
            key: item.TB_ATOLYE_ID.toString(), // ID değerini key olarak kullan
            value: `${item.ATL_KOD}, ${item.ATL_TANIM}`, // Gösterilecek değer
          }));
          setOptions(options);
          setLoading(false); // API isteği bittiğinde loading false yap
        })
        .catch((error) => {
          console.log("API Error:", error);
          setLoading(false); // Hata durumunda da loading false yap
        });
    }
  }, [open]);

  const handleSubmit = () => {
    // console.log("Selected IDs:", selectedIds);

    setOpen(false);
    // onSubmit(selectedIds); // onSubmit ile id'leri gönder
  };

  useEffect(() => {
    // Seçilen id'leri setValue ile ayarla
    const selectedIdsString = selectedIds.join(",");
    setValue("atolyeIds", selectedIdsString);
  }, [selectedIds]);

  const handleCancelClick = () => {
    setSelectedIds([]);
    setValue("departmanIds", "");
    // console.log(watch("locationIds"));
    setOpen(false);
    // onSubmit([]);
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
          value={selectedIds.map((id) => {
            const option = options.find((option) => option.key === id);
            return option ? option.value : "";
          })}
          onChange={handleChange}
          allowClear
          notFoundContent={
            loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40px",
                }}
              >
                <Spin size="small" />
              </div>
            ) : null
          } // Spin burada gösterilecek
        >
          {options.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.value}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="bottom">
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
          }}
        >
          {selectedIds.length}
        </div>
      </Button>
    </Popover>
  );
};

export default AtolyeFilter;
