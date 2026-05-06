import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Progress, message, Card, Row, Col, Space, Popconfirm, Tag, Popover, Drawer } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer1 from "../../../YardimMasasi/IsTalepleri/Update/EditDrawer";
import { useFormContext } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { t } from "i18next";
import dayjs from "dayjs";

const { Text } = Typography;

// Function to extract text from React elements
import { isValidElement } from "react";

function extractTextFromElement(element) {
  let text = "";
  if (typeof element === "string") {
    text = element;
  } else if (Array.isArray(element)) {
    text = element.map((child) => extractTextFromElement(child)).join("");
  } else if (isValidElement(element)) {
    text = extractTextFromElement(element.props.children);
  } else if (element !== null && element !== undefined) {
    text = element.toString();
  }
  return text;
}

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

const MainTable = () => {
  // State definitions...
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [label, setLabel] = useState("Yükleniyor...");
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);
  const [onayCheck, setOnayCheck] = useState({ ONY_AKTIF: 0, ONY_MANUEL: 0 });
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [siparisDrawer, setSiparisDrawer] = useState({ visible: false, data: null });
  const [selectedRows, setSelectedRows] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [cardsData, setCardsData] = useState({});
  const [body, setBody] = useState({
    ToplamIzinKaydi: 0,
    BelgeliKayit: 0,
  });

  const cardItems = useMemo(() => [
    { title: "Toplam İzin Kaydı", value: body.ToplamIzinKaydi },
    { title: "Belgeli Kayıt", value: body.BelgeliKayit },
  ], [body]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`GetOnayCheck?TB_ONAY_ID=3`); // API URL'niz
        if (response[0].ONY_AKTIF === 1) {
          setOnayCheck(true);
        } else {
          setOnayCheck(false);
        }
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
      }
    };

    fetchData();
  }, []);

  // Özel Alanların nameleri backend çekmek için api isteği

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=TALEP FİŞİ"); // API URL'niz
        localStorage.setItem("ozelAlanlar", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlar = JSON.parse(localStorage.getItem("ozelAlanlar"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu

  const statusTag = (statusId) => {
    switch (statusId) {
      case 1:
        return { color: "#ff5e00", text: "Onay Bekliyor" };
      case 2:
        return { color: "#00d300", text: "Onaylandı" };
      case 3:
        return { color: "#d10000", text: "Onaylanmadı" };
      default:
        return { color: "", text: "" }; // Diğer durumlar için boş değer
    }
  };

  const TeklifPopoverContent = ({ fisId, fisNo, onOpenDrawer, onClosePopover }) => {
    const [loading, setLoading] = useState(true);
    const [teklifPaketleri, setTeklifPaketleri] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      if (!fisId) return;
      try {
        setLoading(true);
        const res = await AxiosInstance.get(`ListTeklifPaketleriByTalep?talepId=${fisId}`);
        
        if (active) {
          if (res?.items) {
            setTeklifPaketleri(res.items);
          } else if (Array.isArray(res)) {
             setTeklifPaketleri(res);
          } else {
            setTeklifPaketleri([]);
          }
        }
      } catch (err) {
        console.error("Hata:", err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [fisId]);

  const DURUM_STYLES = {
    1: { text: "TEKLİFLER TOPLANIYOR", backgroundColor: "#e1f7d5", color: "#3c763d" },
    2: { text: "ONAYA GÖNDERİLDİ", backgroundColor: "#fff4d6", color: "#b8860b" },
    3: { text: "ONAYLANDI", backgroundColor: "#d4f8e8", color: "#207868" },
    4: { text: "REDDEDİLDİ", backgroundColor: "#fde2e4", color: "#c63b3b" },
    5: { text: "SİPARİŞ", backgroundColor: "#e6f7ff", color: "#096dd9" }
  };

  const handleLinkClick = (teklif) => {
    onOpenDrawer(teklif.teklifId, teklif.durumID, fisId, fisNo);
    if (onClosePopover) onClosePopover();
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", width: "200px", textAlign: "center" }}>
        <Spin size="small" /> Yükleniyor...
      </div>
    );
  }

  if (teklifPaketleri.length === 0) {
    return <div style={{ padding: "10px", color: "#999" }}>Teklif paketi yok.</div>;
  }

  const isMulti = teklifPaketleri.length > 1;
  
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    padding: "10px",
    width: isMulti ? "660px" : "320px",
    overflowX: "auto",
    overflowY: "hidden",
    whiteSpace: "nowrap"
  };

    return (
        <div style={containerStyle}>
        {teklifPaketleri.map((t) => (
            <div 
                key={t.teklifId} 
                style={{ flex: "0 0 300px", width: "300px" }}
            >
            <Card
                size="small"
                title={
                    <span style={{ fontSize: 13, fontWeight: "bold" }}>
                        RFQ —{" "}
                        <a 
                          onClick={() => handleLinkClick(t)}
                          style={{ color: "#1890ff", textDecoration: "underline", cursor: "pointer" }}
                        >
                            {t.baslik}
                        </a>
                    </span>
                }
                style={{ 
                    borderRadius: 8, 
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    height: "100%", 
                    whiteSpace: "normal" 
                }}
                bodyStyle={{ padding: "10px" }}
            >
                <div style={{ marginBottom: 6 }}>
                    <Tag color={DURUM_STYLES[t.durumID]?.color || "default"}>
                        {DURUM_STYLES[t.durumID]?.text || t.durumID}
                    </Tag>
                </div>
                
                <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span><b>Kalem:</b> {t.kalemSayisi} adet</span>
                    <span><b>Tedarikçi:</b> {t.tedarikcSayisi} firma</span>
                    {/* Tedarikçiler uzun olabilir, tek satıra sığdırmak için truncate eklenebilir */}
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <b>Tedarikçiler:</b> {t.tedarikciler}
                    </span>
                    <span style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>
                        {t.olusturmaTarih ? dayjs(t.olusturmaTarih).format("DD.MM.YYYY") : "-"}
                    </span>
                </div>
            </Card>
            </div>
        ))}
      </div>
    );
  };

  const initialColumns = [
    {
      title: "Personel Ad",
      dataIndex: "PersonelAd",
      key: "PersonelAd",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.PersonelAd === null) return -1;
        if (b.PersonelAd === null) return 1;
        return a.PersonelAd.localeCompare(b.PersonelAd);
      },
    },
    {
      title: "Personel Kod",
      dataIndex: "PersonelKod",
      key: "PersonelKod",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.PersonelKod === null) return -1;
        if (b.PersonelKod === null) return 1;
        return a.PersonelKod.localeCompare(b.PersonelKod);
      },
    },
    {
      title: "Başlık",
      dataIndex: "Initials",
      key: "Initials",
      width: 200,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.Initials === null && b.Initials === null) return 0;
        if (a.Initials === null) return 1;
        if (b.Initials === null) return -1;
        return a.Initials.localeCompare(b.Initials);
      },
    },
    {
      title: "Departman",
      dataIndex: "Departman",
      key: "Departman",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.Departman === null) return -1;
        if (b.Departman === null) return 1;
        return a.Departman.localeCompare(b.Departman);
      },
    },
    {
      title: "İzin Türü",
      dataIndex: "IzinTuru",
      key: "IzinTuru",
      width: 300,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.IzinTuru === null) return -1;
        if (b.IzinTuru === null) return 1;
        return a.IzinTuru.localeCompare(b.IzinTuru);
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "İzin Türü",
      dataIndex: "IzinTipClass",
      key: "IzinTipClass",
      width: 150,
      sorter: (a, b) => {
        if (a.IzinTipClass === null && b.IzinTipClass === null) return 0;
        if (a.IzinTipClass === null) return 1;
        if (b.IzinTipClass === null) return -1;
        return a.IzinTipClass.localeCompare(b.IzinTipClass);
      },
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Tarih",
      dataIndex: "TarihAraligi",
      key: "TarihAraligi",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.TarihAraligi === null) return -1;
        if (b.TarihAraligi === null) return 1;
        return a.TarihAraligi.localeCompare(b.TarihAraligi);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Gün",
      dataIndex: "Gun",
      key: "Gun",
      width: 200,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.Gun === null && b.Gun === null) return 0;
        if (a.Gun === null) return 1;
        if (b.Gun === null) return -1;
        return a.Gun.localeCompare(b.Gun);
      },
    },
    {
      title: "Açıklama",
      dataIndex: "Aciklama",
      key: "Aciklama",
      width: 150,
      sorter: (a, b) => {
        if (a.Aciklama === null && b.Aciklama === null) return 0;
        if (a.Aciklama === null) return -1;
        if (b.Aciklama === null) return 1;
        return a.Aciklama.localeCompare(b.Aciklama);
      },
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
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

  // ana tablo api isteği için kullanılan useEffect

  const lastRequestRef = useRef(null);

// ✅ API isteği
useEffect(() => {
  const params = JSON.stringify({ body, currentPage, pageSize });
  if (lastRequestRef.current === params) return;
  lastRequestRef.current = params;

  fetchEquipmentData(body, currentPage, pageSize);
}, [body, currentPage, pageSize]);

  // ana tablo api isteği için kullanılan useEffect son

  // arama işlemi için kullanılan useEffect
  useEffect(() => {
  if (searchTimeout) clearTimeout(searchTimeout);

  const timeout = setTimeout(() => {
    // burada doğru path: body.filters.Kelime
    if (searchTerm !== body.filters.Arama) {
      handleBodyChange("filters", { ...body.filters, Arama: searchTerm });
      setCurrentPage(1);
    }
  }, 2000);

  setSearchTimeout(timeout);
  return () => clearTimeout(timeout);
}, [searchTerm]);

  // arama işlemi için kullanılan useEffect son

 const fetchEquipmentData = useCallback(async () => {
  try {
      setLoading(true);
      const payload = {
        Arama: searchTerm,
        IzinTurId: null, // İhtiyaca göre filtreden beslenebilir
      };

      const res = await AxiosInstance.post("GetPersonelIzinListesi", payload);

      if (res.status_code === 200 && !res.has_error) {
        // Özet verilerini set et
        setBody({
          ToplamIzinKaydi: res.data.ToplamIzinKaydi,
          BelgeliKayit: res.data.BelgeliKayit,
        });

        // Liste verilerini set et
        const list = Array.isArray(res.data.Liste) ? res.data.Liste : [];
        const formattedData = list.map((item) => ({
          ...item,
          key: item.IzinId, // Unique ID olarak IzinId kullanıldı
        }));

        setData(formattedData);
        setTotalDataCount(res.data.Liste.length); // Pagination dokümanda belirtilmemişse liste uzunluğu alınır
      } else {
        message.error("Veriler alınırken bir hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      message.error("Bağlantı hatası!");
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);
  // filtreleme işlemi için kullanılan useEffect
  const handleBodyChange = useCallback((type, newBody) => {
  setBody((state) => ({
    ...state,
    [type]: newBody,
  }));
  setCurrentPage(1);
}, []);
  // filtreleme işlemi için kullanılan useEffect son

  // sayfalama için kullanılan useEffect
  const handleTableChange = (pagination) => {
  if (pagination) {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
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
    console.log("Seçilen Satırlar:", newSelectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const onRowClick = (record) => {
  //   return {
  //     onClick: () => {
  //       setDrawer({ visible: true, data: record });
  //     },
  //   };
  // };

  // Talep No için
  const onRowClick = (record) => {
    setDrawer({ visible: true, data: { ...record, key: record.TB_STOK_FIS_ID } });
  };

  // Sipariş No için
  const onSiparisNoClick = (record) => {
    setSiparisDrawer({ 
      visible: true, 
      data: { ...record, key: record.SFS_REF_ID } // SFS_REF_ID’yi key olarak ekledik
    });
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

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData(body, currentPage);
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage]);

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnPersonelIzinOrder");
    const savedVisibility = localStorage.getItem("columnPersonelIzinVisibility");
    const savedWidths = localStorage.getItem("columnPersonelIzinWidths");

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

    localStorage.setItem("columnPersonelIzinOrder", JSON.stringify(order));
    localStorage.setItem("columnPersonelIzinVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnPersonelIzinWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnPersonelIzinOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnPersonelIzinVisibility",
      JSON.stringify(
        columns.reduce(
          (acc, col) => ({
            ...acc,
            [col.key]: col.visible,
          }),
          {}
        )
      )
    );
    localStorage.setItem(
      "columnPersonelIzinWidths",
      JSON.stringify(
        columns.reduce(
          (acc, col) => ({
            ...acc,
            [col.key]: col.width,
          }),
          {}
        )
      )
    );
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
    localStorage.removeItem("columnOrder");
    localStorage.removeItem("columnVisibility");
    localStorage.removeItem("columnWidths");
    localStorage.removeItem("ozelAlanlar");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  // Function to handle CSV download
  const handleDownloadXLSX = async () => {
    try {
      // İndirme işlemi başlıyor
      setXlsxLoading(true);

      // Body state'inden filtreleri alıyoruz
      const { filters = {} } = body || {};

      // ✅ API İsteği: GetMalzemeTalepleriExcel
      // Filtreleri body olarak gönderiyoruz
      const response = await AxiosInstance.post("GetMalzemeTalepleriExcel", filters);

      // Gelen yanıtı kontrol et (Direkt array mi yoksa obje içinde mi?)
      // Eğer ana tablo yapısına benziyorsa response.talep_listesi olabilir, 
      // direkt liste dönüyorsa response kendisidir.
      const dataToProcess = Array.isArray(response) 
        ? response 
        : (response?.talep_listesi || response?.items || []);

      if (dataToProcess.length > 0) {
        // Verileri işliyoruz
        const xlsxData = dataToProcess.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              // Özel durumları ele alıyoruz (Formatlama işlemleri)
              if (col.render) {
                if (key === "DUZENLEME_TARIH" || key.endsWith("_TARIH") || key === "SFS_TARIH") {
                  value = formatDate(value);
                } else if (key === "DUZENLEME_SAAT" || key.endsWith("_SAAT") || key === "SFS_SAAT") {
                  value = formatTime(value);
                } else if (key === "GARANTI") {
                  value = row.GARANTI ? "Evet" : "Hayır";
                } else if (key === "TAMAMLANMA") {
                  value = `${row.TAMAMLANMA}%`;
                } else if (key === "SFS_DURUM") { // Durum metnini al
                  value = row.SFS_DURUM; 
                } else if (key === "ISM_ONAY_DURUM") {
                  const { text } = statusTag(row.ISM_ONAY_DURUM);
                  value = text;
                } else if (key.startsWith("OZEL_ALAN_")) {
                  value = row[key];
                } else {
                  value = extractTextFromElement(col.render(row[key], row));
                }
              }

              xlsxRow[extractTextFromElement(col.title)] = value;
            }
          });
          return xlsxRow;
        });

        // XLSX dosyasını oluşturuyoruz
        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Talep Listesi");

        // Sütun genişliklerini ayarlıyoruz
        const headers = filteredColumns
          .map((col) => {
            let label = extractTextFromElement(col.title);
            return {
              label: label,
              key: col.dataIndex,
              width: col.width, // Tablo sütun genişliği
            };
          })
          .filter((col) => col.key);

        const scalingFactor = 0.8; 

        worksheet["!cols"] = headers.map((header) => ({
          wpx: header.width ? header.width * scalingFactor : 100, 
        }));

        // İndirme işlemini başlatıyoruz
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Malzeme_Talepleri_${dayjs().format("DD_MM_YYYY")}.xlsx`); // Dosya ismine tarih ekledim
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setXlsxLoading(false);
      } else {
        message.warning("İndirilecek veri bulunamadı.");
        setXlsxLoading(false);
      }
    } catch (error) {
      setXlsxLoading(false);
      console.error("XLSX indirme hatası:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

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
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
      {loading ? (
        <Spin size="large" />
      ) : cardItems.length > 0 ? (
        cardItems.map((item, index) => (
          <div
            key={index}
            style={{
              flex: "1",
              minWidth: "150px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            <Text style={{ fontWeight: 600, fontSize: "14px", color: "#5C595C" }}>
              {item.title}
            </Text>
            <Text style={{ marginTop: "8px", fontWeight: 700, fontSize: "22px", color: "#1F1E1F" }}>
              {item.value}
            </Text>
          </div>
        ))
      ) : (
        <div>Veri Yok</div>
      )}
    </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
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
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
           <Filters kelime={searchTerm} onChange={handleBodyChange} />
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button style={{ display: "flex", alignItems: "center" }} onClick={handleDownloadXLSX} loading={xlsxLoading} icon={<SiMicrosoftexcel />}>
            İndir
          </Button>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} onayCheck={onayCheck} />
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
          // onRow={onRowClick}
          scroll={{ y: "calc(100vh - 450px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.SFS_TALEP_DURUM_ID === 0 ? "boldRow" : "")}
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
    </>
  );
};

export default MainTable;
