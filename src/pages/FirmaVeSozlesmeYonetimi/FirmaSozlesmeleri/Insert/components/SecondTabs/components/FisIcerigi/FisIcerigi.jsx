import React, { useEffect, useState } from "react";
import { Typography, Input, InputNumber, Checkbox, DatePicker, TimePicker, Row, Col, Divider, message, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";
import MakineTablo from "./MakineTablo";
import AxiosInstance from "../../../../../../../../api/http";
import FirmaTablo from "../../../../../../../../utils/components/FirmaTablo";
import LokasyonSelect from "../../../../../../../../utils/components/LokasyonSelectbox";
import PersonelSelect from "../../../../../../../../utils/components/PersonelSelectbox";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function SecondTabs() {
  const { control, watch, setValue } = useFormContext();

  const watchStokKullanim = watch("StokKullanim");
  const watchMakineId = watch("MakineId");
  
  // API tetikleyicileri için izlenen alanlar
  const watchYakitTipId = watch("YakitTipId");
  const watchLokasyonId = watch("LokasyonId");
  
  // API'den gelen gizli/bilgi alanları
  const watchSayacBirimi = watch("_sayacBirimi") || "KM";
  const watchSayacZorunlu = watch("_sayacZorunlu");
  const watchMaxKapasite = watch("_maxKapasite");
  const watchGuncelSayac = watch("_guncelSayacDegeri");

  // Hesaplamalar için izlenecek alanlar
  const watchSonKm = watch("SonKm");
  const watchAlinanKm = watch("AlinanKm");
  const watchMiktar = watch("Miktar");
  const watchFiyat = watch("Fiyat");
  const watchTutar = watch("Tutar");
  const watchFarkKm = watch("FarkKm");
  const watchFullDepo = watch("FullDepo");

  // --- YENİ STATE'LER ---
  const [yakitTipleri, setYakitTipleri] = useState([]);
  const [yakitTipleriLoading, setYakitTipleriLoading] = useState(false);
  
  const [yakitDepolari, setYakitDepolari] = useState([]);
  const [yakitDepolariLoading, setYakitDepolariLoading] = useState(false);

  // 1. Yakıt Tiplerini Çekme (Sayfa yüklendiğinde)
  useEffect(() => {
    setYakitTipleriLoading(true);
    AxiosInstance.get(`GetYakitList?aktif=1`)
      .then((res) => {
        // Axios interceptor ayarlarına göre data bazen res'in içinde bazen direkt res olarak dönebilir.
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
        setYakitTipleri(list);
      })
      .catch(() => message.error(t("Yakıt tipleri alınamadı.")))
      .finally(() => setYakitTipleriLoading(false));
  }, []);

  // 2. Yakıt Depolarını Çekme (Lokasyon, Yakıt Tipi veya Stok Kullanım değiştiğinde)
  useEffect(() => {
    // Sadece stok kullanımı aktifse istek atılacak
    if (watchStokKullanim) {
      setYakitDepolariLoading(true);
      
      const payload = {
        LokasyonIds: [], // Array
        YakitTipIds: [], // Array
        Durum: 1 // 1, 0, -1
      };

      AxiosInstance.post(`GetYakitTankList`, payload)
        .then((res) => {
          const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          setYakitDepolari(list);
        })
        .catch(() => message.error(t("Yakıt depoları alınamadı.")))
        .finally(() => setYakitDepolariLoading(false));
    } else {
      setYakitDepolari([]); // Stok kullanım kapanırsa listeyi temizle
      setValue("YakitTankId", null); // Depo seçimini de sıfırla
    }
  }, [watchStokKullanim, watchLokasyonId, watchYakitTipId, setValue]);

  // Doküman Madde 2: Araç Seçildiğinde Ön Bilgi Çekme
  useEffect(() => {
    if (watchMakineId) {
      AxiosInstance.get(`GetAracYakitGirisDurumu?makineId=${watchMakineId}`)
        .then((res) => {
          if (res.data) {
            const d = res.data;
            setValue("SonKm", d.SonAlinanKm);
            setValue("_maxKapasite", d.DepoKapasitesi);
            setValue("_sayacZorunlu", d.SayacTakibiZorunlu);
            setValue("_sayacBirimi", d.SayacBirimi || "KM");
            setValue("_guncelSayacDegeri", d.GuncelSayacDegeri);
            setValue("AlinanKm", d.GuncelSayacDegeri);
          }
        })
        .catch(() => message.error(t("Araç bilgileri alınamadı.")));
    }
  }, [watchMakineId, setValue]);

  // Fark KM Hesaplama
  useEffect(() => {
    const son = Number(watchSonKm) || 0;
    const alinan = Number(watchAlinanKm) || 0;
    
    if (alinan > son && son > 0) {
      setValue("FarkKm", alinan - son);
    } else {
      setValue("FarkKm", null);
    }
  }, [watchSonKm, watchAlinanKm, setValue]);

  // Tutar Hesaplama (Miktar ve Fiyat girildiğinde otomatik çarpar)
  useEffect(() => {
    const miktar = Number(watchMiktar) || 0;
    const fiyat = Number(watchFiyat) || 0;
    
    if (miktar > 0 && fiyat > 0) {
      const hesaplananTutar = Number((miktar * fiyat).toFixed(2));
      if (hesaplananTutar !== watchTutar) {
        setValue("Tutar", hesaplananTutar);
      }
    }
  }, [watchMiktar, watchFiyat, setValue, watchTutar]);

  // Full Depo Seçildiğinde Kapasiteyi Miktara Basma
  useEffect(() => {
    if (watchFullDepo && watchMaxKapasite) {
      setValue("Miktar", watchMaxKapasite);
    }
  }, [watchFullDepo, watchMaxKapasite, setValue]);

  // Otomatik Hesaplama Değişkenleri
  const fark = Number(watchFarkKm) || 0;
  const tutar = Number(watchTutar) || 0;
  const miktar = Number(watchMiktar) || 0;

  const kmBasiMaliyet = fark > 0 && tutar > 0 ? (tutar / fark).toFixed(2) + " ₺" : "—";
  const ortTuketim = fark > 0 && miktar > 0 ? ((miktar / fark) * 100).toFixed(2) + " Lt" : "—";
  const tuketimDegeri = fark > 0 && miktar > 0 ? ((miktar / fark) * 100) : 0;
  const isAnomali = tuketimDegeri > 20;

  // Stil Tanımlamaları
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "500" };
  const cardStyle = {
    border: "1px solid #f0f0f0",
    padding: "15px",
    borderRadius: "8px",
    height: "100%",
    backgroundColor: "#fff"
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ÜST BİLGİLER */}
      <div style={{ marginBottom: "20px" }}>
        {/* 1. SATIR: Araç / Sürücü / Yakıt Tipi */}
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text style={labelStyle}>{t("Araç / Ekipman")}</Text>
            <MakineTablo
            control={control}
            setValue={setValue}
            makineFieldName="MKN_KOD" 
            makineIdFieldName="MakineId" 
          />
          </Col>
          <Col span={8}>
            <Text style={labelStyle}>{t("Sürücü / Personel")}</Text>
            <PersonelSelect
              fieldName="PersonelId" placeholder={t("Seçiniz")} mode="default" selectStyle={{ width: "100%", maxWidth: "600px"}} 
            />
          </Col>
          <Col span={8}>
            <Text style={labelStyle}>{t("Yakıt Tipi")}</Text>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                {/* YAKIT TİPİ GÜNCELLENDİ (JSON'a göre TB_STOK_ID ve YAKIT_TANIM eşleştirildi) */}
                <Controller
                  name="YakitTipId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      loading={yakitTipleriLoading}
                      placeholder={t("Seçiniz")}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      options={yakitTipleri.map((item) => ({
                        value: item.TB_STOK_ID, 
                        label: item.YAKIT_TANIM, 
                      }))}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </div>
              <Controller
                name="StokKullanim"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <Checkbox 
                    {...field} 
                    checked={field.value} 
                    onChange={(e) => field.onChange(e.target.checked)}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {t("Stoktan Kullanım")}
                  </Checkbox>
                )}
              />
            </div>
          </Col>
        </Row>

        {/* 2. SATIR: Tarih / Saat / Yakıt Deposu */}
        <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
          <Col span={4}>
            <Text style={labelStyle}>{t("Tarih")}</Text>
            <Controller
              name="Tarih"
              control={control}
              render={({ field }) => (
                <DatePicker 
                  {...field} 
                  value={field.value ? dayjs(field.value) : null} 
                  onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                  style={{ width: "100%" }} 
                />
              )}
            />
          </Col>
          <Col span={4}>
            <Text style={labelStyle}>{t("Saat")}</Text>
            <Controller
              name="Saat"
              control={control}
              render={({ field }) => (
                <TimePicker 
                  {...field} 
                  value={field.value ? dayjs(field.value, "HH:mm") : null} 
                  format="HH:mm" 
                  onChange={(time) => field.onChange(time ? time.format("HH:mm:ss") : null)}
                  style={{ width: "100%" }} 
                />
              )}
            />
          </Col>
          <Col span={8}>
            {watchStokKullanim && (
              <>
                <Text style={labelStyle}>{t("Yakıt Deposu")}</Text>
                {/* YAKIT DEPOSU GÜNCELLENDİ */}
                <Controller
                  name="YakitTankId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      loading={yakitDepolariLoading}
                      placeholder={t("Depo Seçiniz")}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      options={yakitDepolari.map((item) => ({
                        value: item.TB_DEPO_ID || item.ID, // Backenddeki depo id alanı (Emin değilsen console.log atıp bakarsın kanka)
                        label: item.DEP_TANIM || item.TANIM, // Backenddeki depo tanım alanı
                      }))}
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </>
            )}
          </Col>
        </Row>
      </div>

      <Divider />

      {/* ORTA BÖLÜM */}
      <Row gutter={[24, 24]}>
        {/* 1. Sütun: Kilometre Bilgisi */}
        <Col span={8}>
          <div style={cardStyle}>
            <Title level={5}>{t("Kilometre Bilgisi")}</Title>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Text type="secondary" size="small">{t("Son Alınan")} ({watchSayacBirimi})</Text>
                <Controller
                  name="SonKm"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} disabled />}
                />
              </Col>
              <Col span={12}>
                <Text type="secondary" size="small">{t("Yakıtın Alındığı")} ({watchSayacBirimi})</Text>
                <Controller
                  name="AlinanKm"
                  control={control}
                  render={({ field }) => (
                    <InputNumber 
                      {...field} 
                      style={{ width: "100%" }} 
                      status={watchSayacZorunlu && !field.value ? "error" : ""} 
                    />
                  )}
                />
              </Col>
              <Col span={12}>
                <Text type="secondary" size="small">{t("Fark")} ({watchSayacBirimi})</Text>
                <Controller
                  name="FarkKm"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} disabled />}
                />
                {/* Güncel Sayaç Bilgilendirme Alanı */}
                {watchGuncelSayac !== undefined && watchGuncelSayac !== null && (
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '11px', color: '#1890ff' }}>
                      {t("Güncel Sayaç")}: {watchGuncelSayac}
                    </Text>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Col>

        {/* 2. Sütun: Yakıt / Tutar */}
        <Col span={8}>
          <div style={cardStyle}>
            <Title level={5}>{t("Yakıt / Tutar")}</Title>
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Text style={labelStyle}>{t("Miktar (lt)")} <span style={{ color: "red" }}>*</span></Text>
                <Controller
                  name="Miktar"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
                />
              </Col>
              <Col span={12}>
                <Text style={labelStyle}>{t("Birim Fiyatı")}</Text>
                <Controller
                  name="Fiyat"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
                />
              </Col>
              <Col span={12}>
                <Text style={labelStyle}>{t("Tutar")} <span style={{ color: "red" }}>*</span></Text>
                <Controller
                  name="Tutar"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
                />
              </Col>
              <Col span={12} style={{ display: "flex", alignItems: "center", paddingTop: "25px" }}>
                <Controller
                  name="FullDepo"
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value}>{t("Full Depo")}</Checkbox>}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: "15px", backgroundColor: "#fafafa", padding: "10px", borderRadius: "4px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>{t("Otomatik hesap")}</Text>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                <div><Text size="small">Maliyet / {watchSayacBirimi}</Text><br /><b>{kmBasiMaliyet}</b></div>
                <div><Text size="small">Ort. tüketim</Text><br /><b>{ortTuketim}</b></div>
                <div>
                  <Text size="small" style={{ color: isAnomali ? "red" : "inherit" }}>Anomali</Text><br />
                  <b style={{ color: isAnomali ? "red" : "inherit" }}>{isAnomali ? "Var" : "Yok"}</b>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* 3. Sütun: Belge & Konum */}
        <Col span={8}>
          <div style={cardStyle}>
            <Title level={5}>{t("Belge & Konum")}</Title>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Text style={labelStyle}>{t("Fatura / Fiş No")}</Text>
                <Controller
                  name="FaturaFisNo"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </Col>
              <Col span={24}>
                <Text style={labelStyle}>{t("Fatura / Fiş Tarihi")}</Text>
                <Controller
                  name="FaturaTarihi"
                  control={control}
                  render={({ field }) => (
                    <DatePicker 
                      {...field} 
                      value={field.value ? dayjs(field.value) : null} 
                      onChange={(date) => field.onChange(date ? date.toISOString() : null)}
                      style={{ width: "100%" }} 
                    />
                  )}
                />
              </Col>
              
              <Col span={24}> {/* Sütunu tam genişlik yapıyoruz (24 birim) */}
                <Text style={labelStyle}>{t("Lokasyon")}</Text>
                  <LokasyonSelect 
                    fieldName="LokasyonId" placeholder={t("Seçiniz")} mode="default" selectStyle={{ width: "100%", maxWidth: "600px"}} 
                  />
              </Col>
              <Col span={24}>
                <Text style={labelStyle}>{t("Firma")}</Text>
                <FirmaTablo firmaFieldName="FirmaAdi" firmaIdFieldName="FirmaId" />
              </Col>

              <Col span={24}>
                {!watchStokKullanim && (
                  <>
                    <Text style={labelStyle}>{t("İstasyon")}</Text>
                    <KodIDSelectbox name1="IstasyonKodId" kodID={35690} placeholder="İstasyon Seçiniz" />
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
}