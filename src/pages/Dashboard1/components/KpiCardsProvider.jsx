import React, { useMemo } from "react";
import PropTypes from "prop-types";
import useWidgetData from "./useWidgetData";
import { KpiCardsContext } from "./kpiCardsContext";

/** GetDashboardV2Cards isteğini bir kez yapıp dört KPI kartıyla paylaşır. */
export default function KpiCardsProvider({ children }) {
  const { data, loading, hasError } = useWidgetData("GetDashboardV2Cards");

  const value = useMemo(() => ({ cards: data?.data || {}, loading, hasError }), [data, loading, hasError]);

  return <KpiCardsContext.Provider value={value}>{children}</KpiCardsContext.Provider>;
}

KpiCardsProvider.propTypes = {
  children: PropTypes.node,
};
