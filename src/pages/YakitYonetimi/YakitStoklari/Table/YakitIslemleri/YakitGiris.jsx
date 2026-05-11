import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text } = Typography;

const YakitGiris = ({ onClose, onRefresh, selectedRows }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    HedefDepoId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    fetchDepoListesi();
    if (selectedRows?.[0]) {
      setFormData(prev => ({ ...prev, HedefDepoId: selectedRows[0].TB_DEPO_ID }));
    }
  }, [selectedRows]);

  const fetchDepoListesi = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setDepolar(list.map(item => ({ value: item.TB_DEPO_ID, label: `${item.DEP_KOD} (${item.DEP_TANIM})` })));
    } catch (err) { message.error("Liste yüklenemedi."); }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.HedefDepoId) return message.error("Zorunlu alanları doldurun!");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", { 
        ...formData, 
        IslemTipi: "GIRIS", 
        KaynakDepoId: -1, 
        MakineId: -1, 
        TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss") 
      });
      message.success("İşlem başarılı.");
      onRefresh();
      onClose();
    } catch (error) { message.error("Hata!"); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Text strong>İşlem Yapılan Depo / Tank <span style={{color: 'red'}}>*</span></Text>
          <Select 
            style={{ width: "100%", marginTop: "5px" }} 
            options={depolar} 
            value={formData.HedefDepoId}
            onChange={(val) => setFormData({...formData, HedefDepoId: val})}
            showSearch
          />
        </Col>
        <Col span={8}>
          <Text strong>Tarih / Saat <span style={{color: 'red'}}>*</span></Text>
          <DatePicker 
            showTime 
            style={{ width: "100%", marginTop: "5px" }} 
            value={formData.TarihSaat} 
            onChange={(val) => setFormData({...formData, TarihSaat: val})} 
          />
        </Col>
        <Col span={12}>
          <Text strong>Miktar (Litre) <span style={{color: 'red'}}>*</span></Text>
          <InputNumber 
            style={{ width: "100%", marginTop: "5px" }} 
            value={formData.Miktar} 
            onChange={(val) => setFormData({...formData, Miktar: val})} 
            placeholder="0"
          />
        </Col>
        <Col span={12}>
          <Text strong>Belge No</Text>
          <Input 
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder="İrsaliye / Fatura" 
            value={formData.BelgeNo} 
            onChange={(e) => setFormData({...formData, BelgeNo: e.target.value})} 
          />
        </Col>
        <Col span={24}>
          <Text strong>Açıklama</Text>
          <Input.TextArea 
            rows={2} 
            style={{ marginTop: "5px" }} 
            placeholder="Notlar..." 
            value={formData.Aciklama} 
            onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} 
          />
        </Col>
        {/* FOOTER BUTONLARI */}
        <Col span={24} style={{ borderTop: "1px solid #f0f0f0", paddingTop: "15px", textAlign: "right" }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>Vazgeç</Button>
          <Button type="primary" onClick={handleSave} loading={loading} style={{ backgroundColor: "#fa541c", borderColor: "#fa541c" }}>
            Kaydet
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default YakitGiris;