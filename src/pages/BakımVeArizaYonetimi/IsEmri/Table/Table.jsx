import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import ContextMenu from "../components/ContextMenu/ContextMenu";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function MainTable() {
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
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  // Özel Alanların nameleri backend çekmek için api isteği sonu

  // Örnek kolonlar ve başlangıçta hepsinin görünür olacağı varsayılıyor
  const columns = [
    {
      title: "İş Emri No",
      dataIndex: "ISEMRI_NO",
      key: "ISEMRI_NO",
      width: "150px",
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tarih",
      dataIndex: "DUZENLEME_TARIH",
      key: "DUZENLEME_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "Saat",
      dataIndex: "DUZENLEME_SAAT",
      key: "DUZENLEME_SAAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Konu",
      dataIndex: "KONU",
      key: "KONU",
      width: "250px",
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
    },
    {
      title: "İş Emri Tipi",
      dataIndex: "ISEMRI_TIP",
      key: "ISEMRI_TIP",
      width: "200px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Tag
            style={{
              backgroundColor: hexToRGBA(record.ISM_TIP_RENK, 0.2),
              border: `1.2px solid ${hexToRGBA(record.ISM_TIP_RENK, 0.7)}`,
              color: record.ISM_TIP_RENK,
            }}>
            {text}
          </Tag>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "DURUM",
      key: "DURUM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Lokasyon",
      dataIndex: "LOKASYON",
      key: "LOKASYON",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Makine Kodu",
      dataIndex: "MAKINE_KODU",
      key: "MAKINE_KODU",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MAKINE_TANIMI",
      key: "MAKINE_TANIMI",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Planlanan Başlama Tarihi",
      dataIndex: "PLAN_BASLAMA_TARIH",
      key: "PLAN_BASLAMA_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },

    {
      title: "Planlanan Başlama Saati",
      dataIndex: "PLAN_BASLAMA_SAAT",
      key: "PLAN_BASLAMA_SAAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => formatTime(text),
    },
    {
      title: "Planlanan Bitiş Tarihi",
      dataIndex: "PLAN_BITIS_TARIH",
      key: "PLAN_BITIS_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Planlanan Bitiş Saati",
      dataIndex: "PLAN_BITIS_SAAT",
      key: "PLAN_BITIS_SAAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Başlama Tarihi",
      dataIndex: "BASLAMA_TARIH",
      key: "BASLAMA_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Başlama Saati",
      dataIndex: "BASLAMA_SAAT",
      key: "BASLAMA_SAAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "ISM_BITIS_TARIH",
      key: "ISM_BITIS_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Bitiş Saati",
      dataIndex: "ISM_BITIS_SAAT",
      key: "ISM_BITIS_SAAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IS_SURESI",
      key: "IS_SURESI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => (text > 0 ? text : null),
    },
    {
      title: "Tamamlama (%)",
      dataIndex: "TAMAMLANMA",
      key: "TAMAMLANMA",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => `${text}%`,
    },
    {
      title: "Garanti",
      dataIndex: "GARANTI",
      key: "GARANTI",
      width: "100px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text, record) => {
        return record.GARANTI ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "Makine Durumu",
      dataIndex: "MAKINE_DURUM",
      key: "MAKINE_DURUM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Plaka",
      dataIndex: "MAKINE_PLAKA",
      key: "MAKINE_PLAKA",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Makine Tipi",
      dataIndex: "MAKINE_TIP",
      key: "MAKINE_TIP",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Ekipman",
      dataIndex: "EKIPMAN",
      key: "EKIPMAN",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Tipi",
      dataIndex: "IS_TIPI",
      key: "IS_TIPI",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Nedeni",
      dataIndex: "IS_NEDENI",
      key: "IS_NEDENI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Atölye",
      dataIndex: "ATOLYE",
      key: "ATOLYE",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Talimat",
      dataIndex: "TALIMAT",
      key: "TALIMAT",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Öncelik",
      dataIndex: "ONCELIK",
      key: "ONCELIK",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Kapanış Tarihi",
      dataIndex: "KAPANIS_TARIHI",
      key: "KAPANIS_TARIHI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: "Kapanış Saati",
      dataIndex: "KAPANIS_SAATI",
      key: "KAPANIS_SAATI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatTime(text),
    },
    {
      title: "Takvim",
      dataIndex: "TAKVIM",
      key: "TAKVIM",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "MASRAF_MERKEZI",
      key: "MASRAF_MERKEZI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Firma",
      dataIndex: "FRIMA",
      key: "FRIMA",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Kodu",
      dataIndex: "IS_TALEP_NO",
      key: "IS_TALEP_NO",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Eden",
      dataIndex: "IS_TALEP_EDEN",
      key: "IS_TALEP_EDEN",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "İş Talep Tarihi",
      dataIndex: "IS_TALEP_TARIH",
      key: "IS_TALEP_TARIH",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
      render: (text) => formatDate(text),
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_1}</div>,
      dataIndex: "OZEL_ALAN_1",
      key: "OZEL_ALAN_1",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_2}</div>,
      dataIndex: "OZEL_ALAN_2",
      key: "OZEL_ALAN_2",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_3}</div>,
      dataIndex: "OZEL_ALAN_3",
      key: "OZEL_ALAN_3",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_4}</div>,
      dataIndex: "OZEL_ALAN_4",
      key: "OZEL_ALAN_4",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_5}</div>,
      dataIndex: "OZEL_ALAN_5",
      key: "OZEL_ALAN_5",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_6}</div>,
      dataIndex: "OZEL_ALAN_6",
      key: "OZEL_ALAN_6",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_7}</div>,
      dataIndex: "OZEL_ALAN_7",
      key: "OZEL_ALAN_7",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_8}</div>,
      dataIndex: "OZEL_ALAN_8",
      key: "OZEL_ALAN_8",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_9}</div>,
      dataIndex: "OZEL_ALAN_9",
      key: "OZEL_ALAN_9",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_10}</div>,
      dataIndex: "OZEL_ALAN_10",
      key: "OZEL_ALAN_10",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_11}</div>,
      dataIndex: "OZEL_ALAN_11",
      key: "OZEL_ALAN_11",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_12}</div>,
      dataIndex: "OZEL_ALAN_12",
      key: "OZEL_ALAN_12",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_13}</div>,
      dataIndex: "OZEL_ALAN_13",
      key: "OZEL_ALAN_13",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_14}</div>,
      dataIndex: "OZEL_ALAN_14",
      key: "OZEL_ALAN_14",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_15}</div>,
      dataIndex: "OZEL_ALAN_15",
      key: "OZEL_ALAN_15",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_16}</div>,
      dataIndex: "OZEL_ALAN_16",
      key: "OZEL_ALAN_16",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_17}</div>,
      dataIndex: "OZEL_ALAN_17",
      key: "OZEL_ALAN_17",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_18}</div>,
      dataIndex: "OZEL_ALAN_18",
      key: "OZEL_ALAN_18",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_19}</div>,
      dataIndex: "OZEL_ALAN_19",
      key: "OZEL_ALAN_19",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_20}</div>,
      dataIndex: "OZEL_ALAN_20",
      key: "OZEL_ALAN_20",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Personel Adı",
      dataIndex: "PERSONEL_ADI",
      key: "PERSONEL_ADI",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Tam Lokasyon",
      dataIndex: "TAM_LOKASYON",
      key: "TAM_LOKASYON",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Kat",
      dataIndex: "BILDIRILEN_KAT",
      key: "BILDIRILEN_KAT",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Bildirilen Bina",
      dataIndex: "BILDIRILEN_BINA",
      key: "BILDIRILEN_BINA",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Sayaç Değeri",
      dataIndex: "GUNCEL_SAYAC_DEGER",
      key: "GUNCEL_SAYAC_DEGER",
      width: "150px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    {
      title: "Notlar",
      dataIndex: "ICERDEKI_NOT",
      key: "ICERDEKI_NOT",
      width: "250px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak kapalı
    },
    // Diğer kolonlarınız...
  ];

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    // 'visibleColumns' isimli anahtarla kaydedilmiş değeri oku
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumnsIsEmri"));

    // Eğer localStorage'da bir değer varsa, bu değeri kullan
    if (savedVisibleColumns) {
      return savedVisibleColumns;
    }

    // Yoksa, varsayılan olarak görünür olacak kolonların key'lerini döndür
    return columns.filter((col) => col.visible).map((col) => col.key);
  });

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için son

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
        throw new Error("Invalid time format");
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
    }
  };

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body, currentPage);
  }, [body, currentPage]);

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

  const fetchEquipmentData = async (body, page) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const response = await AxiosInstance.post(
        `getIsEmriFullList?parametre=${keyword}&pagingDeger=${currentPage}`,
        filters
      );
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.list.map((item) => ({
          ...item,
          key: item.TB_ISEMRI_ID,
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
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
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

  // const refreshTableData = useCallback(() => {
  //   fetchEquipmentData();
  // }, []);

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

  // Kolon görünürlüğünü güncelleme fonksiyonu
  const handleVisibilityChange = (checkedValues) => {
    setVisibleColumnKeys(checkedValues);
    // Yeni görünürlük durumunu localStorage'a kaydet
    localStorage.setItem("visibleColumnsIsEmri", JSON.stringify(checkedValues));
  };

  // Kolonları gösterip gizleme Modalını göster/gizle
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Görünür kolonları filtrele
  const visibleColumns = columns.filter((col) => visibleColumnKeys.includes(col.key));

  // Kolon görünürlüğünü güncelleme fonksiyonu son

  return (
    <div>
      <style>
        {`
          .boldRow {
            font-weight: bold;
          }
        `}
      </style>

      <Modal width={900} title="Kolonları Düzenle" open={isModalVisible} onOk={toggleModal} onCancel={toggleModal}>
        <Checkbox.Group
          style={{ width: "100%", display: "flex", gap: "10px", flexDirection: "column", height: "500px" }}
          value={visibleColumnKeys}
          onChange={handleVisibilityChange}>
          {columns.map((col) => (
            <Checkbox key={col.key} value={col.key}>
              {col.title}
            </Checkbox>
          ))}
        </Checkbox.Group>
      </Modal>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: "20px",
          gap: "10px",
          padding: "0 5px",
        }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: "100%",
            maxWidth: "780px",
            flexWrap: "wrap",
          }}>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              // width: "32px",
              height: "32px",
            }}
            onClick={toggleModal}>
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
          <Filters onChange={handleBodyChange} />
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
      </div>
      <Spin spinning={loading}>
        <Table
          columns={visibleColumns}
          rowSelection={rowSelection}
          dataSource={data}
          pagination={{
            current: currentPage,
            total: totalPages * 50, // Toplam kayıt sayısı (sayfa başına kayıt sayısı ile çarpılır)
            pageSize: 50,
            showSizeChanger: false,
            onChange: handleTableChange,
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 380px)" }}
          onChange={handleTableChange}
          rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
        />
      </Spin>

      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </div>
  );
}
