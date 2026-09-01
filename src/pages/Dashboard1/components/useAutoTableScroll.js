import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWidgetSize } from "./widgetSizeContext";

// Tablo başlığının yaklaşık yüksekliği; yalnızca ilk render'daki başlangıç değeri için kullanılır,
// sonrasında gerçek yükseklik ölçülür.
const HEADER_TAHMINI = 40;

/** Tablonun yerleştirildiği iç kutu; yüksekliğini tamamen dış kutudan alır. */
export const TABLE_FILL_INNER = { position: "absolute", inset: 0, overflow: "hidden" };

/**
 * Tablonun kaydırma yüksekliğini kartta kalan boşluğa göre ayarlar.
 * Sabit bir `scroll.y` ile kart, satırdaki daha uzun komşusu yüzünden uzadığında
 * tablonun altında boşluk kalıyordu; bu hook o boşluğu tablo gövdesine devreder.
 *
 * Ölçülen iç kutu mutlak konumlandırıldığı için yüksekliği tablonun kendi içeriğine
 * bağlı değildir; böylece ölç–render–ölç döngüsü oluşmaz. Dış kutu ise esnek taban
 * kullanır: yer varsa büyür, kart daraldığında küçülür.
 *
 * Kullanımı:
 *   <div style={wrapperStyle}>
 *     <div ref={containerRef} style={TABLE_FILL_INNER}>
 *       <Table scroll={{ y: scrollY }} ... />
 *
 * @param {number} naturalHeight Tablo alanının (başlık + gövde) doğal yüksekliği
 * @param {number} minHeight İzin verilen en küçük kaydırma yüksekliği
 */
export default function useAutoTableScroll(naturalHeight = 260, minHeight = 96) {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(Math.max(naturalHeight - HEADER_TAHMINI, minHeight));
  // Widget elle yeniden boyutlandırıldığında bu değer değişir ve bileşen yeniden render
  // olur; aşağıdaki layout effect de ölçümü tazeler.
  useWidgetSize();

  const olc = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Tablo başlığı ve sayfalama sabit kalır, kalan alanın tamamı gövdeye verilir.
    const baslik = container.querySelector(".ant-table-thead");
    const sayfalama = container.querySelector(".ant-pagination");
    const kullanilabilir = container.clientHeight - (baslik?.offsetHeight ?? 0) - (sayfalama?.offsetHeight ?? 0);
    const hedef = Math.max(Math.round(kullanilabilir), minHeight);

    setScrollY((onceki) => (Math.abs(onceki - hedef) > 1 ? hedef : onceki));
  }, [minHeight]);

  // Her render sonrası ölçülür: veri geldiğinde veya widget yeniden boyutlandırıldığında
  // tablo kendini günceller.
  useLayoutEffect(olc);

  // ResizeObserver bazı bağlamlarda (arka plandaki sekme) tetiklenmediği için
  // pencere yeniden boyutlandırma olayı da ayrıca dinlenir.
  useEffect(() => {
    const container = containerRef.current;
    window.addEventListener("resize", olc);

    const observer = new ResizeObserver(olc);
    if (container) observer.observe(container);

    return () => {
      window.removeEventListener("resize", olc);
      observer.disconnect();
    };
  }, [olc]);

  // Esnek taban: kart doğal yüksekliğindeyken bu değeri alır, uzayınca büyür, daralınca küçülür.
  const wrapperStyle = useMemo(() => ({ position: "relative", flex: `1 1 ${naturalHeight}px`, minHeight: 0 }), [naturalHeight]);

  return { containerRef, scrollY, wrapperStyle };
}
