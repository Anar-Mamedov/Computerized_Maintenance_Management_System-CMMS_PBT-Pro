import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Card, Select, Input, Button, Space, Typography, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import AxiosInstance from "../../../../api/http";

const { Option } = Select;
const { Text } = Typography;

const months = ["Oca", "Sub", "Mar", "Nis", "May", "Haz", "Tem", "Agu", "Eyl", "Eki", "Kas", "Ara"];

const AylikTab = ({ search, setSearch, year, setYear, jobTypeFilter }) => {
  const [groupBy, setGroupBy] = useState("NEDEN");
  const [metric, setMetric] = useState("SURE");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2010; // İstersen bunu daha eskiye çekebilirsin
    const endYear = currentYear + 1; // Gelecek yılı da ekleyelim
    const years = [];
    for (let i = endYear; i >= startYear; i--) {
      years.push(i);
    }
    return years;
  }, []);

  useEffect(() => {
    if (!year) {
      setYear(new Date().getFullYear());
    }
  }, [year, setYear]);

  const fetchData = useCallback(async () => {
    if (!year) return; // Yıl yoksa boşuna istek atmasın
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { title: 'Başlık', dataIndex: 'Baslik', key: 'Baslik', fixed: 'left', width: 150, render: (t) => t },
    ...months.map(m => ({
      title: m,
      dataIndex: m,
      key: m,
      align: 'right',
      width: 100,
      render: (v) => v > 0 ? (metric === "MALIYET" ? `${v} TL` : `${v} ${metric === "SURE" ? "dk" : ""}`) : "-"
    })),
    { title: 'Toplam', dataIndex: 'Toplam', key: 'Toplam', fixed: 'right', align: 'right', width: 120, render: (v) => <Text strong>{v}</Text> }
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      <Card size="small">
        <Space wrap>
          <Input placeholder="Arama..." prefix={<SearchOutlined />} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
          <Select 
            value={year} 
            onChange={setYear} 
            style={{ width: 100 }}
            placeholder="Yıl Seç"
            showSearch // Kanka çok yıl olursa içinde arama da yapabilirsin
          >
            {yearOptions.map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
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
          <Button icon={<DownloadOutlined />}>İndir</Button>
        </Space>
      </Card>
      
      {/* Scroll ve Sayfalama Alanı */}
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={loading} 
        scroll={{ x: 1300, y: 'calc(100vh - 520px)' }}
        bordered 
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