import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Progress, message, Card, Row, Col, Space, Popconfirm, Tag, Popover, Drawer, Select } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer1 from "../../../YardimMasasi/IsTalepleri/Update/EditDrawer";
import Filters from "./filter/Filters";
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
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [selectedRows, setSelectedRows] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [cardsData, setCardsData] = useState({});

  const [body, setBody] = useState({
    LokasyonIds: [],
    YakitTipIds: [],
  });

  const cardItems = useMemo(() => {
    // Veri yoksa bile kart iskeletini koruyalım ki sayfa zıplamasın
    const data = cardsData || {};

    return [
      { 
        title: "Toplam Depo Sayısı", 
        value: data.ToplamDepoSayisi ?? 0 
      },
      { 
        title: "Toplam Yakıt Miktarı", 
        // Sayıyı okunaklı hale getirdik (örn: 69.200 Lt)
        value: `${Number(data.ToplamYakitMiktari || 0).toLocaleString('tr-TR')} Lt` 
      },
      { 
        title: "Kritik Depo Sayısı", 
        value: data.KritikDepoSayisi ?? 0,
        // Kritik sayı 0'dan büyükse rengi kırmızımsı yapmak için style prop eklenebilir (render kısmında)
        isCritical: (data.KritikDepoSayisi || 0) > 0 
      },
      { 
        title: "Günlük Giriş Çıkış", 
        value: data.GunlukGirisCikis || "0 / 0 L" 
      },
    ];
  }, [cardsData]);

  const fetchCards = useCallback(async () => {
    try {
      const res = await AxiosInstance.get("GetYakitTankOzet");
      
      // Dokümandaki gibi direkt obje dönüyorsa:
      if (res) {
        // Eğer API wrapper kullanıyorsa (res.data içindeyse) kontrolü:
        const data = res.data || res; 
        setCardsData(data);
      } 
    } catch (err) {
      console.error("Kart verileri çekilemedi:", err);
      // Hata durumunda boş obje set edelim
      setCardsData({});
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=YAKIT"); // API URL'niz
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

  const initialColumns = [
    {
      title: "Depo Kodu",
      dataIndex: "DEP_KOD",
      key: "DEP_KOD",
      width: 120,
      ellipsis: true,
      visible: true,
      render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
      sorter: (a, b) => a.DEP_KOD?.localeCompare(b.DEP_KOD),
    },
    {
      title: "Depo Tanımı",
      dataIndex: "DEP_TANIM",
      key: "DEP_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => a.DEP_TANIM?.localeCompare(b.DEP_TANIM),
    },
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      key: "LOKASYON",
      width: 150,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => a.LOKASYON?.localeCompare(b.LOKASYON),
    },
    {
      title: "Yakıt Türü",
      dataIndex: "YAKIT_TURU",
      key: "YAKIT_TURU",
      width: 120,
      visible: true,
      sorter: (a, b) => a.YAKIT_TURU?.localeCompare(b.YAKIT_TURU),
    },
    {
      title: "Kapasite",
      dataIndex: "KAPASITE",
      key: "KAPASITE",
      width: 120,
      visible: true,
      render: (value) => <div style={{textAlign:'right'}}>{Number(value).toLocaleString('tr-TR')} Lt</div>,
      sorter: (a, b) => a.KAPASITE - b.KAPASITE,
    },
    {
      title: "Mevcut Miktar",
      dataIndex: "MEVCUT_MIKTAR",
      key: "MEVCUT_MIKTAR",
      width: 150,
      visible: true,
      render: (value) => <div style={{textAlign:'right', fontWeight:'bold'}}>{Number(value).toLocaleString('tr-TR')} Lt</div>,
      sorter: (a, b) => a.MEVCUT_MIKTAR - b.MEVCUT_MIKTAR,
    },
    {
      title: "Doluluk",
      dataIndex: "DOLULUK_ORANI",
      key: "DOLULUK_ORANI",
      width: 180,
      visible: true,
      render: (value, record) => {
        // Renk belirleme: %20 altı kırmızı, diğerleri mavi/yeşil
        let color = "#1890ff";
        if (value < 20) color = "#ff4d4f";
        else if (value > 90) color = "#52c41a";

        return (
          <Progress 
            percent={value} 
            size="small" 
            strokeColor={color} 
            format={percent => `${percent}%`}
          />
        );
      },
      sorter: (a, b) => a.DOLULUK_ORANI - b.DOLULUK_ORANI,
    },
    {
      title: "Son Hareket",
      dataIndex: "SON_HAREKET",
      key: "SON_HAREKET",
      width: 150,
      visible: true,
    },
    {
      title: "Durum",
      dataIndex: "DURUM_TEXT",
      key: "DURUM_TEXT",
      width: 100,
      visible: true,
      render: (text, record) => {
        let color = "default";
        if (record.DURUM_CLASS === "success") color = "success";
        if (record.DURUM_CLASS === "warning") color = "warning";
        if (record.DURUM_CLASS === "danger") color = "error";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Aktiflik",
      dataIndex: "AKTIF",
      key: "AKTIF",
      width: 80,
      visible: false,
      render: (aktif) => (
        <Tag color={aktif ? "green" : "red"}>{aktif ? "Aktif" : "Pasif"}</Tag>
      ),
    }
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

  const handleBodyChange = useCallback((type, newIds) => {
    setBody((prev) => ({
      ...prev,
      [type]: newIds,
    }));
    // Filtre değişince sayfayı başa alabilirsin istersen
    // setCurrentPage(1); 
  }, []);

  // Status veya Body değiştiğinde veriyi çek
  useEffect(() => {
    fetchEquipmentData();
  }, [status, body]); 

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      
      // Dokümana uygun Body hazırlama
      const payload = {
        LokasyonIds: body.LokasyonIds || [], // Array
        YakitTipIds: body.YakitTipIds || [], // Array
        Durum: status // 1, 0, -1
      };

      const response = await AxiosInstance.post(`GetYakitTankList`, payload);

      if (Array.isArray(response)) {
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_DEPO_ID || item.TB_STOK_ID, // Key olarak ID kullan
        }));
        setData(formattedData);
        setTotalDataCount(formattedData.length); // Client-side pagination için
      } else {
        console.error("API yanıtı beklenen formatta değil.", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      message.error("Veri çekilemedi.");
    } finally {
      setLoading(false);
    }
  };

  // --- Frontend Arama (Client-side Search) ---
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        (item.DEP_KOD && item.DEP_KOD.toLowerCase().includes(lowerSearch)) ||
        (item.DEP_TANIM && item.DEP_TANIM.toLowerCase().includes(lowerSearch)) ||
        (item.LOKASYON && item.LOKASYON.toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

  // sayfalama için kullanılan useEffect
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
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
    console.log("Tıklanan Satırın ID'si:", record.TB_STOK_ID); // Konsolda ID görüyor musun?
    setDrawer({ visible: true, data: { ...record, key: record.TB_STOK_ID } });
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
    fetchCards();
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage]);

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnYakitTankOrder");
    const savedVisibility = localStorage.getItem("columnYakitTankVisibility");
    const savedWidths = localStorage.getItem("columnYakitTankWidths");

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

    localStorage.setItem("columnYakitTankOrder", JSON.stringify(order));
    localStorage.setItem("columnYakitTankVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnYakitTankWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      // Eğer column undefined ise (eski localStorage verisi yüzünden), null döndürüyoruz.
      return column ? { ...column, visible: visibility[key], width: widths[key] } : null;
    }).filter(Boolean); // Null değerleri diziden temizliyoruz.
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnYakitTankOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnYakitTankVisibility",
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
      "columnYakitTankWidths",
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
                  // Diğer sütunlar için render fonksiyonundan metni çıkar
                  // extractTextFromElement fonksiyonun zaten yukarıda tanımlıydı
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Yakıt Tanımları Listesi");

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
    <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "20px" }}>
       <Spin size="large" />
    </div>
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
          border: item.isCritical ? "1px solid red" : "none",
        }}
      >
        <Text style={{ fontWeight: 600, fontSize: "14px", color: "#5C595C" }}>
          {item.title}
        </Text>
        <Text
          style={{
            marginTop: "8px",
            fontWeight: 700,
            fontSize: "22px",
            color: item.isCritical ? "#d32f2f" : "#1F1E1F",
          }}
        >
          {item.value}
        </Text>
      </div>
    ))
  ) : (
    <div style={{ width: "100%", padding: "20px", textAlign: "center", color: "#999" }}>
      Veri Yok
    </div>
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
          <Select
  value={status}
  onChange={(value) => setStatus(value)}
  style={{ width: 120 }}
  options={[
    { value: -1, label: "Tümü" }, // Backend'e -1 gider
    { value: 1, label: "Aktif" }, // Backend'e 1 gider
    { value: 0, label: "Pasif" }, // Backend'e 0 gider
  ]}
/>
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button style={{ display: "flex", alignItems: "center" }} onClick={handleDownloadXLSX} loading={xlsxLoading} icon={<SiMicrosoftexcel />}>
            İndir
          </Button>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={filteredColumns}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            total: totalDataCount,
            pageSize: pageSize,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            onChange: handleTableChange,
            showTotal: (total, range) => `Toplam ${total}`,
            showQuickJumper: true,
          }}
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
