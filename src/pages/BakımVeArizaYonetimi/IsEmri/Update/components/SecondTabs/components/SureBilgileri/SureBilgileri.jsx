import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, Slider, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAppContext } from "../../../../../../../../AppContext"; // Context hook'unu import edin
import ProsedurTablo from "./components/ProsedurTablo";
import ProsedurTipi from "./components/ProsedurTipi";
import ProsedurNedeni from "./components/ProsedurNedeni";
import OncelikTablo from "./components/OncelikTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import TalimatTablo from "./components/TalimatTablo";
import TakvimTablo from "./components/TakvimTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
import ProjeTablo from "./components/ProjeTablo";
import FirmaTablo from "./components/FirmaTablo";
import SozlesmeTablo from "./components/SozlesmeTablo";

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

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için

// Önceki değeri tutmak için bir hook
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]); // value değiştiğinde çalış
  return ref.current;
}

// iş emri selectboxu sayfa ilk defa render olduğunda prosedür ve sonraki 3 fieldin değerlerini sıfırlamasın diye ilk renderdeki durumu tutması için son

export default function SureBilgileri({ fieldRequirements }) {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const { selectedOption } = useAppContext(); // Context'ten seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const previousSelectedOption = usePrevious(selectedOption); // Önceki seçilen opsiyonu al iş emri tipi selectboxu değiştiğinde prosedürü sıfırlaması için
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format

  // iş emri tipi selectboxu değiştiğinde prosedür ve ondan sonraki 3 fieldin değerlerini sıfırlamak için Context API kullanarak
  useEffect(() => {
    if (previousSelectedOption !== undefined && previousSelectedOption !== selectedOption) {
      // İlk render'da değil ve selectedOption değiştiğinde çalışacak kod
      handleProsedurMinusClick();
    }
  }, [selectedOption, previousSelectedOption]); // Bağımlılıklara previousSelectedOption ekleyin

  // iş emri tipi selectboxu değiştiğinde prosedür ve ondan sonraki 3 fieldin değerlerini sıfırlamak için son

  const prosedurTab = watch("prosedurTab");

  const handleProsedurMinusClick = () => {
    setValue("prosedur", "");
    setValue("prosedurID", "");
    setValue("konu", "");
    setValue("prosedurTipi", null);
    setValue("prosedurTipiID", "");
    setValue("prosedurNedeni", null);
    setValue("prosedurNedeniID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handleTalimatMinusClick = () => {
    setValue("talimatTanim", "");
    setValue("talimatID", "");
  };

  const handleTakvimMinusClick = () => {
    setValue("takvimTanim", "");
    setValue("takvimID", "");
  };

  const handleMasrafMerkeziMinusClick = () => {
    setValue("masrafMerkezi", "");
    setValue("masrafMerkeziID", "");
  };
  const handleProjeMinusClick = () => {
    setValue("proje", "");
    setValue("projeID", "");
  };

  const handleFirmaMinusClick = () => {
    setValue("firma", "");
    setValue("firmaID", "");
  };

  const handleSozlesmeMinusClick = () => {
    setValue("sozlesme", "");
    setValue("sozlesmeID", "");
  };

  // date picker için tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

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

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama

  // Watch for changes in the relevant fields
  const watchFields = watch(["baslamaZamani", "baslamaZamaniSaati", "bitisZamani", "bitisZamaniSaati"]);

  React.useEffect(() => {
    const { baslamaZamani, baslamaZamaniSaati, bitisZamani, bitisZamaniSaati } = getValues();
    if (baslamaZamani && baslamaZamaniSaati && bitisZamani && bitisZamaniSaati) {
      // Başlangıç ve bitiş tarih/saatini birleştir
      const startDateTime = dayjs(baslamaZamani).hour(baslamaZamaniSaati.hour()).minute(baslamaZamaniSaati.minute());
      const endDateTime = dayjs(bitisZamani).hour(bitisZamaniSaati.hour()).minute(bitisZamaniSaati.minute());

      // İki tarih/saat arasındaki farkı milisaniye cinsinden hesapla
      const diff = endDateTime.diff(startDateTime);

      // Farkı saat ve dakikaya dönüştür
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Hesaplanan saat ve dakikaları form alanlarına yaz
      setValue("calismaSaat", hours);
      setValue("calismaDakika", minutes);
    }
  }, [watchFields, setValue, getValues]);

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama sonu

  const lojistikSuresi = watch("lojistikSuresi");
  const seyahatSuresi = watch("seyahatSuresi");
  const onaySuresi = watch("onaySuresi");
  const beklemeSuresi = watch("beklemeSuresi");
  const digerSuresi = watch("digerSuresi");
  const mudahaleSuresi = watch("mudahaleSuresi");
  const calismaSuresi = watch("calismaSuresi");
  const toplamIsSuresi = watch("toplamIsSuresi");

  useEffect(() => {
    if (lojistikSuresi || seyahatSuresi || onaySuresi || beklemeSuresi || digerSuresi) {
      const mudahaleSuresi1 = lojistikSuresi + seyahatSuresi + onaySuresi + beklemeSuresi + digerSuresi;
      setValue("mudahaleSuresi", mudahaleSuresi1);
    }
    if (mudahaleSuresi || calismaSuresi) {
      const toplamIsSuresi1 = mudahaleSuresi + calismaSuresi;
      setValue("toplamIsSuresi", toplamIsSuresi1);
    }
  }, [lojistikSuresi, seyahatSuresi, onaySuresi, beklemeSuresi, digerSuresi, mudahaleSuresi, calismaSuresi, setValue]);

  return (
    <div style={{ paddingBottom: "35px" }}>
      {/* number input okları kaldırma */}
      <style>
        {`
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }
    `}
      </style>
      <div style={{ display: "flex", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
            maxWidth: "300px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Müdahele Süresi</Text>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Lojistik Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="lojistikSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Seyahet Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="seyahatSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Onay Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="onaySuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Bekleme Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="beklemeSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Diğer (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="digerSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            width: "100%",
            maxWidth: "300px",
          }}>
          <div style={{ borderBottom: "1px solid #e8e8e8", marginBottom: "5px", paddingBottom: "5px", width: "100%" }}>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Toplam İş Süresi</Text>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Müdahele Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="mudahaleSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Çalışma Sürei (dk.):</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="calismaSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "480px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Toplam İş Süresi:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "145px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="toplamIsSuresi"
                control={control}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    min={0}
                    disabled
                    // max={59}
                    style={{ width: "145px" }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
