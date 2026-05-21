import React, { useState, useEffect } from "react";
import { Select, Button, Popover, Spin } from "antd";
import AxiosInstance from "../../../../../api/http";
import { useFormContext } from "react-hook-form";

const { Option } = Select;

const LocationFilter = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const { setValue, watch } = useFormContext();

  // Ana formda saklanan "LokasyonIds" dizisini anlık olarak izliyoruz kanka
  const currentSelectedIds = watch("LokasyonIds") || [];

  // Lokasyon listesini API'den çekiyoruz
  useEffect(() => {
    if (open) {
      setLoading(true);
      AxiosInstance.get("GetLokasyonList")
        .then((response) => {
          // Axios response kontrolü (response.data veya direkt response olabilir yapına göre)
          const resData = response?.data || response;
          const formattedOptions = resData.map((item) => ({
            key: item.TB_LOKASYON_ID.toString(), // ID'yi string olarak tutuyoruz
            value: item.LOK_TANIM,               // Ekranda görünecek metin
          }));
          setOptions(formattedOptions);
        })
        .catch((error) => {
          console.error("Lokasyon API Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  // Ant Design Select seçimi değiştiğinde çalışacak temiz fonksiyon
  const handleChange = (selectedKeys) => {
    // Seçilen değerleri direkt ID array'i olarak yerel state yerine ana forma yazıyoruz
    setValue("LokasyonIds", selectedKeys);
  };

  const handleSubmit = () => {
    setOpen(false);
  };

  const handleCancelClick = () => {
    // İptal edilirse forma boş array geçiyoruz, böylece payload temiz gidiyor
    setValue("LokasyonIds", []);
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
          // Select'in değer eşlemesini doğrudan ID (key) üzerinden yapıyoruz kanka
          value={currentSelectedIds}
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
          }
        >
          {options.map((option) => (
            // Key alanına ID, value alanına da ID basıyoruz ki onChange'de bize direkt ID array'i dönsün
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
      <Button
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Lokasyon
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

export default LocationFilter;