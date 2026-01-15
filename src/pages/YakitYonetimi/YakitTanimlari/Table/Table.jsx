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
  const [status, setStatus] = useState(true);

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
      title: "Yakıt Kodu",
      dataIndex: "YAKIT_KOD",
      key: "YAKIT_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.YAKIT_KOD === null) return -1;
        if (b.YAKIT_KOD === null) return 1;
        return a.YAKIT_KOD.localeCompare(b.YAKIT_KOD);
      },
    },
    {
      title: "Yakıt Tanımı",
      dataIndex: "YAKIT_TANIM",
      key: "YAKIT_TANIM",
      width: 200,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.YAKIT_TANIM === null) return -1;
        if (b.YAKIT_TANIM === null) return 1;
        return a.YAKIT_TANIM.localeCompare(b.YAKIT_TANIM);
      },
    },
    {
      title: "Yakıt Tipi",
      dataIndex: "TIP",
      key: "TIP",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.TIP === null) return -1;
        if (b.TIP === null) return 1;
        return a.TIP.localeCompare(b.TIP);
      },
    },
    {
      title: "Birim",
      dataIndex: "BIRIM",
      key: "BIRIM",
      width: 200,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.BIRIM === null && b.BIRIM === null) return 0;
        if (a.BIRIM === null) return 1;
        if (b.BIRIM === null) return -1;
        return a.BIRIM.localeCompare(b.BIRIM);
      },
    },
    {
      title: "Giren Miktar",
      dataIndex: "GIREN_MIKTAR",
      key: "GIREN_MIKTAR",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.GIREN_MIKTAR === null) return -1;
        if (b.GIREN_MIKTAR === null) return 1;
        return a.GIREN_MIKTAR.localeCompare(b.GIREN_MIKTAR);
      },
    },
    {
      title: "Çıkan Miktar",
      dataIndex: "CIKAN_MIKTAR",
      key: "CIKAN_MIKTAR",
      width: 300,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.CIKAN_MIKTAR === null) return -1;
        if (b.CIKAN_MIKTAR === null) return 1;
        return a.CIKAN_MIKTAR.localeCompare(b.CIKAN_MIKTAR);
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Stok Miktarı",
      dataIndex: "STOK_MIKTAR",
      key: "STOK_MIKTAR",
      width: 150,
      sorter: (a, b) => {
        if (a.STOK_MIKTAR === null && b.STOK_MIKTAR === null) return 0;
        if (a.STOK_MIKTAR === null) return 1;
        if (b.STOK_MIKTAR === null) return -1;
        return a.STOK_MIKTAR.localeCompare(b.STOK_MIKTAR);
      },
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Giriş Fiyatı",
      dataIndex: "GIRIS_FIYAT",
      key: "GIRIS_FIYAT",
      width: 200,
      ellipsis: true,

      visible: false, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.GIRIS_FIYAT === null && b.GIRIS_FIYAT === null) return 0;
        if (a.GIRIS_FIYAT === null) return 1;
        if (b.GIRIS_FIYAT === null) return -1;
        return a.GIRIS_FIYAT.localeCompare(b.GIRIS_FIYAT);
      },
    },
    {
      title: "Çıkış Fiyatı",
      dataIndex: "CIKIS_FIYAT",
      key: "CIKIS_FIYAT",
      width: 150,
      sorter: (a, b) => {
        if (a.CIKIS_FIYAT === null && b.CIKIS_FIYAT === null) return 0;
        if (a.CIKIS_FIYAT === null) return -1;
        if (b.CIKIS_FIYAT === null) return 1;
        return a.CIKIS_FIYAT.localeCompare(b.CIKIS_FIYAT);
      },
      ellipsis: true,

      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Durum",
      dataIndex: "AKTIF",
      key: "AKTIF",
      width: 100,
      visible: true,
      render: (aktif) => (
        <Tag color={aktif ? "green" : "red"}>
          {aktif ? "Aktif" : "Pasif"}
        </Tag>
      ),
      sorter: (a, b) => (a.AKTIF === b.AKTIF ? 0 : a.AKTIF ? -1 : 1),
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

  const [body, setBody] = useState({
    filters: {
      Kelime: "",
    },
  });

  // ana tablo api isteği için kullanılan useEffect

  const lastRequestRef = useRef(null);

  // --- API İsteği (GÜNCELLENEN KISIM) ---
  useEffect(() => {
    fetchEquipmentData(status);
  }, [status]); // status değiştiğinde yeniden veri çek

  const fetchEquipmentData = async (currentStatus) => {
    try {
      setLoading(true);
      // ✅ API isteği parametre ile atılıyor (true/false)
      const response = await AxiosInstance.get(`GetYakitList?aktif=${currentStatus}`);

      if (Array.isArray(response)) {
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_STOK_ID,
        }));
        setData(formattedData);
      } else {
        console.error("API yanıtı beklenen formatta değil (Array bekleniyor).", response);
        setData([]);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Data veya searchTerm değiştiğinde tablo verisini günceller
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        (item.YAKIT_KOD && item.YAKIT_KOD.toLowerCase().includes(lowerSearch)) ||
        (item.YAKIT_TANIM && item.YAKIT_TANIM.toLowerCase().includes(lowerSearch))
    );
  }, [data, searchTerm]);

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
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage]);

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnYakitTanimlariOrder");
    const savedVisibility = localStorage.getItem("columnYakitTanimlariVisibility");
    const savedWidths = localStorage.getItem("columnYakitTanimlariWidths");

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

    localStorage.setItem("columnYakitTanimlariOrder", JSON.stringify(order));
    localStorage.setItem("columnYakitTanimlariVisibility", JSON.stringify(visibility));
    localStorage.setItem("columnYakitTanimlariWidths", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      // Eğer column undefined ise (eski localStorage verisi yüzünden), null döndürüyoruz.
      return column ? { ...column, visible: visibility[key], width: widths[key] } : null;
    }).filter(Boolean); // Null değerleri diziden temizliyoruz.
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnYakitTanimlariOrder", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnYakitTanimlariVisibility",
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
      "columnYakitTanimlariWidths",
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

          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            style={{ width: 120 }}
            options={[
              { value: true, label: "Aktif" },
              { value: false, label: "Pasif" },
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
