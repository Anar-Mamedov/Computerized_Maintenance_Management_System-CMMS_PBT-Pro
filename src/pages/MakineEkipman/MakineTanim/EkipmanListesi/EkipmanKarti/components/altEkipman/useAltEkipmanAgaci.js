import { useState } from "react";

const listedeDegistir = (liste, anahtar) => (liste.includes(anahtar) ? liste.filter((oge) => oge !== anahtar) : [...liste, anahtar]);

/**
 * Alt ekipman agacinin ekran durumu; anahtarlar dugum anahtaridir (tip + ID, bkz. agaciKur).
 * - acikAnahtarlar: alt kirilimi acik satirlar. Agac tek istekte geldigi icin acmak istek atmaz.
 * - kapaliBolumler: kapatilmis bolumler; bolumler varsayilan olarak aciktir. Kok grubun bolum anahtari grubun anahtaridir.
 * - seciliAnahtar: tek secili dugum. Islem menusu ve "Ekle" ona gore calisir (yeni kayit secili grup / ekipmanin altina).
 */
export default function useAltEkipmanAgaci() {
  const [acikAnahtarlar, setAcikAnahtarlar] = useState([]);
  const [kapaliBolumler, setKapaliBolumler] = useState([]);
  const [seciliAnahtar, setSeciliAnahtar] = useState(null);

  return {
    acikAnahtarlar,
    kapaliBolumler,
    seciliAnahtar,
    acKapat: (anahtar) => setAcikAnahtarlar((onceki) => listedeDegistir(onceki, anahtar)),
    bolumuAcKapat: (anahtar) => setKapaliBolumler((onceki) => listedeDegistir(onceki, anahtar)),
    /** Dugumu (satir ya da kok grup bolumu) acar; ör. altina kayit eklenince yeni kayit gorunsun diye. */
    ac: (anahtar) => {
      setAcikAnahtarlar((onceki) => (onceki.includes(anahtar) ? onceki : [...onceki, anahtar]));
      setKapaliBolumler((onceki) => onceki.filter((kapali) => kapali !== anahtar));
    },
    /** Dugumu secer; null secimi kaldirir. */
    sec: setSeciliAnahtar,
    secimiDegistir: (anahtar) => setSeciliAnahtar((onceki) => (onceki === anahtar ? null : anahtar)),
    hepsiniAc: (dugumAnahtarlari) => {
      setKapaliBolumler([]);
      setAcikAnahtarlar(dugumAnahtarlari);
    },
    hepsiniKapat: (bolumAnahtarlari) => {
      setKapaliBolumler(bolumAnahtarlari);
      setAcikAnahtarlar([]);
    },
  };
}
