import { CloseOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row, Typography, Select, Space, Input, DatePicker, Spin } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import AxiosInstance from "../../../../../../api/http"; // Axios yolunu kontrol et

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.locale("tr");

const { Text } = Typography;

const StyledCloseOutlined = styled(CloseOutlined)`
  svg { width: 10px; height: 10px; }
`;

const CloseButton = styled.div`
  width: 20px; height: 20px; border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  background-color: #80808048; cursor: pointer;
`;

// --- 1. TEDARİKÇİ (FİRMA) SELECT BİLEŞENİ ---
const TedarikciSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchTedarikci = async () => {
    setFetching(true);
    try {
      // Firma API'si
      const response = await AxiosInstance.get(`GetTedarikciList?aktif=1&searchText=&pagingDeger=1&pageSize=500`);
      const data = response.data || []; 
      const mappedOptions = data.map((item) => ({
        value: item.TB_CARI_ID, 
        label: item.CAR_TANIM || item.CARI_ISIM, 
      }));
      setOptions(mappedOptions);
    } catch (error) {
      console.error("Tedarikçi çekme hatası:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchTedarikci(); }, []);

  return (
    <Select
      labelInValue
      showSearch
      value={value && value.value ? value : undefined}
      placeholder="Firma Ara..."
      style={{ width: "100%" }}
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      onChange={onChange}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
      loading={fetching}
      allowClear
    />
  );
};

// --- 2. MALZEME SELECT BİLEŞENİ (INPUT DEĞİL, SELECT!) ---
const MalzemeSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchMalzeme = async () => {
    setFetching(true);
    try {
      // Senin verdiğin Malzeme API'si
      // İstemci tarafında arama rahat olsun diye pageSize'ı 500 yaptım.
      const response = await AxiosInstance.get(`Stok?modulNo=1&pagingDeger=1&pageSize=500&prm=&isAktif=1`);
      
      // API dönüş yapısına göre burayı ayarla (response.data veya response.data.list)
      const data = response.Data || []; 
      
      const mappedOptions = data.map((item) => ({
        value: item.TB_STOK_ID, // ID
        label: item.STK_TANIM || item.STK_ISIM || item.STK_KOD, // Görünen İsim
      }));
      setOptions(mappedOptions);
    } catch (error) {
      console.error("Malzeme çekme hatası:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchMalzeme(); }, []);

  return (
    <Select
      labelInValue
      showSearch
      value={value && value.value ? value : undefined}
      placeholder="Malzeme Ara..."
      style={{ width: "100%" }}
      filterOption={(input, option) => 
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      onChange={onChange}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      options={options}
      loading={fetching}
      allowClear
    />
  );
};

// --- ANA BİLEŞEN ---
export default function CustomFilter({ onSubmit }) {
  const { watch } = useFormContext();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [newObjectsAdded, setNewObjectsAdded] = useState(false);
  const [filtersExist, setFiltersExist] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  const [baslangicTarihi, setbaslangicTarihi] = useState(null);
  const [bitisTarihi, setbitisTarihi] = useState(null);

  const baslangicTarihiSelected = watch("baslangicTarihi");
  const bitisTarihiSelected = watch("bitisTarihi");

  useEffect(() => {
    setbaslangicTarihi(baslangicTarihiSelected ? dayjs(baslangicTarihiSelected) : null);
    setbitisTarihi(bitisTarihiSelected ? dayjs(bitisTarihiSelected) : null);
  }, [baslangicTarihiSelected, bitisTarihiSelected]);

  useEffect(() => {
    if ((baslangicTarihi !== null && bitisTarihi !== null) || (baslangicTarihi === null && bitisTarihi === null)) {
      if(open) handleSubmit(); 
    }
  }, [baslangicTarihi, bitisTarihi]);

  const isFilterApplied = newObjectsAdded || filtersExist || baslangicTarihi || bitisTarihi;

  const handleSelectChange = (value, rowId) => {
    setSelectedValues((prev) => ({ ...prev, [rowId]: value }));
    // Tip değişince input değerini sıfırla
    setInputValues(prev => ({ ...prev, [`input-${rowId}`]: "" }));
  };

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleSubmit = () => {
    const filterData = rows.reduce((acc, row) => {
      const selectedKey = selectedValues[row.id] || ""; 
      const inputValue = inputValues[`input-${row.id}`];

      if (selectedKey && inputValue) {
        // SELECT'ten gelen veri obje ({value: 1, label: 'A'}) olduğu için ID'yi ayıklıyoruz
        if (typeof inputValue === 'object' && inputValue !== null && inputValue.value) {
            acc[selectedKey] = inputValue.value; 
        } else {
            acc[selectedKey] = inputValue; // Normal text (eğer kalırsa)
        }
      }
      return acc;
    }, {});

    if (baslangicTarihi) filterData.baslangicTarihi = baslangicTarihi.format("YYYY-MM-DD");
    if (bitisTarihi) filterData.bitisTarihi = bitisTarihi.format("YYYY-MM-DD");

    onSubmit(filterData);
    setOpen(false);
  };

  const handleCancelClick = (rowId) => {
    setRows((prev) => prev.filter((row) => row.id !== rowId));
    
    const newInputValues = { ...inputValues };
    delete newInputValues[`input-${rowId}`];
    setInputValues(newInputValues);

    const newSelectedValues = { ...selectedValues };
    delete newSelectedValues[rowId];
    setSelectedValues(newSelectedValues);

    if (rows.length <= 1) { 
        setFiltersExist(false);
        setNewObjectsAdded(false);
        onSubmit(""); 
    } else {
        setFiltersExist(true);
    }
  };

  // Generic Input Handler: Hem Event (Input) hem Value (Select) destekler
  const handleGenericInputChange = (valOrEvent, rowId) => {
    let finalValue;
    if (valOrEvent && valOrEvent.target) {
        finalValue = valOrEvent.target.value;
    } else {
        finalValue = valOrEvent;
    }
    setInputValues((prev) => ({ ...prev, [`input-${rowId}`]: finalValue }));
  };

  const handleAddFilterClick = () => {
    const newRow = { id: Date.now() };
    setRows((prev) => [...prev, newRow]);
    setNewObjectsAdded(true);
    setFiltersExist(true);
    setInputValues((prev) => ({ ...prev, [`input-${newRow.id}`]: "" }));
  };

  return (
    <>
      <Button
        onClick={showDrawer}
        style={{ display: "flex", alignItems: "center", backgroundColor: isFilterApplied ? "#EBF6FE" : "#fff" }}
        className={isFilterApplied ? "#ff0000-dot-button" : ""}>
        <FilterOutlined />
        <span style={{ marginRight: "5px" }}>Filtreler</span>
        {isFilterApplied && <span className="blue-dot"></span>}
      </Button>
      <Drawer
        extra={<Space><Button type="primary" onClick={handleSubmit}>Uygula</Button></Space>}
        title={<span><FilterOutlined style={{ marginRight: "8px" }} /> Filtreler</span>}
        placement="right" onClose={onClose} open={open}>
        
        <div style={{ marginBottom: "20px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" }}>
          <div style={{ marginBottom: "10px" }}><Text style={{ fontSize: "14px" }}>Tarih Aralığı</Text></div>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <DatePicker style={{ width: "100%" }} placeholder="Başlangıç" value={baslangicTarihi} onChange={setbaslangicTarihi} locale={dayjs.locale("tr")} />
            <Text>-</Text>
            <DatePicker style={{ width: "100%" }} placeholder="Bitiş" value={bitisTarihi} onChange={setbitisTarihi} locale={dayjs.locale("tr")} />
          </div>
        </div>

        {rows.map((row) => (
          <Row key={row.id} style={{ marginBottom: "10px", border: "1px solid #80808048", padding: "15px 10px", borderRadius: "8px" }}>
            <Col span={24}>
              <Col span={24} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text>Yeni Filtre</Text>
                <CloseButton onClick={() => handleCancelClick(row.id)}><StyledCloseOutlined /></CloseButton>
              </Col>
              <Col span={24} style={{ marginBottom: "10px" }}>
                {/* 1. SEÇİM TÜRÜNÜ BELİRLEME (Firma mı Malzeme mi) */}
                <Select
                  style={{ width: "100%", marginBottom: "10px" }}
                  placeholder={`Seçim Yap`}
                  onChange={(value) => handleSelectChange(value, row.id)}
                  value={selectedValues[row.id] || undefined}
                  options={[
                    { value: "Firma", label: "Firma" },
                    { value: "Malzeme", label: "Malzeme" },
                  ]}
                />
                
                {/* 2. KOŞULLU RENDER KISMI */}
                {selectedValues[row.id] === "Firma" ? (
                    // FİRMA SEÇİLİRSE -> TedarikciSelect
                    <TedarikciSelect 
                        value={inputValues[`input-${row.id}`]}
                        onChange={(val) => handleGenericInputChange(val, row.id)}
                    />
                ) : selectedValues[row.id] === "Malzeme" ? (
                    // MALZEME SEÇİLİRSE -> MalzemeSelect (Input değil!)
                    <MalzemeSelect 
                        value={inputValues[`input-${row.id}`]}
                        onChange={(val) => handleGenericInputChange(val, row.id)}
                    />
                ) : (
                    // HİÇBİRİ SEÇİLMEDİYSE (Varsayılan Input)
                    <Input
                        placeholder="Arama Yap"
                        value={inputValues[`input-${row.id}`] || ""}
                        onChange={(e) => handleGenericInputChange(e, row.id)}
                    />
                )}
                
              </Col>
            </Col>
          </Row>
        ))}
        <Button type="primary" onClick={handleAddFilterClick} style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center" }}>
          <PlusOutlined /> Filtre ekle
        </Button>
      </Drawer>
    </>
  );
}