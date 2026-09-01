import { createContext, useContext } from "react";

export const WidgetSizeContext = createContext({ stretch: false });

/**
 * Widget'a elle bir yükseklik verilip verilmediğini bildirir.
 * `stretch` true olduğunda grafikler sabit piksel yerine kalan alanı doldurur.
 */
export function useWidgetSize() {
  return useContext(WidgetSizeContext);
}
