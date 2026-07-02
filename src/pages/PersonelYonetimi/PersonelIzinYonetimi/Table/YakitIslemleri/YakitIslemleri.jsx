import React, { useState, useEffect } from "react";
import { Modal, Button, Radio, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";

const { Text, Title } = Typography;

const YakitIslemleriModal = ({ visible, onClose, onRefresh }) => {
  const [mode, setMode] = useState("GIRIS");
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]); // Tank listesi burada tutulacak

  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    HedefDepoId: null,
    MakineId: -1,
    BelgeNo: "",
    Aciklama: "",
  });

  // Modal açıldığında tank listesini çek
  useEffect(() => {
    if (visible) {
      fetchDepoListesi();
      setFormData({
        TarihSaat: dayjs(),
        Miktar: 0,
        KaynakDepoId: null,
        HedefDepoId: null,
        MakineId: -1,
        BelgeNo: "",
        Aciklama: "",
      });
      setMode("GIRIS");
    }
  }, [visible]);

  const fetchDepoListesi = async () => {
    try {
      // Gönderdiğin yeni Request Body yapısı
      const payload = {
        LokasyonIds: [],
        YakitTipIds: [],
        Durum: -1 // Sadece aktif tankları getiriyoruz
      };
      
      const res = await AxiosInstance.post("GetYakitTankList", payload);
      if (res && Array.isArray(res)) {
        const options = res.map(item => ({
          value: item.TB_DEPO_ID, // Yeni ID alanı
          label: `${item.DEP_KOD} (${item.DEP_TANIM})`, // Daha açıklayıcı olması için lokasyon ekledim
        }));
        setDepolar(options);
      }
    } catch (err) {
      console.error("Tank listesi çekilemedi:", err);
      message.error("Tank listesi yüklenirken hata oluştu.");
    }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0) return message.error("Lütfen miktar giriniz.");
    if ((mode === "CIKIS" || mode === "TRANSFER") && !formData.KaynakDepoId) return message.error("Kaynak tank seçimi zorunludur.");
    if ((mode === "GIRIS" || mode === "TRANSFER") && !formData.HedefDepoId) return message.error("Hedef tank seçimi zorunludur.");

    setLoading(true);

    const payload = {
      IslemTipi: mode,
      TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss"),
      Miktar: formData.Miktar,
      KaynakDepoId: (mode === "CIKIS" || mode === "TRANSFER") ? formData.KaynakDepoId : -1,
      HedefDepoId: (mode === "GIRIS" || mode === "TRANSFER") ? formData.HedefDepoId : -1,
      MakineId: mode === "CIKIS" ? formData.MakineId : -1,
      BelgeNo: formData.BelgeNo,
      Aciklama: formData.Aciklama,
    };

    try {
      const response = await AxiosInstance.post("AddYakitIslemi", payload);
      if (response.status === "error") {
        message.error(response.message || "İşlem reddedildi.");
      } else {
        message.success("İşlem başarıyla kaydedildi.");
        onClose();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div>
          <Title level={5} style={{ margin: 0 }}>Yakıt İşlemi</Title>
          <Text type="secondary" style={{ fontSize: "12px" }}>Giriş / Çıkış / Transfer</Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Vazgeç</Button>,
        <Button key="submit" type="primary" style={{ backgroundColor: "#ff6d28", borderColor: "#ff6d28" }} loading={loading} onClick={handleSave}>
          Kaydet
        </Button>
      ]}
      width={700}
    >
      <div style={{ marginBottom: "20px", marginTop: "10px" }}>
        <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)} buttonStyle="solid">
          <Radio.Button value="GIRIS" style={mode === "GIRIS" ? { backgroundColor: "#ff6d28", borderColor: "#ff6d28" } : {}}>Giriş</Radio.Button>
          <Radio.Button value="CIKIS" style={mode === "CIKIS" ? { backgroundColor: "#ff6d28", borderColor: "#ff6d28" } : {}}>Çıkış</Radio.Button>
          <Radio.Button value="TRANSFER" style={mode === "TRANSFER" ? { backgroundColor: "#ff6d28", borderColor: "#ff6d28" } : {}}>Transfer</Radio.Button>
        </Radio.Group>
      </div>

      <Row gutter={[16, 16]}>
        {(mode === "CIKIS" || mode === "TRANSFER") && (
          <Col span={mode === "TRANSFER" ? 12 : 16}>
            <Text strong>Yakıtın Alındığı Tank (Kaynak)</Text>
            <Select 
              style={{ width: "100%", marginTop: "5px" }} 
              placeholder="Kaynak seçiniz..."
              value={formData.KaynakDepoId}
              onChange={(val) => setFormData({...formData, KaynakDepoId: val})}
              options={depolar}
            />
          </Col>
        )}

        {(mode === "GIRIS" || mode === "TRANSFER") && (
          <Col span={mode === "TRANSFER" ? 12 : 16}>
            <Text strong>Yakıtın Basıldığı Tank (Hedef)</Text>
            <Select 
              style={{ width: "100%", marginTop: "5px" }} 
              placeholder="Hedef seçiniz..."
              value={formData.HedefDepoId}
              onChange={(val) => setFormData({...formData, HedefDepoId: val})}
              options={depolar}
            />
          </Col>
        )}

        <Col span={8}>
          <Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>

        <Col span={8}>
          <Text strong>Miktar (Litre)</Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} placeholder="0" value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>

        <Col span={8}>
          <Text strong>Belge No</Text>
          <Input style={{ width: "100%", marginTop: "5px" }} placeholder="İrsaliye / Fatura" value={formData.BelgeNo} onChange={(e) => setFormData({...formData, BelgeNo: e.target.value})} />
        </Col>

        {mode === "CIKIS" && (
          <Col span={12}>
            <Text strong>Makine / Araç</Text>
            <Select style={{ width: "100%", marginTop: "5px" }} placeholder="Seçiniz..." value={formData.MakineId} onChange={(val) => setFormData({...formData, MakineId: val})}
              options={[{ value: 102, label: "Ekskavatör #E-12" }]} // Makineler için ayrı api varsa eklenebilir
            />
          </Col>
        )}

        <Col span={mode === "CIKIS" ? 12 : 24}>
          <Text strong>Açıklama</Text>
          <Input style={{ width: "100%", marginTop: "5px" }} placeholder="Notlar..." value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
      </Row>
    </Modal>
  );
};

export default YakitIslemleriModal;