/**
 * Yakit Analizleri ve Yakit Stok Islemleri uclarinin veri tipleri (dokuman 6. "Hazir TypeScript Tipleri",
 * types/yakit.ts). Proje JavaScript oldugu icin JSDoc olarak tutulur; servisler bu tiplere atif yapar.
 */

// --- ORTAK FILTRE ---

/**
 * @typedef {Object} YakitOrtakFiltre
 * @property {string|null} [BaslangicTarihi] "YYYY-MM-DD"
 * @property {string|null} [BitisTarihi] "YYYY-MM-DD"
 * @property {number[]} [LokasyonIds]
 * @property {number[]} [YakitTipIds]
 * @property {number[]} [YakitStokIds]
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} has_error
 * @property {number} [status_code]
 * @property {string} [status]
 * @property {T} [data]
 */

// --- EKRAN 1: ANALIZLER ---

/**
 * @typedef {Object} YakitAnalizKpiOzet
 * @property {number} ToplamYakitMiktari
 * @property {number} ToplamYakitFarkYuzde
 * @property {number} ToplamYakitTutari
 * @property {number} ToplamTutarFarkYuzde
 * @property {number} OrtalamaBirimFiyat
 * @property {number} OrtalamaTuketim1000Km
 * @property {number} OrtalamaTuketim100Km
 * @property {number} OrtalamaTuketimSaat
 * @property {number} OrtalamaTuketimFarkYuzde
 * @property {number} ToplamKm
 * @property {number} ToplamSaat
 * @property {number} EkipmanBasinaMaliyet
 * @property {number} EkipmanBasinaMaliyetFarkYuzde
 * @property {number} EkipmanSayisi
 */

/**
 * @typedef {Object} YakitAylikTuketim
 * @property {number} AyNo
 * @property {string} AyAdi
 * @property {number} Miktar
 * @property {number} Tutar
 * @property {boolean} AktifAyMi
 */

/**
 * @typedef {Object} YakitMakineTipiDagilim
 * @property {number} TipId
 * @property {string} TipAdi
 * @property {number} Miktar
 * @property {number} PayYuzde
 */

/**
 * @typedef {Object} YakitTankDurumWidget
 * @property {number} DepoId
 * @property {string} DepoKod
 * @property {string} DepoTanim
 * @property {string} Lokasyon
 * @property {number} MevcutMiktar
 * @property {number} Kapasite
 * @property {number} DolulukOrani
 * @property {number} KritikSeviye
 * @property {"critical"|"normal"|"high"} Durum
 */

/**
 * @typedef {Object} YakitLokasyonDagilim
 * @property {number} LokasyonId
 * @property {string} LokasyonAdi
 * @property {number} Miktar
 * @property {number} Tutar
 */

/**
 * @typedef {Object} YakitEnFazlaTuketen
 * @property {number} MakineId
 * @property {string} EkipmanAdi
 * @property {string} EkipmanKodu
 * @property {number} ToplamMiktar
 * @property {number} OrtalamaTuketim
 * @property {"L/saat"|"L/100 km"} OrtalamaBirim
 * @property {number} Fark30GunYuzde
 * @property {"up"|"down"|"flat"} FarkTon
 */

/**
 * @typedef {Object} YakitKontrolUyari
 * @property {"KRITIK_TANK"|"YUKSEK_TUKETIM"|"EKSIK_SAYAC"} UyariTipi
 * @property {number|null} RefId
 * @property {string} Baslik
 * @property {string} Detay
 * @property {"Kritik"|"İncele"|"Tamamla"} Durum
 * @property {"critical"|"warning"|"info"} DurumClass
 */

/**
 * @typedef {Object} YakitAnalizDashboardResponse
 * @property {string} BaslangicTarihi
 * @property {string} BitisTarihi
 * @property {string} GuncellemeZamani
 * @property {YakitAnalizKpiOzet} Kpis
 * @property {number} AylikYil
 * @property {YakitAylikTuketim|null} AktifAyOzeti
 * @property {YakitAylikTuketim[]} AylikTuketimler
 * @property {number} MakineTipiToplamMiktar
 * @property {YakitMakineTipiDagilim[]} MakineTipiDagilimi
 * @property {YakitTankDurumWidget[]} TankStokDurumu
 * @property {YakitLokasyonDagilim[]} LokasyonDagilimi
 * @property {YakitEnFazlaTuketen[]} EnFazlaTuketenEkipmanlar
 * @property {YakitKontrolUyari[]} KontrolGerektirenler
 */

/**
 * @typedef {YakitOrtakFiltre & {
 *   SortBy?: "name"|"equipmentCount"|"liters"|"share"|"cost"|"km"|"hours"|"delta",
 *   SortDir?: "asc"|"desc"
 * }} YakitLokasyonKarsilastirmaFiltre
 */

/**
 * @typedef {YakitOrtakFiltre & {
 *   GorunumTipi: "filo"|"lokasyon"|"performans"|"personel",
 *   GruplamaTuru?: "ekipman"|"ekipman-tipi"|"marka",
 *   Page?: number,
 *   PageSize?: number,
 *   IsExcel?: boolean
 * }} YakitDetayliTabloFiltre
 */

