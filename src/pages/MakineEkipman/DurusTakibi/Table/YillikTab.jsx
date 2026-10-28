import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Card, Select, Button, Space, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import AxiosInstance from "../../../../api/http";
import { pivotSatirlari, pivotuExceleAktar } from "./durusExcel";

const { Option } = Select;
const { Text } = Typography;

// `filtreler`: ust cubuktaki ortak filtreler. Yillik pivot tarih araligini backend'de yok sayar, digerlerini uygular.
const YillikTab = ({ search, year, jobTypeFilter, filtreler }) => {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState("NEDEN");
  const [metric, setMetric] = useState("SURE");
  const [data, setData] = useState([]);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post("GetDurusYillikPivot", istekGovdesi);
      if (response.status_code === 200) {
        setDynamicHeaders(response.headers || []);
        setData(response.data || []);
      }
    } catch (error) {
      message.error("Yıllık veriler alınamadı");
    } finally {
      setLoading(false);
    }
  }, [istekGovdesi]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // "İndir": GetDurusYillikPivotExcel; yil kolonlari yanittaki `headers`'tan (yoksa tablodakilerden) gelir.
  const indir = async () => {
    setIndiriliyor(true);
    try {
      const yanit = await AxiosInstance.post("GetDurusYillikPivotExcel", istekGovdesi);
      const satirlar = pivotSatirlari(yanit, "Baslik");
      if (satirlar.length === 0) {
        message.warning(t("durusTakibi.excel.veriYok"));
        return;
      }
      const yillar = Array.isArray(yanit?.headers) && yanit.headers.length > 0 ? yanit.headers : dynamicHeaders;
      const kolonlar = [
        { baslik: t("durusTakibi.excel.baslik"), alan: "Baslik" },
        ...yillar.map((yil) => ({ baslik: String(yil), alan: String(yil) })),
        { baslik: t("toplam"), alan: "Toplam" },
      ];
      pivotuExceleAktar(satirlar, kolonlar, t("durusTakibi.excel.yillikDosya"));
    } catch (error) {
      console.error("Yıllık pivot Excel'e aktarılamadı:", error);
      message.error(t("hataOlustu"));
    } finally {
      setIndiriliyor(false);
    }
  };

  const columns = [
    { title: 'Başlık', dataIndex: 'Baslik', key: 'Baslik', fixed: 'left', width: 160 },
    // Kanka API'den gelen 'headers' dizisini (yılları) sütuna çeviriyoruz
    ...dynamicHeaders.map(yearHead => ({
      title: String(yearHead),
      dataIndex: String(yearHead),
      key: String(yearHead),
      align: 'right',
      width: 130,
      render: (v) => (v === null || v === undefined || v === "") ? "-" : v
    })),
    { 
      title: 'Toplam', 
      dataIndex: 'Toplam', 
      key: 'Toplam', 
      fixed: 'right', 
      align: 'right', 
      width: 140, 
      render: (v) => <Text strong style={{ color: '#cf1322' }}>{v}</Text> 
    }
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      <Card size="small">
        {/* Arama ust cubuktadir (tum sekmelerde ortak). */}
        <Space wrap>
          <Select value={groupBy} onChange={setGroupBy} style={{ width: 160 }}>
            <Option value="NEDEN">Duruş Nedenleri</Option>
            <Option value="LOKASYON">Lokasyonlar</Option>
            <Option value="EKIPMANTIP">Ekipman Tipi</Option>
            <Option value="MARKA">Markalar</Option>
          </Select>
          <Select value={metric} onChange={setMetric} style={{ width: 140 }}>
            <Option value="SURE">Süre (dk)</Option>
            <Option value="MALIYET">Maliyet</Option>
            <Option value="SAYI">Kayıt Sayısı</Option>
          </Select>
          <Button icon={<DownloadOutlined />} loading={indiriliyor} onClick={indir}>
            {t("indir")}
          </Button>
        </Space>
      </Card>

      {/* Scroll ve Sayfalama Alanı */}
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={loading} 
        scroll={{ x: 1200, y: 'calc(100vh - 520px)' }} // Dinamik dikey scroll eklendi
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

export default YillikTab;