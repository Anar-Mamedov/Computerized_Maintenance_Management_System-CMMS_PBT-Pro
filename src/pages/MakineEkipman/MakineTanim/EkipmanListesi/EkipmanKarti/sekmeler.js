/**
 * Kart sekmeleri (tasarimdaki sira).
 * - `sayi`: basliktaki kayit sayisinin geldigi liste (useSekmeVerileri).
 * - `kosul`: sekmeyi gosteren form alani (Arac: MKN_ARAC, Yakit: MKN_YAKIT_KULLANIM).
 */
export const SEKMELER = [
  { key: "genel", etiketKey: "ekipmanKarti.sekme.genelBilgiler" },
  { key: "altEkipman", etiketKey: "ekipmanKarti.sekme.altEkipmanlar", sayi: "altEkipmanlar" },
  { key: "detay", etiketKey: "ekipmanKarti.sekme.detayBilgi" },
  { key: "finansal", etiketKey: "ekipmanKarti.sekme.finansalBilgiler" },
  { key: "sayac", etiketKey: "ekipmanKarti.sekme.sayaclar", sayi: "sayaclar" },
  { key: "periyodikBakim", etiketKey: "ekipmanKarti.sekme.periyodikBakimlar", sayi: "bakimlar" },
  { key: "yakit", etiketKey: "ekipmanKarti.sekme.yakitBilgileri", kosul: "makineYakitKullanim" },
  { key: "arac", etiketKey: "ekipmanKarti.sekme.arac", kosul: "arac" },
  { key: "ozelAlanlar", etiketKey: "ekipmanKarti.sekme.ozelAlanlar" },
  { key: "notlar", etiketKey: "ekipmanKarti.sekme.notlar" },
  { key: "belgeler", etiketKey: "ekipmanKarti.sekme.ekliBelgeler" },
  { key: "resimler", etiketKey: "ekipmanKarti.sekme.resimler" },
];

export const ILK_SEKME = SEKMELER[0].key;
