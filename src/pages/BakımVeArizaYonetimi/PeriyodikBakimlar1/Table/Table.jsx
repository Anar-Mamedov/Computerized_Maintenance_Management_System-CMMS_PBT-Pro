import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import { useDashboardFilterParams } from "../../../../utils/dashboardFilterParams";
import FiltreCekmecesi from "../../../../utils/components/FiltreCekmecesi";
import AktifPasifHepsiSelect from "../../../../utils/components/AktifPasifHepsiSelect";
import PeriyodikBakimExcelButonu from "./PeriyodikBakimExcelButonu";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { t } from "i18next";

const { Text } = Typography;

// antd sıralama yönünün GetPBakimTanimList sortOrder karşılığı.
const SIRALAMA_YONU = { ascend: "ASC", descend: "DESC" };

// Sütunların boyutlarını ayarlamak için kullanılan component

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  // tabloyu genişletmek için kullanılan alanın stil özellikleri
  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%", // this is the area that is draggable, you can adjust it
    zIndex: 2, // ensure it's above other elements
    cursor: "col-resize",
    padding: "0px",
    backgroundSize: "0px",
  };

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={handleStyle}
        />
      }
      onResize={onResize}
      draggableOpts={{
        enableUserSelectHack: false,
      }}
    >
      <th {...restProps} />
    </Resizable>
  );
};
// Sütunların boyutlarını ayarlamak için kullanılan component sonu

// Sütunların sürüklenebilir olmasını sağlayan component

