import { useMemo, useState } from "react";
import { tercihOku, tercihYaz } from "../../../tercihler";

/**
 * "Liste Ozellikleri" icin kolon gorunurlugu. Gizlenen kolon anahtarlari tarayicida saklanir.
 * kolonlar: antd kolon tanimlari (her birinde `key` olmali).
 */
export default function useGorunurKolonlar(depolamaAnahtari, kolonlar) {
  const [gizliAnahtarlar, setGizliAnahtarlar] = useState(() => {
    const kayitli = tercihOku(depolamaAnahtari, []);
    return Array.isArray(kayitli) ? kayitli : [];
  });

  const gizliAnahtarlariDegistir = (yeniAnahtarlar) => {
    setGizliAnahtarlar(yeniAnahtarlar);
    tercihYaz(depolamaAnahtari, yeniAnahtarlar);
  };

  const gorunurKolonlar = useMemo(() => kolonlar.filter((kolon) => !gizliAnahtarlar.includes(kolon.key)), [kolonlar, gizliAnahtarlar]);

  return { gorunurKolonlar, gizliAnahtarlar, gizliAnahtarlariDegistir };
}
