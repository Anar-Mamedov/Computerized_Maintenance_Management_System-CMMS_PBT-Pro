import React, { useCallback, useEffect, useState, isValidElement } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Popover } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
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
import TeknisyenSubmit from "../components/IsEmrineCevir/Teknisyen/TeknisyenSubmit";
import AtolyeSubmit from "../components/IsEmrineCevir/Atolye/AtolyeSubmit";
import EditDrawer1 from "../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { t } from "i18next";
import { SiMicrosoftexcel } from "react-icons/si";
import * as XLSX from "xlsx";

const { Text } = Typography;

// Function to extract text from React elements
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı için state
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için
  const [totalDataCount, setTotalDataCount] = useState(0); // Tüm veriyi tutan state
  const [pageSize, setPageSize] = useState(20); // Başlangıçta sayfa başına 20 kayıt göster
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);
  const [onayCheck, setOnayCheck] = useState(false);

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const [selectedRows, setSelectedRows] = useState([]);
  const [assignPopoverOpen, setAssignPopoverOpen] = useState(false);
  const [xlsxLoading, setXlsxLoading] = useState(false);

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
      case 6:
        return { color: "#ff5e00", text: "Onay Bekliyor" };
      case 7:
        return { color: "#00d300", text: "Onaylandı" };
      case 8:
        return { color: "#d10000", text: "Onaylanmadı" };
      default:
        return { color: "default", text: "" }; // Eğer farklı bir değer gelirse
    }
  };

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
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.post(`GetOnayCheck?TB_ONAY_ID=2`); // API URL'niz
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

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        localStorage.setItem("ozelAlanlarIsTalep", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlarIsTalep = JSON.parse(localStorage.getItem("ozelAlanlarIsTalep"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "Talep Kodu",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 120,
      ellipsis: true,
      visible: true,
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => (a.IST_KOD || "").localeCompare(b.IST_KOD || ""),
    },
    {
      title: "Tarih",
      dataIndex: "IST_ACILIS_TARIHI",
      key: "IST_ACILIS_TARIHI",
      width: 110,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      render: (text) => formatDate(text),
      sorter: (a, b) => (a.IST_ACILIS_TARIHI || "").localeCompare(b.IST_ACILIS_TARIHI || ""),
    },
    {
      title: "Saat",
      dataIndex: "IST_ACILIS_SAATI",
      key: "IST_ACILIS_SAATI",
      width: 90,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      render: (text) => formatTime(text),
      sorter: (a, b) => (a.IST_ACILIS_SAATI || "").localeCompare(b.IST_ACILIS_SAATI || ""),
    },
    {
      title: "Konu",
      dataIndex: "IST_TANIMI",
      key: "IST_TANIMI",
      width: 300,
      ellipsis: true,
      visible: true,
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => (a.IST_TANIMI || "").localeCompare(b.IST_TANIMI || ""),
    },
    {
      title: "Talep Eden",
      dataIndex: "IST_TALEP_EDEN_ADI",
      key: "IST_TALEP_EDEN_ADI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      sorter: (a, b) => (a.IST_TALEP_EDEN_ADI || "").localeCompare(b.IST_TALEP_EDEN_ADI || ""),
    },
    {
      title: "Durum",
      dataIndex: "IST_DURUM_ID",
      key: "IST_DURUM_ID",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      render: (_, record) => {
        const { color, text } = statusTag(record.IST_DURUM_ID);
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Tag
              style={{
                textAlign: "center",
                backgroundColor: hexToRGBA(color, 0.2),
                border: `1.2px solid ${hexToRGBA(color, 0.7)}`,
                color: color,
              }}
            >
              {text}
            </Tag>
          </div>
        );
      },
      sorter: (a, b) => (a.IST_DURUM_ID || 0) - (b.IST_DURUM_ID || 0),
    },
    {
      title: t("kullaniciDurumu"),
      dataIndex: "IST_KULLANICI_ONAY_DURUM",
      key: "IST_KULLANICI_ONAY_DURUM",
      width: 150,
      ellipsis: true,
      visible: true,
      render: (text) => {
        let tagStyle = {};
        let tagText = t(text);

        switch (text) {
          case "Bekliyor":
            tagStyle = {
              color: "#ff6a00",
              backgroundColor: "rgba(255, 106, 0, 0.1)",
              border: "1.2px solid #ff6a00",
            };
            break;
          case "onaylandi":
            tagStyle = {
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.1)",
              border: "1.2px solid green",
            };
            break;
          case "reddedildi":
            tagStyle = {
              color: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              border: "1.2px solid red",
            };
            break;
          default:
            tagStyle = {};
        }

        return <Tag style={tagStyle}>{tagText}</Tag>;
      },
      sorter: (a, b) => (a.IST_KULLANICI_ONAY_DURUM || "").localeCompare(b.IST_KULLANICI_ONAY_DURUM || ""),
    },
    {
      title: t("kullaniciAciklama"),
      dataIndex: "IST_RED_ACIKLAMA",
      key: "IST_RED_ACIKLAMA",
      width: 200,
      ellipsis: true,
      visible: true,
      sorter: (a, b) => (a.IST_RED_ACIKLAMA || "").localeCompare(b.IST_RED_ACIKLAMA || ""),
    },
    {
      title: "Makine Tanım",
      dataIndex: "IST_MAKINE_TANIM",
      key: "IST_MAKINE_TANIM",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      sorter: (a, b) => (a.IST_MAKINE_TANIM || "").localeCompare(b.IST_MAKINE_TANIM || ""),
    },
    {
      title: "İş Kategorisi",
      dataIndex: "IST_KATEGORI_TANIMI",
      key: "IST_KATEGORI_TANIMI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_KATEGORI_TANIMI || "").localeCompare(b.IST_KATEGORI_TANIMI || ""),
    },
    {
      title: "Öncelik",
      dataIndex: "IST_ONCELIK",
      key: "IST_ONCELIK",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      sorter: (a, b) => (a.IST_ONCELIK || "").localeCompare(b.IST_ONCELIK || ""),
    },
    {
      title: "Lokasyon",
      dataIndex: "IST_BILDIREN_LOKASYON",
      key: "IST_BILDIREN_LOKASYON",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      sorter: (a, b) => (a.IST_BILDIREN_LOKASYON || "").localeCompare(b.IST_BILDIREN_LOKASYON || ""),
    },
    {
      title: "İşlem Süresi",
      dataIndex: "ISLEM_SURE",
      key: "ISLEM_SURE",
      width: 300,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true,
      render: (text, record) => {
        let baslangicTarihi, bitisTarihi;
        baslangicTarihi = dayjs(record.IST_ACILIS_TARIHI.split("T")[0] + "T" + record.IST_ACILIS_SAATI, "YYYY-MM-DDTHH:mm:ss");
        if (record.IST_DURUM_ID !== 4) {
          bitisTarihi = dayjs();
        } else {
          if (record.IST_KAPAMA_TARIHI && record.IST_KAPAMA_SAATI) {
            bitisTarihi = dayjs(record.IST_KAPAMA_TARIHI.split("T")[0] + "T" + record.IST_KAPAMA_SAATI, "YYYY-MM-DDTHH:mm:ss");
          } else {
            return "";
          }
        }
        const fark = bitisTarihi.diff(baslangicTarihi);
        const farkSaniye = Math.floor(fark / 1000);
        const farkDakika = Math.floor(farkSaniye / 60);
        const farkSaat = Math.floor(farkDakika / 60);
        const farkGun = Math.floor(farkSaat / 24);
        return `${farkGun > 0 ? farkGun + " gün " : ""}${farkSaat % 24 > 0 ? (farkSaat % 24) + " saat " : ""}${farkDakika % 60 > 0 ? (farkDakika % 60) + " dakika " : ""}`;
      },
      sorter: (a, b) => (a.ISLEM_SURE || "").localeCompare(b.ISLEM_SURE || ""),
    },
    {
      title: "Kapanma Tarih",
      dataIndex: "IST_KAPAMA_TARIHI",
      key: "IST_KAPAMA_TARIHI",
      width: 110,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatDate(text),
      sorter: (a, b) => (a.IST_KAPAMA_TARIHI || "").localeCompare(b.IST_KAPAMA_TARIHI || ""),
    },
    {
      title: "Kapanma Saat",
      dataIndex: "IST_KAPAMA_SAATI",
      key: "IST_KAPAMA_SAATI",
      width: 90,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatTime(text),
      sorter: (a, b) => (a.IST_KAPAMA_SAATI || "").localeCompare(b.IST_KAPAMA_SAATI || ""),
    },
    {
      title: "İptal Tarih",
      dataIndex: "IST_IPTAL_TARIH",
      key: "IST_IPTAL_TARIH",
      width: 110,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatDate(text),
      sorter: (a, b) => (a.IST_IPTAL_TARIH || "").localeCompare(b.IST_IPTAL_TARIH || ""),
    },
    {
      title: "İptal Saat",
      dataIndex: "IST_IPTAL_SAAT",
      key: "IST_IPTAL_SAAT",
      width: 90,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatTime(text),
      sorter: (a, b) => (a.IST_IPTAL_SAAT || "").localeCompare(b.IST_IPTAL_SAAT || ""),
    },
    {
      title: "Müdahele Gecikme Süresi",
      dataIndex: "mudaheleGecikmeSuresi",
      key: "mudaheleGecikmeSuresi",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.mudaheleGecikmeSuresi || "").localeCompare(b.mudaheleGecikmeSuresi || ""),
    },
    {
      title: "Durum Açıklaması",
      dataIndex: "durumAciklamasi",
      key: "durumAciklamasi",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.durumAciklamasi || "").localeCompare(b.durumAciklamasi || ""),
    },
    {
      title: "Planlanan Başlama Tarihi",
      dataIndex: "IST_PLANLANAN_BASLAMA_TARIHI",
      key: "IST_PLANLANAN_BASLAMA_TARIHI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatDate(text),
      sorter: (a, b) => (a.IST_PLANLANAN_BASLAMA_TARIHI || "").localeCompare(b.IST_PLANLANAN_BASLAMA_TARIHI || ""),
    },
    {
      title: "Planlanan Başlama Saati",
      dataIndex: "IST_PLANLANAN_BASLAMA_SAATI",
      key: "IST_PLANLANAN_BASLAMA_SAATI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatTime(text),
      sorter: (a, b) => (a.IST_PLANLANAN_BASLAMA_SAATI || "").localeCompare(b.IST_PLANLANAN_BASLAMA_SAATI || ""),
    },
    {
      title: "Planlanan Bitiş Tarihi",
      dataIndex: "IST_PLANLANAN_BITIS_TARIHI",
      key: "IST_PLANLANAN_BITIS_TARIHI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatDate(text),
      sorter: (a, b) => (a.IST_PLANLANAN_BITIS_TARIHI || "").localeCompare(b.IST_PLANLANAN_BITIS_TARIHI || ""),
    },
    {
      title: "Planlanan Bitiş Saati",
      dataIndex: "IST_PLANLANAN_BITIS_SAATI",
      key: "IST_PLANLANAN_BITIS_SAATI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      render: (text) => formatTime(text),
      sorter: (a, b) => (a.IST_PLANLANAN_BITIS_SAATI || "").localeCompare(b.IST_PLANLANAN_BITIS_SAATI || ""),
    },
    {
      title: "İş Emri No",
      dataIndex: "IST_ISEMRI_NO",
      key: "IST_ISEMRI_NO",
      width: 150,
      ellipsis: true,
      onCell: (record) => ({
        onClick: (event) => {
          event.stopPropagation();
          const updatedRecord = { ...record, key: record.IST_ISEMRI_ID };
          setEditDrawer1Data(updatedRecord);
          setEditDrawer1Visible(true);
        },
      }),
      render: (text) => <a>{text}</a>,
      visible: true,
      sorter: (a, b) => (a.IST_ISEMRI_NO || "").localeCompare(b.IST_ISEMRI_NO || ""),
    },
    {
      title: "Teknisyen",
      dataIndex: "IST_TEKNISYEN_TANIM",
      key: "IST_TEKNISYEN_TANIM",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_TEKNISYEN_TANIM || "").localeCompare(b.IST_TEKNISYEN_TANIM || ""),
    },
    {
      title: "Atölye",
      dataIndex: "IST_ATOLYE_TANIM",
      key: "IST_ATOLYE_TANIM",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_ATOLYE_TANIM || "").localeCompare(b.IST_ATOLYE_TANIM || ""),
    },
    {
      title: "Makine Kodu",
      dataIndex: "IST_MAKINE_KOD",
      key: "IST_MAKINE_KOD",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_MAKINE_KOD || "").localeCompare(b.IST_MAKINE_KOD || ""),
    },
    {
      title: "Bildirim Tipi",
      dataIndex: "IST_TIP_TANIM",
      key: "IST_TIP_TANIM",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_TIP_TANIM || "").localeCompare(b.IST_TIP_TANIM || ""),
    },
    {
      title: "İlgili Kişi",
      dataIndex: "IST_TAKIP_EDEN_ADI",
      key: "IST_TAKIP_EDEN_ADI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_TAKIP_EDEN_ADI || "").localeCompare(b.IST_TAKIP_EDEN_ADI || ""),
    },
    {
      title: "Bildirilen Bina",
      dataIndex: "IST_BINA",
      key: "IST_BINA",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_BINA || "").localeCompare(b.IST_BINA || ""),
    },
    {
      title: "Bildirilen Kat",
      dataIndex: "IST_KAT",
      key: "IST_KAT",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_KAT || "").localeCompare(b.IST_KAT || ""),
    },
    {
      title: "Servis Nedeni",
      dataIndex: "IST_SERVIS_NEDENI",
      key: "IST_SERVIS_NEDENI",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_SERVIS_NEDENI || "").localeCompare(b.IST_SERVIS_NEDENI || ""),
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
      visible: false,
      sorter: (a, b) => (a.IST_BILDIREN_LOKASYON_TUM || "").localeCompare(b.IST_BILDIREN_LOKASYON_TUM || ""),
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
      }),
      width: 300,
      sorter: (a, b) => {
        if (a.IST_BILDIREN_LOKASYON_TUM && b.IST_BILDIREN_LOKASYON_TUM) {
          return a.IST_BILDIREN_LOKASYON_TUM.localeCompare(b.IST_BILDIREN_LOKASYON_TUM);
        }
        if (!a.IST_BILDIREN_LOKASYON_TUM && !b.IST_BILDIREN_LOKASYON_TUM) {
          return 0;
        }
        return a.IST_BILDIREN_LOKASYON_TUM ? 1 : -1;
      },
      render: (text) => {
        if (text === null) {
          return null;
        }
        const parts = text.split("/");
        return parts.length > 1 ? parts[0] : text;
      },
      visible: false,
    },
    {
      title: "Talep Değerlendirme Puan",
      dataIndex: "IST_DEGERLENDIRME_PUAN",
      key: "IST_DEGERLENDIRME_PUAN",
      width: 150,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_DEGERLENDIRME_PUAN || "").localeCompare(b.IST_DEGERLENDIRME_PUAN || ""),
    },
    {
      title: "Talep Değerlendirme Açıklama",
      dataIndex: "IST_DEGERLENDIRME_ACIKLAMA",
      key: "IST_DEGERLENDIRME_ACIKLAMA",
      width: 250,
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false,
      sorter: (a, b) => (a.IST_DEGERLENDIRME_ACIKLAMA || "").localeCompare(b.IST_DEGERLENDIRME_ACIKLAMA || ""),
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
      const response = await AxiosInstance.post(`GetIsTalepFullList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`, filters);
      if (response) {
        if (response.status_code === 401) {
          message.error(t("buSayfayaErisimYetkinizBulunmamaktadir"));
          return;
        }
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.is_talep_listesi.map((item) => ({
          ...item,
          key: item.TB_IS_TALEP_ID,
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

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderIsTalep");
    const savedVisibility = localStorage.getItem("columnVisibilityIsTalep");
    const savedWidths = localStorage.getItem("columnWidthsIsTalep");

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

    localStorage.setItem("columnOrderIsTalep", JSON.stringify(order));
    localStorage.setItem("columnVisibilityIsTalep", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsIsTalep", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderIsTalep", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem("columnVisibilityIsTalep", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})));
    localStorage.setItem("columnWidthsIsTalep", JSON.stringify(columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})));
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
    localStorage.removeItem("columnOrderIsTalep");
    localStorage.removeItem("columnVisibilityIsTalep");
    localStorage.removeItem("columnWidthsIsTalep");
    localStorage.removeItem("ozelAlanlarIsTalep");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  // Function to handle XLSX download
  const handleDownloadXLSX = async () => {
    try {
      setXlsxLoading(true);

      const { keyword = "", filters = {} } = body || {};
      const response = await AxiosInstance.post(`GetIsTalepFullListWithExcel?parametre=${keyword}`, filters);
      if (response) {
        const list = Array.isArray(response) ? response : Array.isArray(response?.is_talep_listesi) ? response.is_talep_listesi : [];

        if (!Array.isArray(list) || list.length === 0) {
          console.error("Excel için beklenmeyen API yanıtı: is_talep_listesi dizi değil veya boş", response);
          message.error("Excel verisi bulunamadı veya beklenmeyen yanıt alındı.");
          setXlsxLoading(false);
          return;
        }

        const xlsxData = list.map((row) => {
          let xlsxRow = {};
          filteredColumns.forEach((col) => {
            const key = col.dataIndex;
            if (key) {
              let value = row[key];

              if (col.render) {
                if (key.endsWith("_TARIH") || key.endsWith("_TARIHI")) {
                  value = formatDate(value);
                } else if (key.endsWith("_SAAT") || key.endsWith("_SAATI")) {
                  value = formatTime(value);
                } else if (key === "IST_DURUM_ID") {
                  const { text } = statusTag(row.IST_DURUM_ID);
                  value = text;
                } else if (key === "ISLEM_SURE") {
                  let baslangicTarihi = null;
                  let bitisTarihi = null;
                  if (row.IST_ACILIS_TARIHI && row.IST_ACILIS_SAATI) {
                    baslangicTarihi = dayjs(row.IST_ACILIS_TARIHI.split("T")[0] + "T" + row.IST_ACILIS_SAATI, "YYYY-MM-DDTHH:mm:ss");
                  }
                  if (row.IST_DURUM_ID !== 4) {
                    bitisTarihi = dayjs();
                  } else if (row.IST_KAPAMA_TARIHI && row.IST_KAPAMA_SAATI) {
                    bitisTarihi = dayjs(row.IST_KAPAMA_TARIHI.split("T")[0] + "T" + row.IST_KAPAMA_SAATI, "YYYY-MM-DDTHH:mm:ss");
                  }
                  if (baslangicTarihi && bitisTarihi) {
                    const fark = bitisTarihi.diff(baslangicTarihi);
                    const farkSaniye = Math.floor(fark / 1000);
                    const farkDakika = Math.floor(farkSaniye / 60);
                    const farkSaat = Math.floor(farkDakika / 60);
                    const farkGun = Math.floor(farkSaat / 24);
                    value = `${farkGun > 0 ? farkGun + " gün " : ""}${farkSaat % 24 > 0 ? (farkSaat % 24) + " saat " : ""}${
                      farkDakika % 60 > 0 ? (farkDakika % 60) + " dakika " : ""
                    }`;
                  } else {
                    value = "";
                  }
                } else if (key === "IST_KULLANICI_ONAY_DURUM") {
                  value = t(row.IST_KULLANICI_ONAY_DURUM);
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
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const headers = filteredColumns
          .map((col) => {
            const label = extractTextFromElement(col.title);
            return { label, key: col.dataIndex, width: col.width };
          })
          .filter((col) => col.key);

        const scalingFactor = 0.8;
        worksheet["!cols"] = headers.map((header) => ({
          wpx: header.width ? header.width * scalingFactor : 100,
        }));

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "is_talepleri.xlsx");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setXlsxLoading(false);
      } else {
        console.error("API yanıtı beklenen formatta değil");
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
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
        `}
      </style>
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
          <Filters onChange={handleBodyChange} />
          <Popover
            content={
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "360px" }}>
                <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} onayCheck={onayCheck} />
                <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} onayCheck={onayCheck} />
              </div>
            }
            trigger="click"
            open={assignPopoverOpen}
            onOpenChange={setAssignPopoverOpen}
            placement="bottomLeft"
          >
            <Button>{t("isEmrineCevir")}</Button>
          </Popover>
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
            defaultPageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            onChange: handleTableChange,
            showTotal: (total, range) => `Toplam ${total}`, // Burada 'total' parametresi doğru kayıt sayısını yansıtacaktır
            showQuickJumper: true,
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 370px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
        />
      </Spin>
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />

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