const DraggableRow = ({ id, text, index, moveRow, className, style, visible, onVisibilityChange, ...restProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "#f0f0f0" : "",
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...restProps} {...attributes}>
      {/* <Checkbox
        checked={visible}
        onChange={(e) => onVisibilityChange(index, e.target.checked)}
        style={{ marginLeft: "auto" }}
      /> */}
      <div
        {...listeners}
        style={{
          cursor: "grab",
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <HolderOutlined style={{ marginRight: 8 }} />
        {text}
      </div>
    </div>
  );
};

// Sütunların sürüklenebilir olmasını sağlayan component sonu

const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  // Dashboard widget'indan gelindiyse widget'in filtreleri URL uzerinden tasinir.
  const { filters: dashboardFilters } = useDashboardFilterParams("/periyodikBakimlar");
  // Cekmeceden gelen filtreler; dashboard degerleri bunlara baslangic degeri olarak yerlesir.
  const [ekranFiltreleri, setEkranFiltreleri] = useState({});
  // 1 aktif, 0 pasif, -1 tümü (GetPBakimTanimList isAktif; gönderilmezse backend yalnız aktifleri döndürür).
  const [isAktif, setIsAktif] = useState(1);
  // Sunucu sıralaması: kolonun dataIndex'i ve ASC / DESC; sıralama yoksa boş.
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  // Filtre cekmecesinde secilebilecek alanlar: GetPBakimTanimList'in lokasyonIds / atolyeIds parametreleri
  // (tarih araligi cekmecede sabittir).
  const filtreAlanlari = useMemo(
    () => [
      { value: "lokasyonlar", label: t("lokasyon"), tip: "lokasyon" },
      { value: "atolyeler", label: t("atolye"), tip: "atolye" },
    ],
    []
  );

  // Dashboard'dan gelenler cekmecenin baslangic degerleri olur.
  const cekmeceBaslangici = useMemo(
    () => ({
      lokasyonlar: dashboardFilters.lokasyonlar,
      atolyeler: dashboardFilters.atolyeler,
    }),
    [dashboardFilters]
  );
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  // Dashboard filtresiyle gelindiginde sayfalama server-side calisir.
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // GetPBakimTanimList ve Excel ucunun ortak sorgu parametreleri (sayfalama hariç). Çoklu ID'ler virgülle ayrılır,
  // boş filtreler gönderilmez.
  const sorguParametreleri = useMemo(() => {
    const virgullu = (ids) => (Array.isArray(ids) ? ids.join(",") : "");
    const parametreler = new URLSearchParams({ parametre: debouncedSearchTerm, isAktif: String(isAktif) });
    const ekle = (ad, deger) => {
      if (deger) parametreler.append(ad, deger);
    };

    ekle("lokasyonIds", virgullu(ekranFiltreleri.lokasyonlar));
    ekle("atolyeIds", virgullu(ekranFiltreleri.atolyeler));
    ekle("sortField", sortField);
    ekle("sortOrder", sortOrder);
    return parametreler.toString();
  }, [ekranFiltreleri, debouncedSearchTerm, isAktif, sortField, sortOrder]);
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const [selectedRows, setSelectedRows] = useState([]);

  function hexToRGBA(hex, opacity) {
    // hex veya opacity null ise hata döndür
    if (hex === null || opacity === null) {
      // console.error("hex veya opacity null olamaz!");
      return; // veya uygun bir varsayılan değer döndürebilirsiniz
    }

    let r = 0,
      g = 0,
      b = 0;
    // 3 karakterli hex kodunu kontrol et
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 karakterli hex kodunu kontrol et
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Özel Alanların nameleri backend çekmek için api isteği

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        localStorage.setItem("ozelAlanlarPeryodikBakimlar", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlarPeryodikBakimlar = JSON.parse(localStorage.getItem("ozelAlanlarPeryodikBakimlar"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "Aktif",
      dataIndex: "PBK_AKTIF",
      key: "PBK_AKTIF",
      width: 100,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      align: "center",
      render: (text) => <div style={{ textAlign: "center" }}>{text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}</div>,
      sorter: true,
    },
    {
      title: "Periyodik Bakım Kodu",
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
      visible: true,
      render: (text) => <a>{text}</a>,
      sorter: true,
    },
    {
      title: "Makine Sayısı",
      dataIndex: "MAKINE_SAYI",
      key: "MAKINE_SAYI",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: true,
    },
    {
      title: "Periyodik Bakım Tanımı",
      dataIndex: "PBK_TANIM",
      key: "PBK_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },

    {
      title: "Periyodik Bakım Tipi",
      dataIndex: "PBK_TIP",
      key: "PBK_TIP",
      width: 250,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Periyodik Bakım Grup",
      dataIndex: "PBK_GRUP",
      key: "PBK_GRUP",
      width: 200,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Atölye",
      dataIndex: "PBK_ATOLYE",
      key: "PBK_ATOLYE",
      width: 200,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "PBK_LOKASYON",
      key: "PBK_LOKASYON",
      width: 200,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
      sorter: true,
    },
    {
      title: "Öncelik",
      dataIndex: "PBK_ONCELIK",
      key: "PBK_ONCELIK",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Talimat",
      dataIndex: "PBK_TALIMAT",
      key: "PBK_TALIMAT",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "PBK_CALISMA_SURE",
      key: "PBK_CALISMA_SURE",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: true,
    },
    {
      title: "Duruş Süresi (dk.)",
      dataIndex: "PBK_DURUS_SURE",
      key: "PBK_DURUS_SURE",
      width: 170,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: true,
    },
    {
      title: "Personel Sayısı (kişi)",
      dataIndex: "PBK_PERSONEL_SAYI",
      key: "PBK_PERSONEL_SAYI",
      width: 170,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: true,
    },
    {
      title: "Özel Alan 1",
      dataIndex: "PBK_OZEL_ALAN_1",
      key: "PBK_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 2",
      dataIndex: "PBK_OZEL_ALAN_2",
      key: "PBK_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 3",
      dataIndex: "PBK_OZEL_ALAN_3",
      key: "PBK_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 4",
      dataIndex: "PBK_OZEL_ALAN_4",
      key: "PBK_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 5",
      dataIndex: "PBK_OZEL_ALAN_5",
      key: "PBK_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 6",
      dataIndex: "PBK_OZEL_ALAN_6",
      key: "PBK_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 7",
      dataIndex: "PBK_OZEL_ALAN_7",
      key: "PBK_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 8",
      dataIndex: "PBK_OZEL_ALAN_8",
      key: "PBK_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 9",
      dataIndex: "PBK_OZEL_ALAN_9",
      key: "PBK_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    {
      title: "Özel Alan 10",
      dataIndex: "PBK_OZEL_ALAN_10",
      key: "PBK_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: true,
    },
    // Diğer kolonlarınız...
  ];

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
        // throw new Error("Invalid time format"); // hata fırlatır ve uygulamanın çalışmasını durdurur
        console.error("Invalid time format:", time);
        // return time; // Hatalı formatı olduğu gibi döndür
        return ""; // Hata durumunda boş bir string döndür
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
      // return time; // Hatalı formatı olduğu gibi döndür
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(currentPage, pageSize);
  }, [sorguParametreleri, currentPage, pageSize, refreshKey]);

  // Filtre, aktiflik, arama veya sıralama değişince daralan sonuç kümesinde eski sayfada kalınmasın.
  useEffect(() => {
    setCurrentPage(1);
  }, [sorguParametreleri]);

  // ana tablo api isteği için kullanılan useEffect son

  // GetPBakimTanimList'in liste ve toplam alanlari backend surumune gore degisebildigi icin
  // bilinen alan adlari sirayla denenir.
  const extractPBakimList = (response) => {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== "object") return [];

    const knownListKeys = ["p_bakim_listesi", "list", "periyodik_bakim_listesi", "pbakim_listesi", "periyodikBakimList", "Data"];
    const matchedKey = knownListKeys.find((key) => Array.isArray(response[key]));

    return matchedKey ? response[matchedKey] : [];
  };

  const extractTotalCount = (response, fallback) => {
    if (!response || typeof response !== "object" || Array.isArray(response)) return fallback;

    const knownCountKeys = ["kayit_sayisi", "TotalCount", "toplam_kayit", "totalCount"];
    const matchedKey = knownCountKeys.find((key) => Number.isFinite(Number(response[key])));

    return matchedKey ? Number(response[matchedKey]) : fallback;
  };

  // Arka arkaya atilan istekler farkli surede donebildigi icin yalnizca en son istegin yaniti ekrana islenir.
  const istekSirasiRef = useRef(0);

  const fetchEquipmentData = async (page = currentPage, size = pageSize) => {
    istekSirasiRef.current += 1;
    const istekSirasi = istekSirasiRef.current;
    const guncelMi = () => istekSirasi === istekSirasiRef.current;

    try {
      setLoading(true);

      // Liste her zaman tanim ucundan gelir; filtre, aktiflik, arama, siralama ve sayfalama sunucuda uygulanir.
      const rawResponse = await AxiosInstance.get(`GetPBakimTanimList?pagingDeger=${page}&pageSize=${size}&${sorguParametreleri}`);
      if (!guncelMi()) return;
      const list = extractPBakimList(rawResponse);

      setData(list.map((item) => ({ ...item, key: item.TB_PERIYODIK_BAKIM_ID })));
      setTotalDataCount(extractTotalCount(rawResponse, list.length));
      setLoading(false);
    } catch (error) {
      if (!guncelMi()) return;

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

  // Arama API'ye gidiyor; terimi debounce edip ilk sayfaya doneriz.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

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

  // Sıralama sunucuda yapılır; sayfalama da sunucuda olduğu için istemci sıralaması yalnız açık sayfayı sıralardı.
  const handleTableChange = (_pagination, _filters, sorter, extra) => {
    if (extra?.action !== "sort") return;
    const yon = SIRALAMA_YONU[sorter?.order] || "";
    setSortField(yon ? sorter.field : "");
    setSortOrder(yon);
  };

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

    // Verileri yeniden çekmek için ana veri effect'ini tetikle.
    // Dogrudan fetchEquipmentData() cagirmak, bu useCallback'in bos bagimlilik listesi yuzunden
    // eski sayfa/arama degerlerini kullanirdi.
    setRefreshKey((previous) => previous + 1);
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, []); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderPeryodikBakimlar");
    const savedVisibility = localStorage.getItem("columnVisibilityPeryodikBakimlar");
    const savedWidths = localStorage.getItem("columnWidthsPeryodikBakimlar");

    let order = savedOrder ? JSON.parse(savedOrder) : [];
    let visibility = savedVisibility ? JSON.parse(savedVisibility) : {};
    let widths = savedWidths ? JSON.parse(savedWidths) : {};

    initialColumns.forEach((col) => {
      if (!order.includes(col.key)) {
        order.push(col.key);
      }
      if (visibility[col.key] === undefined) {
        visibility[col.key] = col.visible;
      }
      if (widths[col.key] === undefined) {
        widths[col.key] = col.width;
      }
    });

    localStorage.setItem("columnOrderPeryodikBakimlar", JSON.stringify(order));
    localStorage.setItem("columnVisibilityPeryodikBakimlar", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsPeryodikBakimlar", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderPeryodikBakimlar", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem("columnVisibilityPeryodikBakimlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem("columnWidthsPeryodikBakimlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
  }, [columns]);
  // sütunları local storage'a kaydediyoruz sonu

  // sütunların boyutlarını ayarlamak için kullanılan fonksiyon
  const handleResize =
    (key) =>
    (_, { size }) => {
      setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, width: size.width } : col)));
    };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize(column.key),
    }),
  }));

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz

  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // fitrelenmiş sütunları birleştiriyoruz ve sadece görünür olanları alıyoruz ve tabloya gönderiyoruz sonu

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.key === active.id);
      const newIndex = columns.findIndex((column) => column.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
      } else {
        console.error(`Column with key ${active.id} or ${over.id} does not exist.`);
      }
    }
  };

  // sütunların sıralamasını değiştirmek için kullanılan fonksiyon sonu

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon

  const toggleVisibility = (key, checked) => {
    const index = columns.findIndex((col) => col.key === key);
    if (index !== -1) {
      const newColumns = [...columns];
      newColumns[index].visible = checked;
      setColumns(newColumns);
    } else {
      console.error(`Column with key ${key} does not exist.`);
    }
  };

  // sütunların görünürlüğünü değiştirmek için kullanılan fonksiyon sonu

  // sütunları sıfırlamak için kullanılan fonksiyon

  function resetColumns() {
    localStorage.removeItem("columnOrderPeryodikBakimlar");
    localStorage.removeItem("columnVisibilityPeryodikBakimlar");
    localStorage.removeItem("columnWidthsPeryodikBakimlar");
    localStorage.removeItem("ozelAlanlarPeryodikBakimlar");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  return (
    <>
      <Modal title="Sütunları Yönet" centered width={800} open={isModalVisible} onOk={() => setIsModalVisible(false)} onCancel={() => setIsModalVisible(false)}>
        <Text style={{ marginBottom: "15px" }}>Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını Ayarlayabilirsiniz.</Text>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              width: "46%",
              border: "1px solid #8080806e",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #80808051",
                padding: "8px 8px 12px 8px",
              }}
            >
              <Text style={{ fontWeight: 600 }}>Sütunları Göster / Gizle</Text>
            </div>
            <div style={{ height: "400px", overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div style={{ display: "flex", gap: "10px" }} key={col.key}>
                  <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  {col.title}
                </div>
              ))}
            </div>
          </div>

          <DndContext
            onDragEnd={handleDragEnd}
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
          >
            <div
              style={{
                width: "46%",
                border: "1px solid #8080806e",
                borderRadius: "8px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  marginBottom: "20px",
                  borderBottom: "1px solid #80808051",
                  padding: "8px 8px 12px 8px",
                }}
              >
                <Text style={{ fontWeight: 600 }}>Sütunların Sıralamasını Ayarla</Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext items={columns.filter((col) => col.visible).map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <DraggableRow key={col.key} id={col.key} index={index} text={col.title} />
                    ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
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
            onClick={() => setIsModalVisible(true)}
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
          {/* Filtre çekmecesi her ekranda arama kutusunun yanında, solda hizalı durur. */}
          <FiltreCekmecesi alanlar={filtreAlanlari} tarihAraligiGoster={false} baslangicFiltreleri={cekmeceBaslangici} onSubmit={setEkranFiltreleri} />
          <AktifPasifHepsiSelect value={isAktif} onChange={setIsAktif} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <PeriyodikBakimExcelButonu sorguParametreleri={sorguParametreleri} kolonlar={filteredColumns} />
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={filteredColumns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize,
            total: totalDataCount,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            showTotal: (total) => `Toplam ${total}`,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          onRow={onRowClick}
          onChange={handleTableChange}
          scroll={{ y: "calc(100vh - 370px)" }}
        />
      </Spin>
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
    </>
  );
};

export default MainTable;
