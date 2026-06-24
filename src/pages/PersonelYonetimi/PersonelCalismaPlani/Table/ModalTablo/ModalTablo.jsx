import React, { useCallback, useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Tag, message } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../api/http.jsx";
import CreateDrawer from "../../Insert/CreateDrawer.jsx";
import EditDrawer from "../../Update/EditDrawer.jsx";
import Filters from "./filter/Filters.jsx";
import ContextMenu from "../../components/ContextMenu/ContextMenu.jsx";
import TeknisyenSubmit from "../../components/IsEmrineCevir/Teknisyen/TeknisyenSubmit.jsx";
import AtolyeSubmit from "../../components/IsEmrineCevir/Atolye/AtolyeSubmit.jsx";
import EditDrawer1 from "../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "styled-components";

dayjs.extend(customParseFormat);

//styled components
const StyledTable = styled(Table)`
  .ant-table-cell {
    padding: 16px 16px !important;
  }
`;

//styled components end

export default function MainTable() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı için state
  const [totalDataCount, setTotalDataCount] = useState(0); // Tüm veriyi tutan state
  const [pageSize, setPageSize] = useState(10); // Başlangıçta sayfa başına 10 kayıt göster
  const apiRequestInProgress = useRef(false);
  const [requestCounter, setRequestCounter] = useState(0);

  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const statusTag = (statusId) => {
    switch (statusId) {
      case 0:
        return { color: "blue", text: "Açık" };
      case 1:
        return { color: "#ff5e00", text: "Bekliyor" };
      case 2:
        return { color: "#ffe600", text: "Planlandı" };
      case 3:
        return { color: "#00d300", text: "Devam Ediyor" };
      case 4:
        return { color: "#575757", text: "Kapandı" };
      case 5:
        return { color: "#d10000", text: "İptal Edildi" };
      case 6:
        return { color: "#ff5e00", text: "Onay Bekliyor" };
      case 7:
        return { color: "#00d300", text: "Onaylandı" };
      case 8:
        return { color: "#d10000", text: "Onaylanmadı" };
      default:
        return { color: "default", text: "" }; // Eğer farklı bir değer gelirse
    }
  };

  const hexToRGBA = (hex, opacity) => {
    // Hex kodunu R, G, B değerlerine dönüştür
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    // RGBA formatında string döndür
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: "Talep Kodu",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: "120px",
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tarih",
      dataIndex: "IST_ACILIS_TARIHI",
      key: "IST_ACILIS_TARIHI",
      width: "110px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Saat",
      dataIndex: "IST_ACILIS_SAATI",
      key: "IST_ACILIS_SAATI",
      width: "90px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Konu",
      dataIndex: "IST_TANIMI",
      key: "IST_TANIMI",
      width: "300px",
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Talep Eden",
      dataIndex: "IST_TALEP_EDEN_ADI",
      key: "IST_TALEP_EDEN_ADI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Durum",
      dataIndex: "IST_DURUM_ID",
      key: "IST_DURUM_ID",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (_, record) => {
        const { color, text } = statusTag(record.IST_DURUM_ID);
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tag
              style={{
                textAlign: "center",
                backgroundColor: hexToRGBA(color, 0.2),
                border: `1.2px solid ${hexToRGBA(color, 0.7)}`,
                color: color,
              }}
            >
              {text}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Makine Tanım",
      dataIndex: "IST_MAKINE_TANIM",
      key: "IST_MAKINE_TANIM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },

    // {
    //   title: "Durum",
    //   dataIndex: "IST_DURUM_ID",
    //   key: "IST_DURUM_ID",
    //   width: "150px",
    //   ellipsis: true,
    //   visible: true, // Varsayılan olarak açık
    //   render: (text, record) => {
    //     switch (record.IST_DURUM_ID) {
    //       case 0:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "blue",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             Açık
    //           </div>
    //         );
    //       case 1:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "#ff5e00",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             Bekliyor
    //           </div>
    //         );
    //       case 2:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "#ffe600",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             Planlandı
    //           </div>
    //         );
    //       case 3:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "#00d300",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             Devam Ediyor
    //           </div>
    //         );
    //       case 4:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "#575757",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             Kapandı
    //           </div>
    //         );
    //       case 5:
    //         return (
    //           <div
    //             style={{
    //               color: "white",
    //               backgroundColor: "#d10000",
    //               textAlign: "center",
    //               borderRadius: "10px",
    //               padding: "6px",
    //             }}>
    //             İptal Edildi
    //           </div>
    //         );
    //       default:
    //         return ""; // Eğer farklı bir değer gelirse
    //     }
    //   },
    // },

    {
      title: "İş Kategorisi",
      dataIndex: "IST_KATEGORI_TANIMI",
      key: "IST_KATEGORI_TANIMI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Öncelik",
      dataIndex: "IST_ONCELIK",
      key: "IST_ONCELIK",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Lokasyon",
      dataIndex: "IST_BILDIREN_LOKASYON",
      key: "IST_BILDIREN_LOKASYON",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "İşlem Süresi",
      dataIndex: "ISLEM_SURE",
      key: "ISLEM_SURE",
      width: 300,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text, record) => {
        let baslangicTarihi, bitisTarihi;
        // IST_ACILIS_TARIHI ve IST_ACILIS_SAATI'nin tarih ve saatini al
        baslangicTarihi = dayjs(record.IST_ACILIS_TARIHI.split("T")[0] + "T" + record.IST_ACILIS_SAATI, "YYYY-MM-DDTHH:mm:ss");

        // IST_DURUM_ID'nin değeri 4'ten farklıysa
        if (record.IST_DURUM_ID !== 4) {
          // Şimdiki zamanı al
          bitisTarihi = dayjs();
        } else {
          // IST_KAPAMA_TARIHI ve IST_KAPAMA_SAATI değerleri null, undefined veya boş değilse
          if (record.IST_KAPAMA_TARIHI && record.IST_KAPAMA_SAATI) {
            // IST_KAPAMA_TARIHI ve IST_KAPAMA_SAATI'nin tarih ve saatini al
            bitisTarihi = dayjs(record.IST_KAPAMA_TARIHI.split("T")[0] + "T" + record.IST_KAPAMA_SAATI, "YYYY-MM-DDTHH:mm:ss");
          } else {
            // IST_KAPAMA_TARIHI ve IST_KAPAMA_SAATI değerleri null, undefined veya boşsa, hesaplama yapma ve boş döndür
            return "";
          }
        }

        // İki zaman arasındaki farkı milisaniye cinsinden hesapla
        const fark = bitisTarihi.diff(baslangicTarihi);
        // Farkı saniye cinsine çevir
        const farkSaniye = Math.floor(fark / 1000);
        // Farkı dakika cinsine çevir
        const farkDakika = Math.floor(farkSaniye / 60);
        // Farkı saat cinsine çevir
        const farkSaat = Math.floor(farkDakika / 60);
        // Farkı gün cinsine çevir
        const farkGun = Math.floor(farkSaat / 24);
        // İşlem süresini formatla ve döndür
        // return `${farkGun > 0 ? farkGun + " gün " : ""}${farkSaat % 24} saat ${farkDakika % 60} dakika `;
        return `${farkGun > 0 ? farkGun + " gün " : ""}${farkSaat % 24 > 0 ? (farkSaat % 24) + " saat " : ""}${farkDakika % 60 > 0 ? (farkDakika % 60) + " dakika " : ""}`;
      },
    },
    {
      title: "Kapanma Tarih",
      dataIndex: "IST_KAPAMA_TARIHI",
      key: "IST_KAPAMA_TARIHI",
      width: "110px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Kapanma Saat",
      dataIndex: "IST_KAPAMA_SAATI",
      key: "IST_KAPAMA_SAATI",
      width: "90px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "İptal Tarih",
      dataIndex: "IST_IPTAL_TARIH",
      key: "IST_IPTAL_TARIH",
      width: "110px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "İptal Saat",
      dataIndex: "IST_IPTAL_SAAT",
      key: "IST_IPTAL_SAAT",
      width: "90px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Müdahele Gecikme Süresi",
      dataIndex: "mudaheleGecikmeSuresi",
      key: "mudaheleGecikmeSuresi",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Durum Açıklaması",
      dataIndex: "durumAciklamasi",
      key: "durumAciklamasi",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Planlanan Başlama Tarihi",
      dataIndex: "IST_PLANLANAN_BASLAMA_TARIHI",
      key: "IST_PLANLANAN_BASLAMA_TARIHI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Başlama Saati",
      dataIndex: "IST_PLANLANAN_BASLAMA_SAATI",
      key: "IST_PLANLANAN_BASLAMA_SAATI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Planlanan Bitiş Tarihi",
      dataIndex: "IST_PLANLANAN_BITIS_TARIHI",
      key: "IST_PLANLANAN_BITIS_TARIHI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Bitiş Saati",
      dataIndex: "IST_PLANLANAN_BITIS_SAATI",
      key: "IST_PLANLANAN_BITIS_SAATI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "İş Emri No",
      dataIndex: "IST_ISEMRI_NO",
      key: "IST_ISEMRI_NO",
      width: "150px",
      ellipsis: true,
      onCell: (record) => ({
        onClick: (event) => {
          event.stopPropagation();

          // Burada, record objesini doğrudan kullanmak yerine,
          // bir kopyasını oluşturup `key` değerini `ISM_DURUM_KOD_ID` ile güncelliyoruz.
          const updatedRecord = { ...record, key: record.IST_ISEMRI_ID };
          // const updatedRecord = { ...record, key: 378 };

          setEditDrawer1Data(updatedRecord); // Güncellenmiş record'u EditDrawer1 için data olarak ayarla
          setEditDrawer1Visible(true); // EditDrawer1'i aç
        },
      }),
      render: (text) => <a>{text}</a>,
      visible: true, // Varsayılan olarak kapalı
    },
    {
      title: "Teknisyen",
      dataIndex: "IST_TEKNISYEN_TANIM",
      key: "IST_TEKNISYEN_TANIM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Atölye",
      dataIndex: "IST_ATOLYE_TANIM",
      key: "IST_ATOLYE_TANIM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Makine Kodu",
      dataIndex: "IST_MAKINE_KOD",
      key: "IST_MAKINE_KOD",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    // {
    //   title: "Makine Plaka",
    //   dataIndex: "IST_MAKINE_PLAKA",
    //   key: "IST_MAKINE_PLAKA",
    //   width: "150px",
    //   ellipsis: true,
    //   onCell: () => ({
    //     onClick: (event) => {
    //       event.stopPropagation();
    //     },
    //   }),
    //   visible: false, // Varsayılan olarak kapalı
    // },
    {
      title: "Bildirim Tipi",
      dataIndex: "IST_TIP_TANIM",
      key: "IST_TIP_TANIM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İlgili Kişi",
      dataIndex: "IST_TAKIP_EDEN_ADI",
      key: "IST_TAKIP_EDEN_ADI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Bina",
      dataIndex: "IST_BINA",
      key: "IST_BINA",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Kat",
      dataIndex: "IST_KAT",
      key: "IST_KAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Servis Nedeni",
      dataIndex: "IST_SERVIS_NEDENI",
      key: "IST_SERVIS_NEDENI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Tam Lokasyon",
      dataIndex: "IST_BILDIREN_LOKASYON_TUM",
      key: "IST_BILDIREN_LOKASYON_TUM",
      width: 300,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Ana Lokasyon",
      dataIndex: "IST_BILDIREN_LOKASYON_TUM",
      key: "ANA_LOKASYON",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 300,
      sorter: (a, b) => {
        if (a.IST_BILDIREN_LOKASYON_TUM && b.IST_BILDIREN_LOKASYON_TUM) {
          return a.IST_BILDIREN_LOKASYON_TUM.localeCompare(b.IST_BILDIREN_LOKASYON_TUM);
        }
        if (!a.IST_BILDIREN_LOKASYON_TUM && !b.IST_BILDIREN_LOKASYON_TUM) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.IST_BILDIREN_LOKASYON_TUM ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      render: (text) => {
        if (text === null) {
          return null;
        }
        const parts = text.split("/");
        return parts.length > 1 ? parts[0] : text;
      }, // Add this line
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Talep Değerlendirme Puan",
      dataIndex: "IST_DEGERLENDIRME_PUAN",
      key: "IST_DEGERLENDIRME_PUAN",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Talep Değerlendirme Açıklama",
      dataIndex: "IST_DEGERLENDIRME_ACIKLAMA",
      key: "IST_DEGERLENDIRME_ACIKLAMA",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    // Diğer kolonlarınız...
  ];

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    // 'visibleColumns' isimli anahtarla kaydedilmiş değeri oku
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumnsIsTalep"));

    // Eğer localStorage'da bir değer varsa, bu değeri kullan
    if (savedVisibleColumns) {
      return savedVisibleColumns;
    }

    // Yoksa, varsayılan olarak görünür olacak kolonların key'lerini döndür
    return columns.filter((col) => col.visible).map((col) => col.key);
  });

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için son

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
      // `hour12` seçeneğini belirtmeyerek Intl.DateTimeFormat'ın kullanıcının sistem ayarlarına göre otomatik seçim yapmasına izin ver
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

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const [body, setBody] = useState({
    keyword: "",
    filters: {
      durumlar: { key0: "3" }, // Varsayılan filtre - Devam Ediyor
    },
  });

  // ana tablo api isteği için kullanılan useEffect
  useEffect(() => {
    // Çok fazla API isteği gönderilmesini önlemek için bir zamanlayıcı kullanıyoruz
    const fetchTimeout = setTimeout(() => {
      if (!apiRequestInProgress.current) {
        apiRequestInProgress.current = true;
        fetchEquipmentData(body, currentPage, pageSize).finally(() => {
          apiRequestInProgress.current = false;
        });
      }
    }, 300);

    return () => clearTimeout(fetchTimeout);
  }, [body, currentPage, pageSize, requestCounter]);

  // arama işlemi için kullanılan useEffect
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Arama terimi değiştiğinde ve boş olduğunda API isteğini tetikle
    const timeout = setTimeout(() => {
      if (searchTerm !== body.keyword) {
        handleBodyChange("keyword", searchTerm);
        setCurrentPage(1); // Arama yapıldığında veya arama sıfırlandığında sayfa numarasını 1'e ayarla
      }
    }, 2000);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // arama işlemi için kullanılan useEffect son

  const fetchEquipmentData = async (body, page, size) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    try {
      setLoading(true);
      console.log("API isteği gönderiliyor:", filters);

      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(`GetIsTalepFullList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`, filters);
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.is_talep_listesi.map((item) => ({
          ...item,
          key: item.TB_IS_TALEP_ID,
          // Diğer alanlarınız...
        }));
        setData(formattedData);
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        // İnternet bağlantısı var
        message.error("Hata Mesajı: " + error.message);
      } else {
        // İnternet bağlantısı yok
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  // filtreleme işlemi için kullanılan useEffect
  const handleBodyChange = useCallback((type, newBody) => {
    setBody((state) => {
      // Eğer filters güncelleniyor ise
      if (type === "filters") {
        return {
          ...state,
          [type]: newBody,
        };
      }

      return {
        ...state,
        [type]: newBody,
      };
    });
    setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla

    // Yeni bir istek tetiklemek için sayacı artır
    setRequestCounter((prev) => prev + 1);
  }, []);

  // sayfalama için kullanılan useEffect
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (pagination) {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize); // pageSize güncellemesi
    }
  };
  // sayfalama için kullanılan useEffect son

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
    // Seçilen satırların verisini bul
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Seçilen satırların verilerini state'e ata
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setDrawer({ visible: true, data: record });
      },
    };
  };

  // const refreshTableData = useCallback(() => {
  //   fetchEquipmentData();
  // }, []);

  const refreshTableData = useCallback(() => {
    // Sayfa numarasını 1 yap
    // setCurrentPage(1);

    // `body` içerisindeki filtreleri ve arama terimini sıfırla
    // setBody({
    //   keyword: "",
    //   filters: {},
    // });
    // setSearchTerm("");

    // Tablodan seçilen kayıtların checkbox işaretini kaldır
    setSelectedRowKeys([]);
    setSelectedRows([]);

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData(body, currentPage);
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage]); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  // Kolon görünürlüğünü güncelleme fonksiyonu
  const handleVisibilityChange = (checkedValues) => {
    setVisibleColumnKeys(checkedValues);
    // Yeni görünürlük durumunu localStorage'a kaydet
    localStorage.setItem("visibleColumnsIsTalep", JSON.stringify(checkedValues));
  };

  // Modalı göster/gizle
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Görünür kolonları filtrele
  const visibleColumns = columns.filter((col) => visibleColumnKeys.includes(col.key));

  // Kolon görünürlüğünü güncelleme fonksiyonu son

  return (
    <div>
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
        `}
      </style>

      <Modal width={750} title="Kolonları Düzenle" open={isModalVisible} onOk={toggleModal} onCancel={toggleModal}>
        <Checkbox.Group
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            height: "400px",
          }}
          value={visibleColumnKeys}
          onChange={handleVisibilityChange}
        >
          {columns.map((col) => (
            <Checkbox key={col.key} value={col.key}>
              {col.title}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              // width: "32px",
              height: "32px",
            }}
            onClick={toggleModal}
          >
            <MenuOutlined />
          </Button>
          <Input
            style={{ width: "250px", maxWidth: "200px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Filters onChange={handleBodyChange} />
          <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
      </div>
      <Spin spinning={loading}>
        <StyledTable
          columns={visibleColumns}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={{
            current: currentPage,
            total: totalDataCount, // Toplam kayıt sayısı (sayfa başına kayıt sayısı ile çarpılır)
            pageSize: pageSize,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            onChange: handleTableChange,
            showTotal: (total, range) => `Toplam ${total}`, // Burada 'total' parametresi doğru kayıt sayısını yansıtacaktır
            showQuickJumper: true,
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 380px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
        />
      </Spin>

      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />

      {editDrawer1Visible && (
        <EditDrawer1
          selectedRow={editDrawer1Data}
          onDrawerClose={() => setEditDrawer1Visible(false)}
          drawerVisible={editDrawer1Visible}
          onRefresh={() => {
            /* Veri yenileme işlemi */
          }}
        />
      )}
    </div>
  );
}
