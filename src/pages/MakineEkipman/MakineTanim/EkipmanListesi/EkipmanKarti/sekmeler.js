/**
 * Kart sekmeleri (tasarimdaki sira).
 * - `sayi`: basliktaki kayit sayisinin geldigi liste (useSekmeVerileri).
 * - `kosul`: sekmeyi gosteren form alani (Arac: MKN_ARAC, Yakit: MKN_YAKIT_KULLANIM).
 * - `kayitGerekli`: kayitli ekipman ID'siyle calisan sekme; yeni ekipman eklenirken gosterilmez.
 */
export const SEKMELER = [
  { key: "genel", etiketKey: "ekipmanKarti.sekme.genelBilgiler" },
  { key: "altEkipman", etiketKey: "ekipmanKarti.sekme.altEkipmanlar", sayi: "altEkipmanlar", kayitGerekli: true },
  { key: "detay", etiketKey: "ekipmanKarti.sekme.detayBilgi" },
  { key: "finansal", etiketKey: "ekipmanKarti.sekme.finansalBilgiler" },
  { key: "sayac", etiketKey: "ekipmanKarti.sekme.sayaclar", sayi: "sayaclar", kayitGerekli: true },
  { key: "periyodikBakim", etiketKey: "ekipmanKarti.sekme.periyodikBakimlar", sayi: "bakimlar", kayitGerekli: true },
  { key: "yakit", etiketKey: "ekipmanKarti.sekme.yakitBilgileri", kosul: "makineYakitKullanim" },
  { key: "arac", etiketKey: "ekipmanKarti.sekme.arac", kosul: "arac", kayitGerekli: true },
  { key: "ozelAlanlar", etiketKey: "ekipmanKarti.sekme.ozelAlanlar" },
  { key: "notlar", etiketKey: "ekipmanKarti.sekme.notlar" },
  { key: "belgeler", etiketKey: "ekipmanKarti.sekme.ekliBelgeler", kayitGerekli: true },
  { key: "resimler", etiketKey: "ekipmanKarti.sekme.resimler", kayitGerekli: true },
];

export const ILK_SEKME = SEKMELER[0].key;
