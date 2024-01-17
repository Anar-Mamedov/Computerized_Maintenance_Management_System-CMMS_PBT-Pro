import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import MalzemeTablo from "./components/MalzemeTablo";
import MalzemeTipi from "./components/MalzemeTipi";
import Birim from "./components/Birim";

const { Text, Link } = Typography;
const { TextArea } = Input;

const onChange = (key) => {
  // console.log(key);
};

const StyledDivBottomLine = styled.div`
  ${"" /* number input okları kaldırma */}

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }

  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();
  const ondalikSayi = watch("ondalikSayi");
  const hedefDeger = watch("hedefDeger");
  const olcumLimit = watch("olcumLimit");
  const [focusedField, setFocusedField] = useState(null);

  // input alanları için ref'ler
  const hedefDegerRef = useRef(null);
  const olcumLimitRef = useRef(null);
  const minimumDegerRef = useRef(null);
  const maximumDegerRef = useRef(null);
  // ... Diğer ref'ler ...

  const formatDecimal = (value, decimalPlaces) => {
    if (!value && value !== 0) return value;

    // Nokta ile ayrılmış ondalık ve tam sayı kısımlarını al
    let [integer, decimal] = value.toString().replace(",", ".").split(".");

    if (!decimal) decimal = "";

    // toFixed ile yuvarlama yap ve sonucu string olarak al
    const rounded = parseFloat(`${integer}.${decimal}`).toFixed(decimalPlaces);

    // Sonucu virgül ile ayrılmış formata çevir
    return rounded.replace(".", ",");
  };

  useEffect(() => {
    const decimalPlaces = parseInt(ondalikSayi, 10) || 0;

    // Sadece odaklanılmamış alanları güncelle
    if (focusedField !== "hedefDeger" && hedefDegerRef.current) {
      setValue("hedefDeger", formatDecimal(watch("hedefDeger"), decimalPlaces), { shouldValidate: true });
    }
    if (focusedField !== "olcumLimit" && olcumLimitRef.current) {
      setValue("olcumLimit", formatDecimal(watch("olcumLimit"), decimalPlaces), { shouldValidate: true });
    }
    if (focusedField !== "minimumDeger" && minimumDegerRef.current) {
      setValue("minimumDeger", formatDecimal(watch("minimumDeger"), decimalPlaces), { shouldValidate: true });
    }
    if (focusedField !== "maximumDeger" && maximumDegerRef.current) {
      setValue("maximumDeger", formatDecimal(watch("maximumDeger"), decimalPlaces), { shouldValidate: true });
    }
    // ... Diğer alanlar için benzer koşullar ...

    // Hedef Değer ve Ölçüm Limiti hesapla
    const hesaplaVeGuncelle = () => {
      if (focusedField !== "hedefDeger" && focusedField !== "olcumLimit") {
        // String'i sayıya çevirirken virgülü noktaya dönüştür
        const maxDeger =
          parseFloat((hedefDeger || "0").replace(",", ".")) + parseFloat((olcumLimit || "0").replace(",", "."));
        setValue("maximumDeger", maxDeger.toFixed(decimalPlaces).replace(".", ","), { shouldValidate: true });

        const minDeger =
          parseFloat((hedefDeger || "0").replace(",", ".")) - parseFloat((olcumLimit || "0").replace(",", "."));
        setValue("minimumDeger", minDeger.toFixed(decimalPlaces).replace(".", ","), { shouldValidate: true });
      }
    };

    hesaplaVeGuncelle();
  }, [hedefDeger, olcumLimit, ondalikSayi, setValue, focusedField]);

  const onFocus = (name) => {
    setFocusedField(name);
  };

  const onBlur = (name) => {
    setFocusedField(null);
    const decimalPlaces = parseInt(ondalikSayi, 10) || 0;
    setValue(name, formatDecimal(watch(name), decimalPlaces), { shouldValidate: true });
  };

  return (
    <div>
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
      <div>
        <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
          <StyledDivBottomLine
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <Text style={{ fontSize: "14px" }}>Sira No</Text>
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
                name="olcumSiraNo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    style={{ flex: 1 }}
                    onKeyPress={(e) => {
                      // Sadece rakam girişine izin ver
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>
          </StyledDivBottomLine>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
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
            maxWidth: "602px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}>
          <Controller
            name="olcumTanim"
            control={control}
            render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
          />
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Birim:</Text>
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
            <Birim />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Ondalık Sayı:</Text>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              maxWidth: "200px",
              minWidth: "200px",
              gap: "10px",
              width: "100%",
            }}>
            <Controller
              name="ondalikSayi"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  style={{ flex: 1 }}
                  min={0}
                  max={20}
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (isNaN(value)) {
                      value = 0; // Sayı değilse 0'a ayarla
                    } else if (value < 0) {
                      value = 0; // Eksi değerse 0'a ayarla
                    } else if (value > 20) {
                      value = 20; // 20'den büyükse 20'ye ayarla
                    }
                    field.onChange(value); // Değeri güncelle
                  }}
                  onKeyPress={(e) => {
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || field.value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Hedef Değer:</Text>
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
              name="hedefDeger"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  ref={hedefDegerRef}
                  onFocus={() => onFocus("hedefDeger")}
                  onBlur={() => onBlur("hedefDeger")}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Limit (+)(-):</Text>
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
              name="olcumLimit"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  ref={olcumLimitRef}
                  onFocus={() => onFocus("olcumLimit")}
                  onBlur={() => onBlur("olcumLimit")}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Minimum Değer:</Text>
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
              name="minimumDeger"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  style={{ flex: 1 }}
                  ref={minimumDegerRef}
                  onFocus={() => onFocus("minimumDeger")}
                  onBlur={() => onBlur("minimumDeger")}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "450px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Maximum Değer:</Text>
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
              name="maximumDeger"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled
                  style={{ flex: 1 }}
                  ref={maximumDegerRef}
                  onFocus={() => onFocus("maximumDeger")}
                  onBlur={() => onBlur("maximumDeger")}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
    </div>
  );
}