// --- EKRAN 2: YAKIT STOK ISLEMLERI ---

/**
 * @typedef {YakitOrtakFiltre & {
 *   IslemTuru?: "TUMU"|"GIRIS"|"CIKIS"|"TRANSFER",
 *   Arama?: string,
 *   SortBy?: "tarih"|"islemTuru"|"yakitTipi"|"yakitTanimi"|"miktar"|"birimFiyat"|"tutar"|"lokasyon"|"kaynakDepo"|"hedefDepo"|"aciklama",
 *   SortDir?: "asc"|"desc",
 *   Page?: number,
 *   PageSize?: number,
 *   IsExcel?: boolean
 * }} YakitStokIslemFiltre
 */

/**
 * @typedef {Object} YakitStokIslemOzet
 * @property {number} ToplamGiris
 * @property {number} ToplamCikis
 * @property {number} ToplamTransfer
 * @property {number} MevcutDepoStoku
 */

/**
 * @typedef {Object} YakitStokIslemListeItem
 * @property {number} TB_STOK_FIS_ID
 * @property {string} FisNo
 * @property {string} Tarih
 * @property {string} Saat
 * @property {"G"|"C"|"T"} GC
 * @property {"Giriş"|"Çıkış"|"Transfer"} IslemTuru
 * @property {number|null} YakitTipId
 * @property {string} YakitTipi
 * @property {number} StokId
 * @property {string} YakitTanimi
 * @property {number} Miktar
 * @property {number} BirimFiyat
 * @property {number} Tutar
 * @property {number|null} LokasyonId
 * @property {string} Lokasyon
 * @property {number|null} KaynakDepoId
 * @property {string} KaynakDepo
 * @property {number|null} HedefDepoId
 * @property {string} HedefDepo
 * @property {number|null} CariId
 * @property {string} CariTanim
 * @property {number|null} IslemTipKodId
 * @property {string} IslemNedeni
 * @property {string} BelgeNo
 * @property {string} Aciklama
 */

/**
 * @typedef {Object} YakitStokIslemListeResponse
 * @property {YakitStokIslemOzet} Ozetler
 * @property {number} Page
 * @property {number} PageSize
 * @property {number} ToplamKayit
 * @property {number} ToplamSayfa
 * @property {YakitStokIslemListeItem[]} Liste
 */

/**
 * @typedef {Object} YakitStokIslemDetay
 * @property {number} TB_STOK_FIS_ID
 * @property {string} FisNo
 * @property {"G"|"C"|"T"} GC
 * @property {"GIRIS"|"CIKIS"|"TRANSFER"} IslemTipi
 * @property {"Giriş"|"Çıkış"|"Transfer"} IslemTuru
 * @property {string} Tarih
 * @property {string} Saat
 * @property {string} TarihSaat
 * @property {number|null} KaynakDepoId
 * @property {string} KaynakDepoAdi
 * @property {number} KaynakDepoMevcutStok
 * @property {number} KaynakDepoKapasite
 * @property {number|null} HedefDepoId
 * @property {string} HedefDepoAdi
 * @property {number} HedefDepoMevcutStok
 * @property {number} HedefDepoKapasite
 * @property {number} StokId
 * @property {string} YakitTanimi
 * @property {number|null} YakitTipId
 * @property {string} YakitTipi
 * @property {number|null} BirimId
 * @property {string} BirimTanim
 * @property {number} Miktar
 * @property {number} BirimFiyat
 * @property {number} AraToplam
 * @property {number} KdvOrani
 * @property {string} KdvDurum
 * @property {number} KdvTutari
 * @property {number} GenelToplam
 * @property {number|null} CariId
 * @property {string} CariTanim
 * @property {number|null} IslemTipKodId
 * @property {string} IslemNedeni
 * @property {number|null} MakineId
 * @property {string} MakineKodu
 * @property {string} MakineTanimi
 * @property {number|null} LokasyonId
 * @property {string} LokasyonAdi
 * @property {string} BelgeNo
 * @property {string} Aciklama
 * @property {number|null} OlusturanId
 * @property {string|null} OlusturmaTarih
 * @property {number|null} DegistirenId
 * @property {string|null} DegistirmeTarih
 */

/**
 * @typedef {Object} YakitFisKayitRequest
 * @property {"GIRIS"|"CIKIS"|"TRANSFER"} IslemTipi
 * @property {string} TarihSaat ISO: "2026-08-27T14:30:00"
 * @property {number} Miktar
 * @property {number|null} [KaynakDepoId]
 * @property {number|null} [HedefDepoId]
 * @property {number|null} [MakineId]
 * @property {number|null} [CariId]
 * @property {number|null} [IslemTipKodId]
 * @property {string} [BelgeNo]
 * @property {string} [Aciklama]
 * @property {number} [BirimFiyat]
 * @property {number} [AraToplam]
 * @property {number} [KdvOrani]
 * @property {string} [KdvDurum]
 * @property {number} [KdvTutari]
 * @property {number} [GenelToplam]
 */

/** @typedef {YakitFisKayitRequest & { TB_STOK_FIS_ID: number }} YakitStokIslemGuncelleRequest */

/**
 * @typedef {Object} YakitStokIslemSilRequest
 * @property {number[]} Ids
 */

export {};
