import { createContext, useContext } from "react";
import dayjs from "dayjs";

export const DashboardContext = createContext(null);

/** Dashboard filtre ve yenileme state'ine erişim sağlar. */
export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard, DashboardProvider içinde kullanılmalıdır.");
  }

  return context;
}

/** Seçilen tarihi API'nin beklediği gün başlangıcı formatına çevirir. */
export const toApiStart = (date) => (date ? dayjs(date).startOf("day").format("YYYY-MM-DDTHH:mm:ss") : null);

/** Seçilen tarihi API'nin beklediği gün sonu formatına çevirir. */
export const toApiEnd = (date) => (date ? dayjs(date).endOf("day").format("YYYY-MM-DDTHH:mm:ss") : null);
