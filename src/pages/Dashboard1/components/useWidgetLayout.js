import { useCallback, useEffect, useState } from "react";

// Widget anahtarları veya kayıt şeması değiştikçe sürüm artırılır; eski kayıtlar
// okunmaz ve kullanıcı yeni varsayılanlarla başlar.
const STORAGE_KEY = "dashboardV2WidgetLayout.v4";

/** Dashboard'daki widget'ların varsayılan sırası. */
export const DEFAULT_WIDGET_ORDER = [
  "kpiBekleyenIsTalepleri",
  "kpiAcikIsEmirleri",
  "kpiKritikStoklar",
  "kpiAcikArizaIsEmirleri",
  "actionCenter",
  "completedWorkOrders",
  "workOrderTypePerformance",
  "monthlyMaintenanceCosts",
  "failurePareto",
  "topFailureEquipment",
  "recurringFailures",
  "upcomingMaintenances",
  "personnelKpi",
  "performanceSummary",
  "timeDistribution",
  "pendingApprovals",
  "inventoryDistribution",
];

// Referans tasarımda yer almadığı için varsayılan olarak kapalı gelen widget'lar.
export const DEFAULT_HIDDEN_WIDGETS = ["inventoryDistribution"];

/** Yeniden boyutlandırmada izin verilen sınırlar. */
export const MIN_WIDGET_SPAN = 4;
export const MAX_WIDGET_SPAN = 24;

// Yükseklik de genişlik gibi bir ızgaraya oturur; böylece yan yana duran iki widget
// aynı yüksekliğe kolayca getirilebilir. Sınırlar bu adımın katlarıdır.
export const WIDGET_HEIGHT_STEP = 40;
// Alt sinir 2 satir: KPI kartlari gibi kisa widget'lar tutamaca dokunur dokunmaz sicramaz.
export const MIN_WIDGET_HEIGHT = WIDGET_HEIGHT_STEP * 2;
export const MAX_WIDGET_HEIGHT = WIDGET_HEIGHT_STEP * 30;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Piksel yüksekliğini ızgara adımına yuvarlar ve sınırlar içinde tutar. */
export const snapHeight = (value) => clamp(Math.round(value / WIDGET_HEIGHT_STEP) * WIDGET_HEIGHT_STEP, MIN_WIDGET_HEIGHT, MAX_WIDGET_HEIGHT);

/** Yüksekliği kaç ızgara satırına denk geldiğiyle ifade eder. */
export const heightToRows = (value) => Math.round(value / WIDGET_HEIGHT_STEP);

// Sadece bilinen widget anahtarlarını ve geçerli aralıktaki sayıları kabul eder.
const sanitizeSizes = (sizes, normalize) => {
  if (!sizes || typeof sizes !== "object") return {};

  return Object.entries(sizes).reduce((accumulator, [key, value]) => {
    const numericValue = Number(value);
    if (DEFAULT_WIDGET_ORDER.includes(key) && Number.isFinite(numericValue)) {
      accumulator[key] = normalize(numericValue);
    }
    return accumulator;
  }, {});
};

const normalizeSpan = (value) => clamp(Math.round(value), MIN_WIDGET_SPAN, MAX_WIDGET_SPAN);

const readStoredLayout = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || !Array.isArray(stored.order)) return null;

    // Kaydedilmiş sıralamada olmayan yeni widget'lar sona eklenir, silinenler ayıklanır.
    const knownOrder = stored.order.filter((key) => DEFAULT_WIDGET_ORDER.includes(key));
    const missingOrder = DEFAULT_WIDGET_ORDER.filter((key) => !knownOrder.includes(key));
    const storedHidden = Array.isArray(stored.hidden) ? stored.hidden.filter((key) => DEFAULT_WIDGET_ORDER.includes(key)) : [];
    // Sonradan eklenen ve varsayılanı kapalı olan widget'lar mevcut kullanıcılarda da kapalı başlar.
    const newlyHidden = missingOrder.filter((key) => DEFAULT_HIDDEN_WIDGETS.includes(key));

    return {
      order: [...knownOrder, ...missingOrder],
      hidden: [...new Set([...storedHidden, ...newlyHidden])],
      spans: sanitizeSizes(stored.spans, normalizeSpan),
      heights: sanitizeSizes(stored.heights, snapHeight),
    };
  } catch (error) {
    console.error("Dashboard widget yerleşimi okunamadı:", error);
    return null;
  }
};

const createDefaultLayout = () => ({ order: DEFAULT_WIDGET_ORDER, hidden: [...DEFAULT_HIDDEN_WIDGETS], spans: {}, heights: {} });

/** Widget sırası, görünürlüğü ve boyutlarını tarayıcıda saklayan hook. */
export default function useWidgetLayout() {
  const [layout, setLayout] = useState(() => readStoredLayout() || createDefaultLayout());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch (error) {
      console.error("Dashboard widget yerleşimi kaydedilemedi:", error);
    }
  }, [layout]);

  const setOrder = useCallback((order) => setLayout((previous) => ({ ...previous, order })), []);

  const toggleVisibility = useCallback((key, visible) => {
    setLayout((previous) => ({
      ...previous,
      hidden: visible ? previous.hidden.filter((hiddenKey) => hiddenKey !== key) : [...new Set([...previous.hidden, key])],
    }));
  }, []);

  const hideWidget = useCallback((key) => toggleVisibility(key, false), [toggleVisibility]);

  /** Yeniden boyutlandırma bittiğinde widget'ın genişlik ve/veya yüksekliğini kaydeder. */
  const setWidgetSize = useCallback((key, { span, height } = {}) => {
    setLayout((previous) => {
      const spans = { ...previous.spans };
      const heights = { ...previous.heights };

      if (Number.isFinite(span)) spans[key] = normalizeSpan(span);
      if (Number.isFinite(height)) heights[key] = snapHeight(height);

      return { ...previous, spans, heights };
    });
  }, []);

  /** Tek bir widget'ı varsayılan boyutuna döndürür. */
  const resetWidgetSize = useCallback((key) => {
    setLayout((previous) => {
      const spans = { ...previous.spans };
      const heights = { ...previous.heights };
      delete spans[key];
      delete heights[key];
      return { ...previous, spans, heights };
    });
  }, []);

  const resetLayout = useCallback(() => setLayout(createDefaultLayout()), []);

  return {
    order: layout.order,
    hidden: layout.hidden,
    spans: layout.spans,
    heights: layout.heights,
    setOrder,
    toggleVisibility,
    hideWidget,
    setWidgetSize,
    resetWidgetSize,
    resetLayout,
  };
}
