import { isValidElement } from "react";
import * as XLSX from "xlsx";

// Diger tablolardaki "İndir" ile ayni: Excel sutun genisligi = tablodaki kolon genisligi x 0.8 (piksel).
const GENISLIK_OLCEGI = 0.8;

// Kolon basligi JSX gelebilecegi icin duz metni cikarir.
const metneCevir = (eleman) => {
  if (typeof eleman === "string" || typeof eleman === "number") return String(eleman);
  if (Array.isArray(eleman)) return eleman.map(metneCevir).join("");
  if (isValidElement(eleman)) return metneCevir(eleman.props.children);
  return "";
};

/** Basliklar ve satirlar "Sheet1" sayfasina yazilir, dosya tarayicida indirilir. */
const dosyayaYaz = (sutunlar, satirlar, dosyaAdi) => {
  const sayfa = XLSX.utils.aoa_to_sheet([sutunlar.map((sutun) => sutun.baslik), ...satirlar]);
  sayfa["!cols"] = sutunlar.map((sutun) => ({ wpx: sutun.genislik ? sutun.genislik * GENISLIK_OLCEGI : 100 }));
  const kitap = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(kitap, sayfa, "Sheet1");
  XLSX.writeFile(kitap, `${dosyaAdi}.xlsx`);
};

/**
 * Detayli liste: tabloda gorunen kolonlar tablodaki sirasi ve basligiyla yazilir. Tabloda tek hucrede birlesen
 * bilgiler ayri sutuna acilir (ekipman kodu / tanimi, tarih + saat); evet/hayir alanlari metin olarak yazilir.
 */
export function durusListesiniExceleAktar(kayitlar, gorunurKolonlar, t, { tarihYaz, saatYaz }, dosyaAdi) {
  const tarihSaat = (tarih, saat) => [tarih ? tarihYaz(tarih) : "", saat ? saatYaz(saat) : ""].filter(Boolean).join(" ");

  const sutunlar = gorunurKolonlar
    .filter((kolon) => kolon.dataIndex)
    .flatMap((kolon) => {
      const baslik = metneCevir(kolon.title);
      switch (kolon.dataIndex) {
        case "MKN_KOD":
          return [
            { baslik: t("ekipmanKodu"), genislik: 120, deger: (kayit) => kayit.MKN_KOD },
            { baslik: t("ekipmanTanimi"), genislik: kolon.width, deger: (kayit) => kayit.MKN_TANIM },
          ];
        case "MKD_BASLAMA_TARIH":
          return [{ baslik, genislik: kolon.width, deger: (kayit) => tarihSaat(kayit.MKD_BASLAMA_TARIH, kayit.MKD_BASLAMA_SAAT) }];
        case "MKD_BITIS_TARIH":
          return [{ baslik, genislik: kolon.width, deger: (kayit) => tarihSaat(kayit.MKD_BITIS_TARIH, kayit.MKD_BITIS_SAAT) }];
        default:
          return [
            {
              baslik,
              genislik: kolon.width,
              deger: (kayit) => {
                const deger = kayit[kolon.dataIndex];
                if (typeof deger === "boolean") return deger ? t("evet") : t("hayir");
                return deger;
              },
            },
          ];
      }
    });

  const satirlar = kayitlar.map((kayit) => sutunlar.map((sutun) => sutun.deger(kayit) ?? ""));
  dosyayaYaz(sutunlar, satirlar, dosyaAdi);
}

/**
 * Aylik / yillik pivot yanitindaki satirlar. Excel ucu `data` (bicimli, ör. "91 sa 56 dk") ve `raw_data` (sayisal) doner;
 * Excel'de hesap yapilabilsin diye ayni kolon adlarini tasiyorsa `raw_data` tercih edilir.
 */
export const pivotSatirlari = (yanit, ornekAlan) => {
  const ham = Array.isArray(yanit?.raw_data) ? yanit.raw_data : [];
  const bicimli = Array.isArray(yanit?.data) ? yanit.data : [];
  return ham.length > 0 && ornekAlan in ham[0] ? ham : bicimli;
};

/** Pivot tablosu: `kolonlar` = [{ baslik, alan }] sirasiyla yazilir. */
export function pivotuExceleAktar(satirlar, kolonlar, dosyaAdi) {
  const sutunlar = kolonlar.map((kolon, index) => ({ ...kolon, genislik: index === 0 ? 200 : 110 }));
  dosyayaYaz(
    sutunlar,
    satirlar.map((satir) => sutunlar.map((sutun) => satir[sutun.alan] ?? "")),
    dosyaAdi
  );
}
