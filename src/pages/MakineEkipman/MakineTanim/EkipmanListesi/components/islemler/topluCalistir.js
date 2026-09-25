import { message } from "antd";
import { basariliMi } from "../../ekipmanService";

/** Tek kayitlik bir ucu secili kayitlar icin sirayla cagirir (sunucuya ayni anda yuk bindirmez); basarili adedini dondurur. */
export async function siraylaCalistir(satirlar, istek) {
  let basarili = 0;
  for (const satir of satirlar) {
    try {
      const response = await istek(satir);
      if (basariliMi(response)) basarili += 1;
    } catch (error) {
      console.error("Ekipman işlemi başarısız:", error);
    }
  }
  return basarili;
}

/** Toplu islem sonucunu tek bir bildirimle gosterir. */
export function sonucuBildir(basarili, toplam, t) {
  if (toplam > 0 && basarili === toplam) {
    message.success(t("islemBasarili"));
  } else if (basarili > 0) {
    message.warning(t("ekipmanListesi.kismenBasarili", { basarili, toplam }));
  } else {
    message.error(t("islemBasarisiz"));
  }
}

/** Toplu uclarin (TopluTip/Durum/Sayac) yanitini bildirir; basariliysa true doner. */
export function yanitiBildir(response, t) {
  if (basariliMi(response)) {
    message.success(response?.message || t("islemBasarili"));
    return true;
  }
  message.error(response?.message || t("islemBasarisiz"));
  return false;
}
