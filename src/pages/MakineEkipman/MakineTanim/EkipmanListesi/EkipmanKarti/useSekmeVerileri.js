import useKartListesi from "./useKartListesi";
import { getMakineAltEkipmanAgaci, getMakinePeriyodikBakimlari, getMakineSayaclari, listeyiAl } from "./ekipmanKartiService";
import { anahtarEkle } from "./yardimcilar";
import { DUGUM, kayitTipi } from "./components/altEkipman/altEkipmanYardimcilari";

const altEkipmanlariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "ID");
const sayaclariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_SAYAC_ID");
const bakimlariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_PERIYODIK_BAKIM_MAKINE_ID");

/**
 * Sekme basliklarinda kayit sayisi gosterilen listeler (Alt Ekipmanlar, Sayaclar, Periyodik Bakimlar).
 * Kart acilinca makine bilgisiyle birlikte yuklenir; sekmeler bu veriyi kullanir, tekrar istek atmaz.
 * Her biri: { kayitlar, yukleniyor, yenile, sayi? }. Kayitlarda React anahtari `clientKey`dir.
 * Alt ekipmanlar agacin duz listesidir; baslik sayisi gruplari saymaz (grup yalnizca klasordur).
 */
export default function useSekmeVerileri(makineId) {
  const altEkipmanAgaci = useKartListesi(getMakineAltEkipmanAgaci, makineId, altEkipmanlariHazirla);
  const sayaclar = useKartListesi(getMakineSayaclari, makineId, sayaclariHazirla);
  const bakimlar = useKartListesi(getMakinePeriyodikBakimlari, makineId, bakimlariHazirla);
  const altEkipmanlar = { ...altEkipmanAgaci, sayi: altEkipmanAgaci.kayitlar.filter((kayit) => kayitTipi(kayit) !== DUGUM.GRUP).length };

  return { altEkipmanlar, sayaclar, bakimlar };
}
