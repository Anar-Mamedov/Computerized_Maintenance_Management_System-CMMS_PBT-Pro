import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Typography, Tabs, message, DatePicker, InputNumber } from "antd";
import AxiosInstance from "../../../../../../../../../../api/http";

const { Text } = Typography;

import { Controller, useForm, FormProvider, useFormContext } from "react-hook-form";

function PeryotBakimBilgileriEkle({ activeTab, tarihSayacBakim }) {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // date picker için tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
      minute: "numeric",
    });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const makineBilgileri = (
    <div>
      <Text style={{ color: "#1677ff" }}>Makine Bilgileri</Text>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          borderTop: "1px solid #80808030",
          paddingTop: "10px",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Makine Kodu</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="makineKodu" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
            <Controller name="makineID" control={control} render={({ field }) => <Input {...field} style={{ flex: 1, display: "none" }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Makine Tanımı</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="makineTanimi" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Makine Lokasyon</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="makineLokasyon" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: "14px" }}>Makine Tipi</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="makineTipi" control={control} render={({ field }) => <Input {...field} disabled style={{ flex: 1 }} />} />
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px", width: "152px" }}>Son Uygulama Tarihi</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="sonUygulamaTarihi"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  status={errors.sonUygulamaTarihi ? "error" : ""}
                  // disabled={!isDisabled}
                  style={{ width: "180px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px", width: "152px" }}>Hedef Tarih</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller
              name="hedefTarih"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker {...field} status={errors.hedefTarih ? "error" : ""} disabled style={{ width: "180px" }} format={localeDateFormat} placeholder="Tarih seçiniz" />
              )}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px", width: "152px" }}>Sayaç</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="sayac" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "180px" }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px", width: "152px" }}>Son Uygulama Sayaç</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="sonUygulamaSayac" control={control} render={({ field }) => <InputNumber {...field} min={0} style={{ width: "180px" }} />} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: "14px", width: "152px" }}>Hedef Sayaç</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}
          >
            <Controller name="hedefSayac" control={control} render={({ field }) => <InputNumber {...field} min={0} disabled style={{ width: "180px" }} />} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
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
      {/* Always render Makine Bilgileri */}
      {makineBilgileri}

      {tarihSayacBakim === "b" ? (
        <>
          {tarihBilgileri}
          {sayacBilgileri}
        </>
      ) : tarihSayacBakim === "a" ? (
        activeTab === "SAYAC" ? (
          <>{sayacBilgileri}</>
        ) : (
          <>{tarihBilgileri}</>
        )
      ) : null}
    </div>
  );
}

export default PeryotBakimBilgileriEkle;
