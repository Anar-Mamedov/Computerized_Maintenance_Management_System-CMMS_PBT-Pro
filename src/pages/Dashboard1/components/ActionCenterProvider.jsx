import React, { useMemo } from "react";
import PropTypes from "prop-types";
import useWidgetData from "./useWidgetData";
import { ActionCenterContext } from "./actionCenterContext";

/** GetDashboardV2ActionCenter isteğini bir kez yapıp Aksiyon Merkezi ve KPI kartlarıyla paylaşır. */
export default function ActionCenterProvider({ children }) {
  const { data, loading, hasError, reload } = useWidgetData("GetDashboardV2ActionCenter");

  const value = useMemo(() => ({ items: data?.data || [], loading, hasError, reload }), [data, loading, hasError, reload]);

  return <ActionCenterContext.Provider value={value}>{children}</ActionCenterContext.Provider>;
}

ActionCenterProvider.propTypes = {
  children: PropTypes.node,
};
