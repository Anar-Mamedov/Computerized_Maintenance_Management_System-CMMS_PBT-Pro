import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text, Title } = Typography;

const YakitCikisModal = ({ visible, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    MakineId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    if (visible) {
      fetchDepoListesi();
      setFormData({ TarihSaat: dayjs(), Miktar: 0, KaynakDepoId: null, MakineId: null, BelgeNo: "", Aciklama: "" });
    }
  }, [visible]);

  const fetchDepoListesi = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      if (res && Array.isArray(res)) {
        setDepolar(res.map(item => ({ value: item.TB_DEPO_ID, label: `${item.DEP_KOD} (${item.DEP_TANIM})` })));
      }
    } catch (err) { message.error("Liste yüklenemedi."); }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.KaynakDepoId || !formData.MakineId) return message.error("Lütfen eksik alanları doldurunuz.");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", { ...formData, IslemTipi: "CIKIS", HedefDepoId: -1, TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss") });
      message.success("Çıkış işlemi kaydedildi.");
      onClose(); if (onRefresh) onRefresh();
    } catch (error) { message.error("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <Modal title={<Title level={5}>Yakıt Çıkış</Title>} open={visible} onCancel={onClose}
      footer={[<Button key="b" onClick={onClose}>Vazgeç</Button>, <Button key="s" type="primary" onClick={handleSave} loading={loading}>Kaydet</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}><Text strong>Kaynak Tank</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Seçiniz..." value={formData.KaynakDepoId} onChange={(val) => setFormData({...formData, KaynakDepoId: val})} options={depolar} />
        </Col>
        <Col span={24}><Text strong>Makine / Araç</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Seçiniz..." value={formData.MakineId} onChange={(val) => setFormData({...formData, MakineId: val})}
            options={[{ value: 102, label: "Ekskavatör #E-12" }]} // Makineler APIsi eklenmeli
          />
        </Col>
        <Col span={12}><Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={12}><Text strong>Miktar (Litre)</Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={24}><Text strong>Açıklama</Text>
          <Input style={{ marginTop: "5px" }} value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
      </Row>
    </Modal>
  );
};
export default YakitCikisModal;