import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress } from "antd";
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
  const [totalDataCount, setTotalDataCount] = useState(0); // Tüm veriyi tutan state
  const [pageSize, setPageSize] = useState(10); // Başlangıçta sayfa başına 10 kayıt göster

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
        const response = await AxiosInstance.get("OzelAlan?form=MAKINE"); // API URL'niz
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
      title: "#",
      dataIndex: "key",
      key: "key",
      width: "100px",
      ellipsis: true,
      visible: false, // Varsayılan olarak açık
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Belge",
      dataIndex: "MKN_BELGE_VAR",
      key: "MKN_BELGE_VAR",
      width: "100px",
      ellipsis: true,
      visible: false, // Varsayılan olarak açık
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => (a.MKN_BELGE_VAR === b.MKN_BELGE_VAR ? 0 : a.MKN_BELGE_VAR ? -1 : 1),
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },
    {
      title: "Resim",
      dataIndex: "MKN_RESIM_VAR",
      key: "MKN_RESIM_VAR",
      width: "100px",
      ellipsis: true,
      visible: false, // Varsayılan olarak açık
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => (a.MKN_RESIM_VAR === b.MKN_RESIM_VAR ? 0 : a.MKN_RESIM_VAR ? -1 : 1),
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },
    {
      title: "Peryodik Bakım",
      dataIndex: "MKN_PERIYODIK_BAKIM",
      key: "MKN_PERIYODIK_BAKIM",
      width: "100px",
      ellipsis: true,
      visible: false, // Varsayılan olarak açık
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => (a.MKN_PERIYODIK_BAKIM === b.MKN_PERIYODIK_BAKIM ? 0 : a.MKN_PERIYODIK_BAKIM ? -1 : 1),
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
    },
    {
      title: "Makine Kodu",
      dataIndex: "MKN_KOD",
      key: "MKN_KOD",
      width: "150px",
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => {
        if (a.MKN_KOD === null) return -1;
        if (b.MKN_KOD === null) return 1;
        return a.MKN_KOD.localeCompare(b.MKN_KOD);
      },
    },
    {
      title: "Makine Tanımı",
      dataIndex: "MKN_TANIM",
      key: "MKN_TANIM",
      width: "250px",
      ellipsis: true,
      sorter: (a, b) => {
        if (a.MKN_TANIM === null) return -1;
        if (b.MKN_TANIM === null) return 1;
        return a.MKN_TANIM.localeCompare(b.MKN_TANIM);
      },
      visible: true, // Varsayılan olarak açık
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Aktif",
      dataIndex: "MKN_AKTIF",
      key: "MKN_AKTIF",
      width: "100px",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
      render: (text) => (
        <div style={{ textAlign: "center" }}>
          {text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}
        </div>
      ),
      sorter: (a, b) => {
        if (a.MKN_AKTIF === null) return -1;
        if (b.MKN_AKTIF === null) return 1;
        return a.MKN_AKTIF === b.MKN_AKTIF ? 0 : a.MKN_AKTIF ? -1 : 1;
      },
    },

    {
      title: "Makine Durumu",
      dataIndex: "MKN_DURUM",
      key: "MKN_DURUM",
      width: "150px",
      ellipsis: true,
      sorter: (a, b) => {
        if (a.MKN_DURUM === null) return -1;
        if (b.MKN_DURUM === null) return 1;
        return a.MKN_DURUM.localeCompare(b.MKN_DURUM);
      },
      visible: true, // Varsayılan olarak açık
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
    },
    {
      title: "Araç Tipi",
      dataIndex: "MKN_ARAC_TIP",
      key: "MKN_ARAC_TIP",
      width: "100px",
      sorter: (a, b) => {
        if (a.MKN_ARAC_TIP === null && b.MKN_ARAC_TIP === null) return 0;
        if (a.MKN_ARAC_TIP === null) return 1;
        if (b.MKN_ARAC_TIP === null) return -1;
        return a.MKN_ARAC_TIP.localeCompare(b.MKN_ARAC_TIP);
      },
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
      dataIndex: "MKN_LOKASYON",
      key: "MKN_LOKASYON",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_LOKASYON === null && b.MKN_LOKASYON === null) return 0;
        if (a.MKN_LOKASYON === null) return 1;
        if (b.MKN_LOKASYON === null) return -1;
        return a.MKN_LOKASYON.localeCompare(b.MKN_LOKASYON);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Makine Tipi",
      dataIndex: "MKN_TIP",
      key: "MKN_TIP",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_TIP === null && b.MKN_TIP === null) return 0;
        if (a.MKN_TIP === null) return 1;
        if (b.MKN_TIP === null) return -1;
        return a.MKN_TIP.localeCompare(b.MKN_TIP);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Kategori",
      dataIndex: "MKN_KATEGORI",
      key: "MKN_KATEGORI",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_KATEGORI === null && b.MKN_KATEGORI === null) return 0;
        if (a.MKN_KATEGORI === null) return 1;
        if (b.MKN_KATEGORI === null) return -1;
        return a.MKN_KATEGORI.localeCompare(b.MKN_KATEGORI);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Marka",
      dataIndex: "MKN_MARKA",
      key: "MKN_MARKA",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_MARKA === null && b.MKN_MARKA === null) return 0;
        if (a.MKN_MARKA === null) return 1;
        if (b.MKN_MARKA === null) return -1;
        return a.MKN_MARKA.localeCompare(b.MKN_MARKA);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Model",
      dataIndex: "MKN_MODEL",
      key: "MKN_MODEL",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_MODEL === null && b.MKN_MODEL === null) return 0;
        if (a.MKN_MODEL === null) return 1;
        if (b.MKN_MODEL === null) return -1;
        return a.MKN_MODEL.localeCompare(b.MKN_MODEL);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: true, // Varsayılan olarak açık
    },
    {
      title: "Master Makine Tanımı",
      dataIndex: "MKN_MASTER_MAKINE_TANIM",
      key: "MKN_MASTER_MAKINE_TANIM",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_MASTER_MAKINE_TANIM === null && b.MKN_MASTER_MAKINE_TANIM === null) return 0;
        if (a.MKN_MASTER_MAKINE_TANIM === null) return 1;
        if (b.MKN_MASTER_MAKINE_TANIM === null) return -1;
        return a.MKN_MASTER_MAKINE_TANIM.localeCompare(b.MKN_MASTER_MAKINE_TANIM);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Master Makine Kod",
      dataIndex: "MKN_MASTER_MAKINE_KOD",
      key: "MKN_MASTER_MAKINE_KOD",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_MASTER_MAKINE_KOD === null && b.MKN_MASTER_MAKINE_KOD === null) return 0;
        if (a.MKN_MASTER_MAKINE_KOD === null) return 1;
        if (b.MKN_MASTER_MAKINE_KOD === null) return -1;
        return a.MKN_MASTER_MAKINE_KOD.localeCompare(b.MKN_MASTER_MAKINE_KOD);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Çalışma Takvimi",
      dataIndex: "MKN_TAKVIM",
      key: "MKN_TAKVIM",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_TAKVIM === null && b.MKN_TAKVIM === null) return 0;
        if (a.MKN_TAKVIM === null) return 1;
        if (b.MKN_TAKVIM === null) return -1;
        return a.MKN_TAKVIM.localeCompare(b.MKN_TAKVIM);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Üretim Yılı",
      dataIndex: "MKN_URETIM_YILI",
      key: "MKN_URETIM_YILI",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_URETIM_YILI === null && b.MKN_URETIM_YILI === null) return 0;
        if (a.MKN_URETIM_YILI === null) return 1;
        if (b.MKN_URETIM_YILI === null) return -1;
        return a.MKN_URETIM_YILI.localeCompare(b.MKN_URETIM_YILI);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "MKN_MASRAF_MERKEZ",
      key: "MKN_MASRAF_MERKEZ",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_MASRAF_MERKEZ === null && b.MKN_MASRAF_MERKEZ === null) return 0;
        if (a.MKN_MASRAF_MERKEZ === null) return 1;
        if (b.MKN_MASRAF_MERKEZ === null) return -1;
        return a.MKN_MASRAF_MERKEZ.localeCompare(b.MKN_MASRAF_MERKEZ);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Sorumlu Atölye",
      dataIndex: "MKN_ATOLYE",
      key: "MKN_ATOLYE",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_ATOLYE === null && b.MKN_ATOLYE === null) return 0;
        if (a.MKN_ATOLYE === null) return 1;
        if (b.MKN_ATOLYE === null) return -1;
        return a.MKN_ATOLYE.localeCompare(b.MKN_ATOLYE);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Bakım Grubu",
      dataIndex: "MKN_BAKIM_GRUP",
      key: "MKN_BAKIM_GRUP",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_BAKIM_GRUP === null && b.MKN_BAKIM_GRUP === null) return 0;
        if (a.MKN_BAKIM_GRUP === null) return 1;
        if (b.MKN_BAKIM_GRUP === null) return -1;
        return a.MKN_BAKIM_GRUP.localeCompare(b.MKN_BAKIM_GRUP);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Arıza Grubu",
      dataIndex: "MKN_ARIZA_GRUP",
      key: "MKN_ARIZA_GRUP",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_ARIZA_GRUP === null && b.MKN_ARIZA_GRUP === null) return 0;
        if (a.MKN_ARIZA_GRUP === null) return 1;
        if (b.MKN_ARIZA_GRUP === null) return -1;
        return a.MKN_ARIZA_GRUP.localeCompare(b.MKN_ARIZA_GRUP);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Öncelik",
      dataIndex: "MKN_ONCELIK",
      key: "MKN_ONCELIK",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_ONCELIK === null && b.MKN_ONCELIK === null) return 0;
        if (a.MKN_ONCELIK === null) return 1;
        if (b.MKN_ONCELIK === null) return -1;
        return a.MKN_ONCELIK.localeCompare(b.MKN_ONCELIK);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Arıza Sıklığı (Gün)",
      dataIndex: "ARIZA_SIKLIGI",
      key: "ARIZA_SIKLIGI",
      width: "150px",
      sorter: (a, b) => {
        if (a.ARIZA_SIKLIGI === null && b.ARIZA_SIKLIGI === null) return 0;
        if (a.ARIZA_SIKLIGI === null) return 1;
        if (b.ARIZA_SIKLIGI === null) return -1;
        return a.ARIZA_SIKLIGI.localeCompare(b.ARIZA_SIKLIGI);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Arıza Sayısı",
      dataIndex: "ARIZA_SAYISI",
      key: "ARIZA_SAYISI",
      width: "150px",
      sorter: (a, b) => {
        if (a.ARIZA_SAYISI === null && b.ARIZA_SAYISI === null) return 0;
        if (a.ARIZA_SAYISI === null) return 1;
        if (b.ARIZA_SAYISI === null) return -1;
        return a.ARIZA_SAYISI.localeCompare(b.ARIZA_SAYISI);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_1}</div>,
      dataIndex: "MKN_OZEL_ALAN_1",
      key: "MKN_OZEL_ALAN_1",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_1 && b.MKN_OZEL_ALAN_1) {
          return a.MKN_OZEL_ALAN_1.localeCompare(b.MKN_OZEL_ALAN_1);
        }
        if (!a.MKN_OZEL_ALAN_1 && !b.MKN_OZEL_ALAN_1) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_1 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_2}</div>,
      dataIndex: "MKN_OZEL_ALAN_2",
      key: "MKN_OZEL_ALAN_2",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_2 && b.MKN_OZEL_ALAN_2) {
          return a.MKN_OZEL_ALAN_2.localeCompare(b.MKN_OZEL_ALAN_2);
        }
        if (!a.MKN_OZEL_ALAN_2 && !b.MKN_OZEL_ALAN_2) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_2 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_3}</div>,
      dataIndex: "MKN_OZEL_ALAN_3",
      key: "MKN_OZEL_ALAN_3",

      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_3 && b.MKN_OZEL_ALAN_3) {
          return a.MKN_OZEL_ALAN_3.localeCompare(b.MKN_OZEL_ALAN_3);
        }
        if (!a.MKN_OZEL_ALAN_3 && !b.MKN_OZEL_ALAN_3) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_3 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_4}</div>,
      dataIndex: "MKN_OZEL_ALAN_4",
      key: "MKN_OZEL_ALAN_4",

      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_4 && b.MKN_OZEL_ALAN_4) {
          return a.MKN_OZEL_ALAN_4.localeCompare(b.MKN_OZEL_ALAN_4);
        }
        if (!a.MKN_OZEL_ALAN_4 && !b.MKN_OZEL_ALAN_4) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_4 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_5}</div>,
      dataIndex: "MKN_OZEL_ALAN_5",
      key: "MKN_OZEL_ALAN_5",

      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_5 && b.MKN_OZEL_ALAN_5) {
          return a.MKN_OZEL_ALAN_5.localeCompare(b.MKN_OZEL_ALAN_5);
        }
        if (!a.MKN_OZEL_ALAN_5 && !b.MKN_OZEL_ALAN_5) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_5 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_6}</div>,
      dataIndex: "MKN_OZEL_ALAN_6",
      key: "MKN_OZEL_ALAN_6",

      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_6 && b.MKN_OZEL_ALAN_6) {
          return a.MKN_OZEL_ALAN_6.localeCompare(b.MKN_OZEL_ALAN_6);
        }
        if (!a.MKN_OZEL_ALAN_6 && !b.MKN_OZEL_ALAN_6) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_6 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_7}</div>,
      dataIndex: "MKN_OZEL_ALAN_7",
      key: "MKN_OZEL_ALAN_7",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_7 && b.MKN_OZEL_ALAN_7) {
          return a.MKN_OZEL_ALAN_7.localeCompare(b.MKN_OZEL_ALAN_7);
        }
        if (!a.MKN_OZEL_ALAN_7 && !b.MKN_OZEL_ALAN_7) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_7 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_8}</div>,
      dataIndex: "MKN_OZEL_ALAN_8",
      key: "MKN_OZEL_ALAN_8",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_8 && b.MKN_OZEL_ALAN_8) {
          return a.MKN_OZEL_ALAN_8.localeCompare(b.MKN_OZEL_ALAN_8);
        }
        if (!a.MKN_OZEL_ALAN_8 && !b.MKN_OZEL_ALAN_8) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_8 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_9}</div>,
      dataIndex: "MKN_OZEL_ALAN_9",
      key: "MKN_OZEL_ALAN_9",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_9 && b.MKN_OZEL_ALAN_9) {
          return a.MKN_OZEL_ALAN_9.localeCompare(b.MKN_OZEL_ALAN_9);
        }
        if (!a.MKN_OZEL_ALAN_9 && !b.MKN_OZEL_ALAN_9) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_9 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_10}</div>,
      dataIndex: "MKN_OZEL_ALAN_10",
      key: "MKN_OZEL_ALAN_10",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_10 && b.MKN_OZEL_ALAN_10) {
          return a.MKN_OZEL_ALAN_10.localeCompare(b.MKN_OZEL_ALAN_10);
        }
        if (!a.MKN_OZEL_ALAN_10 && !b.MKN_OZEL_ALAN_10) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_10 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_11}</div>,
      dataIndex: "MKN_OZEL_ALAN_11_KOD_ID",
      key: "MKN_OZEL_ALAN_11_KOD_ID",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_11_KOD_ID && b.MKN_OZEL_ALAN_11_KOD_ID) {
          return a.MKN_OZEL_ALAN_11_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_11_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_11_KOD_ID && !b.MKN_OZEL_ALAN_11_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_11_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_12}</div>,
      dataIndex: "MKN_OZEL_ALAN_12_KOD_ID",
      key: "MKN_OZEL_ALAN_12_KOD_ID",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_12_KOD_ID && b.MKN_OZEL_ALAN_12_KOD_ID) {
          return a.MKN_OZEL_ALAN_12_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_12_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_12_KOD_ID && !b.MKN_OZEL_ALAN_12_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_12_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_13}</div>,
      dataIndex: "MKN_OZEL_ALAN_13_KOD_ID",
      key: "MKN_OZEL_ALAN_13_KOD_ID",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_13_KOD_ID && b.MKN_OZEL_ALAN_13_KOD_ID) {
          return a.MKN_OZEL_ALAN_13_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_13_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_13_KOD_ID && !b.MKN_OZEL_ALAN_13_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_13_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_14}</div>,
      dataIndex: "MKN_OZEL_ALAN_14_KOD_ID",
      key: "MKN_OZEL_ALAN_14_KOD_ID",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_14_KOD_ID && b.MKN_OZEL_ALAN_14_KOD_ID) {
          return a.MKN_OZEL_ALAN_14_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_14_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_14_KOD_ID && !b.MKN_OZEL_ALAN_14_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_14_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_15}</div>,
      dataIndex: "MKN_OZEL_ALAN_15_KOD_ID",
      key: "MKN_OZEL_ALAN_15_KOD_ID",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_15_KOD_ID && b.MKN_OZEL_ALAN_15_KOD_ID) {
          return a.MKN_OZEL_ALAN_15_KOD_ID.localeCompare(b.MKN_OZEL_ALAN_15_KOD_ID);
        }
        if (!a.MKN_OZEL_ALAN_15_KOD_ID && !b.MKN_OZEL_ALAN_15_KOD_ID) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_15_KOD_ID ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_16}</div>,
      dataIndex: "MKN_OZEL_ALAN_16",
      key: "MKN_OZEL_ALAN_16",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_16 && b.MKN_OZEL_ALAN_16) {
          return a.MKN_OZEL_ALAN_16.localeCompare(b.MKN_OZEL_ALAN_16);
        }
        if (!a.MKN_OZEL_ALAN_16 && !b.MKN_OZEL_ALAN_16) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_16 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_17}</div>,
      dataIndex: "MKN_OZEL_ALAN_17",
      key: "MKN_OZEL_ALAN_17",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_17 && b.MKN_OZEL_ALAN_17) {
          return a.MKN_OZEL_ALAN_17.localeCompare(b.MKN_OZEL_ALAN_17);
        }
        if (!a.MKN_OZEL_ALAN_17 && !b.MKN_OZEL_ALAN_17) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_17 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_18}</div>,
      dataIndex: "MKN_OZEL_ALAN_18",
      key: "MKN_OZEL_ALAN_18",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_18 && b.MKN_OZEL_ALAN_18) {
          return a.MKN_OZEL_ALAN_18.localeCompare(b.MKN_OZEL_ALAN_18);
        }
        if (!a.MKN_OZEL_ALAN_18 && !b.MKN_OZEL_ALAN_18) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_18 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_19}</div>,
      dataIndex: "MKN_OZEL_ALAN_19",
      key: "MKN_OZEL_ALAN_19",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_19 && b.MKN_OZEL_ALAN_19) {
          return a.MKN_OZEL_ALAN_19.localeCompare(b.MKN_OZEL_ALAN_19);
        }
        if (!a.MKN_OZEL_ALAN_19 && !b.MKN_OZEL_ALAN_19) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_19 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: <div>{label.OZL_OZEL_ALAN_20}</div>,
      dataIndex: "MKN_OZEL_ALAN_20",
      key: "MKN_OZEL_ALAN_20",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 150,
      sorter: (a, b) => {
        if (a.MKN_OZEL_ALAN_20 && b.MKN_OZEL_ALAN_20) {
          return a.MKN_OZEL_ALAN_20.localeCompare(b.MKN_OZEL_ALAN_20);
        }
        if (!a.MKN_OZEL_ALAN_20 && !b.MKN_OZEL_ALAN_20) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_OZEL_ALAN_20 ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Tam Lokasyon",
      dataIndex: "MKN_LOKASYON_TUM_YOL",
      key: "MKN_LOKASYON_TUM_YOL",
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }), // Enable ellipsis for overflowed content
      width: 200,
      sorter: (a, b) => {
        if (a.MKN_LOKASYON_TUM_YOL && b.MKN_LOKASYON_TUM_YOL) {
          return a.MKN_LOKASYON_TUM_YOL.localeCompare(b.MKN_LOKASYON_TUM_YOL);
        }
        if (!a.MKN_LOKASYON_TUM_YOL && !b.MKN_LOKASYON_TUM_YOL) {
          return 0; // Both are null or undefined, consider them equal
        }
        return a.MKN_LOKASYON_TUM_YOL ? 1 : -1; // If a has a brand and b doesn't, a is considered greater, and vice versa
      },
      visible: false, // Varsayılan olarak açık
    },
    {
      title: "Seri No",
      dataIndex: "MKN_SERI_NO",
      key: "MKN_SERI_NO",
      width: "150px",
      sorter: (a, b) => {
        if (a.MKN_SERI_NO === null && b.MKN_SERI_NO === null) return 0;
        if (a.MKN_SERI_NO === null) return 1;
        if (b.MKN_SERI_NO === null) return -1;
        return a.MKN_SERI_NO.localeCompare(b.MKN_SERI_NO);
      },
      ellipsis: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      visible: false, // Varsayılan olarak açık
    },
    // Diğer kolonlarınız...
  ];

  // Kullanıcının seçtiği kolonların key'lerini tutan state kolonlari göster/gizle butonu için

  const [visibleColumnKeys, setVisibleColumnKeys] = useState(() => {
    // 'visibleColumns' isimli anahtarla kaydedilmiş değeri oku
    const savedVisibleColumns = JSON.parse(localStorage.getItem("visibleColumnsMakine"));

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
      const response = await AxiosInstance.post(
        `GetMakineFullList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`,
        filters
      );
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.makine_listesi.map((item) => ({
          ...item,
          key: item.TB_MAKINE_ID,
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
    localStorage.setItem("visibleColumnsMakine", JSON.stringify(checkedValues));
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
