import * as XLSX from "xlsx";

/**
 * Satirlari "Sheet1" sayfasina yazip indirir. Sayilar ham sayi olarak yazilir (dokuman: formatlama yalnizca
 * arayuzde yapilir, Excel'de siralama bozulmasin).
 * @param {{ satirlar: object[], sutunlar: { baslik: string, deger: (satir: object) => any, genislik?: number }[], dosyaAdi: string }} secenekler
 */
export function exceleAktar({ satirlar, sutunlar, dosyaAdi }) {
  const basliklar = sutunlar.map((sutun) => sutun.baslik);
  const veri = satirlar.map((satir) => Object.fromEntries(sutunlar.map((sutun) => [sutun.baslik, sutun.deger(satir) ?? ""])));
  const sayfa = XLSX.utils.json_to_sheet(veri, { header: basliklar });
  sayfa["!cols"] = sutunlar.map((sutun) => ({ wch: sutun.genislik ?? 18 }));

  const kitap = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(kitap, sayfa, "Sheet1");
  XLSX.writeFile(kitap, `${dosyaAdi}.xlsx`);
}
