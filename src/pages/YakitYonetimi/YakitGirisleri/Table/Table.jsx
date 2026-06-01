import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Tooltip, Table, Button, Modal, Checkbox, Input, Spin, Typography, Progress, message, Card, Row, Col, Space, Popconfirm, Tag, Popover, Drawer, Select } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
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
import YakitIslemleri from "./YakitIslemleri/YakitIslemleri";
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
  const [yakitModalVisible, setYakitModalVisible] = useState(false);

  const [body, setBody] = useState({
    Arama: "",
    KaynakTipi: "TUMU",
    BaslangicTarihi: null,
    BitisTarihi: null,
  });

  const cardItems = useMemo(() => [
    { title: "Toplam Çıkış", value: `${cardsData.ToplamCikisLitre || 0} Lt`, subText: cardsData.SeciliZaman },
    { title: "Toplam Tutar", value: `${Number(cardsData.ToplamTutar || 0).toLocaleString('tr-TR')} TL`, subText: cardsData.SeciliZaman },
    { title: "Anormal Tüketim", value: cardsData.AnormalTuketimKayitSayisi || 0, isCritical: (cardsData.AnormalTuketimKayitSayisi > 0), subText: cardsData.SeciliZaman },
    { title: "Ekipman Başına Maliyet", value: `${cardsData.EkipmanBasinaMaliyet || 0} TL`, subText: cardsData.SeciliZaman },
  ], [cardsData]);

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
      title: "Ekipman",
      dataIndex: "Ekipman", 
      key: "Ekipman",
      width: 300,
      ellipsis: true,
      visible: true,
      render: (value) => (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
          {/* KANKA DÜZELTME: Satırın tamamı tıklanabilir olacağı için buradaki <a> onClick'ini ve link stilini kaldırıp düz metin yaptık */}
          <span style={{ fontWeight: 600, color: "#1677ff" }}>
            {value?.Kod || "-"}
          </span>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {value?.Adi || "-"}
          </Text>
        </div>
      ),
      sorter: (a, b) => (a.Ekipman?.Kod || "").localeCompare(b.Ekipman?.Kod || ""),
    },
    {
      title: "Tarih",
      dataIndex: "TarihSaat",
      key: "TarihSaat",
      width: 110,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => (a.TarihSaat || "").localeCompare(b.TarihSaat || ""),
      render: (text) => {
        if (!text) return "-";
        const parts = text.split("\n");
        const datePart = parts[0];
        const timePart = parts[1] ? parts[1].substring(0, 5) : "";

        return (
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
            <span style={{ fontWeight: 600 }}>{datePart}</span>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {timePart || "-"}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Yakıt Tipi",
      dataIndex: "YakitTipi",
      key: "YakitTipi",
      width: 180, 
      visible: true,
      render: (val) => {
        if (!val) return "-";
        
        return (
          <Tooltip title={val} placement="topLeft">
            <Tag 
              color="blue" 
              style={{ 
                maxWidth: "160px",       
                overflow: "hidden",      
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",    
                display: "inline-block", 
                verticalAlign: "middle"
              }}
            >
              {val}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "Alınan Sayaç",
      dataIndex: "AlinanSayac",
      key: "AlinanSayac",
      width: 80,
      visible: true,
      render: (value) => <div style={{textAlign:'right'}}>{Number(value).toLocaleString('tr-TR')}</div>,
      sorter: (a, b) => a.AlinanSayac - b.AlinanSayac,
    },
    {
      title: "Fark",
      dataIndex: "Fark",
      key: "Fark",
      width: 120,
      visible: true,
      render: (value) => <div style={{textAlign:'right'}}>{Number(value).toLocaleString('tr-TR')}</div>,
      sorter: (a, b) => a.Fark - b.Fark,
    },
    {
      title: "Miktar",
      dataIndex: "Miktar",
      key: "Miktar",
      width: 120,
      visible: true,
      render: (value) => <div style={{textAlign:'right'}}>{Number(value).toLocaleString('tr-TR')} Lt</div>,
      sorter: (a, b) => a.Miktar - b.Miktar,
    },
    {
      title: "Fiyat",
      dataIndex: "Fiyat",
      key: "Fiyat",
      width: 120,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => a.Fiyat?.localeCompare(b.Fiyat),
    },
    {
      title: "Tutar",
      dataIndex: "Tutar",
      key: "Tutar",
      width: 120,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => a.Tutar?.localeCompare(b.Tutar),
    },
    {
      title: "Stoktan Kullanım",
      dataIndex: "StoktanKullanim",
      key: "StoktanKullanim",
      width: 130,
      visible: true,
      align: "center",
      render: (value) =>
        value ? (
          <CheckOutlined style={{ color: "#52c41a", fontSize: "18px" }} />
        ) : (
          <CloseOutlined style={{ color: "#ff4d4f", fontSize: "18px" }} />
        ),
    },
    {
      title: "Operatör",
      dataIndex: "Operator",
      key: "Operator",
      width: 150,
      visible: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "Lokasyon",
      key: "Lokasyon",
      width: 200,
      visible: true,
      render: (value) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500" }}>
            {value?.Adi || "-"}
          </span>
          {value?.Yol && (
            <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {value.Yol}
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => {
        const adiA = a.Lokasyon?.Adi || "";
        const adiB = b.Lokasyon?.Adi || "";
        if (adiA !== adiB) {
          return adiA.localeCompare(adiB);
        }
        return (a.Lokasyon?.Yol || "").localeCompare(b.Lokasyon?.Yol || "");
      },
    },
    {
      title: "Yakıt Deposu",
      dataIndex: "YakitDeposu",
      key: "YakitDeposu",
      width: 150,
      visible: true,
    },
    {
      title: "Açıklama",
      dataIndex: "Aciklama",
      key: "Aciklama",
      width: 150,
      visible: false,
    },
  ];

  // Intl.DateTimeFormat kullanarak tarih formatlama
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

  const handleBodyChange = useCallback((type, newIds) => {
    setBody((prev) => ({
      ...prev,
      [type]: newIds,
    }));
  }, []);

  useEffect(() => {
    fetchEquipmentData();
  }, [status, body, currentPage, pageSize]); 

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      
      const payload = {
        ...body,
        Arama: searchTerm, 
      };

      const response = await AxiosInstance.post(
        `GetAracYakitListesi?page=${currentPage}&pageSize=${pageSize}`, 
        payload
      );

      if (response && !response.has_error && response.data) {
        const { Liste, Ozetler, ToplamKayit } = response.data;

        const formattedData = (Liste || []).map((item) => ({
          ...item,
          key: item.Id, 
        }));

        setData(formattedData);
        setTotalDataCount(ToplamKayit || 0);

        if (Ozetler) {
          setCardsData(Ozetler);
        }

      } else {
        console.error("API hatası veya beklenmeyen format:", response);
        setData([]);
        setTotalDataCount(0);
        message.warning(response?.message || "Veri formatı hatalı.");
      }
    } catch (error) {
      console.error("Error in API request:", error);
      message.error("Sunucu bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

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

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
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

  // KANKA DÜZELTME: Satırın tamamına tıklayınca EditDrawer'ı tetikleyen fonksiyon
  const onRowClick = (record) => {
    setDrawer({ visible: true, data: { ...record, key: record.key } });
  };

  const refreshTableData = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    fetchEquipmentData(body, currentPage);
  }, [body, currentPage]);

  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnYakitGirisleriOrder");
    const savedVisibility = localStorage.getItem("columnYakitGirisleriVisibility");
    const savedWidths = localStorage.getItem("columnYakitGirisleriWidths");

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

    localStorage.setItem("columnYakitGirisleriOrder", JSON.stringify(order));
    localStorage.setItem("columnYakitGirisleriVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnYakitGirisleriWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return column ? { ...column, visible: visibility[key], width: widths[key] } : null;
    }).filter(Boolean); 
  });

  useEffect(() => {
    localStorage.setItem("columnYakitGirisleriOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnYakitGirisleriVisibility",
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
      "columnYakitGirisleriWidths",
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

  // KANKA DÜZELTME: LocalStorage anahtarları yukarıdaki state ile birebir eşitlendi!
  function resetColumns() {
    localStorage.removeItem("columnYakitGirisleriOrder");
    localStorage.removeItem("columnYakitGirisleriVisibility");
    localStorage.removeItem("columnYakitGirisleriWidths");
    localStorage.removeItem("ozelAlanlar");
    window.location.reload();
  }

  const handleDownloadXLSX = async () => {
    try {
      setXlsxLoading(true);
      const { filters = {} } = body || {};

      const response = await AxiosInstance.post("GetMalzemeTalepleriExcel", filters);

      const dataToProcess = Array.isArray(response) 
        ? response 
        : (response?.talep_listesi || response?.items || []);

      if (dataToProcess.length > 0) {
        const xlsxData = dataToProcess.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              if (col.render) {
                if (key === "DUZENLEME_TARIH" || key.endsWith("_TARIH") || key === "SFS_TARIH") {
                  value = formatDate(value);
                } else if (key === "DUZENLEME_SAAT" || key.endsWith("_SAAT") || key === "SFS_SAAT") {
                  value = formatTime(value);
                } else if (key === "GARANTI") {
                  value = row.GARANTI ? "Evet" : "Hayır";
                } else if (key === "TAMAMLANMA") {
                  value = `${row.TAMAMLANMA}%`;
                } else if (key === "SFS_DURUM") { 
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

        const worksheet = XLSX.utils.json_to_sheet(xlsxData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Yakıt Tanımları Listesi");

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

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Malzeme_Talepleri_${dayjs().format("DD_MM_YYYY")}.xlsx`); 
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
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "10px" }}>
          <Button onClick={resetColumns} style={{ marginBottom: "15px" }}>
            Sütunları Sıfırla
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
            <div style={{ marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" }}>
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
            <div style={{ width: "46%", border: "1px solid #8080806e", borderRadius: "8px", padding: "10px" }}>
              <div style={{ marginBottom: "20px", borderBottom: "1px solid #80808051", padding: "8px 8px 12px 8px" }}>
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
                justify: "flex-start",
                border: item.isCritical ? "1px solid red" : "none",
              }}
            >
              <Text style={{ fontWeight: 600, fontSize: "14px", color: "#5C595C" }}>
                {item.title}
              </Text>
              <Text style={{ marginTop: "8px", fontWeight: 700, fontSize: "22px", color: item.isCritical ? "#d32f2f" : "#1F1E1F" }}>
                {item.value}
              </Text>
              {item.subText && (
                <span style={{ alignSelf: 'flex-end', fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  {item.subText}
                </span>
              )}
            </div>
          ))
        ) : (
          <div style={{ width: "100%", padding: "20px", textAlign: "center", color: "#999" }}>
            Veri Yok
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px", gap: "10px", padding: "0 5px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <Button style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0px 8px", height: "32px" }} onClick={() => setIsModalVisible(true)}>
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
            showTotal: (total) => `Toplam ${total}`,
            showQuickJumper: true,
          }}
          scroll={{ y: "calc(100vh - 500px)" }}
          // KANKA DÜZELTME: Satırın tamamına tıklamayı yakalayan onRow eklendi!
          onRow={(record) => ({
            onClick: (event) => {
              // Eğer tıklanan yer Checkbox hücresi veya bir buton alanı değilse drawer'ı aç
              if (!event.target.closest(".ant-table-selection-column") && !event.target.closest("button")) {
                onRowClick(record);
              }
            },
          })}
          rowClassName={(record) => (record.SFS_TALEP_DURUM_ID === 0 ? "boldRow" : "clickable-row")}
        />
      </Spin>

      <EditDrawer 
        selectedRow={drawer.data} 
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })} 
        drawerVisible={drawer.visible} 
        onRefresh={refreshTableData} 
      />
      <YakitIslemleri
        visible={yakitModalVisible} 
        onClose={() => setYakitModalVisible(false)} 
        onRefresh={refreshTableData}
      />

      {editDrawer1Visible && (
        <EditDrawer1
          selectedRow={editDrawer1Data}
          onDrawerClose={() => setEditDrawer1Visible(false)}
          drawerVisible={editDrawer1Visible}
          onRefresh={() => {}}
        />
      )}
    </>
  );
};

export default MainTable;