import React, { useCallback, useEffect, useState, useRef } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message, Space } from "antd";
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
import Highlighter from "react-highlight-words";
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

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
  // columda arama yapmak için kullanılan fonksiyonlar
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Ara
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Sıfırla
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrele
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Kapat
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
          zIndex: 4,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  // columda arama yapmak için kullanılan fonksiyonlar sonu

  // Özel Alanların nameleri backend çekmek için api isteği

  useEffect(() => {
    // API'den veri çekme işlemi
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get("OzelAlan?form=ISEMRI"); // API URL'niz
        localStorage.setItem("ozelAlanlarArizaTanimlari", JSON.stringify(response));
        setLabel(response); // Örneğin, API'den dönen yanıt doğrudan etiket olacak
      } catch (error) {
        console.error("API isteğinde hata oluştu:", error);
        setLabel("Hata! Veri yüklenemedi."); // Hata durumunda kullanıcıya bilgi verme
      }
    };

    fetchData();
  }, [drawer.visible]);

  const ozelAlanlarArizaTanimlari = JSON.parse(localStorage.getItem("ozelAlanlarArizaTanimlari"));

  // Özel Alanların nameleri backend çekmek için api isteği sonu
  const initialColumns = [
    {
      title: "Arıza Kod",
      dataIndex: "IST_KOD",
      key: "IST_KOD",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_KOD"),
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => {
        if (a.IST_KOD === b.IST_KOD) return 0;
        if (a.IST_KOD === null || a.IST_KOD === undefined) return -1;
        if (b.IST_KOD === null || b.IST_KOD === undefined) return 1;
        return a.IST_KOD.localeCompare(b.IST_KOD);
      },
    },
    {
      title: "Arıza Tanım",
      dataIndex: "IST_TANIM",
      key: "IST_TANIM",
      width: 200,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_TANIM"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_TANIM === b.IST_TANIM) return 0;
        if (a.IST_TANIM === null || a.IST_TANIM === undefined) return -1;
        if (b.IST_TANIM === null || b.IST_TANIM === undefined) return 1;
        return a.IST_TANIM.localeCompare(b.IST_TANIM);
      },
    },
    {
      title: "Aktif",
      dataIndex: "IST_AKTIF",
      key: "IST_AKTIF",
      width: 100,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_AKTIF"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      align: "center",
      render: (text) => <div style={{ textAlign: "center" }}>{text ? <CheckOutlined style={{ color: "green" }} /> : <CloseOutlined style={{ color: "red" }} />}</div>,
      sorter: (a, b) => (a.IST_AKTIF === b.IST_AKTIF ? 0 : a.IST_AKTIF ? -1 : 1),
    },
    {
      title: "Arıza Tip",
      dataIndex: "IST_TIP",
      key: "IST_TIP",
      width: 250,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_TIP"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_TIP === b.IST_TIP) return 0;
        if (a.IST_TIP === null || a.IST_TIP === undefined) return -1;
        if (b.IST_TIP === null || b.IST_TIP === undefined) return 1;
        return a.IST_TIP.localeCompare(b.IST_TIP);
      },
    },
    {
      title: "Arıza Grup",
      dataIndex: "IST_GRUP",
      key: "IST_GRUP",
      width: 200,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_GRUP"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_GRUP === b.IST_GRUP) return 0;
        if (a.IST_GRUP === null || a.IST_GRUP === undefined) return -1;
        if (b.IST_GRUP === null || b.IST_GRUP === undefined) return 1;
        return a.IST_GRUP.localeCompare(b.IST_GRUP);
      },
    },
    {
      title: "Atölye",
      dataIndex: "IST_ATOLYE",
      key: "IST_ATOLYE",
      width: 200,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_ATOLYE"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_ATOLYE === b.IST_ATOLYE) return 0;
        if (a.IST_ATOLYE === null || a.IST_ATOLYE === undefined) return -1;
        if (b.IST_ATOLYE === null || b.IST_ATOLYE === undefined) return 1;
        return a.IST_ATOLYE.localeCompare(b.IST_ATOLYE);
      },
    },
    {
      title: "Lokasyon",
      dataIndex: "IST_LOKASYON",
      key: "IST_LOKASYON",
      width: 200,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_LOKASYON"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => {
        if (a.IST_LOKASYON === b.IST_LOKASYON) return 0;
        if (a.IST_LOKASYON === null || a.IST_LOKASYON === undefined) return -1;
        if (b.IST_LOKASYON === null || b.IST_LOKASYON === undefined) return 1;
        return a.IST_LOKASYON.localeCompare(b.IST_LOKASYON);
      },
    },
    {
      title: "Öncelik",
      dataIndex: "IST_ONCELIK",
      key: "IST_ONCELIK",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_ONCELIK"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_ONCELIK === b.IST_ONCELIK) return 0;
        if (a.IST_ONCELIK === null || a.IST_ONCELIK === undefined) return -1;
        if (b.IST_ONCELIK === null || b.IST_ONCELIK === undefined) return 1;
        return a.IST_ONCELIK.localeCompare(b.IST_ONCELIK);
      },
    },
    {
      title: "Talimat",
      dataIndex: "IST_TALIMAT",
      key: "IST_TALIMAT",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_TALIMAT"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_TALIMAT === b.IST_TALIMAT) return 0;
        if (a.IST_TALIMAT === null || a.IST_TALIMAT === undefined) return -1;
        if (b.IST_TALIMAT === null || b.IST_TALIMAT === undefined) return 1;
        return a.IST_TALIMAT.localeCompare(b.IST_TALIMAT);
      },
    },
    {
      title: "İş Süresi (dk.)",
      dataIndex: "IST_CALISMA_SURE",
      key: "IST_CALISMA_SURE",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_CALISMA_SURE"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.IST_CALISMA_SURE - b.IST_CALISMA_SURE,
    },
    {
      title: "Duruş Süresi (dk.)",
      dataIndex: "IST_DURUS_SURE",
      key: "IST_DURUS_SURE",
      width: 170,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_DURUS_SURE"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.IST_DURUS_SURE - b.IST_DURUS_SURE,
    },
    {
      title: "Personel Sayısı (kişi)",
      dataIndex: "IST_PERSONEL_SAYI",
      key: "IST_PERSONEL_SAYI",
      width: 170,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_PERSONEL_SAYI"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
      sorter: (a, b) => a.IST_PERSONEL_SAYI - b.IST_PERSONEL_SAYI,
    },
    {
      title: "Özel Alan 1",
      dataIndex: "IST_OZEL_ALAN_1",
      key: "IST_OZEL_ALAN_1",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_1"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_1 === b.IST_OZEL_ALAN_1) return 0;
        if (a.IST_OZEL_ALAN_1 === null || a.IST_OZEL_ALAN_1 === undefined) return -1;
        if (b.IST_OZEL_ALAN_1 === null || b.IST_OZEL_ALAN_1 === undefined) return 1;
        return a.IST_OZEL_ALAN_1.localeCompare(b.IST_OZEL_ALAN_1);
      },
    },
    {
      title: "Özel Alan 2",
      dataIndex: "IST_OZEL_ALAN_2",
      key: "IST_OZEL_ALAN_2",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_2"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_2 === b.IST_OZEL_ALAN_2) return 0;
        if (a.IST_OZEL_ALAN_2 === null || a.IST_OZEL_ALAN_2 === undefined) return -1;
        if (b.IST_OZEL_ALAN_2 === null || b.IST_OZEL_ALAN_2 === undefined) return 1;
        return a.IST_OZEL_ALAN_2.localeCompare(b.IST_OZEL_ALAN_2);
      },
    },
    {
      title: "Özel Alan 3",
      dataIndex: "IST_OZEL_ALAN_3",
      key: "IST_OZEL_ALAN_3",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_3"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_3 === b.IST_OZEL_ALAN_3) return 0;
        if (a.IST_OZEL_ALAN_3 === null || a.IST_OZEL_ALAN_3 === undefined) return -1;
        if (b.IST_OZEL_ALAN_3 === null || b.IST_OZEL_ALAN_3 === undefined) return 1;
        return a.IST_OZEL_ALAN_3.localeCompare(b.IST_OZEL_ALAN_3);
      },
    },
    {
      title: "Özel Alan 4",
      dataIndex: "IST_OZEL_ALAN_4",
      key: "IST_OZEL_ALAN_4",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_4"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_4 === b.IST_OZEL_ALAN_4) return 0;
        if (a.IST_OZEL_ALAN_4 === null || a.IST_OZEL_ALAN_4 === undefined) return -1;
        if (b.IST_OZEL_ALAN_4 === null || b.IST_OZEL_ALAN_4 === undefined) return 1;
        return a.IST_OZEL_ALAN_4.localeCompare(b.IST_OZEL_ALAN_4);
      },
    },
    {
      title: "Özel Alan 5",
      dataIndex: "IST_OZEL_ALAN_5",
      key: "IST_OZEL_ALAN_5",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_5"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_5 === b.IST_OZEL_ALAN_5) return 0;
        if (a.IST_OZEL_ALAN_5 === null || a.IST_OZEL_ALAN_5 === undefined) return -1;
        if (b.IST_OZEL_ALAN_5 === null || b.IST_OZEL_ALAN_5 === undefined) return 1;
        return a.IST_OZEL_ALAN_5.localeCompare(b.IST_OZEL_ALAN_5);
      },
    },
    {
      title: "Özel Alan 6",
      dataIndex: "IST_OZEL_ALAN_6",
      key: "IST_OZEL_ALAN_6",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_6"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_6 === b.IST_OZEL_ALAN_6) return 0;
        if (a.IST_OZEL_ALAN_6 === null || a.IST_OZEL_ALAN_6 === undefined) return -1;
        if (b.IST_OZEL_ALAN_6 === null || b.IST_OZEL_ALAN_6 === undefined) return 1;
        return a.IST_OZEL_ALAN_6.localeCompare(b.IST_OZEL_ALAN_6);
      },
    },
    {
      title: "Özel Alan 7",
      dataIndex: "IST_OZEL_ALAN_7",
      key: "IST_OZEL_ALAN_7",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_7"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_7 === b.IST_OZEL_ALAN_7) return 0;
        if (a.IST_OZEL_ALAN_7 === null || a.IST_OZEL_ALAN_7 === undefined) return -1;
        if (b.IST_OZEL_ALAN_7 === null || b.IST_OZEL_ALAN_7 === undefined) return 1;
        return a.IST_OZEL_ALAN_7.localeCompare(b.IST_OZEL_ALAN_7);
      },
    },
    {
      title: "Özel Alan 8",
      dataIndex: "IST_OZEL_ALAN_8",
      key: "IST_OZEL_ALAN_8",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_8"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_8 === b.IST_OZEL_ALAN_8) return 0;
        if (a.IST_OZEL_ALAN_8 === null || a.IST_OZEL_ALAN_8 === undefined) return -1;
        if (b.IST_OZEL_ALAN_8 === null || b.IST_OZEL_ALAN_8 === undefined) return 1;
        return a.IST_OZEL_ALAN_8.localeCompare(b.IST_OZEL_ALAN_8);
      },
    },
    {
      title: "Özel Alan 9",
      dataIndex: "IST_OZEL_ALAN_9",
      key: "IST_OZEL_ALAN_9",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_9"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_9 === b.IST_OZEL_ALAN_9) return 0;
        if (a.IST_OZEL_ALAN_9 === null || a.IST_OZEL_ALAN_9 === undefined) return -1;
        if (b.IST_OZEL_ALAN_9 === null || b.IST_OZEL_ALAN_9 === undefined) return 1;
        return a.IST_OZEL_ALAN_9.localeCompare(b.IST_OZEL_ALAN_9);
      },
    },
    {
      title: "Özel Alan 10",
      dataIndex: "IST_OZEL_ALAN_10",
      key: "IST_OZEL_ALAN_10",
      width: 150,
      ellipsis: true,
      visible: true,
      ...getColumnSearchProps("IST_OZEL_ALAN_10"),
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      sorter: (a, b) => {
        if (a.IST_OZEL_ALAN_10 === b.IST_OZEL_ALAN_10) return 0;
        if (a.IST_OZEL_ALAN_10 === null || a.IST_OZEL_ALAN_10 === undefined) return -1;
        if (b.IST_OZEL_ALAN_10 === null || b.IST_OZEL_ALAN_10 === undefined) return 1;
        return a.IST_OZEL_ALAN_10.localeCompare(b.IST_OZEL_ALAN_10);
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
      const response = await AxiosInstance.get(`ArizaGetir`);
      if (response) {
        // Gelen veriyi formatla ve state'e ata
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TANIM_ID,
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
    const filtered = data.filter((item) => normalizeString(item.IST_TANIM).includes(normalizeString(searchTerm)));
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
    const savedOrder = localStorage.getItem("columnOrderArizaTanimlari");
    const savedVisibility = localStorage.getItem("columnVisibilityArizaTanimlari");
    const savedWidths = localStorage.getItem("columnWidthsArizaTanimlari");

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

    localStorage.setItem("columnOrderArizaTanimlari", JSON.stringify(order));
    localStorage.setItem("columnVisibilityArizaTanimlari", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsArizaTanimlari", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });
  // filtrelenmiş sütunları local storage'dan alıp state'e atıyoruz sonu

  // sütunları local storage'a kaydediyoruz
  useEffect(() => {
    localStorage.setItem("columnOrderArizaTanimlari", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityArizaTanimlari",
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
      "columnWidthsArizaTanimlari",
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
    localStorage.removeItem("columnOrderArizaTanimlari");
    localStorage.removeItem("columnVisibilityArizaTanimlari");
    localStorage.removeItem("columnWidthsArizaTanimlari");
    localStorage.removeItem("ozelAlanlarArizaTanimlari");
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
