import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { DashboardContext, toApiEnd, toApiStart } from "./dashboardContext";

const startOfYear = () => dayjs().startOf("year");
const endOfYear = () => dayjs().endOf("year");

/** Dashboard genelindeki tarih/lokasyon/ekipman filtrelerini ve yenileme tetikleyicisini yönetir. */
export default function DashboardProvider({ children }) {
  const [baslangicTarihi, setBaslangicTarihi] = useState(startOfYear);
  const [bitisTarihi, setBitisTarihi] = useState(endOfYear);
  const [lokasyonIds, setLokasyonIds] = useState([]);
  const [ekipmanIds, setEkipmanIds] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sonGuncelleme, setSonGuncelleme] = useState(() => dayjs());

  const refresh = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
    setSonGuncelleme(dayjs());
  }, []);

  const filters = useMemo(
    () => ({
      BaslangicTarihi: toApiStart(baslangicTarihi),
      BitisTarihi: toApiEnd(bitisTarihi),
      LokasyonIds: lokasyonIds,
      AtolyeIds: [],
      EkipmanIds: ekipmanIds,
    }),
    [baslangicTarihi, bitisTarihi, lokasyonIds, ekipmanIds]
  );

  const value = useMemo(
    () => ({
      filters,
      refreshKey,
      refresh,
      sonGuncelleme,
      baslangicTarihi,
      bitisTarihi,
      lokasyonIds,
      ekipmanIds,
      setBaslangicTarihi,
      setBitisTarihi,
      setLokasyonIds,
      setEkipmanIds,
    }),
    [filters, refreshKey, refresh, sonGuncelleme, baslangicTarihi, bitisTarihi, lokasyonIds, ekipmanIds]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

DashboardProvider.propTypes = {
  children: PropTypes.node,
};
