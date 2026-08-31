import { useCallback, useEffect, useState } from "react";

// Widget anahtarları değiştikçe sürüm artırılır; eski kayıtlar okunmaz ve
// kullanıcı yeni varsayılan sıralamayla başlar.
const STORAGE_KEY = "dashboardV2WidgetLayout.v3";

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
  "inventoryDistribution",
];

// Referans tasarımda yer almadığı için varsayılan olarak kapalı gelen widget'lar.
export const DEFAULT_HIDDEN_WIDGETS = ["inventoryDistribution"];

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

    return { order: [...knownOrder, ...missingOrder], hidden: [...new Set([...storedHidden, ...newlyHidden])] };
  } catch (error) {
    console.error("Dashboard widget yerleşimi okunamadı:", error);
    return null;
  }
};

/** Widget sırası ve görünürlüğünü tarayıcıda saklayan hook. */
export default function useWidgetLayout() {
  const [layout, setLayout] = useState(() => readStoredLayout() || { order: DEFAULT_WIDGET_ORDER, hidden: [...DEFAULT_HIDDEN_WIDGETS] });

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

  const resetLayout = useCallback(() => setLayout({ order: DEFAULT_WIDGET_ORDER, hidden: [...DEFAULT_HIDDEN_WIDGETS] }), []);

  return { order: layout.order, hidden: layout.hidden, setOrder, toggleVisibility, hideWidget, resetLayout };
}
