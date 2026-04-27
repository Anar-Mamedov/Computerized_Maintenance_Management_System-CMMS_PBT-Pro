import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, Slider, InputNumber, message } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { useAppContext } from "../../../../../../../../AppContext"; // Context hook'unu import edin
import AxiosInstance from "../../../../../../../../api/http";
import ProsedurTablo from "./components/ProsedurTablo";
import ProsedurTipi from "./components/ProsedurTipi";
import ProsedurNedeni from "./components/ProsedurNedeni";
import OncelikTablo from "./components/OncelikTablo";
import AtolyeTablo from "./components/AtolyeTablo";
import TalimatTablo from "./components/TalimatTablo";
import TakvimTablo from "./components/TakvimTablo";
import MasrafMerkeziTablo from "./components/MasrafMerkeziTablo";
import ProjeTablo from "./components/ProjeTablo";

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

export default function DetayBilgiler({ fieldRequirements }) {
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
  const [baslamaZamaniEditPermission, setBaslamaZamaniEditPermission] = useState(false);
  const [bitisZamaniEditPermission, setBitisZamaniEditPermission] = useState(false);

  // iş emri tipi selectboxu değiştiğinde prosedür ve ondan sonraki 3 fieldin değerlerini sıfırlamak için Context API kullanarak
  useEffect(() => {
    if (previousSelectedOption !== undefined && previousSelectedOption !== selectedOption) {
      // İlk render'da değil ve selectedOption değiştiğinde çalışacak kod
      handleProsedurMinusClick();
    }
  }, [selectedOption, previousSelectedOption]); // Bağımlılıklara previousSelectedOption ekleyin

  // iş emri tipi selectboxu değiştiğinde prosedür ve ondan sonraki 3 fieldin değerlerini sıfırlamak için son

  const prosedurTab = watch("prosedurTab");
  const prosedurID = watch("prosedurID");
  const secilenIsEmriID = watch("secilenIsEmriID");

  // Watch the 'kapali' field from the form
  const kapali = watch("kapali"); // Assuming 'kapali' is the name of the field in your form

  const handleProsedurMinusClick = async () => {
    if (secilenIsEmriID && prosedurID) {
      try {
        // API isteğini yap
        const response = await AxiosInstance.get(`RevmoveProsedurFromIsEmri?isEmriId=${secilenIsEmriID}&isTanimId=${prosedurID}`);
        // İsteğin başarılı olduğunu kontrol et
        if ((response && response.status_code === 200) || response.status_code === 201) {
          // Başarılı işlem mesajı veya başka bir işlem yap
          message.success("İşlem Başarılı!");
          console.log("İşlem başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("İşlem Başarısız!");
          // Hata mesajı göster
          console.error("Bir hata oluştu.");
        }
      } catch (error) {
        // Hata yakalama
        console.error("API isteği sırasında bir hata oluştu:", error);
        message.error("Başarısız Olundu.");
      }
    }

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

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama

  // Watch each field individually
  const baslamaZamani = useWatch({ control, name: "baslamaZamani" });
  const baslamaZamaniSaati = useWatch({ control, name: "baslamaZamaniSaati" });
  const bitisZamani = useWatch({ control, name: "bitisZamani" });
  const bitisZamaniSaati = useWatch({ control, name: "bitisZamaniSaati" });

  useEffect(() => {
    // Ensure all required fields have values
    if (baslamaZamani && baslamaZamaniSaati && bitisZamani && bitisZamaniSaati) {
      // Combine start date and time
      const startDateTime = dayjs(baslamaZamani).hour(baslamaZamaniSaati.hour()).minute(baslamaZamaniSaati.minute());

      // Combine end date and time
      const endDateTime = dayjs(bitisZamani).hour(bitisZamaniSaati.hour()).minute(bitisZamaniSaati.minute());

      // Calculate the difference in milliseconds
      const diff = endDateTime.diff(startDateTime);

      // Convert difference to hours and minutes
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Retrieve current values to prevent unnecessary updates
      const currentHours = getValues("calismaSaat");
      const currentMinutes = getValues("calismaDakika");

      // Update only if values have changed
      if (currentHours !== hours) {
        setValue("calismaSaat", hours);
      }
      if (currentMinutes !== minutes) {
        setValue("calismaDakika", minutes);
      }
    }
  }, [baslamaZamani, baslamaZamaniSaati, bitisZamani, bitisZamaniSaati, setValue, getValues]);

  //! Başlama Tarihi ve saati ile Bitiş Tarihi ve saati arasındaki farkı hesaplama sonu

  const setBaslamaZamani = () => {
    setValue("baslamaZamani", dayjs());
    setValue("baslamaZamaniSaati", dayjs());
  };
  const setBitisZamani = () => {
    setValue("bitisZamani", dayjs());
    setValue("bitisZamaniSaati", dayjs());
  };

  useEffect(() => {
    try {
      const userAuthorization = JSON.parse(localStorage.getItem("userAuthorization") || "[]");
      const permission = userAuthorization.find((item) => item.KYT_YETKI_KOD == 2014);
      const permissionBitisZamani = userAuthorization.find((item) => item.KYT_YETKI_KOD == 2015);

      if (permission) {
        setBaslamaZamaniEditPermission(permission.KYT_DEGISTIR);
      }
      if (permissionBitisZamani) {
        setBitisZamaniEditPermission(permissionBitisZamani.KYT_DEGISTIR);
      }
    } catch (error) {
      console.error("Yetki kontrolü sırasında bir hata oluştu:", error);
    }
  }, []);

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
      <div style={{ display: "flex", alignItems: "stretch", gap: "10px" }}>
        <div
          style={{
            background: "#F3F8FE",
            border: "1px solid #E5EDF7",
            borderRadius: "10px",
            padding: "16px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "450px",
          }}
        >
          <div
            style={{
              marginBottom: "5px",
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#0062ff",
              }}
            >
              İş Bilgileri
            </Text>
          </div>
          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
                width: "100%",
                maxWidth: "450px",
              }}
            >
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.prosedur ? "600" : "normal",
                    }}
                  >
                    Prosedür:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "325px",
                    }}
                  >
                    <Controller
                      name="prosedur"
                      control={control}
                      rules={{
                        required: fieldRequirements.prosedur ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          status={errors.prosedur ? "error" : ""}
                          type="text" // Set the type to "text" for name input
                          style={{ width: "240px" }}
                          disabled
                        />
                      )}
                    />
                    <Controller
                      name="prosedurID"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="text" // Set the type to "text" for name input
                          style={{ display: "none" }}
                        />
                      )}
                    />
                    <ProsedurTablo
                      onSubmit={(selectedData) => {
                        setValue("prosedur", selectedData.IST_KOD);
                        setValue("prosedurID", selectedData.key);
                        if (!getValues("konu")) {
                          setValue("konu", selectedData.IST_TANIM);
                        }
                        setValue("prosedurTipi", selectedData.IST_TIP);
                        setValue("prosedurTipiID", selectedData.IST_TIP_KOD_ID);
                        setValue("prosedurNedeni", selectedData.IST_NEDEN);
                        setValue("prosedurNedeniID", selectedData.IST_NEDEN_KOD_ID);
                      }}
                    />
                    <Button disabled={kapali} onClick={handleProsedurMinusClick}>
                      {" "}
                      -{" "}
                    </Button>
                    {errors.prosedur && <div style={{ color: "red", marginTop: "5px" }}>{errors.prosedur.message}</div>}
                  </div>
                </StyledDivBottomLine>
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.konu ? "600" : "normal",
                    }}
                  >
                    Konu:
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      maxWidth: "325px",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Controller
                      name="konu"
                      control={control}
                      rules={{
                        required: fieldRequirements.konu ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field }) => <Input {...field} status={errors.konu ? "error" : ""} style={{ flex: 1 }} />}
                    />
                    {errors.konu && <div style={{ color: "red", marginTop: "5px" }}>{errors.konu.message}</div>}
                  </div>
                </StyledDivBottomLine>
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.prosedurTipi ? "600" : "normal",
                    }}
                  >
                    Tipi:
                  </Text>
                  <ProsedurTipi fieldRequirements={fieldRequirements} />
                </StyledDivBottomLine>
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
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: fieldRequirements.prosedurNedeni ? "600" : "normal",
                    }}
                  >
                    Nedeni:
                  </Text>
                  <ProsedurNedeni fieldRequirements={fieldRequirements} />
                </StyledDivBottomLine>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", marginTop: "5px" }}>
            <Controller name="isEmriAciklama" control={control} render={({ field }) => <TextArea {...field} rows={3} style={{ width: "100%" }} placeholder="Açıklama" />} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            flex: "1 1 400px",
            maxWidth: "475px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              background: "#F3F8FE",
              border: "1px solid #E5EDF7",
              borderRadius: "10px",
              padding: "16px",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "5px",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#0062ff",
                }}
              >
                Detay Bilgiler
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <StyledDivBottomLine style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%", maxWidth: "450px" }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.oncelikTanim ? "600" : "normal" }}>Öncelik:</Text>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
                  <Controller
                    name="oncelikTanim"
                    control={control}
                    rules={{ required: fieldRequirements.oncelikTanim ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field }) => <Input {...field} status={errors.oncelikTanim ? "error" : ""} type="text" style={{ width: "215px" }} disabled />}
                  />
                  <Controller name="oncelikID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
                  <OncelikTablo
                    onSubmit={(selectedData) => {
                      setValue("oncelikTanim", selectedData.subject);
                      setValue("oncelikID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleOncelikMinusClick}> - </Button>
                  {errors.oncelikTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.oncelikTanim.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <StyledDivBottomLine style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%", maxWidth: "450px" }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.atolyeTanim ? "600" : "normal" }}>Atölye:</Text>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
                  <Controller
                    name="atolyeTanim"
                    control={control}
                    rules={{ required: fieldRequirements.atolyeTanim ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field }) => <Input {...field} status={errors.atolyeTanim ? "error" : ""} type="text" style={{ width: "215px" }} disabled />}
                  />
                  <Controller name="atolyeID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
                  <AtolyeTablo
                    onSubmit={(selectedData) => {
                      setValue("atolyeTanim", selectedData.subject);
                      setValue("atolyeID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleAtolyeMinusClick}> - </Button>
                  {errors.atolyeTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.atolyeTanim.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <StyledDivBottomLine style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%", maxWidth: "450px" }}>
                <Text style={{ fontSize: "14px", fontWeight: fieldRequirements.talimatTanim ? "600" : "normal" }}>Talimat:</Text>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", width: "300px" }}>
                  <Controller
                    name="talimatTanim"
                    control={control}
                    rules={{ required: fieldRequirements.talimatTanim ? "Alan Boş Bırakılamaz!" : false }}
                    render={({ field }) => <Input {...field} status={errors.talimatTanim ? "error" : ""} type="text" style={{ width: "215px" }} disabled />}
                  />
                  <Controller name="talimatID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
                  <TalimatTablo
                    onSubmit={(selectedData) => {
                      setValue("talimatTanim", selectedData.subject);
                      setValue("talimatID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleTalimatMinusClick}> - </Button>
                  {errors.talimatTanim && <div style={{ color: "red", marginTop: "5px" }}>{errors.talimatTanim.message}</div>}
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
                  maxWidth: "450px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.masrafMerkezi ? "600" : "normal",
                  }}
                >
                  Masraf Merkezi:
                </Text>
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
                    name="masrafMerkezi"
                    control={control}
                    rules={{
                      required: fieldRequirements.masrafMerkezi ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.masrafMerkezi ? "error" : ""}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "215px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="masrafMerkeziID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ display: "none" }}
                      />
                    )}
                  />
                  <MasrafMerkeziTablo
                    onSubmit={(selectedData) => {
                      setValue("masrafMerkezi", selectedData.age);
                      setValue("masrafMerkeziID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleMasrafMerkeziMinusClick}> - </Button>
                  {errors.masrafMerkezi && <div style={{ color: "red", marginTop: "5px" }}>{errors.masrafMerkezi.message}</div>}
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
                  maxWidth: "450px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.proje ? "600" : "normal",
                  }}
                >
                  Proje:
                </Text>
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
                    name="proje"
                    control={control}
                    rules={{
                      required: fieldRequirements.proje ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        status={errors.proje ? "error" : ""}
                        type="text" // Set the type to "text" for name input
                        style={{ width: "215px" }}
                        disabled
                      />
                    )}
                  />
                  <Controller
                    name="projeID"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text" // Set the type to "text" for name input
                        style={{ display: "none" }}
                      />
                    )}
                  />
                  <ProjeTablo
                    onSubmit={(selectedData) => {
                      setValue("proje", selectedData.subject);
                      setValue("projeID", selectedData.key);
                    }}
                  />
                  <Button onClick={handleProjeMinusClick}> - </Button>
                  {errors.proje && <div style={{ color: "red", marginTop: "5px" }}>{errors.proje.message}</div>}
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
                  maxWidth: "450px",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.tamamlanmaOranı ? "600" : "normal",
                  }}
                >
                  Tamamlanma %:
                </Text>
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
                    name="tamamlanmaOranı"
                    control={control}
                    rules={{
                      required: fieldRequirements.tamamlanmaOranı ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field }) => <InputNumber {...field} min={0} max={100} status={errors.tamamlanmaOranı ? "error" : ""} style={{ width: "60px" }} />}
                  />
                  <Controller name="tamamlanmaOranı" control={control} render={({ field }) => <Slider {...field} style={{ width: "220px" }} />} />
                  {errors.tamamlanmaOranı && <div style={{ color: "red", marginTop: "5px" }}>{errors.tamamlanmaOranı.message}</div>}
                </div>
              </StyledDivBottomLine>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            width: "100%",
            maxWidth: "515px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "column",
              width: "100%",
              maxWidth: "515px",
            }}
          >
            <div
              style={{
                background: "#F3F8FE",
                border: "1px solid #E5EDF7",
                borderRadius: "10px",
                padding: "16px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  marginBottom: "5px",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#0062ff",
                  }}
                >
                  Çalışma Süresi
                </Text>
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
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.planlananBaslama ? "600" : "normal",
                  }}
                >
                  Planlanan Başlama:
                </Text>
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
                    name="planlananBaslama"
                    control={control}
                    rules={{
                      required: fieldRequirements.planlananBaslama ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        status={errors.planlananBaslama ? "error" : ""}
                        // disabled={!isDisabled}
                        style={{ width: "180px" }}
                        format={localeDateFormat}
                        placeholder="Tarih seçiniz"
                      />
                    )}
                  />
                  <Controller
                    name="planlananBaslamaSaati"
                    control={control}
                    rules={{
                      required: fieldRequirements.planlananBaslama ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker
                        {...field}
                        changeOnScroll
                        needConfirm={false}
                        status={errors.planlananBaslama ? "error" : ""}
                        // disabled={!isDisabled}
                        style={{ width: "110px" }}
                        format={localeTimeFormat}
                        placeholder="Saat seçiniz"
                      />
                    )}
                  />
                  {errors.planlananBaslama && <div style={{ color: "red", marginTop: "5px" }}>{errors.planlananBaslama.message}</div>}
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
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.planlananBitis ? "600" : "normal",
                  }}
                >
                  Planlanan Bitiş:
                </Text>
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
                    name="planlananBitis"
                    control={control}
                    rules={{
                      required: fieldRequirements.planlananBitis ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        {...field}
                        status={errors.planlananBitis ? "error" : ""}
                        // disabled={!isDisabled}
                        style={{ width: "180px" }}
                        format={localeDateFormat}
                        placeholder="Tarih seçiniz"
                      />
                    )}
                  />
                  <Controller
                    name="planlananBitisSaati"
                    control={control}
                    rules={{
                      required: fieldRequirements.planlananBitis ? "Alan Boş Bırakılamaz!" : false,
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TimePicker
                        {...field}
                        changeOnScroll
                        needConfirm={false}
                        status={errors.planlananBitis ? "error" : ""}
                        // disabled={!isDisabled}
                        style={{ width: "110px" }}
                        format={localeTimeFormat}
                        placeholder="Saat seçiniz"
                      />
                    )}
                  />
                  {errors.planlananBitis && <div style={{ color: "red", marginTop: "5px" }}>{errors.planlananBitis.message}</div>}
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
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.baslamaZamani ? "600" : "normal",
                  }}
                >
                  Başlama Zamanı:
                </Text>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Controller
                      name="baslamaZamani"
                      control={control}
                      rules={{
                        required: fieldRequirements.baslamaZamani ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          disabled={!baslamaZamaniEditPermission}
                          status={errors.baslamaZamani ? "error" : ""}
                          // disabled={!isDisabled}
                          style={{ width: "145px" }}
                          format={localeDateFormat}
                          placeholder="Tarih seçiniz"
                        />
                      )}
                    />
                    <Controller
                      name="baslamaZamaniSaati"
                      control={control}
                      rules={{
                        required: fieldRequirements.baslamaZamaniSaati ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TimePicker
                          {...field}
                          disabled={!baslamaZamaniEditPermission}
                          changeOnScroll
                          needConfirm={false}
                          status={errors.baslamaZamaniSaati ? "error" : ""}
                          // disabled={!isDisabled}
                          style={{ width: "100px" }}
                          format={localeTimeFormat}
                          placeholder="Saat seçiniz"
                        />
                      )}
                    />

                    <Button type="primary" onClick={setBaslamaZamani}>
                      <ClockCircleOutlined />
                    </Button>
                  </div>
                  {errors.baslamaZamaniSaati && <div style={{ color: "red", marginTop: "5px" }}>{errors.baslamaZamaniSaati.message}</div>}
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
                }}
              >
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.bitisZamani ? "600" : "normal",
                  }}
                >
                  Bitiş Zamanı:
                </Text>
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
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Controller
                      name="bitisZamani"
                      control={control}
                      rules={{
                        required: fieldRequirements.bitisZamani ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <DatePicker
                          {...field}
                          disabled={!bitisZamaniEditPermission}
                          status={errors.bitisZamani ? "error" : ""}
                          // disabled={!isDisabled}
                          style={{ width: "145px" }}
                          format={localeDateFormat}
                          placeholder="Tarih seçiniz"
                        />
                      )}
                    />
                    <Controller
                      name="bitisZamaniSaati"
                      control={control}
                      rules={{
                        required: fieldRequirements.bitisZamaniSaati ? "Alan Boş Bırakılamaz!" : false,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <TimePicker
                          {...field}
                          disabled={!bitisZamaniEditPermission}
                          changeOnScroll
                          needConfirm={false}
                          status={errors.bitisZamaniSaati ? "error" : ""}
                          // disabled={!isDisabled}
                          style={{ width: "100px" }}
                          format={localeTimeFormat}
                          placeholder="Saat seçiniz"
                        />
                      )}
                    />
                    <Button type="primary" onClick={setBitisZamani} disabled={!baslamaZamani || !baslamaZamaniSaati}>
                      <ClockCircleOutlined />
                    </Button>
                  </div>
                  {errors.bitisZamaniSaati && <div style={{ color: "red", marginTop: "5px" }}>{errors.bitisZamaniSaati.message}</div>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.calismaSuresi ? "600" : "normal",
                  }}
                >
                  Çalışma Süresi Saat:
                </Text>
                <Controller
                  name="calismaSaat"
                  control={control}
                  rules={{
                    required: fieldRequirements.calismaSuresi ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field }) => (
                    <InputNumber
                      {...field}
                      min={0}
                      // max={24}
                      status={errors.calismaSuresi ? "error" : ""}
                      style={{ width: "300px" }}
                    />
                  )}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: fieldRequirements.calismaDakika ? "600" : "normal",
                  }}
                >
                  Çalışma Süresi Dakika:
                </Text>
                <Controller
                  name="calismaDakika"
                  control={control}
                  rules={{
                    required: fieldRequirements.calismaDakika ? "Alan Boş Bırakılamaz!" : false,
                  }}
                  render={({ field }) => <InputNumber {...field} min={0} max={59} status={errors.calismaDakika ? "error" : ""} style={{ width: "300px" }} />}
                />
              </div>
              {errors.calismaDakika && <div style={{ color: "red", marginTop: "5px" }}>{errors.calismaDakika.message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
