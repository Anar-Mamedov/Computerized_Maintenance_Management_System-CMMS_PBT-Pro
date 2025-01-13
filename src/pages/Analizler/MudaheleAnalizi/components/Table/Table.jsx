import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../../api/http.jsx";
// import CreateDrawer from '../Insert/CreateDrawer';
import EditDrawer from "../../../../BakımVeArizaYonetimi/IsEmri/Update/EditDrawer.jsx";
// import Filters from "./filter/Filters";
import Filters1 from "./Filters/Filters.jsx";
// import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer1 from "../../../../YardimMasasi/IsTalepleri/Update/EditDrawer.jsx";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

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
  const {
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useFormContext();
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
        localStorage.setItem("ozelAlanlarIsEmriAnaliz", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlar = JSON.parse(localStorage.getItem("ozelAlanlarIsEmriAnaliz"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "İş Emri No",
      dataIndex: "ISM_ISEMRI_NO",
      key: "ISM_ISEMRI_NO",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a
          onClick={() => {
            setDrawer({ visible: true, data: record });
          }}
        >
          {text}
        </a>
      ),
      sorter: (a, b) => {
        if (a.ISM_ISEMRI_NO === null) return -1;
        if (b.ISM_ISEMRI_NO === null) return 1;
        return a.ISM_ISEMRI_NO.localeCompare(b.ISM_ISEMRI_NO);
      },
    },
    {
      title: "İş Talebi No",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a
          onClick={() => {
            // Create a copy of the record and update the key value
            const updatedRecord = { ...record, key: record.ISM_IS_TALEP_ID };

            // Set the updated record to EditDrawer1 data and make the drawer visible
            setEditDrawer1Data(updatedRecord);
            setEditDrawer1Visible(true);
          }}
        >
          {text}
        </a>
      ),
      sorter: (a, b) => {
        if (a.IST_KOD === null) return -1;
        if (b.IST_KOD === null) return 1;
        return a.IST_KOD.localeCompare(b.IST_KOD);
      },
    },
    {
      title: "Lokasyon Tanım",
      dataIndex: "LOK_TANIM",
      key: "LOK_TANIM",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.LOK_TANIM === null) return -1;
        if (b.LOK_TANIM === null) return 1;
        return a.LOK_TANIM.localeCompare(b.LOK_TANIM);
      },
    },
    {
      title: "Tipi",
      dataIndex: "IMT_TANIM",
      key: "IMT_TANIM",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.IMT_TANIM === null) return -1;
        if (b.IMT_TANIM === null) return 1;
        return a.IMT_TANIM.localeCompare(b.IMT_TANIM);
      },
    },
    {
      title: "Atölye",
      dataIndex: "ATL_TANIM",
      key: "ATL_TANIM",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.ATL_TANIM === null) return -1;
        if (b.ATL_TANIM === null) return 1;
        return a.ATL_TANIM.localeCompare(b.ATL_TANIM);
      },
    },
    {
      title: "Müdahele Süresi",
      dataIndex: "FARK_DAKIKA",
      key: "FARK_DAKIKA",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık

      sorter: (a, b) => {
        if (a.FARK_DAKIKA === null) return 1;
        if (b.FARK_DAKIKA === null) return -1;
        return a.FARK_DAKIKA - b.FARK_DAKIKA;
      },
    },
    {
      title: "Talep Açılma Tarihi",
      dataIndex: "TALEP_ACILIS_TAR",
      key: "TALEP_ACILIS_TAR",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.TALEP_ACILIS_TAR === null) return -1;
        if (b.TALEP_ACILIS_TAR === null) return 1;
        return a.TALEP_ACILIS_TAR.localeCompare(b.TALEP_ACILIS_TAR);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
    },
    {
      title: "İş Emri Başlama Tarihi",
      dataIndex: "ISMERI_BAS_TAR",
      key: "ISMERI_BAS_TAR",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.ISMERI_BAS_TAR === null) return -1;
        if (b.ISMERI_BAS_TAR === null) return 1;
        return a.ISMERI_BAS_TAR.localeCompare(b.ISMERI_BAS_TAR);
      },

      visible: true, // Varsayılan olarak açık
      render: (text) => formatDate(text),
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

  const lokasyonId = watch("locationIds1");
  const atolyeId = watch("atolyeIds1");
  const baslangicTarihi = watch("baslangicTarihi1");
  const bitisTarihi = watch("bitisTarihi1");

  const fetchEquipmentData = async (body, page, size) => {
    // body'nin undefined olması durumunda varsayılan değerler atanıyor
    const { keyword = "", filters = {} } = body || {};
    // page'in undefined olması durumunda varsayılan değer olarak 1 atanıyor
    const currentPage = page || 1;

    try {
      setLoading(true);
      // API isteğinde keyword ve currentPage kullanılıyor
      const body = {
        LokasyonId: lokasyonId || "",
        AtolyeId: atolyeId || "",
        BaslangicTarih: baslangicTarihi ? dayjs(baslangicTarihi).format("YYYY-MM-DD") : "",
        BitisTarih: bitisTarihi ? dayjs(bitisTarihi).format("YYYY-MM-DD") : "",
        // Yil: currentYear,
      };

      const response = await AxiosInstance.post(`GetMudahaleAnalizList?parametre=${keyword}&pagingDeger=${currentPage}&pageSize=${size}`, body);
      if (response) {
        // Toplam sayfa sayısını ayarla
        setTotalPages(response.page);
        setTotalDataCount(response.kayit_sayisi);

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
      if (navigator.onLine) {
        // İnternet bağlantısı var
        message.error("Hata Mesajı: " + error.message);
      } else {
        // İnternet bağlantısı yok
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  // ana tablo api isteği için kullanılan useEffect

  useEffect(() => {
    fetchEquipmentData(body, currentPage, pageSize);
  }, [body, currentPage, pageSize, lokasyonId, atolyeId, baslangicTarihi, bitisTarihi]);

  // ana tablo api isteği için kullanılan useEffect son

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

  // const onRowClick = (record) => {
  //   return {
  //     onClick: () => {
  //       setDrawer({ visible: true, data: record });
  //     },
  //   };
  // };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
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
    const savedOrder = localStorage.getItem("columnOrderIsEmriAnaliz");
    const savedVisibility = localStorage.getItem("columnVisibilityIsEmriAnaliz");
    const savedWidths = localStorage.getItem("columnWidthsIsEmriAnaliz");

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

    localStorage.setItem("columnOrderIsEmriAnaliz", JSON.stringify(order));
    localStorage.setItem("columnVisibilityIsEmriAnaliz", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsIsEmriAnaliz", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderIsEmriAnaliz", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityIsEmriAnaliz",
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
      "columnWidthsIsEmriAnaliz",
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
    localStorage.removeItem("columnOrderIsEmriAnaliz");
    localStorage.removeItem("columnVisibilityIsEmriAnaliz");
    localStorage.removeItem("columnWidthsIsEmriAnaliz");
    localStorage.removeItem("ozelAlanlarIsEmriAnaliz");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        border: "1px solid #f0f0f0",
        filter: "drop-shadow(0 0 0.75rem rgba(0, 0, 0, 0.1))",
      }}
    >
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
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "10px", padding: "0 5px", marginBottom: "10px" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", width: "100%", maxWidth: "935px", flexWrap: "wrap" }}>
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
          {/*<Filters onChange={handleBodyChange} />*/}
          <Filters1 />
          {/* <TeknisyenSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} />
          <AtolyeSubmit selectedRows={selectedRows} refreshTableData={refreshTableData} /> */}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/*<ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />*/}
          {/*<CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />*/}
        </div>
      </div>
      <div style={{ width: "100%", height: "calc(100% - 5px)", overflow: "auto" }}>
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
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              position: ["bottomRight"],
              onChange: handleTableChange,
              showTotal: (total, range) => `Toplam ${total}`, // Burada 'total' parametresi doğru kayıt sayısını yansıtacaktır
              showQuickJumper: true,
            }}
            // onRow={onRowClick}
            scroll={{ y: "100vh" }}
            onChange={handleTableChange}
            rowClassName={(record) => (record.IST_DURUM_ID === 0 ? "boldRow" : "")}
          />
        </Spin>
      </div>
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />

      {editDrawer1Visible && (
        <EditDrawer1 selectedRow={editDrawer1Data} onDrawerClose={() => setEditDrawer1Visible(false)} drawerVisible={editDrawer1Visible} onRefresh={() => {}} />
      )}
    </div>
  );
};

export default MainTable;
