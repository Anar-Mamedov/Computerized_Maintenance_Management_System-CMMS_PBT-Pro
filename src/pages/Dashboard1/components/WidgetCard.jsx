import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Dropdown, Modal, Result, Spin, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { LuArrowRight, LuDownload, LuExpand, LuMoreVertical, LuEyeOff, LuRefreshCw } from "react-icons/lu";
import { useWidgetSize } from "./widgetSizeContext";
import { CARD_HEADER_STYLE, CARD_STYLE, CARD_SUBTITLE_STYLE, CARD_TITLE_STYLE, COLORS } from "./theme";

const { Text } = Typography;

/**
 * Tüm dashboard widget'larının ortak kart kabuğu.
 * Başlık, açıklama, sağ üst aksiyon alanı ve widget menüsünü yönetir.
 */
export default function WidgetCard({ title, subtitle, extra, loading = false, hasError = false, bodyPadding = 16, footer, onRefresh, onDownload, onDetail, onHide, children }) {
  const { t } = useTranslation();
  const { stretch } = useWidgetSize();
  const [expanded, setExpanded] = useState(false);

  const menuItems = [
    { key: "expand", label: t("buyut"), icon: <LuExpand size={14} /> },
    onRefresh ? { key: "refresh", label: t("yenile"), icon: <LuRefreshCw size={14} /> } : null,
    onDownload ? { key: "download", label: t("indir"), icon: <LuDownload size={14} /> } : null,
    onDetail ? { key: "detail", label: t("detayaGit"), icon: <LuArrowRight size={14} /> } : null,
    onHide ? { key: "hide", label: t("widgetiGizle"), icon: <LuEyeOff size={14} /> } : null,
  ].filter(Boolean);

  const handleMenuClick = ({ key }) => {
    if (key === "expand") setExpanded(true);
    if (key === "refresh") onRefresh?.();
    if (key === "download") onDownload?.();
    if (key === "detail") onDetail?.();
    if (key === "hide") onHide?.();
  };

  // Veri alinamadiginda sessizce bos kalmak yerine acik bir hata ve yeniden deneme sunulur.
  const content = hasError ? (
    <Result
      status="warning"
      style={{ padding: "16px 8px" }}
      title={<span style={{ fontSize: 14, color: COLORS.text }}>{t("veriAlinamadi")}</span>}
      extra={
        onRefresh ? (
          <Button size="small" onClick={onRefresh}>
            {t("tekrarDene")}
          </Button>
        ) : null
      }
    />
  ) : (
    children
  );

  const header = (
    <header style={CARD_HEADER_STYLE}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <Text style={CARD_TITLE_STYLE}>{title}</Text>
          {subtitle ? <div style={CARD_SUBTITLE_STYLE}>{subtitle}</div> : null}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {extra}
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]} placement="bottomRight">
          <Button type="text" size="small" aria-label={`${title} ${t("widgetMenusu")}`} icon={<LuMoreVertical size={16} color={COLORS.muted} />} />
        </Dropdown>
      </div>
    </header>
  );

  return (
    <>
      <section style={{ ...CARD_STYLE, height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {header}
        {/* Yukseklik elle ayarlandiginda govde kalan alani doldurur ve tasan icerik kendi icinde kayar. */}
        <div
          className={stretch ? "pbt-widget-body pbt-widget-body-stretch" : "pbt-widget-body"}
          style={{ padding: bodyPadding, flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", ...(stretch ? { overflow: "auto" } : {}) }}
        >
          {expanded ? <div style={{ minHeight: 160 }} /> : <Spin spinning={loading}>{content}</Spin>}
        </div>
        {footer ? <div style={{ borderTop: `1px solid ${COLORS.border}`, padding: "10px 16px" }}>{footer}</div> : null}
      </section>

      <Modal open={expanded} onCancel={() => setExpanded(false)} title={title} width="90%" footer={null} destroyOnClose style={{ top: 24 }}>
        <Spin spinning={loading}>{expanded ? content : null}</Spin>
        {footer ? <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 10, marginTop: 10 }}>{footer}</div> : null}
      </Modal>
    </>
  );
}

WidgetCard.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  extra: PropTypes.node,
  loading: PropTypes.bool,
  hasError: PropTypes.bool,
  bodyPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  footer: PropTypes.node,
  onRefresh: PropTypes.func,
  onDownload: PropTypes.func,
  onDetail: PropTypes.func,
  onHide: PropTypes.func,
  children: PropTypes.node,
};
