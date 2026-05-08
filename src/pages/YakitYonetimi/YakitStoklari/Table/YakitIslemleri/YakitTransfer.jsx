import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text, Title } = Typography;

const YakitTransferModal = ({ visible, onClose, onRefresh, selectedRows }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]); // Kaynak için tüm depolar
  const [hedefDepolar, setHedefDepolar] = useState([]); // Filtrelenmiş hedef depolar
  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    HedefDepoId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  // 1. Modal açıldığında ve satır seçildiğinde ilk yükleme
  useEffect(() => {
    if (visible) {
      fetchKaynakDepolar();
      
      const initialKaynakId = (selectedRows && selectedRows.length > 0) 
        ? selectedRows[0].TB_DEPO_ID 
        : null;

      setFormData({ 
        TarihSaat: dayjs(), 
        Miktar: 0, 
        KaynakDepoId: initialKaynakId, 
        HedefDepoId: null, 
        BelgeNo: "", 
        Aciklama: "" 
      });
    }
  }, [visible, selectedRows]);

  // 2. Kaynak depo değiştiğinde hedef depoları filtrele
  useEffect(() => {
    if (formData.KaynakDepoId && depolar.length > 0) {
      // Seçilen kaynak deponun verisini bul
      const secilenKaynak = depolar.find(d => d.value === formData.KaynakDepoId);

      // DÜZELTME: item.YAKIT_TURU_ID yerine map'lediğin isim olan yakitTipId'yi kullanmalısın
      if (secilenKaynak?.yakitTipId) {
        fetchHedefDepolar(secilenKaynak.yakitTipId);
      }
    } else {
      setHedefDepolar([]);
    }
    // Bağımlılığa 'depolar'ı da ekleyelim ki liste yüklendiğinde de tetiklenebilsin
  }, [formData.KaynakDepoId, depolar]);

  const fetchKaynakDepolar = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      
      setDepolar(list.map(item => ({ 
        value: item.TB_DEPO_ID, 
        label: `${item.DEP_KOD} (${item.DEP_TANIM})`,
        yakitTipId: item.YAKIT_TURU_ID // Filtreleme için bunu saklıyoruz
      })));
    } catch (err) { message.error("Tank listesi alınamadı."); }
  };

  const fetchHedefDepolar = async (yakitTipId) => {
    if (!yakitTipId) return;
    try {
      // Kaynak tankın yakıt tipi neyse hedef tank listesi için o filtreyi gönderiyoruz
      const res = await AxiosInstance.post("GetYakitTankList", { 
        LokasyonIds: [], 
        YakitTipIds: [yakitTipId], 
        Durum: 1 
      });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      
      // Kaynak tankın kendisini listeden çıkarıyoruz (Kendine transfer yapamasın)
      setHedefDepolar(list
        .filter(item => item.TB_DEPO_ID !== formData.KaynakDepoId)
        .map(item => ({ 
          value: item.TB_DEPO_ID, 
          label: `${item.DEP_KOD} (${item.DEP_TANIM})` 
        }))
      );
    } catch (err) { console.error("Hedef depolar filtrelenemedi."); }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.KaynakDepoId || !formData.HedefDepoId) return message.error("Eksik bilgi!");
    if (formData.KaynakDepoId === formData.HedefDepoId) return message.error("Kaynak ve hedef aynı olamaz.");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", { ...formData, IslemTipi: "TRANSFER", MakineId: -1, TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss") });
      message.success("Transfer tamamlandı.");
      onClose(); if (onRefresh) onRefresh();
    } catch (error) { message.error("Hata!"); } finally { setLoading(false); }
  };

  return (
    <Modal title={<Title level={5}>Depolar / Tanklar Arası Transfer</Title>} open={visible} onCancel={onClose}
      footer={[<Button key="b" onClick={onClose}>Vazgeç</Button>, <Button key="s" type="primary" style={{backgroundColor: '#1890ff'}} onClick={handleSave} loading={loading}>Transferi Tamamla</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}><Text strong>Kaynak Depo / Tank</Text>
          <Select 
            showSearch
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder="Nereden?" 
            value={formData.KaynakDepoId} 
            onChange={(val) => setFormData({...formData, KaynakDepoId: val, HedefDepoId: null})} // Kaynak değişince hedef sıfırlanmalı
            options={depolar} 
            optionFilterProp="label"
          />
        </Col>
        <Col span={12}><Text strong>Hedef Depo / Tank</Text>
          <Select 
            showSearch
            disabled={!formData.KaynakDepoId} // Kaynak seçilmeden hedef seçilemez
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder={formData.KaynakDepoId ? "Nereye?" : "Önce Kaynak Seçin"} 
            value={formData.HedefDepoId} 
            onChange={(val) => setFormData({...formData, HedefDepoId: val})} 
            options={hedefDepolar} 
            optionFilterProp="label"
          />
        </Col>
        <Col span={12}><Text strong>Miktar (Litre)</Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={12}><Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={24}><Text strong>Açıklama</Text>
          <Input style={{ marginTop: "5px" }} placeholder="Transfer sebebi vb." value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
      </Row>
    </Modal>
  );
};
export default YakitTransferModal;