import React from "react";
import EkipmanGorseli from "./EkipmanGorseli";
import { SapmaDurumRozeti } from "../Rozetler";
import { ondalikli, sayi } from "../../../ortak/yakitBicim";

/** Hazir gorunumler (GorunumTipi) ve gruplama turleri (GruplamaTuru; yalnizca filo ve performansta aktif). */
export const GORUNUMLER = [
  { value: "filo", labelKey: "yakitAnalizleri.detay.gorunum.filo" },
  { value: "lokasyon", labelKey: "yakitAnalizleri.detay.gorunum.lokasyon" },
  { value: "performans", labelKey: "yakitAnalizleri.detay.gorunum.performans" },
  { value: "personel", labelKey: "yakitAnalizleri.detay.gorunum.personel" },
];

export const GRUPLAMALAR = [
  { value: "ekipman", labelKey: "yakitAnalizleri.detay.gruplama.ekipman" },
  { value: "ekipman-tipi", labelKey: "yakitAnalizleri.detay.gruplama.ekipmanTipi" },
  { value: "marka", labelKey: "yakitAnalizleri.detay.gruplama.marka" },
];

export const gruplamaAktifMi = (gorunum) => gorunum === "filo" || gorunum === "performans";

const bas = (ad) =>
  (ad || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parca) => parca[0])
    .join("")
    .toLocaleUpperCase("tr-TR");

/**
 * Gorunume gore kolonlar (dokuman 3.4 satir semalari). Her kolon tabloda `render`, Excel'de `deger` (ham sayi) kullanir;
 * `birim` olan kolonun birimi Excel'de ayri sutuna yazilir, gorsel kolonu Excel'e yazilmaz.
 */
