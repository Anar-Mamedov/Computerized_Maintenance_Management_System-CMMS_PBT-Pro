import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import SertifikaTipi from "./components/SertifikaTipi";
import AtolyeTablo from "./components/AtolyeTablo";
import PersonelTablo from "./components/PersonelTablo";
import VardiyaSelect from "./components/VardiyaSelect";

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

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }
`;

//styled components end
export default function MainTabs() {
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm"); // Default time format
  const { control, watch, setValue } = useFormContext();

  const yapildi = watch("yapildi");

  const handleAtolyeMinusClick = () => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
  };

  const handlePersonelMinusClick = () => {
    setValue("personelTanim", "");
    setValue("personelID", "");
  };

  const clearYapildi = useCallback(() => {
    setValue("atolyeTanim", "");
    setValue("atolyeID", "");
    setValue("personelTanim", "");
    setValue("personelID", "");
    setValue("baslangicTarihi", null);
    setValue("baslangicSaati", null);
    setValue("vardiya", null);
    setValue("vardiyaID", "");
    setValue("bitisTarihi", null);
    setValue("bitisSaati", null);
    setValue("sure", 0);
  }, [setValue]);

  useEffect(() => {
    if (!yapildi) {
      clearYapildi();
    }
  }, [yapildi, clearYapildi]);

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller
          name="aciklama"
          control={control}
          render={({ field }) => <TextArea {...field} disabled={!yapildi} rows={4} />}
        />
      ),
    },
  ];

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

  // iki tarih ve saat arasında geçen süreyi hesaplamak için

  const watchFields = watch(["baslangicTarihi", "baslangicSaati", "bitisTarihi", "bitisSaati"]);

  useEffect(() => {
    const [baslangicTarihi, baslangicSaati, bitisTarihi, bitisSaati] = watchFields;
    if (baslangicTarihi && baslangicSaati && bitisTarihi && bitisSaati) {
      const baslangicZamani = dayjs(baslangicTarihi).hour(baslangicSaati.hour()).minute(baslangicSaati.minute());
      const bitisZamani = dayjs(bitisTarihi).hour(bitisSaati.hour()).minute(bitisSaati.minute());

      const sure = bitisZamani.diff(baslangicZamani, "minute");
      setValue("sure", sure > 0 ? sure : 0);
    }
  }, [watchFields, setValue]);

  // iki tarih ve saat arasında geçen süreyi hesaplamak için sonu

  return (
    <div>
      <div
        style={{
          display: "flex",
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
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "450px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Tanımı:</Text>
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
            name="isTanimi"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                {error && <div style={{ color: "red" }}>{error.message}</div>}
              </div>
            )}
          />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          top: "10px",
          left: "10px",
          background: "white",
          width: "70px",
        }}>
        <Controller
          name="yapildi"
          control={control}
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
              Yapıldı
            </Checkbox>
          )}
        />
      </div>
      <div style={{ border: "1px solid #ececec", padding: "15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "435px",
            }}>
            <Text style={{ fontSize: "14px" }}>Atölye:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="atolyeTanim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="atolyeID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
              {yapildi ? (
                <AtolyeTablo
                  onSubmit={(selectedData) => {
                    setValue("atolyeTanim", selectedData.subject);
                    setValue("atolyeID", selectedData.key);
                  }}
                />
              ) : (
                <Button disabled={!yapildi}>+</Button>
              )}
              <Button disabled={!yapildi} onClick={handleAtolyeMinusClick}>
                -
              </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "435px",
            }}>
            <Text style={{ fontSize: "14px" }}>Personel:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                width: "300px",
              }}>
              <Controller
                name="personelTanim"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ width: "215px" }}
                    disabled
                  />
                )}
              />
              <Controller
                name="personelID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />

              {yapildi ? (
                <PersonelTablo
                  onSubmit={(selectedData) => {
                    setValue("personelTanim", selectedData.subject);
                    setValue("personelID", selectedData.key);
                  }}
                />
              ) : (
                <Button disabled={!yapildi}>+</Button>
              )}

              <Button disabled={!yapildi} onClick={handlePersonelMinusClick}>
                {" "}
                -{" "}
              </Button>
            </div>
          </StyledDivBottomLine>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <Text style={{ fontSize: "14px" }}>Başlangıç Zamanı:</Text>
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
              name="baslangicTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  disabled={!yapildi}
                  style={{ width: "180px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            <Controller
              name="baslangicSaati"
              control={control}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  disabled={!yapildi}
                  style={{ width: "110px" }}
                  format={localeTimeFormat}
                  placeholder="Saat seçiniz"
                />
              )}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Vardiya:</Text>
            <VardiyaSelect />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "720px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "435px",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: "14px" }}>Bitiş Zamanı:</Text>
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
                name="bitisTarihi"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    disabled={!yapildi}
                    style={{ width: "180px" }}
                    format={localeDateFormat}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="bitisSaati"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    disabled={!yapildi}
                    style={{ width: "110px" }}
                    format={localeTimeFormat}
                    placeholder="Saat seçiniz"
                  />
                )}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <Text style={{ fontSize: "14px" }}>Süre (dk):</Text>
            <Controller
              name="sure"
              control={control}
              render={({ field }) => <InputNumber {...field} disabled={!yapildi} min={0} style={{ width: "200px" }} />}
            />
          </div>
        </div>
        <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
