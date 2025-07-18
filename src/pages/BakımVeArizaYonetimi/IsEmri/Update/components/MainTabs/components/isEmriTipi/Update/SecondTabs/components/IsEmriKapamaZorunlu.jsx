import { Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../../../api/http";

export default function IsEmriKapamaZorunlu() {
  const { control, watch, setValue } = useFormContext();
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, []); // Boş dizi, bu efektin bileşen yüklendiğinde bir kere çalıştırılacağını belirtir

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="kapamaZamani"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Kapama Zamanı
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="makineDurumuKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Makine Durumu
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="bakimPuaniKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Bakım Puanı
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="personelCalismaSuresiKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Personel Çalışma Süresi
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="makineKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Makine
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ekipmanKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Ekipman
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="sayacDegeriKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sayaç Değeri
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="prosedurKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Prosedür
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="isTipiKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                İş Tipi
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="okunanSayacKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Okunan Sayaç
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="isNedeniKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                İş Nedeni
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="konuKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Konu
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="oncelikKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Öncelik
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="atolyeKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Atölye
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="firmaKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Firma
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="sozlesmeKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Sözleşme
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="projeKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Proje
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="referansNoKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Referans No
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="ozelAlan1Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_1}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan2Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_2}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan3Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_3}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan4Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_4}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan5Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_5}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan6Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_6}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan7Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_7}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan8Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_8}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan9Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_9}
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="ozelAlan10Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_10}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan11Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_11}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan12Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_12}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan13Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_13}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan14Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_14}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan15Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_15}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan16Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_16}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan17Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_17}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan18Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_18}
              </Checkbox>
            )}
          />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div>
          <Controller
            name="ozelAlan19Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_19}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="ozelAlan20Kapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                {label.OZL_OZEL_ALAN_20}
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="aciklamaKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Açıklama
              </Checkbox>
            )}
          />
        </div>
        <div>
          <Controller
            name="notlarKapama"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Notlar
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
