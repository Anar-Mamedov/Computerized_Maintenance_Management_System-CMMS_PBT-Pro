import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import EditDrawerTalep from "../../MalzemeTalepleri/Update/EditDrawer";
import EditDrawerSiparis from "../../SatinalmaSiparisleri/Update/EditDrawer"
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer1 from "../../../YardimMasasi/IsTalepleri/Update/EditDrawer";
import { useFormContext } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";
import { t } from "i18next";

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

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "20%",
    height: "100%",
    zIndex: 2,
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
  
  // İKİ AYRI SEARCH TERM
  const [searchTermTeklif, setSearchTermTeklif] = useState("");
  const [searchTermTalep, setSearchTermTalep] = useState("");
  
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [label, setLabel] = useState("Yükleniyor...");
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);
  const [drawer, setDrawer] = useState({ visible: false, data: null });
  const [talepDrawer, setTalepDrawer] = useState({ visible: false, data: null });
  const [siparisDrawer, setSiparisDrawer] = useState({ visible: false, data: null });
  const [selectedRows, setSelectedRows] = useState([]);
  const [xlsxLoading, setXlsxLoading] = useState(false);
  const [cardsData, setCardsData] = useState({});

  const cardItems = useMemo(() => {
    if (!cardsData || Object.keys(cardsData).length === 0) return [];
    return [
      { title: "Toplam Teklif Paketi", value: cardsData.TOPLAM_TEKLIF_PAKETI },
      { title: "Teklif Bekleyen", value: cardsData.TEKLIF_BEKLEYEN },
      { title: "Karşılaştırma Aşamasında", value: cardsData.KARSILASTIRMA_ASAMASINDA },
      { title: "Ortalama Süre (Açık Paket)", 
        value: Number(cardsData.ORT_SURE_GUN).toLocaleString("tr-TR", 
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
      },
    ];
  }, [cardsData]);

  function hexToRGBA(color, opacity) {
    // 1) Geçersiz parametreleri engelle
    if (!color || color.trim() === "" || opacity == null) {
      // Boş ya da null renk için boş değer döndürelim
      return;
    }

    // 2) rgb(...) veya rgba(...) formatını yakala
    if (color.startsWith("rgb(") || color.startsWith("rgba(")) {
      // Örnek: "rgb(0,123,255)" -> ["0","123","255"]
      // Örnek: "rgba(255,0,0,0.96)" -> ["255","0","0","0.96"]
      const rawValues = color.replace(/^rgba?\(|\s+|\)$/g, "").split(",");
      const r = parseInt(rawValues[0], 10) || 0;
      const g = parseInt(rawValues[1], 10) || 0;
      const b = parseInt(rawValues[2], 10) || 0;
      // Her hâlükârda dışarıdan gelen `opacity` ile override edelim
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // 3) "#" ile başlayan (HEX) formatları işle
    if (color.startsWith("#")) {
      let r = 0,
        g = 0,
        b = 0;

      // => #rgb  (3 hane)
      if (color.length === 4) {
        // #abc -> r=aa, g=bb, b=cc
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rgba (4 hane)
      else if (color.length === 5) {
        // #abcf -> r=aa, g=bb, b=cc, a=ff (ama biz alpha'yı yok sayıp dışarıdan gelen opacity'yi kullanacağız)
        r = parseInt(color[1] + color[1], 16);
        g = parseInt(color[2] + color[2], 16);
        b = parseInt(color[3] + color[3], 16);
        // color[4] + color[4] => alpha. Ama override ediyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbb (6 hane)
      else if (color.length === 7) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }

      // => #rrggbbaa (8 hane)
      else if (color.length === 9) {
        // #ff0000c9 gibi
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
        // Son 2 karakter alpha'ya denk geliyor ama biz fonksiyon parametresini kullanıyoruz.
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
    }

    // 4) Hiçbir formata uymuyorsa default dön
    return `rgba(0, 0, 0, ${opacity})`;
  }

  const fetchCards = useCallback(async () => {
    try {
      const res = await AxiosInstance.get("GetTeklifPaketCards");
      if (res.status_code === 200 && res.data) {
        setCardsData(res.data);
      } else {
        setCardsData({});
      }
    } catch (err) {
      console.error(err);
      setCardsData({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Özel Alanların nameleri backend çekmek için api isteği

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=MALZEME_SIPARIS"); // API URL'niz
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
      title: "Teklif Paketi No",
      dataIndex: "teklifPaketiNo",
      key: "teklifPaketiNo",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.teklifPaketiNo === null) return -1;
        if (b.teklifPaketiNo === null) return 1;
        return a.teklifPaketiNo.localeCompare(b.teklifPaketiNo);
      },
    },
    {
      title: "Talep No",
      dataIndex: "talepNo",
      key: "talepNo",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onTalepNoClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.talepNo === null) return -1;
        if (b.talepNo === null) return 1;
        return a.talepNo.localeCompare(b.talepNo);
      },
    },
    {
      title: "Sipariş No",
      dataIndex: "SiparisKod",
      key: "SiparisKod",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onSiparisNoClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.SiparisKod === null) return -1;
        if (b.SiparisKod === null) return 1;
        return a.SiparisKod.localeCompare(b.SiparisKod);
      },
    },
    {
      title: "Tarih",
      dataIndex: "olusturmaTarihi",
      key: "olusturmaTarihi",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.olusturmaTarihi === null) return -1;
        if (b.olusturmaTarihi === null) return 1;
        return a.olusturmaTarihi.localeCompare(b.olusturmaTarihi);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Başlık",
      dataIndex: "teklifBaslik",
      key: "teklifBaslik",
      width: 200,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.teklifBaslik === null && b.teklifBaslik === null) return 0;
        if (a.teklifBaslik === null) return 1;
        if (b.teklifBaslik === null) return -1;
        return a.teklifBaslik.localeCompare(b.teklifBaslik);
      },
    },
    {
  title: "Durum",
  dataIndex: "durumAciklama",
  key: "durumAciklama",
  width: 150,
  ellipsis: true,
  visible: true,
  render: (text) => {
    let style = {
      borderRadius: "12px",
      padding: "2px 8px",
      fontWeight: 500,
      fontSize: "12px",
    };

    switch (text) {
      case "Teklif Bekleniyor":
        style = { ...style, backgroundColor: "#fff4d6", color: "#b8860b" }; // pastel sarı
        break;
      case "Karşılaştırma Aşamasında":
        style = { ...style, backgroundColor: "#e0f7fa", color: "#00796b" }; // pastel turkuaz
        break;
      case "Tamamlandı":
        style = { ...style, backgroundColor: "#eaeaeaff", color: "#949494ff" }; // pastel kırmızı/rose
        break;
      case "Reddedildi":
        style = { ...style, backgroundColor: "#fde2e4", color: "#d64550" }; // pastel kırmızı/rose (KAPALI ile aynı)
        break;
      case "Sipariş Alındı":
        style = { ...style, backgroundColor: "#e6f7ff", color: "#096dd9" }; // pastel açık mavi
        break;
      default:
        style = { ...style, backgroundColor: "#f5f5f5", color: "#595959" }; // gri
    }

    return <span style={style}>{text}</span>;
  },
},
    {
      title: "Lokasyon",
      dataIndex: "lokasyon",
      key: "lokasyon",
      width: 200,
      ellipsis: true,

      visible: false, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.lokasyon === null && b.lokasyon === null) return 0;
        if (a.lokasyon === null) return 1;
        if (b.lokasyon === null) return -1;
        return a.lokasyon.localeCompare(b.lokasyon);
      },
    },
    {
      title: "Departman",
      dataIndex: "departman",
      key: "departman",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.departman === null) return -1;
        if (b.departman === null) return 1;
        return a.departman.localeCompare(b.departman);
      },
    },
    {
      title: "Satınalmacı",
      dataIndex: "satinalmaci",
      key: "satinalmaci",
      width: 250,
      sorter: (a, b) => {
        if (a.satinalmaci === null && b.satinalmaci === null) return 0;
        if (a.satinalmaci === null) return -1;
        if (b.satinalmaci === null) return 1;
        return a.satinalmaci.localeCompare(b.satinalmaci);
      },
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
    },
    {
      title: t("Malzeme Sayısı"),
      dataIndex: "malzemeSayisi",
      key: "malzemeSayisi",
      width: 120,
      ellipsis: true,
      visible: false,
      render: (text, record) => (
        <div className="">
          <span>{Number(text).toFixed(Number(record?.tutarFormat))} </span>
        </div>
      ),
      sorter: (a, b) => {
        if (a.malzemeSayisi === null) return -1;
        if (b.malzemeSayisi === null) return 1;
        return a.malzemeSayisi - b.malzemeSayisi;
      },
    },
    {
      title: t("Tedarikçi Sayısı"),
      dataIndex: "tedarikciSayisi",
      key: "tedarikciSayisi",
      width: 120,
      ellipsis: true,
      visible: true,
      render: (text, record) => (
        <div className="">
          <span>{Number(text).toFixed(Number(record?.tutarFormat))} </span>
        </div>
      ),
      sorter: (a, b) => {
        if (a.tedarikciSayisi === null) return -1;
        if (b.tedarikciSayisi === null) return 1;
        return a.tedarikciSayisi - b.tedarikciSayisi;
      },
    },
  ];


  const formatDate = (date) => {
    if (!date) return "";

    const sampleDate = new Date(2021, 0, 21);
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long";
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short";
    } else {
      monthFormat = "2-digit";
    }

    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const formatTime = (time) => {
    if (!time || time.trim() === "") return "";

    try {
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());

      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        console.error("Invalid time format:", time);
        return "";
      }

      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);

      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
      });

      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };


  const [body, setBody] = useState({
    filters: {
      TeklifNo: "",
      TalepNo: "",
    },
  });


  const lastRequestRef = useRef(null);
  
  useEffect(() => {
    const params = JSON.stringify({ body, currentPage, pageSize });
    if (lastRequestRef.current === params) return;
    lastRequestRef.current = params;
  
    fetchEquipmentData(body, currentPage, pageSize);
  }, [body, currentPage, pageSize]);


  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
  
    const timeout = setTimeout(() => {
      if (searchTermTeklif !== body.filters.TeklifNo) {
        handleBodyChange("filters", { ...body.filters, TeklifNo: searchTermTeklif });
        setCurrentPage(1);
      }
    }, 2000);
  
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchTermTeklif]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
  
    const timeout = setTimeout(() => {
      if (searchTermTalep !== body.filters.TalepNo) {
        handleBodyChange("filters", { ...body.filters, TalepNo: searchTermTalep });
        setCurrentPage(1);
      }
    }, 2000);
  
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchTermTalep]);

  const fetchEquipmentData = async (body, page, size) => {
  const { filters = {} } = body || {};
  const currentPage = page || 1;

  try {
    setLoading(true);

    const response = await AxiosInstance.post(
      `GetTeklifPaketList?pagingDeger=${currentPage}&pageSize=${size}`,
      filters
    );

    if (response.status_code === 401) {
      message.error(t("buSayfayaErisimYetkinizBulunmamaktadir"));
      return;
    }

    setTotalPages(response.page);
    setTotalDataCount(response.kayit_sayisi);

    const list = Array.isArray(response?.teklif_listesi) ? response.teklif_listesi : [];

    if (!Array.isArray(list)) {
      console.error("teklif_listesi array değil!", list);
    }

    const formattedData = list.map((item) => ({
      ...item,
      key: item.teklifId,
    }));

    setData(formattedData);
    setLoading(false);
  } catch (error) {
    console.error("Error in API request:", error);
    setLoading(false);
    if (navigator.onLine) {
      message.error("Hata Mesajı: " + error.message);
    } else {
      message.error("Internet Bağlantısı Mevcut Değil.");
    }
  }
};

  const handleBodyChange = useCallback((type, newBody) => {
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
    setCurrentPage(1);
  }, []);
  
    const handleTableChange = (pagination) => {
    if (pagination) {
      setCurrentPage(pagination.current);
      setPageSize(pagination.pageSize);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: { ...record, key: record.teklifId } });
  };

  const onTalepNoClick = (record) => {
    setTalepDrawer({ 
      visible: true, 
      data: { ...record, key: record.talepID }
    });
  };

  const onSiparisNoClick = (record) => {
    setSiparisDrawer({ 
      visible: true, 
      data: { ...record, key: record.SiparisNo }
    });
  };

  const refreshTableData = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);

    fetchEquipmentData(body, currentPage);
    fetchCards();
  }, [body, currentPage]);

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnFiyatTeklifleriOrder");
    const savedVisibility = localStorage.getItem("columnFiyatTeklifleriVisibility");
    const savedWidths = localStorage.getItem("columnFiyatTeklifleriWidths");

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

    localStorage.setItem("columnFiyatTeklifleriOrder", JSON.stringify(order));
    localStorage.setItem("columnFiyatTeklifleriVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnFiyatTeklifleriWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  useEffect(() => {
    localStorage.setItem("columnFiyatTeklifleriOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnFiyatTeklifleriVisibility",
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
      "columnFiyatTeklifleriWidths",
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

  const filteredColumns = mergedColumns.filter((col) => col.visible);

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



  function resetColumns() {
    localStorage.removeItem("columnOrder");
    localStorage.removeItem("columnVisibility");
    localStorage.removeItem("columnWidths");
    localStorage.removeItem("ozelAlanlar");
    window.location.reload();
  }


  const handleDownloadXLSX = async () => {
    try {
      setXlsxLoading(true);

      const { filters = {} } = body || {};

      const response = await AxiosInstance.post("GetSatinalmaSiparisListExcel", filters);

      const dataToProcess = Array.isArray(response) 
        ? response 
        : (response?.siparis_listesi || response?.items || []);

      if (dataToProcess.length > 0) {
        const xlsxData = dataToProcess.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              if (col.render) {
                if (key.includes("TARIH")) {
                  value = formatDate(value);
                } else if (key.includes("SAAT")) {
                  value = formatTime(value);
                } else if (key === "SSP_DURUM") {
                  value = row.SSP_DURUM; 
                } else if (["SSP_KDV_TOPLAM", "SSP_ARA_TOPLAM", "SSP_YUVARLAMA_TOPLAMI", "SSP_GENEL_TOPLAM"].includes(key)) {
                  const decimals = row.tutarFormat ? Number(row.tutarFormat) : 2;
                  value = Number(value).toFixed(decimals);
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

        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Siparis Listesi");

        const headers = filteredColumns
          .map((col) => {
            let label = extractTextFromElement(col.title);
            return {
              label: label,
              key: col.dataIndex,
              width: col.width,
            };
          })
          .filter((col) => col.key);

        const scalingFactor = 0.8; 

        worksheet["!cols"] = headers.map((header) => ({
          wpx: header.width ? header.width * scalingFactor : 100, 
        }));

        const dateStr = new Date().toLocaleDateString("tr-TR").replace(/\./g, "_");
        const fileName = `Satinalma_Siparisleri_${dateStr}.xlsx`;

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
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
            style={{ width: "200px" }}
            type="text"
            placeholder="Teklif No Ara..."
            value={searchTermTeklif}
            onChange={(e) => setSearchTermTeklif(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Input
            style={{ width: "200px" }}
            type="text"
            placeholder="Talep No Ara..."
            value={searchTermTalep}
            onChange={(e) => setSearchTermTalep(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
          <Filters TeklifNo={searchTermTeklif} onChange={handleBodyChange} />
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
          dataSource={data}
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
        />
      </Spin>
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
      <EditDrawerTalep selectedRow={talepDrawer.data} onDrawerClose={() => setTalepDrawer({ ...talepDrawer, visible: false })} drawerVisible={talepDrawer.visible} onRefresh={refreshTableData} />
      <EditDrawerSiparis selectedRow={siparisDrawer.data} onDrawerClose={() => setSiparisDrawer({ ...siparisDrawer, visible: false })} drawerVisible={siparisDrawer.visible} onRefresh={refreshTableData} />

      {editDrawer1Visible && (
        <EditDrawer1
          selectedRow={editDrawer1Data}
          onDrawerClose={() => setEditDrawer1Visible(false)}
          drawerVisible={editDrawer1Visible}
          onRefresh={() => {
          }}
        />
      )}
    </>
  );
};

export default MainTable;