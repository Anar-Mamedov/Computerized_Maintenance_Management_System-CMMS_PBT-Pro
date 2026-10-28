import * as XLSX from "xlsx";
import { t } from "i18next";
import { getExcelVerisi } from "./sayacHareketleriService";

/**
 * ExportExcel JSON satir donerse dosya bu kolonlarla kurulur: [baslik anahtari, alan]. Sayilar ham deger olarak
 * yazilir (Excel'de sayi olarak kalsin diye). Uc dogrudan dosya donerse oldugu gibi indirilir.
 */
const SUTUNLAR = {
  movements: [
    ["sayacHareketleri.kolon.tarihSaat", "readingDateTimeFormatted"],
    ["ekipmanKodu", "equipmentCode"],
    ["ekipmanTanimi", "equipmentName"],
    ["sayacHareketleri.kolon.sayac", "counterName"],
    ["sayacHareketleri.kolon.okunanDeger", "readingValue"],
    ["sayacHareketleri.kolon.birim", "unit"],
    ["sayacHareketleri.kolon.oncekiDeger", "previousReadingValue"],
    ["sayacHareketleri.kolon.degisim", "incrementValue"],
    ["sayacHareketleri.kolon.kayitKaynagi", "sourceType"],
    ["sayacHareketleri.kolon.aciklama", "description"],
  ],
  summary: [
    ["ekipmanKodu", "equipmentCode"],
    ["ekipmanTanimi", "equipmentName"],
    ["sayacHareketleri.kolon.ekipmanTipi", "equipmentType"],
    ["marka", "brand"],
    ["lokasyon", "locationName"],
    ["sayacHareketleri.kolon.sayacTipi", "counterType"],
    ["sayacHareketleri.kolon.sonOkuma", "lastReadingValue"],
    ["sayacHareketleri.kolon.birim", "unit"],
    ["sayacHareketleri.kolon.sonOkumaTarihi", "lastReadingDateFormatted"],
    ["sayacHareketleri.kolon.donemDegisimi", "periodChange"],
    ["sayacHareketleri.kolon.kayitSayisi", "readingCount"],
  ],
  comparison: [
    ["sayacHareketleri.kolon.grup", "groupName"],
    ["sayacHareketleri.kolon.ekipmanSayisi", "equipmentCount"],
    ["sayacHareketleri.kolon.toplamArtis", "totalIncrease"],
    ["sayacHareketleri.kolon.ekipmanBasinaOrtalama", "averagePerEquipment"],
  ],
};

const dosyayiIndir = (blob, dosyaAdi) => {
  const baglanti = document.createElement("a");
  baglanti.href = URL.createObjectURL(blob);
  baglanti.download = dosyaAdi;
  document.body.appendChild(baglanti);
  baglanti.click();
  baglanti.remove();
  URL.revokeObjectURL(baglanti.href);
};

/** JSON yanittaki satirlar: `data.items`, `data` ya da `items`. */
const satirlariBul = (json) => [json?.data?.items, json?.data, json?.items].find(Array.isArray) ?? [];

/** Blob olarak gelen hata govdesinden backend mesajini cikarir. */
export const excelHataMesaji = async (hata) => {
  const govde = hata?.response?.data;
  if (govde instanceof Blob) {
    try {
      return JSON.parse(await govde.text())?.message || t("hataOlustu");
    } catch {
      return t("hataOlustu");
    }
  }
  return hata?.message || t("hataOlustu");
};

/**
 * "Indir": acik sekmenin tum filtreleriyle sayfalamasiz veri indirilir. Bos sonucta false doner.
 * @returns {Promise<boolean>}
 */
export async function exceleAktar({ govde, excelTab, dosyaAdi }) {
  const yanit = await getExcelVerisi({ ...govde, tab: excelTab });

  if (!(yanit instanceof Blob) || !/json|text/.test(yanit.type)) {
    dosyayiIndir(yanit instanceof Blob ? yanit : new Blob([yanit]), `${dosyaAdi}.xlsx`);
    return true;
  }

  const json = JSON.parse(await yanit.text());
  if (json?.hasError) throw new Error(json.message || t("hataOlustu"));
  const kayitlar = satirlariBul(json);
  if (kayitlar.length === 0) return false;

  const sutunlar = SUTUNLAR[excelTab];
  const satirlar = kayitlar.map((kayit) => sutunlar.map(([, alan]) => kayit[alan] ?? ""));
  const sayfa = XLSX.utils.aoa_to_sheet([sutunlar.map(([baslikKey]) => t(baslikKey)), ...satirlar]);
  const kitap = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(kitap, sayfa, "Sheet1");
  XLSX.writeFile(kitap, `${dosyaAdi}.xlsx`);
  return true;
}
