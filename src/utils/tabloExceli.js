import * as XLSX from "xlsx";

/**
 * Bir hücrenin Excel'e yazılacak değeri. Sayılar ham yazılır (Excel'de toplanıp sıralanabilsin); tarih, para birimi
 * gibi ekranda metne çevrilen kolonlarda kolonun render çıktısı metinse o kullanılır, değilse ham değer yazılır.
 * @param {{ dataIndex: string, render?: (deger: any, satir: object) => any }} kolon
 * @param {object} satir
 */
export const varsayilanHucreDegeri = (kolon, satir) => {
  const ham = satir[kolon.dataIndex];
  if (typeof ham === "number") return ham;

  const gorunen = kolon.render ? kolon.render(ham, satir) : ham;
  return typeof gorunen === "string" ? gorunen : (ham ?? "");
};

/**
 * Satırları tablonun görünür kolonlarıyla (başlık ve genişlik tablodan) "Sheet1" sayfasına yazıp indirir.
 * Ekrana özel bir hücre biçimi gerekirse `hucreDegeri` verilir.
 * @param {{ satirlar: object[], kolonlar: object[], dosyaAdi: string, hucreDegeri?: (kolon: object, satir: object) => any }} secenekler
 */
export function tabloyuExceleYaz({ satirlar, kolonlar, dosyaAdi, hucreDegeri = varsayilanHucreDegeri }) {
  const excelKolonlari = kolonlar.filter((kolon) => kolon.dataIndex);
  const basliklar = excelKolonlari.map((kolon) => (typeof kolon.title === "string" ? kolon.title : kolon.dataIndex));
  const veri = satirlar.map((satir) => Object.fromEntries(excelKolonlari.map((kolon, sira) => [basliklar[sira], hucreDegeri(kolon, satir)])));

  const sayfa = XLSX.utils.json_to_sheet(veri, { header: basliklar });
  sayfa["!cols"] = excelKolonlari.map((kolon) => ({ wpx: Number(kolon.width) || 120 }));
  const kitap = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(kitap, sayfa, "Sheet1");
  XLSX.writeFile(kitap, `${dosyaAdi}.xlsx`);
}
