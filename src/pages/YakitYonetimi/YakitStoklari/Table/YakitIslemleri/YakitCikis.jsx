import React, { useState, useEffect } from "react";
import { Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";
import MakineTablo from "../../../YakitHareketleri/components/MakineTablo";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

const YakitCikis = ({ onClose, onRefresh, selectedRows }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const { control, watch, setValue, formState: { errors } } = useFormContext();

  const watchMakineId = watch("MakineId");

  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null,
    BelgeNo: "",
    Aciklama: "",
    // Yeni Eklenen Finansal Alanlar
    BirimFiyat: 0,
    AraToplam: 0,
    KdvOrani: 20, // Görseldeki gibi varsayılan 20
    KdvDurum: "Dahil", // Görseldeki gibi "Dahil"
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
      genelToplam = miktar * birimFiyat;
      araToplam = genelToplam / (1 + kdvOrani / 100);
      kdvTutari = genelToplam - araToplam;
    } else {
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
    const initialDepoId = (selectedRows && selectedRows.length > 0) ? selectedRows[0].TB_DEPO_ID : null;
    
    setFormData(prev => ({
      ...prev,
      TarihSaat: dayjs(),
      KaynakDepoId: initialDepoId
    }));

    setValue("MakineId", null);
    setValue("MKN_KOD", "");
  }, [selectedRows, setValue]);

  const fetchDepoListesi = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { LokasyonIds: [], YakitTipIds: [], Durum: -1 });
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
      setDepolar(list.map(item => ({ value: item.TB_DEPO_ID, label: `${item.DEP_KOD} (${item.DEP_TANIM})` })));
    } catch (err) { message.error("Tank listesi yüklenemedi."); }
  };

  const handleSave = async () => {
    if (formData.Miktar <= 0 || !formData.KaynakDepoId) {
      return message.error("Lütfen miktar, tank alanlarını doldurunuz.");
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        MakineId: watchMakineId,
        IslemTipi: "CIKIS",
        HedefDepoId: -1,
        TarihSaat: formData.TarihSaat.format("YYYY-MM-DDTHH:mm:ss")
      };
      await AxiosInstance.post("AddYakitIslemi", payload);
      message.success("Çıkış işlemi kaydedildi.");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) { message.error("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <Row gutter={[16, 16]}>
        {/* Üst Satır: Depo ve Tarih */}
        <Col span={16}>
          <Text strong>İşlem Yapılan Depo / Tank <span style={{color: 'red'}}>*</span></Text>
          <Select 
            style={{ width: "100%", marginTop: "5px" }} 
            showSearch
            optionFilterProp="label"
            value={formData.KaynakDepoId}
            onChange={(val) => setFormData({...formData, KaynakDepoId: val})} 
            options={depolar} 
          />
        </Col>
        <Col span={8}>
          <Text strong>Tarih / Saat <span style={{color: 'red'}}>*</span></Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>

        {/* İkinci Satır: Miktar, Yakıt Tipi ve Belge No */}
        <Col span={8}>
          <Text strong>Miktar (Litre) <span style={{color: 'red'}}>*</span></Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} placeholder="0" />
        </Col>
        <Col span={8}>
          <Text strong>Belge No</Text>
          <Input style={{ width: "100%", marginTop: "5px" }} placeholder="İrsaliye / Fatura" value={formData.BelgeNo} onChange={(e) => setFormData({...formData, BelgeNo: e.target.value})} />
        </Col>

        {/* Makine / Araç Seçimi */}
        <Col span={24}>
          <Text strong>Makine / Araç </Text>
          <MakineTablo control={control} setValue={setValue} makineFieldName="MKN_KOD" makineIdFieldName="MakineId" errors={errors} />
        </Col>

        {/* ÇIKIŞ TUTAR BİLGİLERİ PANELİ (Görseldeki Gri Çerçeveli Alan) */}
        <Col span={24}>
          <div style={{ border: "1px solid #f0f0f0", borderRadius: "8px", padding: "16px", backgroundColor: "#fbfcfd" }}>
            <div style={{ marginBottom: "12px" }}><Text strong style={{ color: "#262626" }}>Çıkış Tutar Bilgileri</Text></div>
            <Row gutter={[12, 12]}>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Birim Fiyat</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px" }} value={formData.BirimFiyat} onChange={(val) => setFormData({...formData, BirimFiyat: val})} placeholder="0.00" />
              </Col>
              <Col span={5}>
                <Text type="secondary" style={{ fontSize: "12px" }}>Ara Toplam</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px" }} value={formData.AraToplam} readOnly placeholder="0.00" />
              </Col>
              <Col span={4}>
                <Text type="secondary" style={{ fontSize: "12px" }}>KDV Oranı (%)</Text>
                <InputNumber style={{ width: "100%", marginTop: "4px" }} value={formData.KdvOrani} onChange={(val) => setFormData({...formData, KdvOrani: val})} placeholder="20" />
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
          <Input.TextArea rows={2} style={{ marginTop: "5px" }} placeholder="Notlar..." value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>

        {/* FOOTER BUTONLARI */}
        <Col span={24} style={{ borderTop: "1px solid #f0f0f0", paddingTop: "15px", textAlign: "right", marginTop: "10px" }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>Vazgeç</Button>
          <Button type="primary" onClick={handleSave} loading={loading} style={{ backgroundColor: "#fa541c", borderColor: "#fa541c" }}>Kaydet</Button>
        </Col>
      </Row>
    </div>
  );
};

export default YakitCikis;