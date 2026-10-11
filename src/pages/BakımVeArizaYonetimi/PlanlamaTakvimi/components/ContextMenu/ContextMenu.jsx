import React, { useState } from "react";
import { Button, Popover, Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Sil from "./components/Sil";
import Iptal from "./components/Iptal/Iptal";
import Kapat from "./components/Kapat/Kapat";
import Parametreler from "./components/Parametreler/Parametreler";
import TarihceTablo from "./components/TarihceTablo";
import Form from "./components/Form/Form";
import DownloadCSV from "./components/DownloadCSV/DownloadCSV";
import BakimIslemleri from "./components/BakimIslemleri/BakimIslemleri.jsx";
import BakimIslemModali from "./components/BakimIslemleri/BakimIslemModali.jsx";
import PersonelIhtiyaci from "./components/PersonelIhtiyaci/PersonelIhtiyaci.jsx";
import PeryodikBakimDetayi from "./components/PeryodikBakimDetayi/PeryodikBakimDetayi.jsx";
import MakineDetayi from "./components/MakineDetayi/MakineDetayi.jsx";
import IsEmriDetayi from "./components/IsEmriDetayi/IsEmriDetayi.jsx";

const { Text, Link } = Typography;

export default function ContextMenu({
  selectedRows,
  refreshTableData,
  selectedCells,
  onBakimIslemiTamamlandi,
}) {
  const [visible, setVisible] = useState(false);
  const [bakimModali, setBakimModali] = useState(null);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const hidePopover = () => {
    setVisible(false);
  };

  const bakimIslemiSecildi = (modal) => {
    setVisible(false);
    setBakimModali(modal);
  };

  const bakimIslemiTamamlandi = () => {
    setBakimModali(null);
    onBakimIslemiTamamlandi();
  };
  // Silme işlemi için disable durumunu kontrol et
  // const isDisabled = selectedRows.some((row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 4);
  // const iptalDisabled = selectedRows.some(
  //   (row) => row.IST_DURUM_ID === 3 || row.IST_DURUM_ID === 2 || row.IST_DURUM_ID === 4 || row.IST_DURUM_ID === 5
  // );
  // const kapatDisabled = selectedRows.some((row) => row.KAPALI === true);

  const content = (
    <div>
      {/* <Sil
        selectedRows={selectedRows}
        refreshTableData={refreshTableData}
        disabled={isDisabled}
        hidePopover={hidePopover}
      /> */}
      {/* <Iptal selectedRows={selectedRows} refreshTableData={refreshTableData} iptalDisabled={iptalDisabled} /> */}
      {/* {selectedRows.length >= 1 && (
        <Kapat selectedRows={selectedRows} refreshTableData={refreshTableData} kapatDisabled={kapatDisabled} />
      )} */}

      {/* <Parametreler />
      {selectedRows.length === 1 && <TarihceTablo selectedRows={selectedRows} />} */}
      {/* {selectedRows.length >= 1 && <Form selectedRows={selectedRows} />}
      {selectedRows.length >= 1 && <DownloadCSV selectedRows={selectedRows} />} */}
      {selectedCells.length >= 1 && (
        <>
          <BakimIslemleri selectedCells={selectedCells} onSec={bakimIslemiSecildi} />
          <PersonelIhtiyaci selectedCells={selectedCells} />
          <PeryodikBakimDetayi selectedCells={selectedCells} />
          <MakineDetayi selectedCells={selectedCells} />
          <IsEmriDetayi selectedCells={selectedCells} />
        </>
      )}
    </div>
  );
  return (
    <>
      <Popover
        placement="bottom"
        content={content}
        trigger="click"
        open={visible}
        onOpenChange={handleVisibleChange}
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
          {selectedCells.length >= 1 && (
            <Text style={{ color: "white", marginLeft: "3px" }}>
              {selectedCells.length}
            </Text>
          )}
          <MoreOutlined
            style={{ color: "white", fontSize: "20px", margin: "0" }}
          />
        </Button>
      </Popover>
      <BakimIslemModali modal={bakimModali} onKapat={() => setBakimModali(null)} onTamamlandi={bakimIslemiTamamlandi} />
    </>
  );
}
