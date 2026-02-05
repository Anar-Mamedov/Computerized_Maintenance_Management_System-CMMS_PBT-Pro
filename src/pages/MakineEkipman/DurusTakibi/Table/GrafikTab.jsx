import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Spin, message, Select, Space } from 'antd'; // Select ve Space eklendi
import { Line, Column, Pie } from '@ant-design/plots';
import AxiosInstance from "../../../../api/http";

const { Option } = Select;

const GrafikTab = ({ search, year, setYear, jobTypeFilter }) => {
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState({ line_chart: [], bar_chart: [], pie_chart: [] });

  // Kanka yılları dinamik oluşturuyoruz (2010'dan bugüne +1 yıl)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 1; i >= 2010; i--) {
      years.push(i);
    }
    return years;
  }, []);

  const fetchData = useCallback(async () => {
    // Yıl seçili değilse istek atma kanka
    if (!year) return;

    setLoading(true);
    try {
      const payload = {
        Yil: year,
        IsEmriTipleri: jobTypeFilter ? [Number(jobTypeFilter)] : [],
        Gruplama: "NEDEN", 
        VeriTipi: "SURE",
        Arama: search
      };
      const response = await AxiosInstance.post("GetDurusGrafikData", payload);
      if (response.status_code === 200) {
        setCharts(response.data);
      }
    } catch (error) {
      message.error("Grafik verileri alınamadı");
    } finally {
      setLoading(false);
    }
  }, [year, jobTypeFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <Spin spinning={loading}>
      {/* Üst Kısım: Filtre Alanı */}
      <div style={{ marginBottom: '16px', padding: '0 16px' }}>
        <Space>
          <span style={{ fontWeight: 600 }}>Rapor Yılı:</span>
          <Select 
            value={year} 
            onChange={setYear} 
            style={{ width: 120 }}
            placeholder="Yıl Seçin"
            showSearch
          >
            {yearOptions.map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <div style={{ height: 'calc(100vh - 400px)', overflowY: 'auto', padding: '0 16px 16px 16px' }}>
        <Row gutter={[16, 16]}>
          {/* Üst Sol: Aylık Trend */}
          <Col xs={24} lg={12}>
            <Card title="Aylık Trend" size="small" style={{ borderRadius: '12px' }}>
              <Line 
                data={charts.line_chart || []} 
                xField="AyAdi" 
                yField="Deger" 
                smooth 
                point={{ size: 5 }} 
                height={280}
                autoFit={true}
              />
            </Card>
          </Col>

          {/* Üst Sağ: Duruş Nedenleri */}
          <Col xs={24} lg={12}>
            <Card title="Duruş Nedenleri (Top 10)" size="small" style={{ borderRadius: '12px' }}>
              <Column 
                data={charts.bar_chart || []} 
                xField="Etiket" 
                yField="Deger" 
                color="#d32029" 
                height={280}
                autoFit={true}
                label={{ position: 'top', style: { fill: '#666' } }}
              />
            </Card>
          </Col>

          {/* Alt: Ekipman Dağılımı */}
          <Col span={24}>
            <Card title="Ekipman Dağılımı (Top 10)" size="small" style={{ borderRadius: '12px' }}>
              <Pie 
                data={charts.pie_chart || []} 
                angleField="Deger" 
                colorField="Etiket" 
                radius={0.8} 
                height={350}
                autoFit={true}
                label={{ type: 'outer', content: '{name}: {percentage}' }}
                legend={{ position: 'bottom' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default GrafikTab;