import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import TeknisyenSubmit from "../components/IsEmrineCevir/Teknisyen/TeknisyenSubmit";
import AtolyeSubmit from "../components/IsEmrineCevir/Atolye/AtolyeSubmit";

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

  const [selectedRows, setSelectedRows] = useState([]);

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: "İş Emri No",
      dataIndex: "ISEMRI_NO",
      key: "ISEMRI_NO",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Tarih",
      dataIndex: "DUZENLEME_TARIH",
      key: "DUZENLEME_TARIH",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Saat",
      dataIndex: "DUZENLEME_SAAT",
      key: "DUZENLEME_SAAT",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Konu",
      dataIndex: "KONU",
      key: "KONU",
      width: "250px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "İş Emri Tipi",
      dataIndex: "ISEMRI_TIP",
      key: "ISEMRI_TIP",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Durum",
      dataIndex: "DURUM",
      key: "DURUM",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      key: "LOKASYON",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Makine Kodu",
      dataIndex: "MAKINE_KODU",
      key: "MAKINE_KODU",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MAKINE_TANIMI",
      key: "MAKINE_TANIMI",
      width: "250px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Planlanan Başlama Tarihi",
      dataIndex: "PLAN_BASLAMA_TARIH",
      key: "PLAN_BASLAMA_TARIH",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Planlanan Başlama Saati",
      dataIndex: "PLAN_BASLAMA_SAAT",
      key: "PLAN_BASLAMA_SAAT",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Planlanan Bitiş Tarihi",
      dataIndex: "PLAN_BITIS_TARIH",
      key: "PLAN_BITIS_TARIH",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Bitiş Saati",
      dataIndex: "PLAN_BITIS_SAAT",
      key: "PLAN_BITIS_SAAT",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "BASLAMA_TARIH",
      key: "BASLAMA_TARIH",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Başlama Saati",
      dataIndex: "BASLAMA_SAAT",
      key: "BASLAMA_SAAT",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "ISM_BITIS_TARIH",
      key: "ISM_BITIS_TARIH",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Bitiş Saati",
      dataIndex: "ISM_BITIS_SAAT",
      key: "ISM_BITIS_SAAT",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IS_SURESI",
      key: "IS_SURESI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => (text > 0 ? text : null),
    },
    {
      title: "Tamamlama (%)",
      dataIndex: "TAMAMLANMA",
      key: "TAMAMLANMA",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => `${text}%`,
    },
    {
      title: "Garanti",
      dataIndex: "GARANTI",
      key: "GARANTI",
      width: "100px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text, record) => {
        return record.GARANTI ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "Makine Durumu",
      dataIndex: "MAKINE_DURUM",
      key: "MAKINE_DURUM",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Plaka",
      dataIndex: "MAKINE_PLAKA",
      key: "MAKINE_PLAKA",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Makine Tipi",
      dataIndex: "MAKINE_TIP",
      key: "MAKINE_TIP",
      width: "250px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Ekipman",
      dataIndex: "EKIPMAN",
      key: "EKIPMAN",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Tipi",
      dataIndex: "IS_TIPI",
      key: "IS_TIPI",
      width: "250px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Nedeni",
      dataIndex: "IS_NEDENI",
      key: "IS_NEDENI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Atölye",
      dataIndex: "ATOLYE",
      key: "ATOLYE",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Talimat",
      dataIndex: "TALIMAT",
      key: "TALIMAT",
      width: "250px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Öncelik",
      dataIndex: "ONCELIK",
      key: "ONCELIK",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Kapanış Tarihi",
      dataIndex: "KAPANIS_TARIHI",
      key: "KAPANIS_TARIHI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Kapanış Saati",
      dataIndex: "KAPANIS_SAATI",
      key: "KAPANIS_SAATI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Takvim",
      dataIndex: "TAKVIM",
      key: "TAKVIM",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "MASRAF_MERKEZI",
      key: "MASRAF_MERKEZI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Firma",
      dataIndex: "FRIMA",
      key: "FRIMA",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Kodu",
      dataIndex: "IS_TALEP_NO",
      key: "IS_TALEP_NO",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Eden",
      dataIndex: "IS_TALEP_EDEN",
      key: "IS_TALEP_EDEN",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Tarihi",
      dataIndex: "IS_TALEP_TARIH",
      key: "IS_TALEP_TARIH",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Özel Alan 1",
      dataIndex: "OZEL_ALAN_1",
      key: "OZEL_ALAN_1",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 2",
      dataIndex: "OZEL_ALAN_2",
      key: "OZEL_ALAN_2",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 3",
      dataIndex: "OZEL_ALAN_3",
      key: "OZEL_ALAN_3",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 4",
      dataIndex: "OZEL_ALAN_4",
      key: "OZEL_ALAN_4",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 5",
      dataIndex: "OZEL_ALAN_5",
      key: "OZEL_ALAN_5",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 6",
      dataIndex: "OZEL_ALAN_6",
      key: "OZEL_ALAN_6",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 7",
      dataIndex: "OZEL_ALAN_7",
      key: "OZEL_ALAN_7",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 8",
      dataIndex: "OZEL_ALAN_8",
      key: "OZEL_ALAN_8",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 9",
      dataIndex: "OZEL_ALAN_9",
      key: "OZEL_ALAN_9",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 10",
      dataIndex: "OZEL_ALAN_10",
      key: "OZEL_ALAN_10",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 11",
      dataIndex: "OZEL_ALAN_11",
      key: "OZEL_ALAN_11",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 12",
      dataIndex: "OZEL_ALAN_12",
      key: "OZEL_ALAN_12",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 13",
      dataIndex: "OZEL_ALAN_13",
      key: "OZEL_ALAN_13",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 14",
      dataIndex: "OZEL_ALAN_14",
      key: "OZEL_ALAN_14",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 15",
      dataIndex: "OZEL_ALAN_15",
      key: "OZEL_ALAN_15",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 16",
      dataIndex: "OZEL_ALAN_16",
      key: "OZEL_ALAN_16",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 17",
      dataIndex: "OZEL_ALAN_17",
      key: "OZEL_ALAN_17",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 18",
      dataIndex: "OZEL_ALAN_18",
      key: "OZEL_ALAN_18",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 19",
      dataIndex: "OZEL_ALAN_19",
      key: "OZEL_ALAN_19",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Özel Alan 20",
      dataIndex: "OZEL_ALAN_20",
      key: "OZEL_ALAN_20",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Personel Adı",
      dataIndex: "PERSONEL_ADI",
      key: "PERSONEL_ADI",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Tam Lokasyon",
      dataIndex: "TAM_LOKASYON",
      key: "TAM_LOKASYON",
      width: "250px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Kat",
      dataIndex: "BILDIRILEN_KAT",
      key: "BILDIRILEN_KAT",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Bina",
      dataIndex: "BILDIRILEN_BINA",
      key: "BILDIRILEN_BINA",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Sayaç Değeri",
      dataIndex: "GUNCEL_SAYAC_DEGER",
      key: "GUNCEL_SAYAC_DEGER",
      width: "150px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Notlar",
      dataIndex: "ICERDEKI_NOT",
      key: "ICERDEKI_NOT",
      width: "250px",
      ellipsis: true,
      visible: false, // Varsayılan olarak kapalı
    },
    // Diğer kolonlarınız...
  ];

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    // 'visibleColumns' isimli anahtarla kaydedilmiş değeri oku
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumnsIsEmri"));

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
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
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
    fetchEquipmentData(body, currentPage);
  }, [body, currentPage]);

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

  const fetchEquipmentData = async (body, page) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(
        `getIsEmriFullList?id=11&parametre=${keyword}&pagingDeger=${currentPage}`,
        filters
      );
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.list.map((item) => ({
          ...item,
          key: item.TB_ISEMRI_ID,
          KAPALI: item.KAPALI,
          ONCELIK: item.ONCELIK,
          BELGE: item.BELGE,
          RESIM: item.RESIM,
          ISEMRI_NO: item.ISEMRI_NO,
          MALZEME: item.MALZEME,
          PERSONEL: item.PERSONEL,
          DURUS: item.DURUS,
          OUTER_NOT: item.OUTER_NOT,
          DUZENLEME_TARIH: item.DUZENLEME_TARIH,
          DUZENLEME_SAAT: item.DUZENLEME_SAAT,
          KONU: item.KONU,
          ISEMRI_TIP: item.ISEMRI_TIP,
          DURUM: item.DURUM,
          LOKASYON: item.LOKASYON,
          PLAN_BASLAMA_TARIH: item.PLAN_BASLAMA_TARIH,
          PLAN_BASLAMA_SAAT: item.PLAN_BASLAMA_SAAT,
          PLAN_BITIS_TARIH: item.PLAN_BITIS_TARIH,
          PLAN_BITIS_SAAT: item.PLAN_BITIS_SAAT,
          BASLAMA_TARIH: item.BASLAMA_TARIH,
          BASLAMA_SAAT: item.BASLAMA_SAAT,
          ISM_BITIS_TARIH: item.ISM_BITIS_TARIH,
          ISM_BITIS_SAAT: item.ISM_BITIS_SAAT,
          IS_SURESI: item.IS_SURESI,
          TAMAMLANMA: item.TAMAMLANMA,
          GARANTI: item.GARANTI,
          MAKINE_KODU: item.MAKINE_KODU,
          MAKINE_TANIMI: item.MAKINE_TANIMI,
          MAKINE_PLAKA: item.MAKINE_PLAKA,
          MAKINE_DURUM: item.MAKINE_DURUM,
          MAKINE_TIP: item.MAKINE_TIP,
          EKIPMAN: item.EKIPMAN,
          IS_TIPI: item.IS_TIPI,
          IS_NEDENI: item.IS_NEDENI,
          ATOLYE: item.ATOLYE,
          TALIMAT: item.TALIMAT,
          KAPANIS_TARIHI: item.KAPANIS_TARIHI,
          KAPANIS_SAATI: item.KAPANIS_SAATI,
          TAKVIM: item.TAKVIM,
          MASRAF_MERKEZI: item.MASRAF_MERKEZI,
          FRIMA: item.FRIMA,
          IS_TALEP_NO: item.IS_TALEP_NO,
          IS_TALEP_EDEN: item.IS_TALEP_EDEN,
          IS_TALEP_TARIH: item.IS_TALEP_TARIH,
          ISM_MALIYET_MLZ: item.ISM_MALIYET_MLZ,
          ISM_MALIYET_PERSONEL: item.ISM_MALIYET_PERSONEL,
          ISM_MALIYET_DISSERVIS: item.ISM_MALIYET_DISSERVIS,
          ISM_MALIYET_DIGER: item.ISM_MALIYET_DIGER,
          ISM_MALIYET_INDIRIM: item.ISM_MALIYET_INDIRIM,
          ISM_MALIYET_KDV: item.ISM_MALIYET_KDV,
          ISM_MALIYET_TOPLAM: item.ISM_MALIYET_TOPLAM,
          ISM_SURE_MUDAHALE_LOJISTIK: item.ISM_SURE_MUDAHALE_LOJISTIK,
          ISM_SURE_MUDAHALE_SEYAHAT: item.ISM_SURE_MUDAHALE_SEYAHAT,
          ISM_SURE_MUDAHALE_ONAY: item.ISM_SURE_MUDAHALE_ONAY,
          ISM_SURE_BEKLEME: item.ISM_SURE_BEKLEME,
          ISM_SURE_MUDAHALE_DIGER: item.ISM_SURE_MUDAHALE_DIGER,
          ISM_SURE_PLAN_MUDAHALE: item.ISM_SURE_PLAN_MUDAHALE,
          ISM_SURE_PLAN_CALISMA: item.ISM_SURE_PLAN_CALISMA,
          ISM_SURE_TOPLAM: item.ISM_SURE_TOPLAM,
          ISM_TIP_ID: item.ISM_TIP_ID,
          ISM_DURUM_KOD_ID: item.ISM_DURUM_KOD_ID,
          ISM_BAGLI_ISEMRI_ID: item.ISM_BAGLI_ISEMRI_ID,
          ISM_LOKASYON_ID: item.ISM_LOKASYON_ID,
          ISM_MAKINE_ID: item.ISM_MAKINE_ID,
          ISM_EKIPMAN_ID: item.ISM_EKIPMAN_ID,
          ISM_MAKINE_DURUM_KOD_ID: item.ISM_MAKINE_DURUM_KOD_ID,
          ISM_REF_ID: item.ISM_REF_ID,
          ISM_TIP_KOD_ID: item.ISM_TIP_KOD_ID,
          ISM_NEDEN_KOD_ID: item.ISM_NEDEN_KOD_ID,
          ISM_ONCELIK_ID: item.ISM_ONCELIK_ID,
          ISM_ATOLYE_ID: item.ISM_ATOLYE_ID,
          ISM_TAKVIM_ID: item.ISM_TAKVIM_ID,
          ISM_TALIMAT_ID: item.ISM_TALIMAT_ID,
          ISM_MASRAF_MERKEZ_ID: item.ISM_MASRAF_MERKEZ_ID,
          ISM_PROJE_ID: item.ISM_PROJE_ID,
          ISM_FIRMA_ID: item.ISM_FIRMA_ID,
          ISM_FIRMA_SOZLESME_ID: item.ISM_FIRMA_SOZLESME_ID,
          ISM_OZEL_ALAN_11_KOD_ID: item.ISM_OZEL_ALAN_11_KOD_ID,
          ISM_OZEL_ALAN_12_KOD_ID: item.ISM_OZEL_ALAN_12_KOD_ID,
          ISM_OZEL_ALAN_13_KOD_ID: item.ISM_OZEL_ALAN_13_KOD_ID,
          ISM_OZEL_ALAN_14_KOD_ID: item.ISM_OZEL_ALAN_14_KOD_ID,
          ISM_OZEL_ALAN_15_KOD_ID: item.ISM_OZEL_ALAN_15_KOD_ID,
          ISM_SOZLESME_TANIM: item.ISM_SOZLESME_TANIM,
          ISM_PROJE_KOD: item.ISM_PROJE_KOD,
          ISM_ATOLYE_KOD: item.ISM_ATOLYE_KOD,
          ISM_PROSEDUR_KOD: item.ISM_PROSEDUR_KOD,
          ISM_GARANTI_BITIS: item.ISM_GARANTI_BITIS,
          ISM_BAGLI_ISEMRI_NO: item.ISM_BAGLI_ISEMRI_NO,
          ISM_EVRAK_NO: item.ISM_EVRAK_NO,
          ISM_EVRAK_TARIHI: item.ISM_EVRAK_TARIHI,
          ISM_REFERANS_NO: item.ISM_REFERANS_NO,
          OZEL_ALAN_1: item.OZEL_ALAN_1,
          OZEL_ALAN_2: item.OZEL_ALAN_2,
          OZEL_ALAN_3: item.OZEL_ALAN_3,
          OZEL_ALAN_4: item.OZEL_ALAN_4,
          OZEL_ALAN_5: item.OZEL_ALAN_5,
          OZEL_ALAN_6: item.OZEL_ALAN_6,
          OZEL_ALAN_7: item.OZEL_ALAN_7,
          OZEL_ALAN_8: item.OZEL_ALAN_8,
          OZEL_ALAN_9: item.OZEL_ALAN_9,
          OZEL_ALAN_10: item.OZEL_ALAN_10,
          OZEL_ALAN_11: item.OZEL_ALAN_11,
          OZEL_ALAN_12: item.OZEL_ALAN_12,
          OZEL_ALAN_13: item.OZEL_ALAN_13,
          OZEL_ALAN_14: item.OZEL_ALAN_14,
          OZEL_ALAN_15: item.OZEL_ALAN_15,
          OZEL_ALAN_16: item.OZEL_ALAN_16,
          OZEL_ALAN_17: item.OZEL_ALAN_17,
          OZEL_ALAN_18: item.OZEL_ALAN_18,
          OZEL_ALAN_19: item.OZEL_ALAN_19,
          OZEL_ALAN_20: item.OZEL_ALAN_20,
          BILDIRILEN_KAT: item.BILDIRILEN_KAT,
          BILDIRILEN_BINA: item.BILDIRILEN_BINA,
          PERSONEL_ADI: item.PERSONEL_ADI,
          TAM_LOKASYON: item.TAM_LOKASYON,
          GUNCEL_SAYAC_DEGER: item.GUNCEL_SAYAC_DEGER,
          ICERDEKI_NOT: item.ICERDEKI_NOT,
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
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
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
    localStorage.setItem("visibleColumnsIsEmri", JSON.stringify(checkedValues));
  };

  // Kolonları gösterip gizleme Modalını göster/gizle
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

      <Modal width={900} title="Kolonları Düzenle" open={isModalVisible} onOk={toggleModal} onCancel={toggleModal}>
        <Checkbox.Group
          style={{ width: "100%", display: "flex", gap: "10px", flexDirection: "column", height: "500px" }}
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
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Filters onChange={handleBodyChange} />
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
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
            total: totalPages * 50, // Toplam kayıt sayısı (sayfa başına kayıt sayısı ile çarpılır)
            pageSize: 50,
            showSizeChanger: false,
            onChange: handleTableChange,
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
    </div>
  );
}
