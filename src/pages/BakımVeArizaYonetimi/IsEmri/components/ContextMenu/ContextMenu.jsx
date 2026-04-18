import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import Iptal from "./components/Iptal/Iptal";
import Kapat from "./components/Kapat/Kapat";
import Parametreler from "./components/Parametreler/Parametreler";
import TarihceTablo from "./components/TarihceTablo";
import Form from "./components/Form/Form";
import Ac from "./components/Ac";
import OnayaGonder from "./components/OnayaGonder.jsx";
import OnayaGonderOnaylayiciList from "./components/OnayaGonderOnaylayiciList.jsx";
import NotEkle from "./components/NotEkle.jsx";

const { Text } = Typography;

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: "11px",
      fontWeight: 600,
      color: "#9CA3AF",
      letterSpacing: "0.06em",
      padding: "12px 16px 6px",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

export default function ContextMenu({ selectedRows, refreshTableData, onayCheck }) {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (v) => setVisible(v);
  const hidePopover = () => setVisible(false);

  const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4);
  const iptalDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 2 || row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 5);
  const kapatDisabled = selectedRows.some((row) => row.KAPALI === true);

  const showAc = selectedRows.length === 1 && selectedRows.every((row) => row.KAPALI === true);
  const showSil = selectedRows.length >= 1 && selectedRows.every((row) => row.KAPALI === false);
  const showOnayaGonder =
    onayCheck &&
    onayCheck.ONY_AKTIF == 1 &&
    onayCheck.ONY_MANUEL == 0 &&
    selectedRows.length >= 1 &&
    selectedRows.some((row) => row.ISM_ONAY_DURUM === 0 || row.ISM_ONAY_DURUM === 3) &&
    selectedRows.every((row) => row.KAPALI === false);
  const showOnayaGonderManuel =
    onayCheck &&
    onayCheck.ONY_AKTIF == 1 &&
    onayCheck.ONY_MANUEL == 1 &&
    selectedRows.length >= 1 &&
    selectedRows.some((row) => row.ISM_ONAY_DURUM === 0 || row.ISM_ONAY_DURUM === 3) &&
    selectedRows.every((row) => row.KAPALI === false);

  const showKapat =
    selectedRows.length >= 1 &&
    (onayCheck && onayCheck.ONY_AKTIF == 1 && onayCheck.ONY_MANUEL == 0
      ? selectedRows.every((row) => row.ISM_ONAY_DURUM === 2)
      : true);

  const showForm = selectedRows.length >= 1;
  const showNotEkle = selectedRows.length === 1 && (selectedRows[0]?.ISM_DIS_NOT === null || selectedRows[0]?.ISM_DIS_NOT === undefined);

  const hasTransferSection = showForm || showNotEkle || showKapat;
  const hasExtraSection = showAc || showOnayaGonder || showOnayaGonderManuel || showSil;

  const selectedKod = selectedRows.length === 1 ? selectedRows[0]?.ISEMRI_NO : `${selectedRows.length} kayıt`;

  const content = (
    <div style={{ width: "360px" }}>
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>İş Emri İşlemleri</div>
        <div style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
          Seçili kayıt: <span style={{ fontWeight: 600, color: "#111827" }}>{selectedKod}</span>
        </div>
      </div>

      <div style={{ padding: "4px 6px 8px" }}>
        {hasTransferSection && (
          <>
            <SectionLabel>Planlama ve Transfer</SectionLabel>
            {showForm && <Form selectedRows={selectedRows} />}
            {showNotEkle && <NotEkle selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}
            {showKapat && <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />}
          </>
        )}

        {hasExtraSection && (
          <>
            <SectionLabel>Ek İşlemler</SectionLabel>
            {showAc && <Ac selectedRows={selectedRows} refreshTableData={refreshTableData} disabled={isDisabled} hidePopover={hidePopover} />}
            {showOnayaGonder && <OnayaGonder selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />}
            {showOnayaGonderManuel && (
              <OnayaGonderOnaylayiciList selectedRows={selectedRows} refreshTableData={refreshTableData} hidePopover={hidePopover} />
            )}
            {showSil && <Sil selectedRows={selectedRows} refreshTableData={refreshTableData} disabled={isDisabled} hidePopover={hidePopover} />}
          </>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      open={visible}
      onOpenChange={handleVisibleChange}
      overlayInnerStyle={{ padding: 0, borderRadius: "14px", overflow: "hidden" }}
    >
      <Button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0px 5px",
          backgroundColor: "#2BC770",
          borderColor: "#2BC770",
          height: "32px",
        }}
      >
        {selectedRows.length >= 1 && <Text style={{ color: "white", marginLeft: "3px" }}>{selectedRows.length}</Text>}
        <MoreOutlined style={{ color: "white", fontSize: "20px", margin: "0" }} />
      </Button>
    </Popover>
  );
}
