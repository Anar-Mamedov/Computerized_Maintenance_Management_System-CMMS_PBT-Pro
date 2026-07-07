import React, { useEffect, useState } from "react";
import { Drawer, Typography, Button, Input, Select, Row, Col, Checkbox, ColorPicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import LokasyonTablo from "../../../../../../utils/components/LokasyonTablo";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import IsEmriDurumModal from "./components/IsEmriDurumModal";
import IsEmriTipiSelect from "./components/IsEmriTipiSelect";
import MakineDurumu from "./components/MakineDurumu";
import MakineTablo from "../../../../../../utils/components/Machina/MakineTablo";
import EkipmanTablo from "../../../../../../utils/components/EkipmanTablo";
import FullDatePicker from "../../../../../../utils/components/FullDatePicker";
import FullTimePicker from "../../../../../../utils/components/FullTimePicker";

const { Text, Link } = Typography;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 300px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function MainTabs({ drawerOpen, isDisabled, fieldRequirements }) {
  const [duzenlemeZamaniEditPermission, setDuzenlemeZamaniEditPermission] = useState(false);
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon

  const validateDateTime = () => {
    const date = watch("duzenlenmeTarihi");
    const time = watch("duzenlenmeSaati");
    if (!date || !time) {
      return t("workOrder.validation.required");
    }
    const currentTime = dayjs();
    const inputDateTime = dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${dayjs(time).format("HH:mm")}`);
    if (inputDateTime.isAfter(currentTime)) {
      return t("workOrder.validation.arrangementDateTimeFuture");
    }
    return true;
  };

  // duzenlenmeTarihi ve duzenlenmeSaati alanlarının boş ve ye sistem tarih ve saatinden büyük olup olmadığını kontrol etmek için bir fonksiyon sonu

  const otonomBakimValue = watch("otonomBakim");

  const handleIsEmriDurumMinusClick = () => {
    setValue("isEmriDurum", "");
    setValue("isEmriDurumID", "");
  };

  const handleIlgiliKisiMinusClick = () => {
    setValue("ilgiliKisi", "");
    setValue("ilgiliKisiID", "");
  };

  const handleOncelikMinusClick = () => {
    setValue("oncelikTanim", "");
    setValue("oncelikID", "");
  };

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
    setValue("tamLokasyonTanim", "");
    setValue("makine", "");
    setValue("makineID", "");
    setValue("makineTanim", "");
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
    setValue("makineDurumu", null);
    setValue("makineDurumuID", "");
    setValue("garantiBitis", "");
  };

  const handleEkipmanMinusClick = () => {
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
  };

  const handleMakineMinusClick = () => {
    setValue("makine", "");
    setValue("makineID", "");
    setValue("makineTanim", "");
    setValue("ekipman", "");
    setValue("ekipmanID", "");
    setValue("ekipmanTanim", "");
    setValue("makineDurumu", null);
    setValue("makineDurumuID", "");
    setValue("garantiBitis", "");
  };

  // sistemin o anki tarih ve saatini almak için

  useEffect(() => {
    if (drawerOpen) {
      const currentDate = dayjs(); // Şu anki tarih için dayjs nesnesi
      const currentTime = dayjs(); // Şu anki saat için dayjs nesnesi

      // Tarih ve saat alanlarını güncelle
      setValue("duzenlenmeTarihi", currentDate);
      setValue("duzenlenmeSaati", currentTime);
    }
  }, [drawerOpen, setValue]);

  // sistemin o anki tarih ve saatini almak sonu

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

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  useEffect(() => {
    try {
      const userAuthorization = JSON.parse(localStorage.getItem("userAuthorization") || "[]");
      const permission = userAuthorization.find((item) => item.KYT_YETKI_KOD == 2010);

      if (permission) {
        setDuzenlemeZamaniEditPermission(permission.KYT_DEGISTIR);
      }
    } catch (error) {
      console.error("Yetki kontrolü sırasında bir hata oluştu:", error);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "20px",
        rowGap: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #e8e8e8",
              marginBottom: "5px",
              paddingBottom: "5px",
              width: "100%",
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Genel Bilgiler</Text>
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
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri No:</Text>
            <div
              style={{
                display: "flex",
                // flexWrap: "wrap",
                alignItems: "flex-start",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}
            >
              <Controller
                name="isEmriNo"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                    }}
                  >
                    <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                  </div>
                )}
              />
              <Controller
                name="secilenIsEmriID"
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
              maxWidth: "450px",
              gap: "10px",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "600" }}>{t("workOrder.main.arrangementDateTime")}:</Text>
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
              <FullDatePicker
                name1="duzenlenmeTarihi"
                rules={{ validate: validateDateTime }}
                disabled={!duzenlemeZamaniEditPermission}
                style={{ flex: "none", width: "180px" }}
                placeholder={t("workOrder.detail.selectDate")}
                showError={false}
              />
              <FullTimePicker
                name1="duzenlenmeSaati"
                rules={{ validate: validateDateTime }}
                disabled={!duzenlemeZamaniEditPermission}
                changeOnScroll
                style={{ flex: "none", width: "110px" }}
                placeholder={t("workOrder.detail.selectTime")}
                showError={false}
              />
              {errors.duzenlenmeSaati && <div style={{ color: "red" }}>{errors.duzenlenmeSaati.message}</div>}
            </div>
          </div>
          <div style={{ width: "100%", maxWidth: "450px" }}>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri Tipi:</Text>
              <IsEmriTipiSelect fieldRequirements={fieldRequirements} />
            </StyledDivBottomLine>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "450px",
              }}
            >
              <Text style={{ fontSize: "14px", fontWeight: "600" }}>Durum:</Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "300px",
                }}
              >
                <Controller
                  name="isEmriDurum"
                  control={control}
                  rules={{ required: "Alan Boş Bırakılamaz!" }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      status={errors.isEmriDurum ? "error" : ""}
                      type="text" // Set the type to "text" for name input
                      style={{ width: "265px" }}
                      disabled
                    />
                  )}
                />
                <Controller
                  name="isEmriDurumID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      style={{ display: "none" }}
                    />
                  )}
                />
                <IsEmriDurumModal
                  fieldRequirements={fieldRequirements}
                  onSubmit={(selectedData) => {
                    setValue("isEmriDurum", selectedData.ISK_ISIM);
                    setValue("isEmriDurumID", selectedData.key);
                  }}
                />
                {errors.isEmriDurum && <div style={{ color: "red", marginTop: "10px" }}>{errors.isEmriDurum.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "15px",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
            maxWidth: "700px",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid #e8e8e8",
              marginBottom: "5px",
              paddingBottom: "5px",
              width: "100%",
            }}
          >
            <Text style={{ fontSize: "14px", fontWeight: "500", color: "#0062ff" }}>Ekipman / Lokasyon Bilgileri</Text>
          </div>
          <StyledDivMedia
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: fieldRequirements.lokasyonTanim ? "600" : "normal",
              }}
            >
              Lokasyon:
            </Text>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "565px" }}>
              <div style={{ width: "260px" }}>
                <LokasyonTablo
                  lokasyonFieldName="lokasyonTanim"
                  lokasyonIdFieldName="lokasyonID"
                  isRequired={fieldRequirements.lokasyonTanim}
                  onSubmit={(selectedData) => {
                    setValue("lokasyonTanim", selectedData.LOK_TANIM);
                    setValue("lokasyonID", selectedData.key);
                    setValue("tamLokasyonTanim", selectedData.LOK_TUM_YOL);
                  }}
                  onClear={handleLokasyonMinusClick}
                />
              </div>
              <Controller name="tamLokasyonTanim" control={control} render={({ field }) => <Input {...field} style={{ width: "300px" }} disabled type="text" />} />
            </div>
          </StyledDivMedia>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "700px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.makine ? "600" : "normal",
                }}
              >
                Ekipman:
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "565px" }}>
                <div style={{ width: "260px" }}>
                  <MakineTablo
                    makineFieldName="makine"
                    makineIdFieldName="makineID"
                    isRequired={fieldRequirements.makine}
                    includeAtolyeFilter={false}
                    onSubmit={(selectedData) => {
                      setValue("makine", selectedData.MKN_KOD);
                      setValue("makineID", selectedData.key);
                      setValue("makineTanim", selectedData.MKN_TANIM);
                      setValue("lokasyonID", selectedData.MKN_LOKASYON_ID);
                      setValue("lokasyonTanim", selectedData.MKN_LOKASYON);
                      setValue("tamLokasyonTanim", selectedData.MKN_LOKASYON_TUM_YOL);
                      setValue("makineDurumu", selectedData.MKN_DURUM);
                      setValue("makineDurumuID", selectedData.MKN_DURUM_KOD_ID);
                      setValue("garantiBitis", formatDate(selectedData.MKN_GARANTI_BITIS));
                    }}
                    onClear={handleMakineMinusClick}
                  />
                </div>
                <Controller name="makineTanim" control={control} render={({ field }) => <Input {...field} type="text" style={{ width: "300px" }} disabled />} />
              </div>
            </StyledDivBottomLine>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "700px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.ekipman ? "600" : "normal",
                }}
              >
                Alt Ekipman:
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", width: "565px" }}>
                <div style={{ width: "260px" }}>
                  <EkipmanTablo
                    ekipmanFieldName="ekipman"
                    ekipmanIdFieldName="ekipmanID"
                    isRequired={fieldRequirements.ekipman}
                    requireMakineSelection={true}
                    makineIdFieldName="makineID"
                    onSubmit={(selectedData) => {
                      setValue("ekipman", selectedData.EKP_KOD || selectedData.kod || "");
                      setValue("ekipmanID", selectedData.key);
                      setValue("ekipmanTanim", selectedData.EKP_TANIM || selectedData.tanim || "");
                    }}
                    onClear={handleEkipmanMinusClick}
                  />
                </div>
                <Controller name="ekipmanTanim" control={control} render={({ field }) => <Input {...field} type="text" style={{ width: "300px" }} disabled />} />
              </div>
            </StyledDivBottomLine>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "700px",
              gap: "5px",
            }}
          >
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.makineDurumu ? "600" : "normal",
                }}
              >
                Ekipman Durumu:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  maxWidth: "260px",
                  gap: "10px",
                  width: "100%",
                }}
              >
                <MakineDurumu fieldRequirements={fieldRequirements} />
              </div>
            </StyledDivBottomLine>
            <StyledDivBottomLine
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: fieldRequirements.sayac ? "600" : "normal",
                }}
              >
                Sayaç:
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Controller
                    name="sayac"
                    control={control}
                    rules={{
                      required: fieldRequirements.sayac ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.sayac ? "error" : ""}
                        type="number" // Set the type to "text" for name input
                        style={{ width: "225px" }}
                      />
                    )}
                  />
                </div>

                {errors.sayac && <div style={{ color: "red", marginTop: "5px" }}>{errors.sayac.message}</div>}
              </div>
            </StyledDivBottomLine>
          </div>
        </div>
      </div>
    </div>
  );
}
