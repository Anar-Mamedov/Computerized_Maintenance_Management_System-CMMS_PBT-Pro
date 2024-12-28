import { Checkbox, ColorPicker, Input, Radio, Typography, Tag } from "antd";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import SecondTabs from "./SecondTabs";

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

export default function EditTabs() {
  const { control, watch, setValue } = useFormContext();

  function hexToRGBA(color, opacity) {
    // 1) Geçersiz parametreleri engelle
    if (!color || color.trim() === "" || opacity == null) {
      // Boş ya da null renk için boş değer döndürelim
      return;
    }

    // 2) rgb(...) veya rgba(...) formatını yakala
    if (color.startsWith("rgb(") || color.startsWith("rgba(")) {
      // Örnek: "rgb(0,123,255)" -> ["0","123","255"]
      // Örnek: "rgba(255,0,0,0.96)" -> ["255","0","0","0.96"]
      const rawValues = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
      const r = parseInt(rawValues[0], 10) || 0;
      const g = parseInt(rawValues[1], 10) || 0;
      const b = parseInt(rawValues[2], 10) || 0;
      // Her hâlükârda dışarıdan gelen `opacity` ile override edelim
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 3) "#" ile başlayan (HEX) formatları işle
    if (color.startsWith("#")) {
      let r = 0,
        g = 0,
        b = 0;

      // => #rgb  (3 hane)
      if (color.length === 4) {
        // #abc -> r=aa, g=bb, b=cc
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rgba (4 hane)
      else if (color.length === 5) {
        // #abcf -> r=aa, g=bb, b=cc, a=ff (ama biz alpha’yı yok sayıp dışarıdan gelen opacity'yi kullanacağız)
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        // color[4] + color[4] => alpha. Ama override ediyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbb (6 hane)
      else if (color.length === 7) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbbaa (8 hane)
      else if (color.length === 9) {
        // #ff0000c9 gibi
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        // Son 2 karakter alpha’ya denk geliyor ama biz fonksiyon parametresini kullanıyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }

    // 4) Hiçbir formata uymuyorsa default dön
    return `rgba(0, 0, 0, ${opacity})`;
  }

  const isEmriTipiRenk = watch("isEmriTipiRenk");

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "525px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>İş Emri Tanımı:</Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              name="isEmriTipiTanim"
              control={control}
              rules={{ required: "Alan Boş Bırakılamaz!" }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                  <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                  {error && <div style={{ color: "red" }}>{error.message}</div>}
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
          <div>
            <Controller
              name="varsayilanIsEmriTipi"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Varsayılan
                </Checkbox>
              )}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "408px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Görünüm:</Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            <div>
              <Tag
                style={{
                  backgroundColor: hexToRGBA(isEmriTipiRenk ? isEmriTipiRenk : "#000000", 0.2),
                  border: `1.2px solid ${hexToRGBA(isEmriTipiRenk ? isEmriTipiRenk : "#000000", 0.7)}`,
                  color: isEmriTipiRenk ? isEmriTipiRenk : "#000000",
                }}
              >
                {watch("isEmriTipiTanim")}
              </Tag>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "408px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}
      >
        <Text style={{ fontSize: "14px" }}>Renk:</Text>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              name="isEmriTipiRenk"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  {...field}
                  showText
                  onChange={(color) => {
                    // Rengi hex formatında al
                    const hexColor = color.toHexString();
                    // Form durumunu güncelle
                    field.onChange(hexColor);
                  }}
                />
              )}
            />

            <Controller
              name="aktifIsEmriTipi"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Aktif
                </Checkbox>
              )}
            />
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <Text style={{ position: "relative", top: "10px", backgroundColor: "white", left: "10px" }}>Prosedür Tipi</Text>
        <div
          style={{
            border: "1px solid #80808068",
            borderRadius: "5px",
            padding: "10px",
            maxWidth: "460px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Controller
            name="tipGroup"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Radio value={1}>Arıza</Radio>
                <Radio value={2}>Bakım</Radio>
                <Radio value={3}>Periyodik Bakım</Radio>
                <Radio value={4}>İş Talebi</Radio>
                <Radio value={5}>Diger</Radio>
              </Radio.Group>
            )}
          />
        </div>
      </div>
      <SecondTabs />
    </div>
  );
}
