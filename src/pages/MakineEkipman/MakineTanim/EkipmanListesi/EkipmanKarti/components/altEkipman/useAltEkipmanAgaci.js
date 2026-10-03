import { useRef, useState } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { getAltEkipmanlar, hataMesaji, listeyiAl } from "../../ekipmanKartiService";
import { anahtarEkle } from "../../yardimcilar";

/**
 * Alt ekipman agacinin durumu (anahtarlar TB_EKIPMAN_ID):
 * - acikIdler / cocuklar: satirin cocuklari ilk acilista cekilir ve bellekte tutulur.
 * - seciliKayitlar: { [id]: { kayit, ustEkipmanId } }; kok seviyede ustEkipmanId 0'dir (ust = makine).
 * `sifirla` hepsini temizler; o andaki cocuk istekleri yok sayilir.
 */
export default function useAltEkipmanAgaci() {
  const { t } = useTranslation();
  const [acikIdler, setAcikIdler] = useState([]);
  const [cocuklar, setCocuklar] = useState({});
  const [yuklenenIdler, setYuklenenIdler] = useState([]);
  const [seciliKayitlar, setSeciliKayitlar] = useState({});
  const nesilRef = useRef(0);

  const kapat = (id) => setAcikIdler((onceki) => onceki.filter((acikId) => acikId !== id));

  const acKapat = async (kayit) => {
    const id = kayit.TB_EKIPMAN_ID;
    if (acikIdler.includes(id)) {
      kapat(id);
      return;
    }

    setAcikIdler((onceki) => [...onceki, id]);
    if (cocuklar[id] || yuklenenIdler.includes(id)) return;

    const nesil = nesilRef.current;
    setYuklenenIdler((onceki) => [...onceki, id]);
    try {
      const yanit = await getAltEkipmanlar(id);
      if (nesil !== nesilRef.current) return;
      setCocuklar((onceki) => ({ ...onceki, [id]: anahtarEkle(listeyiAl(yanit), "TB_EKIPMAN_ID") }));
    } catch (hata) {
      if (nesil !== nesilRef.current) return;
      console.error("Alt ekipmanin alt kayitlari alinamadi:", hata);
      message.error(hataMesaji(hata, t("ekipmanKarti.listeAlinamadi")));
      kapat(id);
    } finally {
      if (nesil === nesilRef.current) setYuklenenIdler((onceki) => onceki.filter((yuklenenId) => yuklenenId !== id));
    }
  };

  const secimiDegistir = (kayit, ustEkipmanId) => {
    const id = kayit.TB_EKIPMAN_ID;
    setSeciliKayitlar((onceki) => {
      const yeni = { ...onceki };
      if (yeni[id]) delete yeni[id];
      else yeni[id] = { kayit, ustEkipmanId };
      return yeni;
    });
  };

  const sifirla = () => {
    nesilRef.current += 1;
    setAcikIdler([]);
    setCocuklar({});
    setYuklenenIdler([]);
    setSeciliKayitlar({});
  };

  return { acikIdler, cocuklar, yuklenenIdler, seciliKayitlar, acKapat, secimiDegistir, sifirla };
}