export function detayliTabloKolonlari({ gorunum, gruplama, t, dil }) {
  const litre = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.litreKisa")}`;
  const tl = (deger) => `${ondalikli(deger, dil)} ${t("yakitOrtak.tl")}`;
  const metin = (deger) => (deger === null || deger === undefined || deger === "" ? "–" : deger);
  const kolon = (key, baslikKey, deger, render, secenekler = {}) => ({ key, title: t(baslikKey), deger, render: (_, satir) => render(satir), ...secenekler });
  const sag = { align: "right" };

  const gorsel = { key: "gorsel", title: t("yakitAnalizleri.detay.kolon.gorsel"), width: 72, excelDisi: true, render: (_, satir) => <EkipmanGorseli resimId={satir.ResimId} /> };
  const ekipmanKodu = kolon(
    "kod",
    "yakitAnalizleri.detay.kolon.ekipmanKodu",
    (s) => s.EkipmanKodu,
    (s) => <span className="font-semibold">{metin(s.EkipmanKodu)}</span>
  );
  const ekipmanTanimi = kolon(
    "tanim",
    "yakitAnalizleri.detay.kolon.ekipmanTanimi",
    (s) => s.EkipmanTanimi,
    (s) => metin(s.EkipmanTanimi)
  );
  const yakitMiktari = kolon(
    "miktar",
    "yakitAnalizleri.detay.kolon.yakitMiktari",
    (s) => s.YakitMiktari,
    (s) => <span className="font-semibold">{litre(s.YakitMiktari)}</span>,
    sag
  );
  const yakitTutari = kolon(
    "tutar",
    "yakitAnalizleri.detay.kolon.yakitTutari",
    (s) => s.YakitTutari,
    (s) => <span className="font-semibold">{tl(s.YakitTutari)}</span>,
    sag
  );
  const ortTuketim = kolon(
    "ort",
    "yakitAnalizleri.detay.kolon.ortTuketim",
    (s) => s.OrtTuketim,
    (s) => `${ondalikli(s.OrtTuketim, dil)} ${s.OrtTuketimBirim ?? ""}`,
    { ...sag, birim: (s) => s.OrtTuketimBirim }
  );
  const ekipmanSayisi = kolon(
    "ekipmanSayisi",
    "yakitAnalizleri.detay.kolon.ekipmanSayisi",
    (s) => s.EkipmanSayisi,
    (s) => sayi(s.EkipmanSayisi, dil),
    sag
  );
  const calismaSuresi = kolon(
    "calisma",
    "yakitAnalizleri.detay.kolon.calismaSuresi",
    (s) => s.CalismaSuresi,
    (s) => `${sayi(s.CalismaSuresi, dil)} ${s.KullanimBirimi ?? ""}`,
    { ...sag, birim: (s) => s.KullanimBirimi }
  );

  if (gorunum === "lokasyon") {
    return [
      kolon(
        "lokasyon",
        "yakitAnalizleri.detay.kolon.lokasyon",
        (s) => s.Lokasyon,
        (s) => <span className="font-semibold">{metin(s.Lokasyon)}</span>
      ),
      kolon(
        "proje",
        "yakitAnalizleri.detay.kolon.proje",
        (s) => s.Proje,
        (s) => metin(s.Proje)
      ),
      ekipmanSayisi,
      kolon(
        "toplamYakit",
        "yakitAnalizleri.detay.kolon.toplamYakit",
        (s) => s.ToplamYakit,
        (s) => <span className="font-semibold">{litre(s.ToplamYakit)}</span>,
        sag
      ),
      kolon(
        "toplamTutar",
        "yakitAnalizleri.detay.kolon.toplamTutar",
        (s) => s.ToplamTutar,
        (s) => <span className="font-semibold">{tl(s.ToplamTutar)}</span>,
        sag
      ),
      ortTuketim,
    ];
  }

  if (gorunum === "personel") {
    return [
      kolon(
        "personel",
        "yakitAnalizleri.detay.kolon.personel",
        (s) => s.PersonelAdi,
        (s) => (
          <span className="flex items-center gap-3">
            <span className="ya-avatar">{bas(s.PersonelAdi)}</span>
            <span className="font-semibold">{metin(s.PersonelAdi)}</span>
          </span>
        )
      ),
      ekipmanSayisi,
      kolon(
        "anaEkipmanlar",
        "yakitAnalizleri.detay.kolon.anaEkipmanlar",
        (s) => s.AnaEkipmanlar,
        (s) => metin(s.AnaEkipmanlar)
      ),
      calismaSuresi,
      yakitMiktari,
      yakitTutari,
      ortTuketim,
    ];
  }

  if (gorunum === "performans") {
    return [
      gorsel,
      ekipmanKodu,
      ekipmanTanimi,
      kolon(
        "grup",
        "yakitAnalizleri.detay.kolon.ekipmanGrubu",
        (s) => s.EkipmanGrubu,
        (s) => metin(s.EkipmanGrubu)
      ),
      calismaSuresi,
      yakitMiktari,
      ortTuketim,
      kolon(
        "referans",
        "yakitAnalizleri.detay.kolon.referans",
        (s) => s.Referans,
        (s) => (s.Referans === null || s.Referans === undefined ? "—" : `${ondalikli(s.Referans, dil)} ${s.OrtTuketimBirim ?? ""}`),
        {
          ...sag,
          birim: (s) => s.OrtTuketimBirim,
        }
      ),
      kolon(
        "sapma",
        "yakitAnalizleri.detay.kolon.sapma",
        (s) => s.SapmaYuzde,
        (s) => (s.SapmaYuzde === null || s.SapmaYuzde === undefined ? "—" : t("yakitOrtak.yuzde", { deger: ondalikli(s.SapmaYuzde, dil) })),
        sag
      ),
      kolon(
        "durum",
        "yakitAnalizleri.detay.kolon.durum",
        (s) => s.Durum,
        (s) => <SapmaDurumRozeti durum={s.Durum} />
      ),
    ];
  }

  // Filo ozeti: ekipman bazinda ya da ekipman tipi / marka gruplari.
  if (gruplama !== "ekipman") {
    return [
      kolon(
        "grup",
        gruplama === "marka" ? "yakitAnalizleri.detay.kolon.marka" : "yakitAnalizleri.detay.kolon.ekipmanTipi",
        (s) => s.EkipmanTanimi,
        (s) => <span className="font-semibold">{metin(s.EkipmanTanimi)}</span>
      ),
      ekipmanSayisi,
      yakitMiktari,
      yakitTutari,
      ortTuketim,
    ];
  }

  return [
    gorsel,
    ekipmanKodu,
    ekipmanTanimi,
    kolon(
      "lokasyon",
      "yakitAnalizleri.detay.kolon.lokasyon",
      (s) => s.Lokasyon,
      (s) => metin(s.Lokasyon)
    ),
    kolon(
      "proje",
      "yakitAnalizleri.detay.kolon.proje",
      (s) => s.Proje,
      (s) => metin(s.Proje)
    ),
    yakitMiktari,
    yakitTutari,
    ortTuketim,
  ];
}
