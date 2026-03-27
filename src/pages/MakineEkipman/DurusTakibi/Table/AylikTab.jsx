import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Card, Select, Input, Button, Space, Typography, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import AxiosInstance from "../../../../api/http";

const { Option } = Select;
const { Text } = Typography;

const months = ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"];

const AylikTab = ({ search, setSearch, year, setYear, jobTypeFilter, onFilterChange, body }) => {
  const [groupBy, setGroupBy] = useState("NEDEN");
  const [metric, setMetric] = useState("SURE");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Yıl seçenekleri
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2010;
    const endYear = currentYear + 1;
    const years = [];
    for (let i = endYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  }, []);

  // İlk yüklemede yıl yoksa setle
  useEffect(() => {
    if (!year) {
      setYear(new Date().getFullYear());
    }
  }, [year, setYear]);

  // VERİ ÇEKME FONKSİYONU
  const fetchData = useCallback(async () => {
    if (!year) return;
    setLoading(true);
    try {
      const payload = {
        Yil: year,
        IsEmriTipleri: jobTypeFilter ? [Number(jobTypeFilter)] : [],
        Gruplama: groupBy,
        VeriTipi: metric,
        Arama: search
      };
      const response = await AxiosInstance.post("GetDurusAylikPivot", payload);
      if (response.status_code === 200) {
        setData(response.data);
      }
    } catch (error) {
      message.error("Aylık veriler alınamadı");
    } finally {
      setLoading(false);
    }
  }, [year, jobTypeFilter, groupBy, metric, search]);

  // Sadece fetchData değiştiğinde (yani bağımlılıklar değiştiğinde) tabloyu güncelle
  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  // --- KANKA KRİTİK NOKTA BURASI: Manuel Tetikleyiciler ---
  const triggerCardUpdate = useCallback((valYear) => {
    // Kanka seçilen yıla göre 1 Ocak ve 31 Aralık tarihlerini oluşturuyoruz
    const startDate = `${valYear}-01-01`;
    const endDate = `${valYear}-12-31`;

    onFilterChange?.({ 
      Kelime: search || "", 
      baslangicTarih: startDate, 
      bitisTarih: endDate 
    });
  }, [search, onFilterChange]); // body.filters bağımlılığını çıkardık çünkü artık manuel üretiyoruz

  const handleYearChange = (val) => {
    setYear(val);
    triggerCardUpdate(val); // Yeni seçilen yıla göre 01.01 - 31.12 gönderir
  };

  const handleGroupByChange = (val) => {
    setGroupBy(val);
    triggerCardUpdate(year);
  };

  const handleMetricChange = (val) => {
    setMetric(val);
    triggerCardUpdate(year);
  };

  const columns = [
    { title: 'Başlık', dataIndex: 'Baslik', key: 'Baslik', fixed: 'left', width: 150 },
    ...months.map(m => ({
      title: m,
      dataIndex: m,
      key: m,
      align: 'right',
      width: 120,
      render: (v) => (!v || v === "-") ? "-" : v
    })),
    { 
      title: 'Toplam', 
      dataIndex: 'Toplam', 
      key: 'Toplam', 
      fixed: 'right', 
      align: 'right', 
      width: 130, 
      render: (v) => <Text strong color="#1890ff">{v}</Text> 
    }
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      <Card size="small">
        <Space wrap>
          <Input 
            placeholder="Arama..." 
            prefix={<SearchOutlined />} 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            onPressEnter={() => triggerCardUpdate(year)} // Enter'a basınca kartları da güncelle
            style={{ width: 200 }} 
          />
          <Select 
            value={year} 
            onChange={handleYearChange} // Değişti
            style={{ width: 100 }}
            placeholder="Yıl Seç"
            showSearch
          >
            {yearOptions.map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
          <Select 
            value={groupBy} 
            onChange={handleGroupByChange} // Değişti
            style={{ width: 160 }}
          >
            <Option value="NEDEN">Duruş Nedenleri</Option>
            <Option value="LOKASYON">Lokasyonlar</Option>
            <Option value="EKIPMANTIP">Ekipman Tipi</Option>
            <Option value="MARKA">Markalar</Option>
          </Select>
          <Select 
            value={metric} 
            onChange={handleMetricChange} // Değişti
            style={{ width: 140 }}
          >
            <Option value="SURE">Süre (dk)</Option>
            <Option value="MALIYET">Maliyet</Option>
            <Option value="SAYI">Kayıt Sayısı</Option>
          </Select>
          <Button icon={<DownloadOutlined />}>İndir</Button>
        </Space>
      </Card>
      
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={loading} 
        scroll={{ x: 1300, y: 'calc(100vh - 520px)' }}
        bordered 
        rowKey="Baslik"
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          position: ['bottomRight']
        }}
      />
    </Space>
  );
};

export default AylikTab;