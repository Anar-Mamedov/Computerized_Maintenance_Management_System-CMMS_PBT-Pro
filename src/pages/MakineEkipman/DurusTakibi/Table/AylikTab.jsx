import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Card, Select, Button, Space, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../api/http";
import { pivotSatirlari, pivotuExceleAktar } from "./durusExcel";

const { Option } = Select;
const { Text } = Typography;

const months = ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"];

// `filtreler`: ust cubuktaki ortak filtreler (sure tarihleri, ekipman, ekipman tipi, lokasyon, durus nedeni).
const AylikTab = ({ search, year, setYear, jobTypeFilter, onFilterChange, filtreler }) => {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState("NEDEN");
  const [metric, setMetric] = useState("SURE");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indiriliyor, setIndiriliyor] = useState(false);

  // Tablo ve "İndir" ayni govdeyle istenir.
  const istekGovdesi = useMemo(
    () => ({
      Yil: year,
      IsEmriTipleri: jobTypeFilter ? [Number(jobTypeFilter)] : [],
      Gruplama: groupBy,
      VeriTipi: metric,
      Arama: search,
      ...filtreler,
    }),
    [year, jobTypeFilter, groupBy, metric, search, filtreler]
  );

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
      const response = await AxiosInstance.post("GetDurusAylikPivot", istekGovdesi);
      if (response.status_code === 200) {
        setData(response.data);
      }
    } catch (error) {
      message.error("Aylık veriler alınamadı");
    } finally {
      setLoading(false);
    }
  }, [year, istekGovdesi]);

  // "İndir": GetDurusAylikPivotExcel; sayisal `raw_data` varsa o yazilir (Excel'de toplanabilsin).
  const indir = async () => {
    setIndiriliyor(true);
    try {
      const yanit = await AxiosInstance.post("GetDurusAylikPivotExcel", istekGovdesi);
      const satirlar = pivotSatirlari(yanit, "Baslik");
      if (satirlar.length === 0) {
        message.warning(t("durusTakibi.excel.veriYok"));
        return;
      }
      const kolonlar = [{ baslik: t("durusTakibi.excel.baslik"), alan: "Baslik" }, ...months.map((ay) => ({ baslik: ay, alan: ay })), { baslik: t("toplam"), alan: "Toplam" }];
      pivotuExceleAktar(satirlar, kolonlar, t("durusTakibi.excel.aylikDosya", { yil: year }));
    } catch (error) {
      console.error("Aylık pivot Excel'e aktarılamadı:", error);
      message.error(t("hataOlustu"));
    } finally {
      setIndiriliyor(false);
    }
  };

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
        {/* Arama ust cubuktadir (tum sekmelerde ortak). */}
        <Space wrap>
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
          <Button icon={<DownloadOutlined />} loading={indiriliyor} onClick={indir}>
            {t("indir")}
          </Button>
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