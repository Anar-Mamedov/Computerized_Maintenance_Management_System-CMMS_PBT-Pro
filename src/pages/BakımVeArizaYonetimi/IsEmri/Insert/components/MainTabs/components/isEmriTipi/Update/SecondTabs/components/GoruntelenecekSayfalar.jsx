import { Checkbox } from "antd";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function ZorunluAlanlar() {
  const { control, watch, setValue } = useFormContext();

  const kontrolListesiTab = watch("kontrolListesiTab");
  const personelTab = watch("personelTab");
  const malzemelerTab = watch("malzemelerTab");
  const duruslarTab = watch("duruslarTab");
  const maliyetlerTab = watch("maliyetlerTab");
  const ekipmanIslemleriTab = watch("ekipmanIslemleriTab");
  const olcumDegerleriTab = watch("olcumDegerleriTab");
  const aracGereclerTab = watch("aracGereclerTab");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "250px" }}>
        <div>
          <Controller
            name="detayBilgiler"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} disabled onChange={(e) => field.onChange(e.target.checked)}>
                Detay Bilgiler
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="kontrolListesiTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Kontrol Listesi
              </Checkbox>
            )}
          />

          <Controller
            name="kontrolListesiTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!kontrolListesiTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="personelTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Personel
              </Checkbox>
            )}
          />

          <Controller
            name="personelTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!personelTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="malzemelerTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Malzemeler
              </Checkbox>
            )}
          />

          <Controller
            name="malzemelerTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!malzemelerTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="duruslarTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Duruşlar
              </Checkbox>
            )}
          />

          <Controller
            name="duruslarTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!duruslarTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="sureBilgileriTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Süre Bilgileri
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="maliyetlerTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Maliyetler
              </Checkbox>
            )}
          />

          <Controller
            name="maliyetlerTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!maliyetlerTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="ekipmanIslemleriTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Ekipman İşlemleri
              </Checkbox>
            )}
          />

          <Controller
            name="ekipmanIslemleriTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!ekipmanIslemleriTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="olcumDegerleriTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Ölçüm Değerleri
              </Checkbox>
            )}
          />

          <Controller
            name="olcumDegerleriTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!olcumDegerleriTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="ozelAlanlarTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Özel Alanlar
              </Checkbox>
            )}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Controller
            name="aracGereclerTab"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                Araç Gereçler
              </Checkbox>
            )}
          />

          <Controller
            name="aracGereclerTabZorunlu"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={!aracGereclerTab} // 'kontrolListesi' false ise 'kontrolListesiZorunlu' disable olur
              >
                Zorunlu
              </Checkbox>
            )}
          />
        </div>
      </div>
    </div>
  );
}
