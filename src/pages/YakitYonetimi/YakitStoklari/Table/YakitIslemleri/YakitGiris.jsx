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
    // Finansal Alanlar
    BirimFiyat: 0,
    AraToplam: 0,
    KdvOrani: 20, // Varsayılan %20
    KdvDurum: "Dahil", // "Dahil" veya "Haric"
    KdvTutari: 0,
    GenelToplam: 0,
  });

  // Miktar, Birim Fiyat, KDV Oranı veya KDV Durumu değiştiğinde hesaplamaları otomatik yap
  useEffect(() => {
    const miktar = formData.Miktar || 0;
    const birimFiyat = formData.BirimFiyat || 0;
    const kdvOrani = formData.KdvOrani || 0;
    const kdvDurum = formData.KdvDurum;

    let araToplam = 0;
    let kdvTutari = 0;
    let genelToplam = 0;

    if (kdvDurum === "Dahil") {
      // KDV Dahil Hesaplama
      genelToplam = miktar * birimFiyat;
      araToplam = genelToplam / (1 + kdvOrani / 100);
      kdvTutari = genelToplam - araToplam;
    } else {
      // KDV Hariç Hesaplama
      araToplam = miktar * birimFiyat;
      kdvTutari = araToplam * (kdvOrani / 100);
      genelToplam = araToplam + kdvTutari;
    }

    setFormData((prev) => ({
      ...prev,
      AraToplam: Number(araToplam.toFixed(2)),
      KdvTutari: Number(kdvTutari.toFixed(2)),
      GenelToplam: Number(genelToplam.toFixed(2)),
    }));
  }, [formData.Miktar, formData.BirimFiyat, formData.KdvOrani, formData.KdvDurum]);

  useEffect(() => {
    fetchDepoListesi();
    if (selectedRows?.[0]) {
      setFormData((prev) => ({ ...prev, HedefDepoId: selectedRows[0].TB_DEPO_ID }));
    }
  }, [selectedRows]);

  const fetchDepoListesi = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
      setDepolar(list.map((item) => ({ value: item.TB_DEPO_ID, label: `${item.DEP_KOD} (${item.DEP_TANIM})` })));
    } catch (err) {
      message.error("Liste yüklenemedi.");
    }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.HedefDepoId) return message.error("Zorunlu alanları doldurun!");
    setLoading(true);
    try {
      await AxiosInstance.post("AddYakitIslemi", {
        ...formData,
        IslemTipi: "GIRIS",
        KaynakDepoId: null,
        MakineId: null,
        TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss"),
      });
      message.success("İşlem başarılı.");
      onRefresh();
      onClose();
    } catch (error) {
      message.error("Hata!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <Row gutter={[16, 16]}>
        {/* Üst Satır */}
        <Col span={16}>
          <Text strong>İşlem Yapılan Depo / Tank <span style={{ color: "red" }}>*</span></Text>
          <Select
            style={{ width: "100%", marginTop: "5px" }}
            options={depolar}
            value={formData.HedefDepoId}
            onChange={(val) => setFormData({ ...formData, HedefDepoId: val })}
            showSearch
          />
        </Col>
        <Col span={8}>
          <Text strong>Tarih / Saat <span style={{ color: "red" }}>*</span></Text>
          <DatePicker
            showTime
            style={{ width: "100%", marginTop: "5px" }}
            value={formData.TarihSaat}
            onChange={(val) => setFormData({ ...formData, TarihSaat: val })}
          />
        </Col>

        {/* İkinci Satır */}
        <Col span={8}>
          <Text strong>Miktar (Litre) <span style={{ color: "red" }}>*</span></Text>
          <InputNumber
            style={{ width: "100%", marginTop: "5px" }}
            value={formData.Miktar}
            onChange={(val) => setFormData({ ...formData, Miktar: val })}
            placeholder="0"
          />
        </Col>
        <Col span={8}>
          <Text strong>Belge No</Text>
          <Input
            style={{ width: "100%", marginTop: "5px" }}
            placeholder="İrsaliye / Fatura"
            value={formData.BelgeNo}
            onChange={(e) => setFormData({ ...formData, BelgeNo: e.target.value })}
          />
        </Col>

        {/* GİRİŞ TUTAR BİLGİLERİ PANELİ */}
        <Col span={24}>
          <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px", backgroundColor: "#fbfcfd" }}>
            <div style={{ marginBottom: "12px" }}>
              <Text strong style={{ color: "#262626" }}>Giriş Tutar Bilgileri</Text>
            </div>
            <Row gutter={[12, 12]}>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Birim Fiyat</Text>
                <InputNumber 
                  style={{ width: "100%", marginTop: "4px" }} 
                  value={formData.BirimFiyat} 
                  onChange={(val) => setFormData({ ...formData, BirimFiyat: val })} 
                  placeholder="0.00" 
                />
              </Col>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Ara Toplam</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px" }} value={formData.AraToplam} readOnly placeholder="0.00" />
              </Col>
              <Col span={4}>
                <Text type="secondary" style={{ fontSize: "12px" }}>KDV Oranı (%)</Text>
                <InputNumber 
                  style={{ width: "100%", marginTop: "4px" }} 
                  value={formData.KdvOrani} 
                  onChange={(val) => setFormData({ ...formData, KdvOrani: val })} 
                  placeholder="20" 
                />
              </Col>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>KDV D/H</Text>
                <Select
                  style={{ width: "100%", marginTop: "4px" }}
                  value={formData.KdvDurum}
                  onChange={(val) => setFormData({ ...formData, KdvDurum: val })}
                  options={[
                    { value: "Dahil", label: "Dahil" },
                    { value: "Haric", label: "Hariç" },
                  ]}
                />
              </Col>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>KDV Tutarı</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px" }} value={formData.KdvTutari} readOnly placeholder="0.00" />
              </Col>
              <Col span={8} style={{ marginTop: "8px" }}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Genel Toplam</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px", fontWeight: "bold" }} value={formData.GenelToplam} readOnly placeholder="0.00" />
              </Col>
            </Row>
          </div>
        </Col>

        {/* Açıklama Satırı */}
        <Col span={24}>
          <Text strong>Açıklama</Text>
          <Input.TextArea
            rows={2}
            style={{ marginTop: "5px" }}
            placeholder="Notlar..."
            value={formData.Aciklama}
            onChange={(e) => setFormData({ ...formData, Aciklama: e.target.value })}
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