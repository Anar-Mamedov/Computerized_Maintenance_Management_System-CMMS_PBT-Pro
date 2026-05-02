import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text, Title } = Typography;

const YakitTransferModal = ({ visible, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    HedefDepoId: null,
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    if (visible) {
      fetchDepoListesi();
      setFormData({ TarihSaat: dayjs(), Miktar: 0, KaynakDepoId: null, HedefDepoId: null, BelgeNo: "", Aciklama: "" });
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
    <Modal title={<Title level={5}>Tanklar Arası Transfer</Title>} open={visible} onCancel={onClose}
      footer={[<Button key="b" onClick={onClose}>Vazgeç</Button>, <Button key="s" type="primary" style={{backgroundColor: '#1890ff'}} onClick={handleSave} loading={loading}>Transferi Tamamla</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}><Text strong>Kaynak Tank</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Nereden?" value={formData.KaynakDepoId} onChange={(val) => setFormData({...formData, KaynakDepoId: val})} options={depolar} />
        </Col>
        <Col span={12}><Text strong>Hedef Tank</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Nereye?" value={formData.HedefDepoId} onChange={(val) => setFormData({...formData, HedefDepoId: val})} options={depolar} />
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