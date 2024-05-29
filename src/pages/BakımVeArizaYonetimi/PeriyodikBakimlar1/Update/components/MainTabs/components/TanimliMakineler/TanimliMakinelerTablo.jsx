import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Progress, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import MakineTablo from "./Insert/MakineTablo.jsx";

export default function TanimliMakinelerTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = (date) => {
    if (!date) return "";

    // Örnek bir tarih formatla ve ay formatını belirle
    const sampleDate = new Date(2021, 0, 21); // Ocak ayı için örnek bir tarih
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(
      sampleDate
    );

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
    if (!time || time.trim() === "") return ""; // `trim` metodu ile baştaki ve sondaki boşlukları temizle

    try {
      // Saati ve dakikayı parçalara ayır, boşlukları temizle
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      // Saat ve dakika değerlerinin geçerliliğini kontrol et
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (
        isNaN(hoursInt) ||
        isNaN(minutesInt) ||
        hoursInt < 0 ||
        hoursInt > 23 ||
        minutesInt < 0 ||
        minutesInt > 59
      ) {
        throw new Error("Invalid time format");
      }

      // Geçerli tarih ile birlikte bir Date nesnesi oluştur ve sadece saat ve dakika bilgilerini ayarla
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

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

  const columns = [
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Son Uygulama Tarihi",
      dataIndex: "PBM_SON_UYGULAMA_TARIH",
      key: "PBM_SON_UYGULAMA_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Hedef Tarih",
      dataIndex: "PBM_HEDEF_TARIH",
      key: "PBM_HEDEF_TARIH",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Kalan Süre",
      dataIndex: "PBM_KALAN_SURE",
      key: "PBM_KALAN_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Süre %",
      dataIndex: "PBM_KALAN_SURE_ORAN",
      key: "PBM_KALAN_SURE_ORAN",
      width: 200,
      ellipsis: true,
      render: (text) => <Progress percent={text} steps={8} />,
    },
    {
      title: "Sayaç",
      dataIndex: "MES_TANIM",
      key: "MES_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Güncel Sayaç Değeri",
      dataIndex: "MES_GUNCEL_DEGER",
      key: "MES_GUNCEL_DEGER",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Son Uygulanan",
      dataIndex: "PBM_SON_UYGULAMA_SAYAC",
      key: "PBM_SON_UYGULAMA_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hedef Sayaç",
      dataIndex: "PBM_HEDEF_SAYAC",
      key: "PBM_HEDEF_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Sayaç",
      dataIndex: "PBM_KALAN_SAYAC",
      key: "PBM_KALAN_SAYAC",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Kalan Sayaç %",
      dataIndex: "PBM_KALAN_SAYAC_ORAN",
      key: "PBM_KALAN_SAYAC_ORAN",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "PBM_LOKASYON",
      key: "PBM_LOKASYON",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Durumu",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Kategori",
      dataIndex: "MKN_KATEGORI",
      key: "MKN_KATEGORI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Marka",
      dataIndex: "MKN_MARKA",
      key: "MKN_MARKA",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Makine Model",
      dataIndex: "MKN_MODEL",
      key: "MKN_MODEL",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Hartırlatma Süresi",
      dataIndex: "PBM_HATIRLAT_SURE",
      key: "PBM_HATIRLAT_SURE",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`PeriyodikBakimGetMakineList?BakimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_MAKINE_ID,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]); // secilenBakimID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenBakimID) {
      // secilenBakimID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenBakimID, fetch]); // secilenBakimID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div>
      {/*<CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />*/}
      <MakineTablo />
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
        />
      )}
    </div>
  );
}
