import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text } = Typography;

const YakitTransfer = ({ onClose, onRefresh, selectedRows }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]); 
  const [hedefDepolar, setHedefDepolar] = useState([]);
  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    HedefDepoId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    fetchKaynakDepolar();
    const initialKaynakId = (selectedRows && selectedRows.length > 0) ? selectedRows[0].TB_DEPO_ID : null;
    setFormData(prev => ({ ...prev, KaynakDepoId: initialKaynakId }));
  }, [selectedRows]);

  useEffect(() => {
    if (formData.KaynakDepoId && depolar.length > 0) {
      const secilenKaynak = depolar.find(d => d.value === formData.KaynakDepoId);
      if (secilenKaynak?.yakitTipId) {
        fetchHedefDepolar(secilenKaynak.yakitTipId);
      }
    } else {
      setHedefDepolar([]);
    }
  }, [formData.KaynakDepoId, depolar]);

  const fetchKaynakDepolar = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setDepolar(list.map(item => ({ 
        value: item.TB_DEPO_ID, 
        label: `${item.DEP_KOD} (${item.DEP_TANIM})`,
        yakitTipId: item.YAKIT_TURU_ID 
      })));
    } catch (err) { message.error("Tank listesi alınamadı."); }
  };

  const fetchHedefDepolar = async (yakitTipId) => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [yakitTipId], Durum: 1 });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setHedefDepolar(list
        .filter(item => item.TB_DEPO_ID !== formData.KaynakDepoId)
        .map(item => ({ value: item.TB_DEPO_ID, label: `${item.DEP_KOD} (${item.DEP_TANIM})` }))
      );
    } catch (err) { console.error("Hedef depolar filtrelenemedi."); }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.KaynakDepoId || !formData.HedefDepoId) return message.error("Eksik bilgi!");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", { 
        ...formData, 
        IslemTipi: "TRANSFER", 
        MakineId: -1, 
        TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss") 
      });
      message.success("Transfer tamamlandı.");
      onClose(); 
      if (onRefresh) onRefresh();
    } catch (error) { message.error("Hata!"); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <Row gutter={[16, 16]}>
        <Col span={12}><Text strong>Kaynak Depo / Tank <span style={{color: 'red'}}>*</span></Text>
          <Select 
            showSearch
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder="Nereden?" 
            value={formData.KaynakDepoId} 
            onChange={(val) => setFormData({...formData, KaynakDepoId: val, HedefDepoId: null})} 
            options={depolar} 
            optionFilterProp="label"
          />
        </Col>
        <Col span={12}><Text strong>Hedef Depo / Tank <span style={{color: 'red'}}>*</span></Text>
          <Select 
            showSearch
            disabled={!formData.KaynakDepoId}
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder="Nereye?" 
            value={formData.HedefDepoId} 
            onChange={(val) => setFormData({...formData, HedefDepoId: val})} 
            options={hedefDepolar} 
            optionFilterProp="label"
          />
        </Col>
        <Col span={12}><Text strong>Miktar (Litre) <span style={{color: 'red'}}>*</span></Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={12}><Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={24}><Text strong>Açıklama</Text>
          <Input style={{ marginTop: "5px" }} placeholder="Transfer sebebi vb." value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
        <Col span={24} style={{ borderTop: "1px solid #f0f0f0", paddingTop: "15px", textAlign: "right", marginTop: "10px" }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>Vazgeç</Button>
          <Button type="primary" onClick={handleSave} loading={loading} style={{ backgroundColor: "#fa541c", borderColor: "#fa541c" }}>Transferi Tamamla</Button>
        </Col>
      </Row>
    </div>
  );
};

export default YakitTransfer;