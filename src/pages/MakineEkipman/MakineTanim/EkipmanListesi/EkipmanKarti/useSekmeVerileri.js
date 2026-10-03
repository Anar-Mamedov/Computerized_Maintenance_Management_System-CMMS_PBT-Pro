import useKartListesi from "./useKartListesi";
import { getAltEkipmanlar, getMakinePeriyodikBakimlari, getMakineSayaclari, listeyiAl } from "./ekipmanKartiService";
import { anahtarEkle } from "./yardimcilar";

const altEkipmanlariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_EKIPMAN_ID");
const sayaclariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_SAYAC_ID");
const bakimlariHazirla = (yanit) => anahtarEkle(listeyiAl(yanit), "TB_PERIYODIK_BAKIM_MAKINE_ID");

/**
 * Sekme basliklarinda kayit sayisi gosterilen listeler (Alt Ekipmanlar, Sayaclar, Periyodik Bakimlar).
 * Kart acilinca makine bilgisiyle birlikte yuklenir; sekmeler bu veriyi kullanir, tekrar istek atmaz.
 * Her biri: { kayitlar, yukleniyor, yenile }. Kayitlarda React anahtari `clientKey`dir.
 */
export default function useSekmeVerileri(makineId) {
  const altEkipmanlar = useKartListesi(getAltEkipmanlar, makineId, altEkipmanlariHazirla);
  const sayaclar = useKartListesi(getMakineSayaclari, makineId, sayaclariHazirla);
  const bakimlar = useKartListesi(getMakinePeriyodikBakimlari, makineId, bakimlariHazirla);

  return { altEkipmanlar, sayaclar, bakimlar };
}
