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
  });

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
        <Col span={24}>
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
        <Col span={24}>
          <Text strong>Makine / Araç </Text>
          <MakineTablo control={control} setValue={setValue} makineFieldName="MKN_KOD" makineIdFieldName="MakineId" errors={errors} />
        </Col>
        <Col span={12}>
          <Text strong>Tarih / Saat</Text>
          <DatePicker showTime style={{ width: "100%", marginTop: "5px" }} value={formData.TarihSaat} onChange={(val) => setFormData({...formData, TarihSaat: val})} format="DD.MM.YYYY HH:mm" />
        </Col>
        <Col span={12}>
          <Text strong>Miktar (Litre) <span style={{color: 'red'}}>*</span></Text>
          <InputNumber style={{ width: "100%", marginTop: "5px" }} value={formData.Miktar} onChange={(val) => setFormData({...formData, Miktar: val})} />
        </Col>
        <Col span={24}>
          <Text strong>Açıklama</Text>
          <Input style={{ marginTop: "5px" }} placeholder="Notlar..." value={formData.Aciklama} onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} />
        </Col>
        <Col span={24} style={{ borderTop: "1px solid #f0f0f0", paddingTop: "15px", textAlign: "right", marginTop: "10px" }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>Vazgeç</Button>
          <Button type="primary" onClick={handleSave} loading={loading} style={{ backgroundColor: "#fa541c", borderColor: "#fa541c" }}>Kaydet</Button>
        </Col>
      </Row>
    </div>
  );
};

export default YakitCikis;