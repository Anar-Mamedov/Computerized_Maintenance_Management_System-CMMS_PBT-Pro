import { createElement } from "react";
import { useTranslation } from "react-i18next";
import { LuPencil, LuPlus, LuPrinter, LuTrash2 } from "react-icons/lu";
import { DUGUM, MAKINE_HEDEFI, altinaEklenirMi, dugumEtiketi } from "./altEkipmanYardimcilari";

const AYRAC = { tip: "ayrac" };

// Menu ikonu (hook dosyasi JSX icermez; bkz. react-refresh/only-export-components).
const ikon = (Bilesen) => createElement(Bilesen, { size: 14 });

/**
 * Alt Ekipmanlar sekmesinin menu ogeleri (ortak/IslemMenusu bicimi). Masaustu uygulamasiyla ayni kurallar:
 * - hedefAl(dugum): yeni kaydin baglanacagi yer. Grup ya da ekipman ise o dugum, degilse (secim yok / malzeme) makine.
 * - ekleSecenekleri(hedef): "Ekle" dugmesinin ve "Altina Ekle"nin dort secenegi.
 * - dugumOgeleri(dugum): dugum tipine gore islemler (sag tik, satir sonundaki "…" ve "⋮" menusu). Malzemenin altina kayit
 *   eklenmez, ekipman silinmez (cikartilir), grup ve malzeme silinir.
 * Kisayollar rehberdeki gibidir: Duzenle F5, Sil F6 (secili dugume uygulanir; secim yokken F5 listeyi yeniler).
 * modalAc({ tur, dugum?, hedef?, ... }) secilen islemin penceresini acar.
 */
export default function useAltEkipmanMenuleri(modalAc) {
  const { t } = useTranslation();
  const metin = (anahtar) => t(`ekipmanKarti.altEkipman.${anahtar}`);

  const hedefAl = (dugum) =>
    altinaEklenirMi(dugum)
      ? { tip: dugum.tip, id: dugum.id, anahtar: dugum.anahtar, etiket: dugumEtiketi(dugum) }
      : { tip: MAKINE_HEDEFI, id: null, anahtar: null, etiket: metin("hedefMakine") };

  const ekleSecenekleri = (hedef) => [
    { key: "grupEkle", etiket: metin("grupEkle"), onClick: () => modalAc({ tur: "grup", hedef }) },
    { key: "stoktanEkle", etiket: metin("stoktanEkipmanEkle"), onClick: () => modalAc({ tur: "stoktanEkle", hedef }) },
    { key: "yeniEkipman", etiket: metin("yeniEkipmanStoksuz"), onClick: () => modalAc({ tur: "yeniEkipman", hedef }) },
    { key: "malzemeEkle", etiket: metin("malzemeEkle"), onClick: () => modalAc({ tur: "malzeme", hedef }) },
  ];

  const altinaEkle = (dugum) => ({ key: "altinaEkle", etiket: metin("altinaEkle"), ikon: ikon(LuPlus), altOgeler: ekleSecenekleri(hedefAl(dugum)) });

  const duzenle = (etiketAnahtari, onClick) => ({ key: "duzenle", etiket: metin(etiketAnahtari), kisayol: "F5", ikon: ikon(LuPencil), onClick });

  const sil = (etiketAnahtari, dugum) => ({
    key: "sil",
    etiket: metin(etiketAnahtari),
    kisayol: "F6",
    ikon: ikon(LuTrash2),
    tehlikeli: true,
    onClick: () => modalAc({ tur: "sil", dugum }),
  });

  const dugumOgeleri = (dugum) => {
    if (dugum.tip === DUGUM.GRUP) {
      return [altinaEkle(dugum), AYRAC, duzenle("grupDuzenle", () => modalAc({ tur: "grup", dugum })), sil("grupSil", dugum)];
    }
    if (dugum.tip === DUGUM.MALZEME) {
      return [duzenle("malzemeDuzenle", () => modalAc({ tur: "malzeme", dugum })), sil("malzemeSil", dugum)];
    }
    return [
      altinaEkle(dugum),
      AYRAC,
      duzenle("ekipmanDuzenle", () => modalAc({ tur: "ekipmanDuzenle", dugum })),
      // Stoga Al / Hurdaya Ayir secimi cikartma penceresinde yapilir (hedef tur).
      { key: "cikart", etiket: metin("ekipmanCikartMenu"), onClick: () => modalAc({ tur: "cikart", dugum }) },
      AYRAC,
      { key: "dolasimTarihcesi", etiket: metin("dolasimTarihcesi"), onClick: () => modalAc({ tur: "tarihce", dugum, tarihceTuru: "dolasim" }) },
      { key: "revizyon", etiket: metin("revizyon"), onClick: () => modalAc({ tur: "revizyon", dugum }) },
      { key: "revizyonTarihcesi", etiket: metin("revizyonTarihcesi"), onClick: () => modalAc({ tur: "tarihce", dugum, tarihceTuru: "revizyon" }) },
      AYRAC,
      { key: "barkod", etiket: metin("barkodEtiketi"), ikon: ikon(LuPrinter), onClick: () => modalAc({ tur: "barkod", dugum }) },
    ];
  };

  return { hedefAl, ekleSecenekleri, dugumOgeleri };
}
