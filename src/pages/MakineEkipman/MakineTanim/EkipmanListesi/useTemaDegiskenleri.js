import { useMemo } from "react";
import { theme } from "antd";

/** Marka rengini uygulama temasindan alir (PBT'de mavi, Omega'da turuncu). */
export default function useTemaDegiskenleri() {
  const { token } = theme.useToken();

  return useMemo(
    () => ({
      "--ek-brand": token.colorPrimary,
      "--ek-brand-soft": token.colorPrimaryBg,
    }),
    [token.colorPrimary, token.colorPrimaryBg]
  );
}
