import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import Birim from "./components/Birim";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const onChange = (key) => {
  // console.log(key);
};

export default function MainTabs() {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Format the date based on the user's locale
    const dateFormatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSampleDate = dateFormatter.format(sampleDate);
    setLocaleDateFormat(formattedSampleDate.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));

    // Format the time based on the user's locale
    const timeFormatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric" });
    const sampleTime = new Date(2021, 10, 21, 13, 45); // Use a sample time, e.g., 13:45
    const formattedSampleTime = timeFormatter.format(sampleTime);

    // Check if the formatted time contains AM/PM, which implies a 12-hour format
    const is12HourFormat = /AM|PM/.test(formattedSampleTime);
    setLocaleTimeFormat(is12HourFormat ? "hh:mm A" : "HH:mm");
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  const ondalikSayi = watch("ondalikSayi");
  const hedefDeger = watch("hedefDeger");
  const limit = watch("limit");
  const olcumDegeri = watch("olcumDegeri");
  const maxDeger = watch("maxDeger");
  const fark = watch("fark");

  // ondalık ondalık sayısını belirlemek için başka inputa girilen rakama göre diğer alanların ondalık basamak sayısını belirleme

  const formatDecimal = (value, decimalPlaces) => {
    // Doğrudan parseFloat kullanarak noktayla ondalık ayrımını gerçekleştiririz
    return Number(parseFloat(value)).toFixed(decimalPlaces);
  };

  useEffect(() => {
    const decimalPlaces = parseInt(ondalikSayi, 10) || 0;
    // Hedef Değer ve Ölçüm Limiti dahil olmak üzere tüm ilgili alanları güncelle
    setValue("hedefDeger", formatDecimal(hedefDeger, decimalPlaces), { shouldValidate: true });
    setValue("limit", formatDecimal(limit, decimalPlaces), { shouldValidate: true });
    setValue("olcumDegeri", formatDecimal(olcumDegeri, decimalPlaces), { shouldValidate: true });
    setValue("fark", formatDecimal(fark, decimalPlaces), { shouldValidate: true });

    // Maximum ve minimum değer hesaplama
    // const maxDeger = parseFloat(hedefDeger) + parseFloat(limit);
    // const minDeger = parseFloat(hedefDeger) - parseFloat(limit);

    // setValue("maxDeger", formatDecimal(maxDeger, decimalPlaces));
    // setValue("minDeger", formatDecimal(minDeger, decimalPlaces));
  }, [hedefDeger, limit, ondalikSayi, olcumDegeri, fark, setValue]);

  // ondalık ondalık sayısını belirlemek için başka inputa girilen rakama göre diğer alanların ondalık basamak sayısını belirleme son

  useEffect(() => {
    const numericHedefDeger = parseFloat(hedefDeger) || 0;
    const numericOlcumDegeri = parseFloat(olcumDegeri) || 0;
    const yeniFark = numericOlcumDegeri - numericHedefDeger;

    // Sadece fark değeri önceki değerden farklıysa güncelle
    const oncekiFark = parseFloat(fark) || 0;
    if (yeniFark !== oncekiFark) {
      setValue("fark", formatDecimal(yeniFark, parseInt(ondalikSayi, 10) || 0), { shouldValidate: true });
    }
  }, [hedefDeger, olcumDegeri, ondalikSayi, fark, setValue]);

  // geçerli geçersiz yazdırmak için

  useEffect(() => {
    // parseFloat kullanarak olası string değerleri sayıya çevirme
    const numericOlcumDegeri = parseFloat(olcumDegeri);
    const numericMaxDeger = parseFloat(maxDeger);

    // olcumDegeri'nin maxDeger'den büyük olup olmadığını kontrol etme
    if (numericOlcumDegeri > numericMaxDeger) {
      // olcumDegeri maxDeger'den büyükse, durum alanını "Geçersiz" olarak ayarla
      setValue("durum", "Geçersiz", { shouldValidate: true });
    } else {
      // Aksi takdirde, "Geçerli" olarak ayarla
      setValue("durum", "Geçerli", { shouldValidate: true });
    }
  }, [olcumDegeri, maxDeger, setValue]); // Bağımlılıkları dikkate al

  // geçerli geçersiz yazdırmak için sonu

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Tarih:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "200px",
              gap: "5px",
              width: "100%",
            }}>
            <Controller
              name="tarih"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  status={errors.tarih ? "error" : ""}
                  // disabled={!isDisabled}
                  style={{ width: "100%" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            {errors.tarih && <div style={{ color: "red" }}>{errors.tarih.message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Saat:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "200px",
              gap: "5px",
              width: "100%",
            }}>
            <Controller
              name="saat"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  status={errors.saat ? "error" : ""}
                  // disabled={!isDisabled}
                  style={{ width: "100%" }}
                  format={localeTimeFormat}
                  placeholder="Saat seçiniz"
                />
              )}
            />
            {errors.saat && <div style={{ color: "red" }}>{errors.saat.message}</div>}
          </div>
        </div>
        <div
          style={{
            display: "none",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            gap: "10px",
            rowGap: "0px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Sıra no:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}>
            <Controller
              name="siraNo"
              control={control}
              render={({ field }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <InputNumber {...field} min={1} style={{ flex: 1 }} />
                </div>
              )}
            />
            <Controller
              name="secilenID"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  style={{ display: "none" }}
                />
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "none",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "450px",
            gap: "10px",
            rowGap: "0px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Tanım:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "300px",
              minWidth: "300px",
              gap: "10px",
              width: "100%",
            }}>
            <Controller
              name="tanim"
              control={control}
              render={({ field }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} style={{ flex: 1 }} />
                </div>
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Birim:</Text>
          <Birim />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px", fontWeight: "600" }}>Ölçüm Değeri:</Text>
          <Controller
            name="olcumDegeri"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", maxWidth: "200px" }}>
                <InputNumber
                  {...field}
                  status={error ? "error" : ""}
                  min={0}
                  style={{ width: "200px" }}
                  precision={ondalikSayi}
                />
                {error && <div style={{ color: "red" }}>{error.message}</div>}
              </div>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Fark:</Text>
          <Controller
            name="fark"
            control={control}
            render={({ field }) => <InputNumber {...field} style={{ width: "200px" }} precision={ondalikSayi} />}
          />
        </div>
        <div
          style={{
            display: "none",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "250px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Ondalık Sayı:</Text>
          <Controller
            name="ondalikSayi"
            control={control}
            render={({ field }) => <InputNumber {...field} min={0} style={{ width: "100px" }} />}
          />
        </div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Hedef Değer:</Text>
          <Controller
            name="hedefDeger"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", maxWidth: "200px" }}>
                <InputNumber {...field} min={0} disabled style={{ width: "200px" }} precision={ondalikSayi} />
              </div>
            )}
          />
        </div>
        <div
          style={{
            display: "none",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Limit (+)(-):</Text>
          <Controller
            name="limit"
            control={control}
            render={({ field }) => (
              <InputNumber {...field} min={0} style={{ width: "200px" }} precision={ondalikSayi} />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Minumum Değer:</Text>
          <Controller
            name="minDeger"
            control={control}
            render={({ field }) => (
              <InputNumber {...field} disabled style={{ width: "200px" }} precision={ondalikSayi} />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Maximum Değer:</Text>
          <Controller
            name="maxDeger"
            control={control}
            render={({ field }) => (
              <InputNumber {...field} disabled style={{ width: "200px" }} precision={ondalikSayi} />
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            maxWidth: "350px",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Durum:</Text>
          <Controller
            name="durum"
            control={control}
            render={({ field }) => <Input {...field} disabled style={{ width: "200px" }} />}
          />
        </div>
      </div>
    </div>
  );
}
