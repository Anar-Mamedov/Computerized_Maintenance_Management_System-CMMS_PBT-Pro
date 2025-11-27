import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Checkbox,
  Input,
  Spin,
  Typography,
  Tag,
  Progress,
  message,
} from "antd";
import {
  HolderOutlined,
  SearchOutlined,
  MenuOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu";
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

const DraggableRow = ({
  id,
  text,
  index,
  moveRow,
  className,
  style,
  visible,
  onVisibilityChange,
  ...restProps
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
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
    <div
      ref={setNodeRef}
      style={styleWithTransform}
      {...restProps}
      {...attributes}
    >
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

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
        localStorage.setItem(
          "ozelAlanlarPersonelTanimlari",
          JSON.stringify(response)
        );
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlarPersonelTanimlari = JSON.parse(
    localStorage.getItem("ozelAlanlarPersonelTanimlari")
  );

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "Firma Kodu",
      dataIndex: "CAR_KOD",
      key: "CAR_KOD",
      width: 150,
      ellipsis: true,
      visible: true,
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => {
        if (a.CAR_KOD == null || a.CAR_KOD === "") return 1;
        if (b.CAR_KOD == null || b.CAR_KOD === "") return -1;
        if (typeof a.CAR_KOD === "boolean") return a.CAR_KOD - b.CAR_KOD;
        if (!isNaN(a.CAR_KOD) && !isNaN(b.CAR_KOD)) return a.CAR_KOD - b.CAR_KOD;
        return a.CAR_KOD.toString().localeCompare(b.CAR_KOD.toString());
      },
    },
    {
      title: "Firma Ünvanı",
      dataIndex: "CAR_TANIM",
      key: "CAR_TANIM",
      width: 450,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_TANIM == null || a.CAR_TANIM === "") return 1;
        if (b.CAR_TANIM == null || b.CAR_TANIM === "") return -1;
        return a.CAR_TANIM.toString().localeCompare(b.CAR_TANIM.toString());
      },
    },
    {
      title: "Firma Tipi",
      dataIndex: "",
      key: "",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_TANIM == null || a.CAR_TANIM === "") return 1;
        if (b.CAR_TANIM == null || b.CAR_TANIM === "") return -1;
        return a.CAR_TANIM.toString().localeCompare(b.CAR_TANIM.toString());
      },
    },
    {
      title: "Adres",
      dataIndex: "CAR_ADRES",
      key: "CAR_ADRES",
      width: 150,
      ellipsis: true,
      visible: false,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_ADRES == null || a.CAR_ADRES === "") return 1;
        if (b.CAR_ADRES == null || b.CAR_ADRES === "") return -1;
        return a.CAR_ADRES.toString().localeCompare(b.CAR_ADRES.toString());
      },
    },
    {
      title: "Şehir",
      dataIndex: "CAR_SEHIR",
      key: "CAR_SEHIR",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_SEHIR == null || a.CAR_SEHIR === "") return 1;
        if (b.CAR_SEHIR == null || b.CAR_SEHIR === "") return -1;
        return a.CAR_SEHIR.toString().localeCompare(b.CAR_SEHIR.toString());
      },
    },
    {
      title: "İlçe",
      dataIndex: "CAR_ILCE",
      key: "CAR_ILCE",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_ILCE == null || a.CAR_ILCE === "") return 1;
        if (b.CAR_ILCE == null || b.CAR_ILCE === "") return -1;
        return a.CAR_ILCE.toString().localeCompare(b.CAR_ILCE.toString());
      },
    },
    {
      title: "Telefon",
      dataIndex: "CAR_TEL1",
      key: "CAR_TEL1",
      width: 150,
      ellipsis: true,
      visible: true,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_TEL1 == null || a.CAR_TEL1 === "") return 1;
        if (b.CAR_TEL1 == null || b.CAR_TEL1 === "") return -1;
        return a.CAR_TEL1.toString().localeCompare(b.CAR_TEL1.toString());
      },
      
    },
    {
      title: "Mail",
      dataIndex: "CAR_EMAIL",
      key: "CAR_EMAIL",
      width: 150,
      ellipsis: true,
      visible: false,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_EMAIL == null || a.CAR_EMAIL === "") return 1;
        if (b.CAR_EMAIL == null || b.CAR_EMAIL === "") return -1;
        return a.CAR_EMAIL.toString().localeCompare(b.CAR_EMAIL.toString());
      },
    },
    {
      title: "Vergi Dairesi",
      dataIndex: "CAR_VERGI_DAIRE",
      key: "CAR_VERGI_DAIRE",
      width: 150,
      ellipsis: true,
      visible: false,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_VERGI_DAIRE == null || a.CAR_VERGI_DAIRE === "") return 1;
        if (b.CAR_VERGI_DAIRE == null || b.CAR_VERGI_DAIRE === "") return -1;
        return a.CAR_VERGI_DAIRE.toString().localeCompare(b.CAR_VERGI_DAIRE.toString());
      },
    },
    {
      title: "Vergi No",
      dataIndex: "CAR_VERGI_NO",
      key: "CAR_VERGI_NO",
      width: 150,
      ellipsis: true,
      visible: false,
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.CAR_VERGI_NO == null || a.CAR_VERGI_NO === "") return 1;
        if (b.CAR_VERGI_NO == null || b.CAR_VERGI_NO === "") return -1;
        return a.CAR_VERGI_NO.toString().localeCompare(b.CAR_VERGI_NO.toString());
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
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(
      sampleDate
    );

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
      if (
        isNaN(hoursInt) ||
        isNaN(minutesInt) ||
        hoursInt < 0 ||
        hoursInt > 23 ||
        minutesInt < 0 ||
        minutesInt > 59
      ) {
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

  const fetchEquipmentData = async (page = 1, size = 10, searchTerm = "") => {
  try {
    setLoading(true);

    const response = await AxiosInstance.get(
      `GetTedarikciList?aktif=1&searchText=${searchTerm}&pagingDeger=${page}&pageSize=${size}`
    );

    const list = response?.data ?? [];

    const formatted = list.map(item => ({
      ...item,
      key: item.TB_CARI_ID,
    }));

    setData(formatted);
    setTotalRecords(response.pagination?.total_records || 0);
    setCurrentPage(response.pagination?.current_page || 1);

    setLoading(false);
  } catch (err) {
    setLoading(false);
  }
};

  const normalizeSafe = (str) => {
  if (!str) return ""; // null, undefined, boş hepsi için
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
};

  useEffect(() => {
  if (!searchTerm) {
    setFilteredData(data);
    return;
  }

  const filtered = data.filter((item) => {
    const text = normalizeSafe(item.CAR_TANIM || item.UNVAN || item.CARI_ADI);
    return text.includes(normalizeSafe(searchTerm));
  });

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
    const newSelectedRows = data.filter((row) =>
      newSelectedRowKeys.includes(row.key)
    );
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
    const savedOrder = localStorage.getItem("columnOrderTedarikciFirmalar");
    const savedVisibility = localStorage.getItem(
      "columnVisibilityTedarikciFirmalar"
    );
    const savedWidths = localStorage.getItem("columnWidthsTedarikciFirmalar");

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

    localStorage.setItem("columnOrderTedarikciFirmalar", JSON.stringify(order));
    localStorage.setItem(
      "columnVisibilityTedarikciFirmalar",
      JSON.stringify(visibility)
    );
    localStorage.setItem(
      "columnWidthsTedarikciFirmalar",
      JSON.stringify(widths)
    );

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem(
      "columnOrderTedarikciFirmalar",
      JSON.stringify(columns.map((col) => col.key))
    );
    localStorage.setItem(
      "columnVisibilityTedarikciFirmalar",
      JSON.stringify(
        columns.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {})
      )
    );
    localStorage.setItem(
      "columnWidthsTedarikciFirmalar",
      JSON.stringify(
        columns.reduce((acc, col) => ({ ...acc, [col.key]: col.width }), {})
      )
    );
  }, [columns]);
  // sütunları local storage'a kaydediyoruz sonu

  // sütunların boyutlarını ayarlamak için kullanılan fonksiyon
  const handleResize =
    (key) =>
    (_, { size }) => {
      setColumns((prev) =>
        prev.map((col) =>
          col.key === key ? { ...col, width: size.width } : col
        )
      );
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
        console.error(
          `Column with key ${active.id} or ${over.id} does not exist.`
        );
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
    localStorage.removeItem("columnOrderTedarikciFirmalar");
    localStorage.removeItem("columnVisibilityTedarikciFirmalar");
    localStorage.removeItem("columnWidthsTedarikciFirmalar");
    localStorage.removeItem("ozelAlanlarTedarikciFirmalar");
    window.location.reload();
  }

  // sütunları sıfırlamak için kullanılan fonksiyon sonu

  return (
    <>
      <Modal
        title="Sütunları Yönet"
        centered
        width={800}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        <Text style={{ marginBottom: "15px" }}>
          Aşağıdaki Ekranlardan Sütunları Göster / Gizle ve Sıralamalarını
          Ayarlayabilirsiniz.
        </Text>
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
                  <Checkbox
                    checked={
                      columns.find((column) => column.key === col.key)
                        ?.visible || false
                    }
                    onChange={(e) =>
                      toggleVisibility(col.key, e.target.checked)
                    }
                  />
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
                <Text style={{ fontWeight: 600 }}>
                  Sütunların Sıralamasını Ayarla
                </Text>
              </div>
              <div style={{ height: "400px", overflow: "auto" }}>
                <SortableContext
                  items={columns
                    .filter((col) => col.visible)
                    .map((col) => col.key)}
                  strategy={verticalListSortingStrategy}
                >
                  {columns
                    .filter((col) => col.visible)
                    .map((col, index) => (
                      <DraggableRow
                        key={col.key}
                        id={col.key}
                        index={index}
                        text={col.title}
                      />
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
  {/* ContextMenu sol tarafta */}
  <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
  
  {/* Ekle butonu / CreateDrawer sağda */}
  <CreateDrawer
    selectedLokasyonId={selectedRowKeys[0]}
    onRefresh={refreshTableData}
  />
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
            total: totalRecords,
            pageSize: pageSize,
            showTotal: (total, range) => `Toplam ${total}`,
            showSizeChanger: true,
            onChange: (page, size) => {
              setPageSize(size);
              fetchEquipmentData(page, size, searchTerm);
            }
          }}
          onRow={onRowClick}
          scroll={{ y: "calc(100vh - 370px)" }}
        />
      </Spin>
      <EditDrawer
        selectedRow={drawer.data}
        onDrawerClose={() => setDrawer({ ...drawer, visible: false })}
        drawerVisible={drawer.visible}
        onRefresh={refreshTableData}
      />
    </>
  );
};

export default MainTable;
