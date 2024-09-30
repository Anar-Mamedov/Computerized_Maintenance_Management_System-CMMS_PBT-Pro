import React, { useCallback, useEffect, useState } from "react";
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
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

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
      title: "Periyodik Bakım Kodu",
      dataIndex: "PBK_KOD",
      key: "PBK_KOD",
      width: 150,
      ellipsis: true,
      visible: true,
      render: (text) => <a>{text}</a>,
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
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.PBK_TANIM === b.PBK_TANIM) return 0;
        if (a.PBK_TANIM === null || a.PBK_TANIM === undefined) return -1;
        if (b.PBK_TANIM === null || b.PBK_TANIM === undefined) return 1;
        return a.PBK_TANIM.localeCompare(b.PBK_TANIM);
      },
    },
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
      sorter: (a, b) => (a.PBK_AKTIF === b.PBK_AKTIF ? 0 : a.PBK_AKTIF ? -1 : 1),
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
      sorter: (a, b) => {
        if (a.PBK_TIP === b.PBK_TIP) return 0;
        if (a.PBK_TIP === null || a.PBK_TIP === undefined) return -1;
        if (b.PBK_TIP === null || b.PBK_TIP === undefined) return 1;
        return a.PBK_TIP.localeCompare(b.PBK_TIP);
      },
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
      sorter: (a, b) => {
        if (a.PBK_GRUP === b.PBK_GRUP) return 0;
        if (a.PBK_GRUP === null || a.PBK_GRUP === undefined) return -1;
        if (b.PBK_GRUP === null || b.PBK_GRUP === undefined) return 1;
        return a.PBK_GRUP.localeCompare(b.PBK_GRUP);
      },
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
      sorter: (a, b) => {
        if (a.PBK_ATOLYE === b.PBK_ATOLYE) return 0;
        if (a.PBK_ATOLYE === null || a.PBK_ATOLYE === undefined) return -1;
        if (b.PBK_ATOLYE === null || b.PBK_ATOLYE === undefined) return 1;
        return a.PBK_ATOLYE.localeCompare(b.PBK_ATOLYE);
      },
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
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => {
        if (a.PBK_LOKASYON === b.PBK_LOKASYON) return 0;
        if (a.PBK_LOKASYON === null || a.PBK_LOKASYON === undefined) return -1;
        if (b.PBK_LOKASYON === null || b.PBK_LOKASYON === undefined) return 1;
        return a.PBK_LOKASYON.localeCompare(b.PBK_LOKASYON);
      },
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
      sorter: (a, b) => {
        if (a.PBK_ONCELIK === b.PBK_ONCELIK) return 0;
        if (a.PBK_ONCELIK === null || a.PBK_ONCELIK === undefined) return -1;
        if (b.PBK_ONCELIK === null || b.PBK_ONCELIK === undefined) return 1;
        return a.PBK_ONCELIK.localeCompare(b.PBK_ONCELIK);
      },
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
      sorter: (a, b) => {
        if (a.PBK_TALIMAT === b.PBK_TALIMAT) return 0;
        if (a.PBK_TALIMAT === null || a.PBK_TALIMAT === undefined) return -1;
        if (b.PBK_TALIMAT === null || b.PBK_TALIMAT === undefined) return 1;
        return a.PBK_TALIMAT.localeCompare(b.PBK_TALIMAT);
      },
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
      sorter: (a, b) => a.PBK_CALISMA_SURE - b.PBK_CALISMA_SURE,
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
      sorter: (a, b) => a.PBK_DURUS_SURE - b.PBK_DURUS_SURE,
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
      sorter: (a, b) => a.PBK_PERSONEL_SAYI - b.PBK_PERSONEL_SAYI,
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_1 === b.PBK_OZEL_ALAN_1) return 0;
        if (a.PBK_OZEL_ALAN_1 === null || a.PBK_OZEL_ALAN_1 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_1 === null || b.PBK_OZEL_ALAN_1 === undefined) return 1;
        return a.PBK_OZEL_ALAN_1.localeCompare(b.PBK_OZEL_ALAN_1);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_2 === b.PBK_OZEL_ALAN_2) return 0;
        if (a.PBK_OZEL_ALAN_2 === null || a.PBK_OZEL_ALAN_2 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_2 === null || b.PBK_OZEL_ALAN_2 === undefined) return 1;
        return a.PBK_OZEL_ALAN_2.localeCompare(b.PBK_OZEL_ALAN_2);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_3 === b.PBK_OZEL_ALAN_3) return 0;
        if (a.PBK_OZEL_ALAN_3 === null || a.PBK_OZEL_ALAN_3 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_3 === null || b.PBK_OZEL_ALAN_3 === undefined) return 1;
        return a.PBK_OZEL_ALAN_3.localeCompare(b.PBK_OZEL_ALAN_3);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_4 === b.PBK_OZEL_ALAN_4) return 0;
        if (a.PBK_OZEL_ALAN_4 === null || a.PBK_OZEL_ALAN_4 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_4 === null || b.PBK_OZEL_ALAN_4 === undefined) return 1;
        return a.PBK_OZEL_ALAN_4.localeCompare(b.PBK_OZEL_ALAN_4);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_5 === b.PBK_OZEL_ALAN_5) return 0;
        if (a.PBK_OZEL_ALAN_5 === null || a.PBK_OZEL_ALAN_5 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_5 === null || b.PBK_OZEL_ALAN_5 === undefined) return 1;
        return a.PBK_OZEL_ALAN_5.localeCompare(b.PBK_OZEL_ALAN_5);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_6 === b.PBK_OZEL_ALAN_6) return 0;
        if (a.PBK_OZEL_ALAN_6 === null || a.PBK_OZEL_ALAN_6 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_6 === null || b.PBK_OZEL_ALAN_6 === undefined) return 1;
        return a.PBK_OZEL_ALAN_6.localeCompare(b.PBK_OZEL_ALAN_6);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_7 === b.PBK_OZEL_ALAN_7) return 0;
        if (a.PBK_OZEL_ALAN_7 === null || a.PBK_OZEL_ALAN_7 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_7 === null || b.PBK_OZEL_ALAN_7 === undefined) return 1;
        return a.PBK_OZEL_ALAN_7.localeCompare(b.PBK_OZEL_ALAN_7);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_8 === b.PBK_OZEL_ALAN_8) return 0;
        if (a.PBK_OZEL_ALAN_8 === null || a.PBK_OZEL_ALAN_8 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_8 === null || b.PBK_OZEL_ALAN_8 === undefined) return 1;
        return a.PBK_OZEL_ALAN_8.localeCompare(b.PBK_OZEL_ALAN_8);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_9 === b.PBK_OZEL_ALAN_9) return 0;
        if (a.PBK_OZEL_ALAN_9 === null || a.PBK_OZEL_ALAN_9 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_9 === null || b.PBK_OZEL_ALAN_9 === undefined) return 1;
        return a.PBK_OZEL_ALAN_9.localeCompare(b.PBK_OZEL_ALAN_9);
      },
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
      sorter: (a, b) => {
        if (a.PBK_OZEL_ALAN_10 === b.PBK_OZEL_ALAN_10) return 0;
        if (a.PBK_OZEL_ALAN_10 === null || a.PBK_OZEL_ALAN_10 === undefined) return -1;
        if (b.PBK_OZEL_ALAN_10 === null || b.PBK_OZEL_ALAN_10 === undefined) return 1;
        return a.PBK_OZEL_ALAN_10.localeCompare(b.PBK_OZEL_ALAN_10);
      },
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
      const response = await AxiosInstance.get(`PeriyodikBakimList`);
      if (response) {
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_ID,
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

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setDrawer({ visible: true, data: record });
      },
    };
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
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
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
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 370px)" }}
        />
      </Spin>
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
    </>
  );
};

export default MainTable;
