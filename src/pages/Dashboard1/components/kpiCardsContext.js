import { createContext, useContext } from "react";

export const KpiCardsContext = createContext(null);

/**
 * KPI kartı verisini paylaşan hook.
 * Dört kart ayrı ayrı sürüklenebilir widget olduğu için istek tek bir yerden yapılır.
 */
export function useKpiCards() {
  return useContext(KpiCardsContext) || { cards: {}, loading: false, hasError: false };
}
