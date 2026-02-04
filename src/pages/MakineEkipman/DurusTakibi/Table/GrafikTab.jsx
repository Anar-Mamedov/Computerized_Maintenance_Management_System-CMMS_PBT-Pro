import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { Line, Column, Pie } from '@ant-design/plots';
import AxiosInstance from "../../../../api/http";

const GrafikTab = ({ search, year, jobTypeFilter }) => {
  const [loading, setLoading] = useState(false);
  const [charts, setCharts] = useState({ line_chart: [], bar_chart: [], pie_chart: [] });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        Yil: year,
        IsEmriTipleri: jobTypeFilter ? [Number(jobTypeFilter)] : [],
        Gruplama: "NEDEN", // Dashboard genelde neden odaklıdır
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
      {/* Kanka buraya height kısıtlaması ve overflowY: 'auto' ekledim. 
          Bu sayede ekran ne kadar küçük olursa olsun grafikler bu alan içinde scroll olur.
      */}
      <div style={{ height: 'calc(100vh - 350px)', overflowY: 'auto', padding: '16px' }}>
        <Row gutter={[16, 16]}>
          {/* Üst Sol: Aylık Trend */}
          <Col xs={24} lg={12}>
            <Card title="Aylık Trend" size="small" className="shadow-sm" style={{ borderRadius: '12px' }}>
              <Line 
                data={charts.line_chart} 
                xField="AyAdi" 
                yField="Deger" 
                smooth 
                point={{ size: 5 }} 
                height={280} // Yüksekliği sabitledik
                autoFit={true}
              />
            </Card>
          </Col>

          {/* Üst Sağ: Duruş Nedenleri */}
          <Col xs={24} lg={12}>
            <Card title="Duruş Nedenleri (Top 10)" size="small" className="shadow-sm" style={{ borderRadius: '12px' }}>
              <Column 
                data={charts.bar_chart} 
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
            <Card title="Ekipman Dağılımı (Top 10)" size="small" className="shadow-sm" style={{ borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Pie 
                  data={charts.pie_chart} 
                  angleField="Deger" 
                  colorField="Etiket" 
                  radius={0.8} 
                  height={350}
                  autoFit={true}
                  label={{ type: 'outer', content: '{name}: {percentage}' }}
                  legend={{ position: 'bottom' }}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default GrafikTab;