import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../../../api/http.jsx";
import EditDrawer from "../../../../../BakımVeArizaYonetimi/PeriyodikBakimlar1/Update/EditDrawer.jsx";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import MakineUpdate from "../../../../../MakineEkipman/MakineTanim/EditDrawer.jsx";

const { Text } = Typography;

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
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
    component: null, // 'edit' or 'makine'
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
        localStorage.setItem("ozelAlanlarYaklasanPeriyodikBakimlar", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlarYaklasanPeriyodikBakimlar = JSON.parse(localStorage.getItem("ozelAlanlarYaklasanPeriyodikBakimlar"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "Periyodik Bakım Kodu",
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
      visible: true,
      render: (text, record) => <a onClick={() => onRowClick({ ...record, key: record.PBM_PERIYODIK_BAKIM_ID }, "edit")}>{text}</a>,
      sorter: (a, b) => {
        if (a.PBK_KOD === b.PBK_KOD) return 0;
        if (a.PBK_KOD === null || a.PBK_KOD === undefined) return -1;
        if (b.PBK_KOD === null || b.PBK_KOD === undefined) return 1;
        return a.PBK_KOD.localeCompare(b.PBK_KOD);
      },
    },
    {
      title: "Periyodik Bakım Tanımı",
      dataIndex: "PBK_TANIM",
      key: "PBK_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,

      sorter: (a, b) => {
        if (a.PBK_TANIM === b.PBK_TANIM) return 0;
        if (a.PBK_TANIM === null || a.PBK_TANIM === undefined) return -1;
        if (b.PBK_TANIM === null || b.PBK_TANIM === undefined) return 1;
        return a.PBK_TANIM.localeCompare(b.PBK_TANIM);
      },
    },
    {
      title: "Bakım Periyot ?",
      dataIndex: "PBK_PERIYOT_ACIKLAMA",
      key: "PBK_PERIYOT_ACIKLAMA",
      width: 200,
      ellipsis: true,
      visible: true,

      sorter: (a, b) => {
        if (a.PBK_PERIYOT_ACIKLAMA === b.PBK_PERIYOT_ACIKLAMA) return 0;
        if (a.PBK_PERIYOT_ACIKLAMA === null || a.PBK_PERIYOT_ACIKLAMA === undefined) return -1;
        if (b.PBK_PERIYOT_ACIKLAMA === null || b.PBK_PERIYOT_ACIKLAMA === undefined) return 1;
        return a.PBK_PERIYOT_ACIKLAMA.localeCompare(b.PBK_PERIYOT_ACIKLAMA);
      },
    },
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text, record) => <a onClick={() => onRowClick({ ...record, key: record.PBM_MAKINE_ID }, "makine")}>{text}</a>,
      sorter: (a, b) => {
        if (a.MKN_KOD === b.MKN_KOD) return 0;
        if (a.MKN_KOD === null || a.MKN_KOD === undefined) return -1;
        if (b.MKN_KOD === null || b.MKN_KOD === undefined) return 1;
        return a.MKN_KOD.localeCompare(b.MKN_KOD);
      },
    },

    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,

      sorter: (a, b) => {
        if (a.MKN_TANIM === b.MKN_TANIM) return 0;
        if (a.MKN_TANIM === null || a.MKN_TANIM === undefined) return -1;
        if (b.MKN_TANIM === null || b.MKN_TANIM === undefined) return 1;
        return a.MKN_TANIM.localeCompare(b.MKN_TANIM);
      },
    },

    {
      title: "Son Uygulama Tarihi",
      dataIndex: "PBM_SON_UYGULAMA_TARIH",
      key: "PBM_SON_UYGULAMA_TARIH",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text) => formatDate(text),
      sorter: (a, b) => {
        if (a.PBM_SON_UYGULAMA_TARIH === b.PBM_SON_UYGULAMA_TARIH) return 0;
        if (a.PBM_SON_UYGULAMA_TARIH === null || a.PBM_SON_UYGULAMA_TARIH === undefined) return -1;
        if (b.PBM_SON_UYGULAMA_TARIH === null || b.PBM_SON_UYGULAMA_TARIH === undefined) return 1;
        return a.PBM_SON_UYGULAMA_TARIH.localeCompare(b.PBM_SON_UYGULAMA_TARIH);
      },
    },

    {
      title: "Hedef Tarihi",
      dataIndex: "PBM_HEDEF_TARIH",
      key: "PBM_HEDEF_TARIH",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text) => {
        return <span style={{ color: "white" }}>{formatDate(text)}</span>;
      },
      sorter: (a, b) => {
        if (a.PBM_HEDEF_TARIH === b.PBM_HEDEF_TARIH) return 0;
        if (a.PBM_HEDEF_TARIH === null || a.PBM_HEDEF_TARIH === undefined) return -1;
        if (b.PBM_HEDEF_TARIH === null || b.PBM_HEDEF_TARIH === undefined) return 1;
        return dayjs(a.PBM_HEDEF_TARIH).isBefore(dayjs(b.PBM_HEDEF_TARIH)) ? -1 : 1;
      },
      onCell: (record) => {
        const currentDate = dayjs();
        const targetDate = dayjs(record.PBM_HEDEF_TARIH);
        const backgroundColor = currentDate.isBefore(targetDate) ? "#048f32" : "#bc0808";
        return {
          style: {
            backgroundColor,
          },
        };
      },
    },

    {
      title: "Kalan Süre",
      dataIndex: "PBM_KALAN_SURE",
      key: "PBM_KALAN_SURE",
      width: 170,
      ellipsis: true,
      visible: true,

      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.PBM_KALAN_SURE - b.PBM_KALAN_SURE,
    },

    {
      title: "Kalan Süre %",
      dataIndex: "PBM_KALAN_SURE_ORAN",
      key: "PBM_KALAN_SURE_ORAN",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text) => <Progress percent={text} steps={8} />,
      sorter: (a, b) => a.PBM_KALAN_SURE_ORAN - b.PBM_KALAN_SURE_ORAN,
    },

    {
      title: "Güncel Sayaç Değeri ?",
      dataIndex: "MES_GUNCEL_DEGER",
      key: "MES_GUNCEL_DEGER",
      width: 170,
      ellipsis: true,
      visible: true,

      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.MES_GUNCEL_DEGER - b.MES_GUNCEL_DEGER,
    },

    {
      title: "Hedef Sayaç",
      dataIndex: "PBM_HEDEF_SAYAC",
      key: "PBM_HEDEF_SAYAC",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text) => {
        return <span style={{ color: "white" }}>{text}</span>;
      },
      sorter: (a, b) => a.PBM_HEDEF_SAYAC - b.PBM_HEDEF_SAYAC,
      onCell: (record) => {
        const kalanSayac = record.PBM_KALAN_SAYAC;
        if (kalanSayac > 0) {
          return {
            style: {
              backgroundColor: "#048f32",
            },
          };
        } else if (kalanSayac == 0) {
          return {
            style: {
              backgroundColor: "#bc0808",
            },
          };
        } else {
          return {};
        }
      },
    },

    {
      title: "Kalan Sayaç",
      dataIndex: "PBM_KALAN_SAYAC",
      key: "PBM_KALAN_SAYAC",
      width: 170,
      ellipsis: true,
      visible: true,

      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.PBM_KALAN_SAYAC - b.PBM_KALAN_SAYAC,
    },

    {
      title: "Kalan Sayaç %",
      dataIndex: "PBM_KALAN_SAYAC_ORAN",
      key: "PBM_KALAN_SAYAC_ORAN",
      width: 200,
      ellipsis: true,
      visible: true,
      render: (text) => <Progress percent={text} steps={8} />,
      sorter: (a, b) => a.PBM_KALAN_SAYAC_ORAN - b.PBM_KALAN_SAYAC_ORAN,
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
    fetchEquipmentData();
  }, []);

  // ana tablo api isteği için kullanılan useEffect son

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.get(`GetHatirlaticiYaklasanPBakim`);
      if (response) {
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_MAKINE_ID,
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

  const normalizeString = (str) => {
    if (str === null) {
      return "";
    }
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ğ/gim, "g")
      .replace(/ü/gim, "u")
      .replace(/ş/gim, "s")
      .replace(/ı/gim, "i")
      .replace(/ö/gim, "o")
      .replace(/ç/gim, "c");
  };

  useEffect(() => {
    const filtered = data.filter((item) => normalizeString(item.PBK_TANIM).includes(normalizeString(searchTerm)));
    setFilteredData(filtered);
  }, [searchTerm, data]);

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

  const onRowClick = (record, componentType) => {
    setDrawer({ visible: true, data: record, component: componentType });
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
    fetchEquipmentData();
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, []); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderYaklasanPeriyodikBakimlar");
    const savedVisibility = localStorage.getItem("columnVisibilityYaklasanPeriyodikBakimlar");
    const savedWidths = localStorage.getItem("columnWidthsYaklasanPeriyodikBakimlar");

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

    localStorage.setItem("columnOrderYaklasanPeriyodikBakimlar", JSON.stringify(order));
    localStorage.setItem("columnVisibilityYaklasanPeriyodikBakimlar", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsYaklasanPeriyodikBakimlar", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderYaklasanPeriyodikBakimlar", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem("columnVisibilityYaklasanPeriyodikBakimlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem("columnWidthsYaklasanPeriyodikBakimlar", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
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
    localStorage.removeItem("columnOrderYaklasanPeriyodikBakimlar");
    localStorage.removeItem("columnVisibilityYaklasanPeriyodikBakimlar");
    localStorage.removeItem("columnWidthsYaklasanPeriyodikBakimlar");
    localStorage.removeItem("ozelAlanlarYaklasanPeriyodikBakimlar");
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
        </div>
        <div style={{ display: "flex", gap: "10px" }}>{/*<ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />*/}</div>
      </div>
      <Spin spinning={loading}>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={filteredColumns}
          dataSource={searchTerm ? filteredData : data}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            showTotal: (total, range) => `Toplam ${total}`,
            showQuickJumper: true,
          }}
          scroll={{ y: "calc(100vh - 370px)" }}
        />
      </Spin>
      {drawer.component === "edit" && (
        <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
      )}

      {drawer.component === "makine" && (
        <MakineUpdate selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
      )}
    </>
  );
};

export default MainTable;
