import React, { useState, useEffect } from "react";
import { Typography, Input, DatePicker, InputNumber } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

const rowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  justifyContent: "space-between",
};

const inputWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  maxWidth: "300px",
  minWidth: "300px",
  gap: "10px",
  width: "100%",
};

export default function PeriyodikBakimBilgileriForm({ bakimData, periyotBilgiDurum, viewOnly = false }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY");

  const {
    control,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));
  }, []);

  const bakimBilgileri = (
    <div>
      <Text style={{ color: "#1677ff" }}>Periyodik Bakım Bilgileri</Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderTop: "1px solid #80808030",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <div style={rowStyle}>
          <Text style={{ fontSize: "14px" }}>Bakım Kodu</Text>
          <div style={inputWrapStyle}>
            <Input value={bakimData?.PBK_KOD || ""} disabled style={{ flex: 1 }} />
          </div>
        </div>
        <div style={rowStyle}>
          <Text style={{ fontSize: "14px" }}>Bakım Tanımı</Text>
          <div style={inputWrapStyle}>
            <Input value={bakimData?.PBK_TANIM || ""} disabled style={{ flex: 1 }} />
          </div>
        </div>
        <div style={rowStyle}>
          <Text style={{ fontSize: "14px" }}>Bakım Tipi</Text>
          <div style={inputWrapStyle}>
            <Input value={bakimData?.PBK_TIP || ""} disabled style={{ flex: 1 }} />
          </div>
        </div>
        <div style={rowStyle}>
          <Text style={{ fontSize: "14px" }}>Bakım Grubu</Text>
          <div style={inputWrapStyle}>
            <Input value={bakimData?.PBK_GRUP || ""} disabled style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );

  const tarihBilgileri = (
    <div style={{ marginTop: "10px" }}>
      <Text style={{ color: "#1677ff" }}>Tarih Bilgileri</Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderTop: "1px solid #80808030",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Son Uygulama Tarihi</Text>
          <div style={inputWrapStyle}>
            <Controller
              name="sonUygulamaTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} status={errors.sonUygulamaTarihi ? "error" : ""} disabled={viewOnly} style={{ width: "180px" }} format={localeDateFormat} placeholder="Tarih seçiniz" />
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Hedef Tarih</Text>
          <div style={inputWrapStyle}>
            <Controller
              name="hedefTarih"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} status={errors.hedefTarih ? "error" : ""} disabled style={{ width: "180px" }} format={localeDateFormat} placeholder="Tarih seçiniz" />
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Hatırlatma</Text>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <Controller name="harırlatmaGunOnce" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "70px" }} />} />
            <Text> gün önce</Text>
          </div>
        </div>
      </div>
    </div>
  );

  const sayacBilgileri = (
    <div style={{ marginTop: "10px" }}>
      <Text style={{ color: "#1677ff" }}>Sayaç Bilgileri</Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderTop: "1px solid #80808030",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Sayaç</Text>
          <div style={inputWrapStyle}>
            <Controller name="sayac" control={control} render={({ field }) => <InputNumber {...field} min={0} disabled={viewOnly} style={{ width: "180px" }} />} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Son Uygulama Sayaç</Text>
          <div style={inputWrapStyle}>
            <Controller name="sonUygulamaSayac" control={control} render={({ field }) => <InputNumber {...field} min={0} disabled={viewOnly} style={{ width: "180px" }} />} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Hedef Sayaç</Text>
          <div style={inputWrapStyle}>
            <Controller name="hedefSayac" control={control} render={({ field }) => <InputNumber {...field} min={0} disabled style={{ width: "180px" }} />} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Text style={{ fontSize: "14px", width: "152px" }}>Hatırlatma</Text>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            <Controller name="harırlatmaSayiOnce" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "70px" }} />} />
            <Controller name="hatırlatmaDinamikOnce" control={control} render={({ field }) => <Input {...field} disabled style={{ width: "105px" }} />} />
            <Text> önce</Text>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {bakimBilgileri}
      {periyotBilgiDurum === 1 ? (
        <>{tarihBilgileri}</>
      ) : periyotBilgiDurum === 2 ? (
        <>{sayacBilgileri}</>
      ) : periyotBilgiDurum === 3 ? (
        <>
          {tarihBilgileri}
          {sayacBilgileri}
        </>
      ) : null}
    </div>
  );
}
