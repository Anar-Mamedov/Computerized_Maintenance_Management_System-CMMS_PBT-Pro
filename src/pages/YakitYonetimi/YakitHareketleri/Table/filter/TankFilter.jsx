import React, { useState, useEffect } from "react";
import { Select, Button, Dropdown, Spin, message } from "antd";
import AxiosInstance from "../../../../../api/http";

const { Option } = Select;

const TankFilter = ({ onSubmit }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);

        const payload = {
          LokasyonIds: [],
          YakitTipIds: [],
          Durum: -1 
        };

        // API isteği
        const response = await AxiosInstance.post(`GetYakitTankList`, payload);

        // Düzenleme: API'den dönen response.data kontrol ediliyor
        const tankList = response?.data || []; 
        
        if (Array.isArray(tankList)) {
          const formatted = tankList.map((item) => ({
            value: item.TB_DEPO_ID,
            // JSON'daki DEP_KOD ve DEP_TANIM alanları birleştirildi
            label: `${item.DEP_KOD || ""} - ${item.DEP_TANIM || ""}`,
          }));
          setOptions(formatted);
        }
      } catch (error) {
        console.error("API Error:", error);
        message.error("Depo listesi yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = () => {
    onSubmit(selectedIds);
    setVisible(false);
  };

  const handleClear = () => {
    setSelectedIds([]);
    onSubmit([]);
    setVisible(false);
  };

  const menu = (
    <div style={{ 
      backgroundColor: "white", 
      boxShadow: "0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05)", 
      borderRadius: "8px",
      minWidth: "320px" 
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        padding: "12px", 
        borderBottom: "1px solid #f0f0f0" 
      }}>
        <Button size="small" onClick={handleClear}>Temizle</Button>
        <Button size="small" type="primary" onClick={handleSubmit}>Uygula</Button>
      </div>
      
      <div style={{ padding: "12px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "10px" }}><Spin size="small" /></div>
        ) : (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Depo ara veya seçin..."
            value={selectedIds}
            onChange={(values) => setSelectedIds(values)}
            allowClear
            maxTagCount="responsive"
            // Arama filtresi: label içinde arama yapar
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => menu}
      trigger={["click"]}
      open={visible}
      onOpenChange={(v) => setVisible(v)}
    >
      <Button style={{ display: "inline-flex", alignItems: "center" }}>
        Tüm Depolar
        {selectedIds.length > 0 && (
          <span style={{
            marginLeft: "8px",
            background: "#006cb8",
            borderRadius: "50%",
            minWidth: "18px",
            height: "18px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontSize: "11px",
            fontWeight: "bold"
          }}>
            {selectedIds.length}
          </span>
        )}
      </Button>
    </Dropdown>
  );
};

export default TankFilter;