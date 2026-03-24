import React from "react";
import { Typography, Input, InputNumber, Checkbox, DatePicker, TimePicker, Row, Col, Divider } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { t } from "i18next";
import KodIDSelectbox from "../../../../../../../../utils/components/KodIDSelectbox";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { TextArea } = Input;

export default function SecondTabs() {
  const { control, watch } = useFormContext();

  // Stoktan Kullanım checkbox'ını izliyoruz
  const watchStokKullanim = watch("StokKullanim");

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
            <Text style={labelStyle}>{t("Araç / Makine")}</Text>
            <KodIDSelectbox name1="MakineId" kodID={123} placeholder="Araç Seçiniz" />
          </Col>
          <Col span={8}>
            <Text style={labelStyle}>{t("Sürücü / Personel")}</Text>
            <KodIDSelectbox name1="PersonelId" kodID={456} placeholder="Sürücü Seçiniz" />
          </Col>
          <Col span={8}>
            <Text style={labelStyle}>{t("Yakıt Tipi")}</Text>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <KodIDSelectbox name1="YakitTipId" kodID={35600} placeholder="Seçiniz" />
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
                <KodIDSelectbox 
                  name1="YakitTankId" 
                  kodID={202} 
                  placeholder={t("Depo Seçiniz")} 
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
                <Text type="secondary" size="small">{t("Son Alınan")} (KM)</Text>
                <Controller
                  name="SonKm"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} disabled />}
                />
              </Col>
              <Col span={12}>
                <Text type="secondary" size="small">{t("Yakıtın Alındığı")} (KM)</Text>
                <Controller
                  name="AlinanKm"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} />}
                />
              </Col>
              <Col span={12}>
                <Text type="secondary" size="small">{t("Fark")} (KM)</Text>
                <Controller
                  name="FarkKm"
                  control={control}
                  render={({ field }) => <InputNumber {...field} style={{ width: "100%" }} disabled />}
                />
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
                <div><Text size="small">KM başı maliyet</Text><br /><b>—</b></div>
                <div><Text size="small">Ort. tüketim</Text><br /><b>—</b></div>
                <div><Text size="small" style={{ color: "red" }}>Anomali</Text><br /><b>—</b></div>
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
              <Col span={12}>
                <Text style={labelStyle}>{t("Lokasyon")}</Text>
                <KodIDSelectbox name1="LokasyonId" kodID={456} placeholder="Seçiniz" />
              </Col>
              <Col span={12}>
                <Text style={labelStyle}>{t("Firma")}</Text>
                <KodIDSelectbox name1="FirmaId" kodID={789} placeholder="Seçiniz" />
              </Col>
              <Col span={24}>
                {!watchStokKullanim && (
                  <>
                    <Text style={labelStyle}>{t("İstasyon")}</Text>
                    <KodIDSelectbox name1="IstasyonKodId" kodID={101} placeholder="İstasyon Seçiniz" />
                  </>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* ALT KISIM: AÇIKLAMA */}
      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Text style={labelStyle}>{t("Açıklama")}</Text>
          <Controller
            name="Aciklama"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={3} placeholder="İsteğe bağlı açıklama..." />
            )}
          />
        </Col>
      </Row>
    </div>
  );
}