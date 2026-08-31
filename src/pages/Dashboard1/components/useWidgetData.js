import { useCallback, useEffect, useRef, useState } from "react";
import AxiosInstance from "../../../api/http";
import { useDashboard } from "./dashboardContext";

/**
 * Dashboard V2 endpointleri için ortak veri çekme hook'u.
 * Global filtreler otomatik olarak gövdeye eklenir, `extraBody` ile widget'a özel
 * alanlar (Donem, Gorunum, AramaMetni vb.) gönderilebilir.
 */
export default function useWidgetData(endpoint, extraBody) {
  const { filters, refreshKey } = useDashboard();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const requestIdRef = useRef(0);

  const extraBodyKey = JSON.stringify(extraBody || {});

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const fetchData = async () => {
      setLoading(true);
      setHasError(false);
      try {
        const response = await AxiosInstance.post(endpoint, {
          ...filters,
          ...JSON.parse(extraBodyKey),
        });
        if (requestIdRef.current === requestId) {
          setData(response);
        }
      } catch (error) {
        console.error(`${endpoint} verisi alınamadı:`, error);
        if (requestIdRef.current === requestId) {
          setData(null);
          setHasError(true);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [endpoint, filters, extraBodyKey, refreshKey, localRefreshKey]);

  const reload = useCallback(() => setLocalRefreshKey((previous) => previous + 1), []);

  return { data, loading, hasError, reload };
}
