import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Divider } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined, HomeOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import dayjs from "dayjs";

import { t } from "i18next";

const { Text } = Typography;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 8px;
  height: 32px !important;
`;

const CustomSpin = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #0091ff !important; /* Blue color */
  }
`;

const CustomTable = styled(Table)`
  .ant-pagination-item-ellipsis {
    display: flex !important;
  }
`;

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

const Sigorta = ({ onRowSelect, isSelectionMode = false, islemTip = null, deposuID = null }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  let setValue;

  try {
    const formContext = useFormContext();
    setValue = formContext?.setValue;
  } catch (error) {
    // Form context yoksa setValue null olacak
    setValue = null;
  }
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // Toplam sayfa sayısı için state
  const [label, setLabel] = useState("Yükleniyor..."); // Başlangıç değeri özel alanlar için
  const [totalDataCount, setTotalDataCount] = useState(0); // Tüm veriyi tutan state
  const [pageSize, setPageSize] = useState(10); // Başlangıçta sayfa başına 10 kayıt göster
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);

  // edit drawer için
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  // edit drawer için son

  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowsMapRef = useRef(new Map());

  const statusTag = (statusId) => {
    switch (statusId) {
      case 1:
        return { color: "#ff9800", text: "Bekliyor" };
      case 2:
        return { color: "#2196f3", text: "Devam Ediyor" };
      case 3:
        return { color: "#ff0000", text: "İptal Edildi" };
      case 4:
        return { color: "#2bc770", text: "Tamamlandı" };
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
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=stok"); // API URL'niz
        localStorage.setItem("ozelAlanlarMalzemeTanimlari", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlar = JSON.parse(localStorage.getItem("ozelAlanlarMalzemeTanimlari"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: t("malzemeKodu"),
      dataIndex: "STK_KOD",
      key: "STK_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.STK_KOD === null) return -1;
        if (b.STK_KOD === null) return 1;
        return a.STK_KOD.localeCompare(b.STK_KOD);
      },
    },

    {
      title: t("malzemeTanimi"),
      dataIndex: "STK_TANIM",
      key: "STK_TANIM",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_TANIM === null) return -1;
        if (b.STK_TANIM === null) return 1;
        return a.STK_TANIM.localeCompare(b.STK_TANIM);
      },
    },
    {
      title: t("ureticiKodu"),
      dataIndex: "STK_URETICI_KOD",
      key: "STK_URETICI_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_URETICI_KOD === null) return -1;
        if (b.STK_URETICI_KOD === null) return 1;
        return a.STK_URETICI_KOD.localeCompare(b.STK_URETICI_KOD);
      },
    },
    {
      title: t("aktif"),
      dataIndex: "STK_AKTIF",
      key: "STK_AKTIF",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_AKTIF === null) return -1;
        if (b.STK_AKTIF === null) return 1;
        return a.STK_AKTIF === b.STK_AKTIF ? 0 : a.STK_AKTIF ? -1 : 1;
      },
      render: (text, record) => {
        return record.STK_AKTIF ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />;
      },
    },
    {
      title: t("tip"),
      dataIndex: "STK_TIP",
      key: "STK_TIP",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_TIP === null) return -1;
        if (b.STK_TIP === null) return 1;
        return a.STK_TIP.localeCompare(b.STK_TIP);
      },
    },
    {
      title: t("birim"),
      dataIndex: "STK_TIP",
      key: "STK_TIP",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_TIP === null) return -1;
        if (b.STK_TIP === null) return 1;
        return a.STK_TIP.localeCompare(b.STK_TIP);
      },
    },
    {
      title: t("girenMiktar"),
      dataIndex: "STK_GIREN_MIKTAR",
      key: "STK_GIREN_MIKTAR",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_GIREN_MIKTAR === null) return -1;
        if (b.STK_GIREN_MIKTAR === null) return 1;
        return a.STK_GIREN_MIKTAR.localeCompare(b.STK_GIREN_MIKTAR);
      },
    },
    {
      title: t("cikanMiktar"),
      dataIndex: "STK_CIKAN_MIKTAR",
      key: "STK_CIKAN_MIKTAR",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_CIKAN_MIKTAR === null) return -1;
        if (b.STK_CIKAN_MIKTAR === null) return 1;
        return a.STK_CIKAN_MIKTAR.localeCompare(b.STK_CIKAN_MIKTAR);
      },
    },
    {
      title: t("stokMiktar"),
      dataIndex: "STK_MIKTAR",
      key: "STK_MIKTAR",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MIKTAR === null) return -1;
        if (b.STK_MIKTAR === null) return 1;
        return a.STK_MIKTAR.localeCompare(b.STK_MIKTAR);
      },
    },
    {
      title: t("grup"),
      dataIndex: "STK_GRUP",
      key: "STK_GRUP",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_GRUP === null) return -1;
        if (b.STK_GRUP === null) return 1;
        return a.STK_GRUP.localeCompare(b.STK_GRUP);
      },
    },
    {
      title: t("lokasyon"),
      dataIndex: "STK_LOKASYON",
      key: "STK_LOKASYON",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_LOKASYON === null) return -1;
        if (b.STK_LOKASYON === null) return 1;
        return a.STK_LOKASYON.localeCompare(b.STK_LOKASYON);
      },
    },
    {
      title: t("marka"),
      dataIndex: "STK_MARKA",
      key: "STK_MARKA",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MARKA === null) return -1;
        if (b.STK_MARKA === null) return 1;
        return a.STK_MARKA.localeCompare(b.STK_MARKA);
      },
    },
    {
      title: t("model"),
      dataIndex: "STK_MODEL",
      key: "STK_MODEL",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MODEL === null) return -1;
        if (b.STK_MODEL === null) return 1;
        return a.STK_MODEL.localeCompare(b.STK_MODEL);
      },
    },
    {
      title: t("malzemeSinifi"),
      dataIndex: "STK_SINIF",
      key: "STK_SINIF",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_SINIF === null) return -1;
        if (b.STK_SINIF === null) return 1;
        return a.STK_SINIF.localeCompare(b.STK_SINIF);
      },
    },
    {
      title: t("masrafMerkezi"),
      dataIndex: "STK_MASRAFMERKEZ",
      key: "STK_MASRAFMERKEZ",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MASRAFMERKEZ === null) return -1;
        if (b.STK_MASRAFMERKEZ === null) return 1;
        return a.STK_MASRAFMERKEZ.localeCompare(b.STK_MASRAFMERKEZ);
      },
    },
    {
      title: t("yedekParca"),
      dataIndex: "STK_YEDEK_PARCA",
      key: "STK_YEDEK_PARCA",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_YEDEK_PARCA === null) return -1;
        if (b.STK_YEDEK_PARCA === null) return 1;
        return a.STK_YEDEK_PARCA === b.STK_YEDEK_PARCA ? 0 : a.STK_YEDEK_PARCA ? -1 : 1;
      },
      render: (text, record) => {
        return record.STK_YEDEK_PARCA ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />;
      },
    },
    {
      title: t("sarfMalzeme"),
      dataIndex: "STK_SARF_MALZEME",
      key: "STK_SARF_MALZEME",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_SARF_MALZEME === null) return -1;
        if (b.STK_SARF_MALZEME === null) return 1;
        return a.STK_SARF_MALZEME === b.STK_SARF_MALZEME ? 0 : a.STK_SARF_MALZEME ? -1 : 1;
      },
      render: (text, record) => {
        return record.STK_SARF_MALZEME ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />;
      },
    },
    {
      title: t("stoksuzMalzeme"),
      dataIndex: "STK_STOKSUZ_MALZEME",
      key: "STK_STOKSUZ_MALZEME",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_STOKSUZ_MALZEME === null) return -1;
        if (b.STK_STOKSUZ_MALZEME === null) return 1;
        return a.STK_STOKSUZ_MALZEME === b.STK_STOKSUZ_MALZEME ? 0 : a.STK_STOKSUZ_MALZEME ? -1 : 1;
      },
      render: (text, record) => {
        return record.STK_STOKSUZ_MALZEME ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />;
      },
    },
    {
      title: t("kritikMalzeme"),
      dataIndex: "STK_KRITIK_MALZEME",
      key: "STK_KRITIK_MALZEME",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_KRITIK_MALZEME === null) return -1;
        if (b.STK_KRITIK_MALZEME === null) return 1;
        return a.STK_KRITIK_MALZEME === b.STK_KRITIK_MALZEME ? 0 : a.STK_KRITIK_MALZEME ? -1 : 1;
      },
      render: (text, record) => {
        return record.STK_KRITIK_MALZEME ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />;
      },
    },
    {
      title: t("tehlikeSinifi"),
      dataIndex: "STK_TEHLIKE_SINIF",
      key: "STK_TEHLIKE_SINIF",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_TEHLIKE_SINIF === null) return -1;
        if (b.STK_TEHLIKE_SINIF === null) return 1;
        return a.STK_TEHLIKE_SINIF.localeCompare(b.STK_TEHLIKE_SINIF);
      },
    },
    {
      title: t("girisFiyati"),
      dataIndex: "STK_GIRIS_FIYAT_DEGERI",
      key: "STK_GIRIS_FIYAT_DEGERI",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_GIRIS_FIYAT_DEGERI === null) return -1;
        if (b.STK_GIRIS_FIYAT_DEGERI === null) return 1;
        return a.STK_GIRIS_FIYAT_DEGERI.localeCompare(b.STK_GIRIS_FIYAT_DEGERI);
      },
    },
    {
      title: t("cikisFiyati"),
      dataIndex: "STK_CIKIS_FIYAT_DEGERI",
      key: "STK_CIKIS_FIYAT_DEGERI",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_CIKIS_FIYAT_DEGERI === null) return -1;
        if (b.STK_CIKIS_FIYAT_DEGERI === null) return 1;
        return a.STK_CIKIS_FIYAT_DEGERI.localeCompare(b.STK_CIKIS_FIYAT_DEGERI);
      },
    },
    {
      title: t("kdvOrani"),
      dataIndex: "STK_KDV_ORAN",
      key: "STK_KDV_ORAN",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_KDV_ORAN === null) return -1;
        if (b.STK_KDV_ORAN === null) return 1;
        return a.STK_KDV_ORAN.localeCompare(b.STK_KDV_ORAN);
      },
    },
    {
      title: t("otvOrani"),
      dataIndex: "STK_OTV_ORAN",
      key: "STK_OTV_ORAN",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_OTV_ORAN === null) return -1;
        if (b.STK_OTV_ORAN === null) return 1;
        return a.STK_OTV_ORAN.localeCompare(b.STK_OTV_ORAN);
      },
    },
    {
      title: t("minStokMiktari"),
      dataIndex: "STK_MIN_MIKTAR",
      key: "STK_MIN_MIKTAR",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MIN_MIKTAR === null) return -1;
        if (b.STK_MIN_MIKTAR === null) return 1;
        return a.STK_MIN_MIKTAR.localeCompare(b.STK_MIN_MIKTAR);
      },
    },
    {
      title: t("maxStokMiktari"),
      dataIndex: "STK_MAX_MIKTAR",
      key: "STK_MAX_MIKTAR",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_MAX_MIKTAR === null) return -1;
        if (b.STK_MAX_MIKTAR === null) return 1;
        return a.STK_MAX_MIKTAR.localeCompare(b.STK_MAX_MIKTAR);
      },
    },
    {
      title: t("siparisMiktari"),
      dataIndex: "STK_SIPARIS_MIKTARI",
      key: "STK_SIPARIS_MIKTARI",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.STK_SIPARIS_MIKTARI === null) return -1;
        if (b.STK_SIPARIS_MIKTARI === null) return 1;
        return a.STK_SIPARIS_MIKTARI.localeCompare(b.STK_SIPARIS_MIKTARI);
      },
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_1 ? ozelAlanlar.OZL_OZEL_ALAN_1 : label && label.OZL_OZEL_ALAN_1}</div>,
      dataIndex: "STK_OZEL_ALAN_1",
      key: "STK_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_2 ? ozelAlanlar.OZL_OZEL_ALAN_2 : label && label.OZL_OZEL_ALAN_2}</div>,
      dataIndex: "STK_OZEL_ALAN_2",
      key: "STK_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_3 ? ozelAlanlar.OZL_OZEL_ALAN_3 : label && label.OZL_OZEL_ALAN_3}</div>,
      dataIndex: "STK_OZEL_ALAN_3",
      key: "STK_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_4 ? ozelAlanlar.OZL_OZEL_ALAN_4 : label && label.OZL_OZEL_ALAN_4}</div>,
      dataIndex: "STK_OZEL_ALAN_4",
      key: "STK_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_5 ? ozelAlanlar.OZL_OZEL_ALAN_5 : label && label.OZL_OZEL_ALAN_5}</div>,
      dataIndex: "STK_OZEL_ALAN_5",
      key: "STK_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_6 ? ozelAlanlar.OZL_OZEL_ALAN_6 : label && label.OZL_OZEL_ALAN_6}</div>,
      dataIndex: "STK_OZEL_ALAN_6",
      key: "STK_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_7 ? ozelAlanlar.OZL_OZEL_ALAN_7 : label && label.OZL_OZEL_ALAN_7}</div>,
      dataIndex: "STK_OZEL_ALAN_7",
      key: "STK_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_8 ? ozelAlanlar.OZL_OZEL_ALAN_8 : label && label.OZL_OZEL_ALAN_8}</div>,
      dataIndex: "STK_OZEL_ALAN_8",
      key: "STK_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_9 ? ozelAlanlar.OZL_OZEL_ALAN_9 : label && label.OZL_OZEL_ALAN_9}</div>,
      dataIndex: "STK_OZEL_ALAN_9",
      key: "STK_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_10 ? ozelAlanlar.OZL_OZEL_ALAN_10 : label && label.OZL_OZEL_ALAN_10}</div>,
      dataIndex: "STK_OZEL_ALAN_10",
      key: "STK_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_11 ? ozelAlanlar.OZL_OZEL_ALAN_11 : label && label.OZL_OZEL_ALAN_11}</div>,
      dataIndex: "STK_OZEL_ALAN_11",
      key: "STK_OZEL_ALAN_11",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_12 ? ozelAlanlar.OZL_OZEL_ALAN_12 : label && label.OZL_OZEL_ALAN_12}</div>,
      dataIndex: "STK_OZEL_ALAN_12",
      key: "STK_OZEL_ALAN_12",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_13 ? ozelAlanlar.OZL_OZEL_ALAN_13 : label && label.OZL_OZEL_ALAN_13}</div>,
      dataIndex: "STK_OZEL_ALAN_13",
      key: "STK_OZEL_ALAN_13",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_14 ? ozelAlanlar.OZL_OZEL_ALAN_14 : label && label.OZL_OZEL_ALAN_14}</div>,
      dataIndex: "STK_OZEL_ALAN_14",
      key: "STK_OZEL_ALAN_14",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_15 ? ozelAlanlar.OZL_OZEL_ALAN_15 : label && label.OZL_OZEL_ALAN_15}</div>,
      dataIndex: "STK_OZEL_ALAN_15",
      key: "STK_OZEL_ALAN_15",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_16 ? ozelAlanlar.OZL_OZEL_ALAN_16 : label && label.OZL_OZEL_ALAN_16}</div>,
      dataIndex: "STK_OZEL_ALAN_16",
      key: "STK_OZEL_ALAN_16",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_17 ? ozelAlanlar.OZL_OZEL_ALAN_17 : label && label.OZL_OZEL_ALAN_17}</div>,
      dataIndex: "STK_OZEL_ALAN_17",
      key: "STK_OZEL_ALAN_17",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_18 ? ozelAlanlar.OZL_OZEL_ALAN_18 : label && label.OZL_OZEL_ALAN_18}</div>,
      dataIndex: "STK_OZEL_ALAN_18",
      key: "STK_OZEL_ALAN_18",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_19 ? ozelAlanlar.OZL_OZEL_ALAN_19 : label && label.OZL_OZEL_ALAN_19}</div>,
      dataIndex: "STK_OZEL_ALAN_19",
      key: "STK_OZEL_ALAN_19",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{ozelAlanlar && ozelAlanlar.OZL_OZEL_ALAN_20 ? ozelAlanlar.OZL_OZEL_ALAN_20 : label && label.OZL_OZEL_ALAN_20}</div>,
      dataIndex: "STK_OZEL_ALAN_20",
      key: "STK_OZEL_ALAN_20",
      width: 150,
      ellipsis: true,

      visible: false, // Varsayılan olarak kapalı
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
        // setDrawer({ ...drawer, visible: false }); // Arama yapıldığında veya arama sıfırlandığında Drawer'ı kapat
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

      // islemTip değerine göre API URL'ini oluştur
      let apiUrl = `Stok?modulNo=1&page=${currentPage}&prm=${keyword}`;

      if (islemTip === "C" || islemTip === "T") {
        // islemTip C veya T ise özel parametreler ekle
        apiUrl += `&islemTip=${islemTip}&depoId=${deposuID || 1}`;
      } else {
        // islemTip null ise normal parametreler ekle
        apiUrl;
      }

      // API isteğini yap
      const response = await AxiosInstance.get(apiUrl);

      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.TotalCount);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.Data.map((item) => ({
          ...item,
          key: item.TB_STOK_ID,
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

    const keyStrings = newSelectedRowKeys.map((key) => key.toString());
    const currentPageMap = new Map(data.map((row) => [row.key.toString(), row]));
    const preservedMap = selectedRowsMapRef.current;

    Array.from(preservedMap.keys()).forEach((key) => {
      if (!keyStrings.includes(key)) {
        preservedMap.delete(key);
      }
    });

    keyStrings.forEach((key) => {
      if (currentPageMap.has(key)) {
        preservedMap.set(key, currentPageMap.get(key));
      }
    });

    const mergedSelection = keyStrings.map((key) => preservedMap.get(key)).filter(Boolean);
    setSelectedRows(mergedSelection);

    if (isSelectionMode && onRowSelect) {
      onRowSelect(mergedSelection);
    } else if (setValue) {
      if (newSelectedRowKeys.length > 0) {
        setValue("selectedLokasyonId", newSelectedRowKeys[0]);
      } else {
        setValue("selectedLokasyonId", null);
      }
    }
  };

  const rowSelection = isSelectionMode
    ? {
        type: "checkbox",
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true,
      }
    : {
        type: "checkbox",
        selectedRowKeys,
        onChange: onSelectChange,
        preserveSelectedRowKeys: true,
      };

  // const onRowClick = (record) => {
  //   return {
  //     onClick: () => {
  //       setDrawer({ visible: true, data: record });
  //     },
  //   };
  // };

  const onRowClick = (record) => {
    if (!isSelectionMode) {
      setDrawer({ visible: true, data: record });
    }
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
    selectedRowsMapRef.current.clear();

    // Verileri yeniden çekmek için `fetchEquipmentData` fonksiyonunu çağır
    fetchEquipmentData(body, currentPage);
    // Burada `body` ve `currentPage`'i güncellediğimiz için, bu değerlerin en güncel hallerini kullanarak veri çekme işlemi yapılır.
    // Ancak, `fetchEquipmentData` içinde `body` ve `currentPage`'e bağlı olarak veri çekiliyorsa, bu değerlerin güncellenmesi yeterli olacaktır.
    // Bu nedenle, doğrudan `fetchEquipmentData` fonksiyonunu çağırmak yerine, bu değerlerin güncellenmesini bekleyebiliriz.
  }, [body, currentPage]); // Bağımlılıkları kaldırdık, çünkü fonksiyon içindeki değerler zaten en güncel halleriyle kullanılıyor.

  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderMalzemeTanimlari");
    const savedVisibility = localStorage.getItem("columnVisibilityMalzemeTanimlari");
    const savedWidths = localStorage.getItem("columnWidthsMalzemeTanimlari");

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

    localStorage.setItem("columnOrderMalzemeTanimlari", JSON.stringify(order));
    localStorage.setItem("columnVisibilityMalzemeTanimlari", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsMalzemeTanimlari", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderMalzemeTanimlari", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityMalzemeTanimlari",
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
      "columnWidthsMalzemeTanimlari",
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
    localStorage.removeItem("columnOrderMalzemeTanimlari");
    localStorage.removeItem("columnVisibilityMalzemeTanimlari");
    localStorage.removeItem("columnWidthsMalzemeTanimlari");
    localStorage.removeItem("ozelAlanlarMalzemeTanimlari");
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
          <StyledButton onClick={() => setIsModalVisible(true)}>
            <MenuOutlined />
          </StyledButton>
          <Input
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
          />
        </div>
        {!isSelectionMode && (
          <div style={{ display: "flex", gap: "10px" }}>
            <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
            <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
          </div>
        )}
      </div>
      <Spin spinning={loading}>
        <CustomTable
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
          scroll={{ y: "calc(100vh - 330px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
        />
      </Spin>
      {!isSelectionMode && (
        <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
      )}
    </>
  );
};

export default Sigorta;
