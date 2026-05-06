import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text, Title } = Typography;

const YakitGirisModal = ({ visible, onClose, onRefresh }) => {
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
    if (visible) {
      fetchDepoListesi();
      setFormData({ TarihSaat: dayjs(), Miktar: 0, HedefDepoId: null, BelgeNo: "", Aciklama: "" });
    }
  }, [visible]);

  const fetchDepoListesi = async () => {
  try {
    const res = await AxiosInstance.post("GetYakitTankList", { 
      LokasyonIds: [], 
      YakitTipIds: [], 
      Durum: -1 
    });

    let list = [];

    // 1. İhtimal: Axios standart (res.data.data)
    if (res?.data?.data && Array.isArray(res.data.data)) {
      list = res.data.data;
    } 
    // 2. İhtimal: Interceptor kullanılmış (res.data)
    else if (res?.data && Array.isArray(res.data)) {
      list = res.data;
    }
    // 3. İhtimal: Çok sadeleştirilmiş response (res)
    else if (Array.isArray(res)) {
      list = res;
    }

    if (list.length > 0) {
      setDepolar(list.map(item => ({ 
        value: item.TB_DEPO_ID, 
        label: `${item.DEP_KOD} (${item.DEP_TANIM})` 
      })));
    } else {
      console.warn("Liste boş veya yapılamadı:", res);
    }
    
  } catch (err) { 
    message.error("Tank listesi yüklenemedi."); 
    console.error("Hata detayı:", err);
  }
};

  const handleSave = async () => {
    if (formData.Miktar <= 0) return message.error("Lütfen miktar giriniz.");
    if (!formData.HedefDepoId) return message.error("Hedef tank seçimi zorunludur.");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", { ...formData, IslemTipi: "GIRIS", KaynakDepoId: -1, MakineId: -1, TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss") });
      message.success("Giriş işlemi kaydedildi.");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) { message.error("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <Modal title={<Title level={5}>Yakıt Giriş</Title>} open={visible} onCancel={onClose}
      footer={[<Button key="b" onClick={onClose}>Vazgeç</Button>, <Button key="s" type="primary" loading={loading} onClick={handleSave}>Kaydet</Button>]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}><Text strong>Hedef Tank</Text>
          <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Seçiniz..." value={formData.HedefDepoId} onChange={(val) => setFormData({...formData, HedefDepoId: val})} options={depolar} />
        </Col>
        <Col span={12}><Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={12}><Text strong>Miktar (Litre)</Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={24}><Text strong>Belge No</Text>
          <Input style={{ width: "100%", marginTop: "5px" }} placeholder="Fatura/İrsaliye" value={formData.BelgeNo} onChange={(e) => setFormData({...formData, BelgeNo: e.target.value})} />
        </Col>
        <Col span={24}><Text strong>Açıklama</Text>
          <Input.TextArea rows={2} style={{ marginTop: "5px" }} value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
      </Row>
    </Modal>
  );
};
export default YakitGirisModal;