import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Tag, message } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import TeknisyenSubmit from "../components/IsEmrineCevir/Teknisyen/TeknisyenSubmit";
import AtolyeSubmit from "../components/IsEmrineCevir/Atolye/AtolyeSubmit";
import EditDrawer1 from "../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer";

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
            }}>
            <Tag
              style={{
                textAlign: "center",
                backgroundColor: hexToRGBA(color, 0.2),
                border: `1.2px solid ${hexToRGBA(color, 0.7)}`,
                color: color,
              }}>
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

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body, currentPage, pageSize);
  }, [body, currentPage, pageSize]);

  // ana tablo api isteği için kullanılan useEffect son

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
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(
        `GetIsTalepFullList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`,
        filters
      );
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.is_talep_listesi.map((item) => ({
          ...item,
          key: item.TB_IS_TALEP_ID,
          IST_KOD: item.IST_KOD,
          IST_ACILIS_TARIHI: item.IST_ACILIS_TARIHI,
          IST_ACILIS_SAATI: item.IST_ACILIS_SAATI,
          IST_GUNCELLEME_TARIHI: item.IST_GUNCELLEME_TARIHI,
          IST_GUNCELLEME_SAATI: item.IST_GUNCELLEME_SAATI,
          IST_GUNCELEYEN_ID: item.IST_GUNCELEYEN_ID,
          IST_KAPAMA_TARIHI: item.IST_KAPAMA_TARIHI,
          IST_KAPAMA_SAATI: item.IST_KAPAMA_SAATI,
          IST_TALEP_EDEN_ID: item.IST_TALEP_EDEN_ID,
          IST_IS_TAKIPCISI_ID: item.IST_IS_TAKIPCISI_ID,
          IST_ATOLYE_GRUP_ID: item.IST_ATOLYE_GRUP_ID,
          IST_TIP_KOD_ID: item.IST_TIP_KOD_ID,
          IST_KOTEGORI_KODI_ID: item.IST_KOTEGORI_KODI_ID,
          IST_SERVIS_NEDENI_KOD_ID: item.IST_SERVIS_NEDENI_KOD_ID,
          IST_IRTIBAT_KOD_KOD_ID: item.IST_IRTIBAT_KOD_KOD_ID,
          IST_BILDIRILEN_BINA: item.IST_BILDIRILEN_BINA,
          IST_BILDIRILEN_KAT: item.IST_BILDIRILEN_KAT,
          IST_TANIMI: item.IST_TANIMI,
          IST_KONU: item.IST_KONU,
          IST_NOT: item.IST_NOT,
          IST_DURUM_ID: item.IST_DURUM_ID,
          IST_ONCELIK_ID: item.IST_ONCELIK_ID,
          IST_PLANLANAN_BASLAMA_TARIHI: item.IST_PLANLANAN_BASLAMA_TARIHI,
          IST_PLANLANAN_BASLAMA_SAATI: item.IST_PLANLANAN_BASLAMA_SAATI,
          IST_PLANLANAN_BITIS_TARIHI: item.IST_PLANLANAN_BITIS_TARIHI,
          IST_PLANLANAN_BITIS_SAATI: item.IST_PLANLANAN_BITIS_SAATI,
          IST_BILDIREN_LOKASYON_ID: item.IST_BILDIREN_LOKASYON_ID,
          IST_IRTIBAT_TELEFON: item.IST_IRTIBAT_TELEFON,
          IST_MAIL_ADRES: item.IST_MAIL_ADRES,
          IST_BASLAMA_TARIHI: item.IST_BASLAMA_TARIHI,
          IST_BASLAMA_SAATI: item.IST_BASLAMA_SAATI,
          IST_BITIS_TARIHI: item.IST_BITIS_TARIHI,
          IST_BITIS_SAATI: item.IST_BITIS_SAATI,
          IST_IPTAL_NEDEN: item.IST_IPTAL_NEDEN,
          IST_IPTAL_TARIH: item.IST_IPTAL_TARIH,
          IST_IPTAL_SAAT: item.IST_IPTAL_SAAT,
          IST_MAKINE_ID: item.IST_MAKINE_ID,
          IST_EKIPMAN_ID: item.IST_EKIPMAN_ID,
          IST_ISEMRI_ID: item.IST_ISEMRI_ID,
          IST_ACIKLAMA: item.IST_ACIKLAMA,
          IST_SONUC: item.IST_SONUC,
          IST_AKTIF: item.IST_AKTIF,
          IST_BIRLESIM_ID: item.IST_BIRLESIM_ID,
          IST_ACILIS_NEDEN: item.IST_ACILIS_NEDEN,
          IST_SABLON_ID: item.IST_SABLON_ID,
          IST_ARIZA_ID: item.IST_ARIZA_ID,
          IST_MAKINE_DURUM_KOD_ID: item.IST_MAKINE_DURUM_KOD_ID,
          IST_ARIZA_TANIM_KOD_ID: item.IST_ARIZA_TANIM_KOD_ID,
          IST_OKUNDU: item.IST_OKUNDU,
          IST_ISEMRI_TIP_ID: item.IST_ISEMRI_TIP_ID,
          IST_OZEL_ALAN_1: item.IST_OZEL_ALAN_1,
          IST_OZEL_ALAN_2: item.IST_OZEL_ALAN_2,
          IST_OZEL_ALAN_3: item.IST_OZEL_ALAN_3,
          IST_OZEL_ALAN_4: item.IST_OZEL_ALAN_4,
          IST_OZEL_ALAN_5: item.IST_OZEL_ALAN_5,
          IST_OZEL_ALAN_6: item.IST_OZEL_ALAN_6,
          IST_OZEL_ALAN_7: item.IST_OZEL_ALAN_7,
          IST_OZEL_ALAN_8: item.IST_OZEL_ALAN_8,
          IST_OZEL_ALAN_9: item.IST_OZEL_ALAN_9,
          IST_OZEL_ALAN_10: item.IST_OZEL_ALAN_10,
          IST_OZEL_ALAN_11: item.IST_OZEL_ALAN_11,
          IST_OZEL_ALAN_12: item.IST_OZEL_ALAN_12,
          IST_OZEL_ALAN_13: item.IST_OZEL_ALAN_13,
          IST_OZEL_ALAN_14: item.IST_OZEL_ALAN_14,
          IST_OZEL_ALAN_15: item.IST_OZEL_ALAN_15,
          IST_OZEL_ALAN_16: item.IST_OZEL_ALAN_16,
          IST_OZEL_ALAN_17: item.IST_OZEL_ALAN_17,
          IST_OZEL_ALAN_18: item.IST_OZEL_ALAN_18,
          IST_OZEL_ALAN_19: item.IST_OZEL_ALAN_19,
          IST_OZEL_ALAN_20: item.IST_OZEL_ALAN_20,
          IST_OLUSTURAN_ID: item.IST_OLUSTURAN_ID,
          IST_OLUSTURMA_TARIH: item.IST_OLUSTURMA_TARIH,
          IST_DEGISTIREN_ID: item.IST_DEGISTIREN_ID,
          IST_DEGISTIRME_TARIH: item.IST_DEGISTIRME_TARIH,
          IST_ON_DEGERLENDIRME: item.IST_ON_DEGERLENDIRME,
          IST_IS_DEVAM_DURUM_ID: item.IST_IS_DEVAM_DURUM_ID,
          IST_DEGERLENDIRME_PUAN: item.IST_DEGERLENDIRME_PUAN,
          IST_DEGERLENDIRME_ACIKLAMA: item.IST_DEGERLENDIRME_ACIKLAMA,
          IST_DEPARTMAN_ID: item.IST_DEPARTMAN_ID,
          IST_ILGILI_ATOLYE_ID: item.IST_ILGILI_ATOLYE_ID,
          IST_TALEP_EDEN_ADI: item.IST_TALEP_EDEN_ADI,
          IST_TAKIP_EDEN_ADI: item.IST_TAKIP_EDEN_ADI,
          IST_ATOLYE_GRUBU_TANIMI: item.IST_ATOLYE_GRUBU_TANIMI,
          IST_TIP_TANIM: item.IST_TIP_TANIM,
          IST_KATEGORI_TANIMI: item.IST_KATEGORI_TANIMI,
          IST_SERVIS_NEDENI: item.IST_SERVIS_NEDENI,
          IST_IRTIBAT: item.IST_IRTIBAT,
          IST_ONCELIK: item.IST_ONCELIK,
          IST_ONCELIK_IKON_INDEX: item.IST_ONCELIK_IKON_INDEX,
          IST_BILDIREN_LOKASYON: item.IST_BILDIREN_LOKASYON,
          IST_NOT_ICON: item.IST_NOT_ICON,
          IST_TEKNISYEN_ID: item.IST_TEKNISYEN_ID,
          IST_TEKNISYEN_TANIM: item.IST_TEKNISYEN_TANIM,
          IST_ISEMRI_NO: item.IST_ISEMRI_NO,
          IST_BELGE: item.IST_BELGE,
          IST_RESIM: item.IST_RESIM,
          IST_BIRLESIM: item.IST_BIRLESIM,
          IST_MAKINE_KOD: item.IST_MAKINE_KOD,
          IST_MAKINE_TANIM: item.IST_MAKINE_TANIM,
          IST_MAKINE_PLAKA: item.IST_MAKINE_PLAKA,
          IST_EKIPMAN_KOD: item.IST_EKIPMAN_KOD,
          IST_EKIPMAN_TANIM: item.IST_EKIPMAN_TANIM,
          IST_KAT: item.IST_KAT,
          IST_BINA: item.IST_BINA,
          IST_DURUM_ADI: item.IST_DURUM_ADI,
          IST_DURUM_ADI2: item.IST_DURUM_ADI2,
          IST_KULLANICI_DEPARTMAN_ID: item.IST_KULLANICI_DEPARTMAN_ID,
          IST_MAKINE_DURUM: item.IST_MAKINE_DURUM,
          IST_ARIZA_TANIM_KOD: item.IST_ARIZA_TANIM_KOD,
          ISEMRI_TIPI: item.ISEMRI_TIPI,
          IST_BILDIREN_LOKASYON_TUM: item.IST_BILDIREN_LOKASYON_TUM,
          ISLEM_SURE: item.ISLEM_SURE,
          ResimVarsayilanID: item.ResimVarsayilanID,
          ResimIDleri: item.ResimIDleri,
          IST_TALEPEDEN_LOKASYON_ID: item.IST_TALEPEDEN_LOKASYON_ID,
          USER_ID: item.USER_ID,
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
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
    setCurrentPage(1); // Filtreleme yapıldığında sayfa numarasını 1'e ayarla
  }, []);
  // filtreleme işlemi için kullanılan useEffect son

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
          style={{ width: "100%", display: "flex", gap: "10px", flexDirection: "column", height: "400px" }}
          value={visibleColumnKeys}
          onChange={handleVisibilityChange}>
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
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              // width: "32px",
              height: "32px",
            }}
            onClick={toggleModal}>
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
        <Table
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

      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />

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
