import React, { useCallback, useEffect, useState, useRef, useMemo, memo } from "react";
import { useFormContext } from "react-hook-form";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, message, Tooltip, Progress, ConfigProvider } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, HomeOutlined, ArrowDownOutlined, ArrowUpOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";
import { t } from "i18next";
import trTR from "antd/lib/locale/tr_TR";
import enUS from "antd/lib/locale/en_US";
import ruRU from "antd/lib/locale/ru_RU";
import azAZ from "antd/lib/locale/az_AZ";

// Türkçe karakterleri İngilizce karşılıkları ile değiştiren fonksiyon
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C");
};

const localeMap = {
  tr: trTR,
  en: enUS,
  ru: ruRU,
  az: azAZ,
};

// Define date format mapping based on language
const dateFormatMap = {
  tr: "DD.MM.YYYY",
  en: "MM/DD/YYYY",
  ru: "DD.MM.YYYY",
  az: "DD.MM.YYYY",
};

// Define time format mapping based on language
const timeFormatMap = {
  tr: "HH:mm",
  en: "hh:mm A",
  ru: "HH:mm",
  az: "HH:mm",
};

const { Text } = Typography;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 8px;
  height: 32px !important;
`;

const StyledTable = styled(Table)``;

// Sütunların boyutlarını ayarlamak için kullanılan component

const ResizableTitle = memo((props) => {
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
});
ResizableTitle.displayName = "ResizableTitle";
// Sütunların boyutlarını ayarlamak için kullanılan component sonu

// Sütunların sürüklenebilir olmasını sağlayan component

const DraggableRow = memo(({ id, text, index, style, ...restProps }) => {
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
});
DraggableRow.displayName = "DraggableRow";

// Sütunların sürüklenebilir olmasını sağlayan component sonu

const MalzemeDepolari = () => {
  const formMethods = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // Tüm veriyi saklamak için
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false); // Set initial loading state to false
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // Total data count
  const [pageSize, setPageSize] = useState(10); // Page size
  const [localeDateFormat, setLocaleDateFormat] = useState("MM/DD/YYYY");
  const [localeTimeFormat, setLocaleTimeFormat] = useState("HH:mm");
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);

  // Veri çekme fonksiyonu
  const fetchData = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetDepo?DEP_MODUL_NO=1")
      .then((response) => {
        // API'den gelen veriyi tablo formatına dönüştür
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_DEPO_ID,
        }));

        setAllData(fetchedData);

        // Arama metni varsa filtrele
        const filteredData = searchValue
          ? fetchedData.filter((d) =>
              normalizeText(`${d.DEP_KOD || ""} ${d.DEP_TANIM || ""} ${d.SORUMLU_PERSONEL || ""} ${d.ATOLYE_TANIM || ""} ${d.LOKASYON_TANIM || ""}`)
                .toLowerCase()
                .includes(normalizeText(searchValue).toLowerCase())
            )
          : fetchedData;

        setData(filteredData);
        setTotalCount(filteredData.length);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        message.error(t("hataOlustu"));
      })
      .finally(() => setLoading(false));
  }, [searchValue]);

  // Arama işlemi
  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  // İlk yükleme için useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sayfa değişikliğinde çalışacak fonksiyon
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);

    // Find selected rows data
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  const refreshTableData = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    fetchData();
  }, [fetchData]);

  // Tablo kolonları
  const initialColumns = useMemo(
    () => [
      {
        title: t("depoKodu"),
        dataIndex: "DEP_KOD",
        key: "DEP_KOD",
        width: 200,
        ellipsis: true,
        visible: true,
        render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
        sorter: (a, b) => {
          if (a.DEP_KOD === null) return -1;
          if (b.DEP_KOD === null) return 1;
          return a.DEP_KOD.localeCompare(b.DEP_KOD);
        },
      },
      {
        title: t("depoTanimi"),
        dataIndex: "DEP_TANIM",
        key: "DEP_TANIM",
        width: 300,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.DEP_TANIM === null) return -1;
          if (b.DEP_TANIM === null) return 1;
          return a.DEP_TANIM.localeCompare(b.DEP_TANIM);
        },
      },
      {
        title: t("sorumluPersonel"),
        dataIndex: "SORUMLU_PERSONEL",
        key: "SORUMLU_PERSONEL",
        width: 200,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.SORUMLU_PERSONEL === null) return -1;
          if (b.SORUMLU_PERSONEL === null) return 1;
          return a.SORUMLU_PERSONEL.localeCompare(b.SORUMLU_PERSONEL);
        },
      },
      {
        title: t("atolye"),
        dataIndex: "ATOLYE_TANIM",
        key: "ATOLYE_TANIM",
        width: 200,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.ATOLYE_TANIM === null) return -1;
          if (b.ATOLYE_TANIM === null) return 1;
          return a.ATOLYE_TANIM.localeCompare(b.ATOLYE_TANIM);
        },
      },
      {
        title: t("lokasyon"),
        dataIndex: "LOKASYON_TANIM",
        key: "LOKASYON_TANIM",
        width: 200,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.LOKASYON_TANIM === null) return -1;
          if (b.LOKASYON_TANIM === null) return 1;
          return a.LOKASYON_TANIM.localeCompare(b.LOKASYON_TANIM);
        },
      },
    ],
    []
  );

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için

  // Intl.DateTimeFormat kullanarak tarih formatlama
  const formatDate = useCallback((date) => {
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
  }, []);

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

  // Manage columns from localStorage or default
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderMalzemeDepolari");
    const savedVisibility = localStorage.getItem("columnVisibilityMalzemeDepolari");
    const savedWidths = localStorage.getItem("columnWidthsMalzemeDepolari");

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

    localStorage.setItem("columnOrderMalzemeDepolari", JSON.stringify(order));
    localStorage.setItem("columnVisibilityMalzemeDepolari", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsMalzemeDepolari", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  // Save columns to localStorage
  useEffect(() => {
    localStorage.setItem("columnOrderMalzemeDepolari", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityMalzemeDepolari",
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
      "columnWidthsMalzemeDepolari",
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

  // Handle column resize
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

  // Filtered columns
  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // Handle drag and drop
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

  // Toggle column visibility
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

  // Reset columns
  const resetColumns = () => {
    localStorage.removeItem("columnOrderMalzemeDepolari");
    localStorage.removeItem("columnVisibilityMalzemeDepolari");
    localStorage.removeItem("columnWidthsMalzemeDepolari");
    window.location.reload();
  };

  // Kullanıcının dilini localStorage'den alın
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const currentLocale = localeMap[currentLang] || enUS;

  useEffect(() => {
    // Ay ve tarih formatını dil bazında ayarlayın
    setLocaleDateFormat(dateFormatMap[currentLang] || "MM/DD/YYYY");
    setLocaleTimeFormat(timeFormatMap[currentLang] || "HH:mm");
  }, [currentLang]);

  return (
    <div>
      <ConfigProvider locale={currentLocale}>
        <FormProvider {...formMethods}>
          {/* Modal for managing columns */}
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

          {/* Table */}
          <div
            style={{
              height: "calc(100vh - 200px)",
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: "15px",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <StyledButton onClick={() => setIsModalVisible(true)}>
                  <MenuOutlined />
                </StyledButton>
                <Input
                  style={{ width: "250px" }}
                  type="text"
                  placeholder="Arama yap..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={handleSearch}
                  // prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
                  suffix={<SearchOutlined style={{ color: "#0091ff" }} onClick={handleSearch} />}
                  allowClear
                />

                {/* <Filters onChange={handleBodyChange} /> */}
                {/* <StyledButton onClick={handleSearch} icon={<SearchOutlined />} /> */}
                {/* Other toolbar components */}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTableData} />
                <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
              </div>
            </div>
            <Spin spinning={loading}>
              <StyledTable
                components={components}
                rowSelection={rowSelection}
                columns={filteredColumns}
                dataSource={data}
                pagination={{
                  position: ["bottomRight"],
                  current: currentPage,
                  pageSize,
                  total: totalCount,
                  onChange: handlePageChange,
                  showTotal: (total, range) => `Toplam ${total}`,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showQuickJumper: true,
                  onShowSizeChange: (current, size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  },
                }}
                scroll={{ y: "calc(100vh - 335px)" }}
              />
            </Spin>
            <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />
          </div>
        </FormProvider>
      </ConfigProvider>
    </div>
  );
};

export default memo(MalzemeDepolari);
