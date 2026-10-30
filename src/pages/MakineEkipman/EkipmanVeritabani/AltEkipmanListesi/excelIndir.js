import * as XLSX from "xlsx";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { baglantiMetni } from "./yardimcilar";

dayjs.extend(localizedFormat);

// Eski tablolardaki "İndir" ile ayni: Excel sutun genisligi = tablodaki kolon genisligi x 0.8 (piksel).
const GENISLIK_OLCEGI = 0.8;

const hucreDegeri = (kolon, satir, t, dil) => {
  if (kolon.tur === "baglanti") return baglantiMetni(satir.connectionStatusCode, satir.connectionStatus, t);
  const deger = satir[kolon.alan];
  if (kolon.tur === "tarih") {
    const tarih = deger ? dayjs(deger) : null;
    return tarih?.isValid() ? tarih.locale(dil).format("L") : "";
  }
  return deger ?? "";
};

/**
 * Listeyi Ekipman Listesi'ndeki "Listeyi Dışa Aktar" gibi indirir: tabloda gorunen kolonlar, sirasi ve basligiyla
 * "Sheet1" sayfasina yazilir. Agac gorunumunde de duz liste (tam kirilim yoluyla) indirilir.
 */
export function exceleAktar(kayitlar, gorunurKolonlar, t, dil) {
  const basliklar = gorunurKolonlar.map((kolon) => kolon.baslik);
  const satirlar = kayitlar.map((kayit) => gorunurKolonlar.map((kolon) => hucreDegeri(kolon, kayit, t, dil)));

  const worksheet = XLSX.utils.aoa_to_sheet([basliklar, ...satirlar]);
  worksheet["!cols"] = gorunurKolonlar.map((kolon) => ({ wpx: kolon.genislik * GENISLIK_OLCEGI }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${t("altEkipmanVeritabani.baslik")}.xlsx`);
}
