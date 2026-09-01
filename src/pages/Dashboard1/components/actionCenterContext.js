import { createContext, useContext } from "react";

export const ActionCenterContext = createContext(null);

/**
 * Aksiyon Merkezi verisini paylaşan hook.
 * Hem Aksiyon Merkezi widget'ı hem de KPI kartlarının alt satırı aynı isteği kullanır.
 */
export function useActionCenter() {
  return useContext(ActionCenterContext) || { items: [], loading: false, hasError: false, reload: () => {} };
}

/** Aksiyon kalemini Key alanına göre bulur. */
export const findActionCount = (items, key) => items.find((item) => item.Key === key)?.Count;
