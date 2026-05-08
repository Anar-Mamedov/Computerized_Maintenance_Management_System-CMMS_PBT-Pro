import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, Select, Row, Col, Typography, message, InputNumber } from "antd";
import dayjs from "dayjs";
import AxiosInstance from "../../../../../api/http";
import MakineTablo from "../../../YakitHareketleri/components/MakineTablo";
import { useFormContext } from "react-hook-form";

const { Text, Title } = Typography;

// selectedRows prop'unu ekledik
const YakitCikisModal = ({ visible, onClose, onRefresh, selectedRows }) => {
  const [loading, setLoading] = useState(false);
  const [depolar, setDepolar] = useState([]);
  const { 
    control,
    watch, 
    setValue, 
    formState: { errors } 
  } = useFormContext();

  const watchMakineId = watch("MakineId");

  const [formData, setFormData] = useState({
    TarihSaat: dayjs(),
    Miktar: 0,
    KaynakDepoId: null, // Giriş modalında HedefDepoId idi, burada KaynakDepoId yapıyoruz
    BelgeNo: "",
    Aciklama: "",
  });

  useEffect(() => {
    if (visible) {
      fetchDepoListesi();
      
      // --- OTOMATİK SEÇİM MANTIĞI ---
      const initialDepoId = (selectedRows && selectedRows.length > 0) 
        ? selectedRows[0].TB_DEPO_ID 
        : null;

      setFormData({ 
        TarihSaat: dayjs(), 
        Miktar: 0, 
        KaynakDepoId: initialDepoId, // Kaynak depoyu otomatik set et
        BelgeNo: "", 
        Aciklama: "" 
      });

      // Makine seçimlerini sıfırla
      setValue("MakineId", null);
      setValue("MKN_KOD", "");
    }
  }, [visible, setValue, selectedRows]);

  const fetchDepoListesi = async () => {
    try {
      const res = await AxiosInstance.post("GetYakitTankList", { 
        LokasyonIds: [], 
        YakitTipIds: [], 
        Durum: -1 
      });

      let list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);

      if (list.length > 0) {
        setDepolar(list.map(item => ({ 
          value: item.TB_DEPO_ID, 
          label: `${item.DEP_KOD} (${item.DEP_TANIM})` 
        })));
      }
    } catch (err) { 
      message.error("Tank listesi yüklenemedi."); 
    }
  };

  const handleSave = async () => {
    // KaynakDepoId kontrolü
    if (formData.Miktar <= 0 || !formData.KaynakDepoId || !watchMakineId) {
      return message.error("Lütfen tüm zorunlu alanları (Miktar, Kaynak Tank, Makine) doldurunuz.");
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
    } catch (error) { 
      message.error("Hata oluştu."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <Modal 
      title={<Title level={5}>Yakıt Çıkış</Title>} 
      open={visible} 
      onCancel={onClose}
      footer={[
        <Button key="b" onClick={onClose}>Vazgeç</Button>, 
        <Button key="s" type="primary" onClick={handleSave} loading={loading}>Kaydet</Button>
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text strong>İşlem Yapılan Depo / Tank</Text>
          <Select 
            style={{ width: "100%", marginTop: "5px" }} 
            placeholder="Seçiniz..." 
            showSearch
            optionFilterProp="label"
            value={formData.KaynakDepoId} // Burası state ile senkron
            onChange={(val) => setFormData({...formData, KaynakDepoId: val})} 
            options={depolar} 
          />
        </Col>
        <Col span={24}>
          <Text strong>Makine / Araç</Text>
          <MakineTablo
            control={control}
            setValue={setValue}
            makineFieldName="MKN_KOD"
            makineIdFieldName="MakineId"
            errors={errors}
          />
        </Col>
        <Col span={12}>
          <Text strong>Tarih / Saat</Text>
          <DatePicker 
            showTime 
            style={{ width: "100%", marginTop: "5px" }} 
            value={formData.TarihSaat} 
            onChange={(val) => setFormData({...formData, TarihSaat: val})} 
            format="DD.MM.YYYY HH:mm" 
          />
        </Col>
        <Col span={12}>
          <Text strong>Miktar (Litre)</Text>
          <InputNumber 
            style={{ width: "100%", marginTop: "5px" }} 
            value={formData.Miktar} 
            onChange={(val) => setFormData({...formData, Miktar: val})} 
          />
        </Col>
        <Col span={24}>
          <Text strong>Açıklama</Text>
          <Input 
            style={{ marginTop: "5px" }} 
            value={formData.Aciklama} 
            onChange={(e) => setFormData({...formData, Aciklama: e.target.value})} 
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default YakitCikisModal;