import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import Sekmeler from "./components/Sekmeler";

const { Text, Link } = Typography;

export default function TarihceTablo({ workshopSelectedId, onSubmit, selectedRows }) {
  const { control, watch, setValue } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long"; // Tam ad ("January")
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short"; // Üç harfli kısaltma ("Jan")
    } else {
      monthFormat = "2-digit"; // Sayısal gösterim ("01")
    }

    // Kullanıcı için tarihi formatla
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time) return "";

    try {
      // Saati ve dakikayı parçalara ayır (varsayılan olarak "HH:MM:SS" veya "HH:MM" formatında beklenir)
      const [hours, minutes] = time.split(":");

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

      // Kullanıcının lokal ayarlarına uygun olarak saat ve dakikayı formatla
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının yerel ayarlarına göre otomatik seçim yapmasına izin ver
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
        // hour12 seçeneği burada belirtilmiyor; böylece otomatik olarak kullanıcının sistem ayarlarına göre belirleniyor
      });

      // Formatlanmış saati döndür
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return ""; // Hata durumunda boş bir string döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  useEffect(() => {
    if (isModalVisible) {
      // Tablodan seçilen kayıtların IST_KOD ve IST_TANIMI değerlerini birleştir ve / ile ayır
      const istKodlarVeKonular = selectedRows.map((row) => `${row.IST_KOD} / ${row.IST_TANIMI}`).join(", ");
      setValue("fisNo", istKodlarVeKonular); // "fisNo" alanını güncelle
    }
  }, [isModalVisible, setValue, selectedRows]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };
  return (
    <div>
      <Button
        style={{ display: "flex", padding: "0px 0px", alignItems: "center", justifyContent: "flex-start" }}
        onClick={handleModalToggle}
        type="submit">
        Tarihçe
      </Button>
      <Modal
        width={1200}
        centered
        destroyOnClose
        title="Makine Tarihçe"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <div>
          <Sekmeler selectedRows={selectedRows} />
        </div>
        <div></div>
      </Modal>
    </div>
  );
}
