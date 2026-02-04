import React, { useState, useEffect, useCallback } from 'react';
import { Table, Card, Select, Input, Space, Typography, message } from 'antd';
import AxiosInstance from "../../../../api/http";

const { Option } = Select;
const { Text } = Typography;

const YillikTab = ({ search, setSearch, year, jobTypeFilter }) => {
  const [groupBy, setGroupBy] = useState("NEDEN");
  const [metric, setMetric] = useState("SURE");
  const [data, setData] = useState([]);
  const [dynamicHeaders, setDynamicHeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        Yil: year,
        IsEmriTipleri: jobTypeFilter ? [Number(jobTypeFilter)] : [],
        Gruplama: groupBy,
        VeriTipi: metric,
        Arama: search
      };
      const response = await AxiosInstance.post("GetDurusYillikPivot", payload);
      if (response.status_code === 200) {
        setDynamicHeaders(response.headers || []);
        setData(response.data || []);
      }
    } catch (error) {
      message.error("Yıllık veriler alınamadı");
    } finally {
      setLoading(false);
    }
  }, [year, jobTypeFilter, groupBy, metric, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const columns = [
    { title: 'Başlık', dataIndex: 'Baslik', key: 'Baslik', fixed: 'left', width: 160, render: (t) => t },
    ...dynamicHeaders.map(yearHead => ({
      title: String(yearHead),
      dataIndex: String(yearHead),
      key: String(yearHead),
      align: 'right',
      width: 110,
      render: (v) => v || "-"
    })),
    { title: 'Toplam', dataIndex: 'Toplam', key: 'Toplam', fixed: 'right', align: 'right', width: 120, render: (v) => <Text strong>{v}</Text> }
  ];

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex', width: '100%' }}>
      <Card size="small">
        <Space wrap>
          <Input placeholder="Arama..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
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
        </Space>
      </Card>

      {/* Scroll ve Sayfalama Alanı */}
      <Table 
        dataSource={data} 
        columns={columns} 
        loading={loading} 
        scroll={{ x: 1200, y: 'calc(100vh - 520px)' }} // Dinamik dikey scroll eklendi
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

export default YillikTab;