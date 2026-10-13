import { isValidElement } from "react";
import * as XLSX from "xlsx";

// Diger tablolardaki "İndir" ile ayni: Excel sutun genisligi = tablodaki kolon genisligi x 0.8 (piksel).
const GENISLIK_OLCEGI = 0.8;

// Ozel alan basliklari <div> icinde geldigi icin basligin duz metnini cikarir.
const metneCevir = (eleman) => {
  if (typeof eleman === "string" || typeof eleman === "number") return String(eleman);
  if (Array.isArray(eleman)) return eleman.map(metneCevir).join("");
  if (isValidElement(eleman)) return metneCevir(eleman.props.children);
  return "";
};

/**
 * Malzeme listesini tabloda gorunen kolonlar, tablodaki sirasi ve basligiyla "Sheet1" sayfasina yazar ve
 * dosyayi tarayicida indirir. Tabloda ikon olarak gosterilen evet/hayir alanlari metin olarak yazilir.
 */
export function malzemeListesiniExceleAktar(kayitlar, gorunurKolonlar, t) {
  const sutunlar = gorunurKolonlar.filter((kolon) => kolon.dataIndex);

  const satirlar = kayitlar.map((kayit) =>
    sutunlar.map((kolon) => {
      const deger = kayit[kolon.dataIndex];
      if (typeof deger === "boolean") return deger ? t("evet") : t("hayir");
      return deger ?? "";
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([sutunlar.map((kolon) => metneCevir(kolon.title)), ...satirlar]);
  worksheet["!cols"] = sutunlar.map((kolon) => ({ wpx: kolon.width ? kolon.width * GENISLIK_OLCEGI : 100 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${t("malzemeListesiExcelDosyaAdi")}.xlsx`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Indirme baslayana kadar adres gecerli kalsin.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
