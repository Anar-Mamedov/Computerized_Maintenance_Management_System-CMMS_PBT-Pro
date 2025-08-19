import React, { useCallback, useEffect, useState, useRef, useMemo, memo } from "react";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import Filters from "./filter/Filters";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, message, ConfigProvider } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "./ResizeStyle.css";
import AxiosInstance from "../../../../api/http";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components";
import { t } from "i18next";
import PropTypes from "prop-types";
import trTR from "antd/lib/locale/tr_TR";
import enUS from "antd/lib/locale/en_US";
import ruRU from "antd/lib/locale/ru_RU";
import azAZ from "antd/lib/locale/az_AZ";

const localeMap = {
  tr: trTR,
  en: enUS,
  ru: ruRU,
  az: azAZ,
};

// Date/time formats are derived automatically via Intl based on browser locale

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
ResizableTitle.propTypes = {
  onResize: PropTypes.func,
  width: PropTypes.number,
};
// Sütunların boyutlarını ayarlamak için kullanılan component sonu

// Sütunların sürüklenebilir olmasını sağlayan component

const DraggableRow = memo(({ id, text, style, ...restProps }) => {
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
DraggableRow.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.node,
  style: PropTypes.object,
};

// Sütunların sürüklenebilir olmasını sağlayan component sonu

const DurusTakibi = () => {
  const formMethods = useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false); // Set initial loading state to false
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // Total data count
  const [pageSize, setPageSize] = useState(10); // Page size
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  const prevBodyRef = useRef(body);

  // API call - memoized with useCallback to prevent recreation on every render
  const fetchData = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        // Create customfilter object with search keyword
        const customfilter = {
          ...(body.filters?.customfilter || {}),
          Kelime: searchTerm,
        };

        const response = await AxiosInstance.post(`GetMakineDurusList?pagingDeger=${page}&pageSize=${pageSize}`, customfilter);

        const total = response?.pagination?.total_records || 0;
        setTotalCount(total);
        setCurrentPage(page);
        setPageSize(pageSize);

        const list = Array.isArray(response?.data) ? response.data : [];
        const newData = list.map((item) => ({
          ...item,
          key: item.TB_MAKINE_DURUS_ID,
        }));

        if (newData.length > 0) {
          setData(newData);
        } else {
          message.warning(t("kayitBulunamadi"));
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error(t("hataOlustu"));
      } finally {
        setLoading(false);
      }
    },
    [body.filters, searchTerm]
  );

  // Combined useEffect for initial data fetch and body state changes
  useEffect(() => {
    // Initial data fetch or when body changes
    if (!prevBodyRef.current || JSON.stringify(body) !== JSON.stringify(prevBodyRef.current)) {
      fetchData(1, pageSize);
      prevBodyRef.current = { ...body };
    }
  }, [body, fetchData, pageSize]);

  // Search handling
  // Define handleSearch function
  const handleSearch = useCallback(() => {
    fetchData(1, pageSize);
  }, [fetchData, pageSize]);

  const handleTableChange = (page, pageSize) => {
    fetchData(page, pageSize);
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
    fetchData(1, pageSize);
  }, [fetchData, pageSize]);

  // Intl.DateTimeFormat kullanarak tarih ve saat formatlama (locale-aware)
  const formatDate = useCallback((date) => {
    if (!date) return "";

    const sampleDate = new Date(2021, 0, 21);
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);

    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long";
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short";
    } else {
      monthFormat = "2-digit";
    }

    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  }, []);

  const formatTime = useCallback((time) => {
    if (!time || time.trim() === "") return "";
    try {
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        console.error("Invalid time format:", time);
        return "";
      }
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
      });
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  }, []);

  // Columns definition (adjust as needed)
  const initialColumns = useMemo(
    () => [
      {
        title: t("isEmriNo"),
        dataIndex: "ISEMRINO",
        key: "ISEMRINO",
        width: 130,
        ellipsis: true,
        visible: true,
        render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
        sorter: (a, b) => {
          if (a.ISEMRINO === null) return -1;
          if (b.ISEMRINO === null) return 1;
          return String(a.ISEMRINO).localeCompare(String(b.ISEMRINO));
        },
      },
      {
        title: t("makineKodu"),
        dataIndex: "MKN_KOD",
        key: "MKN_KOD",
        width: 140,
        ellipsis: true,
        visible: true,
        render: (text, record) => <a onClick={() => onRowClick(record)}>{text}</a>,
        sorter: (a, b) => {
          if (a.MKN_KOD === null) return -1;
          if (b.MKN_KOD === null) return 1;
          return String(a.MKN_KOD).localeCompare(String(b.MKN_KOD));
        },
      },
      {
        title: t("makineTanimi"),
        dataIndex: "MKN_TANIM",
        key: "MKN_TANIM",
        width: 220,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKN_TANIM === null) return -1;
          if (b.MKN_TANIM === null) return 1;
          return String(a.MKN_TANIM).localeCompare(String(b.MKN_TANIM));
        },
      },
      {
        title: t("durusNedeni"),
        dataIndex: "MKD_NEDEN",
        key: "MKD_NEDEN",
        width: 140,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_NEDEN === null) return -1;
          if (b.MKD_NEDEN === null) return 1;
          return String(a.MKD_NEDEN).localeCompare(String(b.MKD_NEDEN));
        },
      },
      {
        title: t("baslamaTarihi"),
        dataIndex: "MKD_BASLAMA_TARIH",
        key: "MKD_BASLAMA_TARIH",
        width: 140,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_BASLAMA_TARIH === null) return -1;
          if (b.MKD_BASLAMA_TARIH === null) return 1;
          return String(a.MKD_BASLAMA_TARIH).localeCompare(String(b.MKD_BASLAMA_TARIH));
        },
        render: (text) => formatDate(text),
      },
      {
        title: t("baslamaSaati"),
        dataIndex: "MKD_BASLAMA_SAAT",
        key: "MKD_BASLAMA_SAAT",
        width: 120,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_BASLAMA_SAAT === null) return -1;
          if (b.MKD_BASLAMA_SAAT === null) return 1;
          return String(a.MKD_BASLAMA_SAAT).localeCompare(String(b.MKD_BASLAMA_SAAT));
        },
        render: (text) => formatTime(text),
      },
      {
        title: t("bitisTarihi"),
        dataIndex: "MKD_BITIS_TARIH",
        key: "MKD_BITIS_TARIH",
        width: 140,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_BITIS_TARIH === null) return -1;
          if (b.MKD_BITIS_TARIH === null) return 1;
          return String(a.MKD_BITIS_TARIH).localeCompare(String(b.MKD_BITIS_TARIH));
        },
        render: (text) => formatDate(text),
      },
      {
        title: t("bitisSaati"),
        dataIndex: "MKD_BITIS_SAAT",
        key: "MKD_BITIS_SAAT",
        width: 120,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_BITIS_SAAT === null) return -1;
          if (b.MKD_BITIS_SAAT === null) return 1;
          return String(a.MKD_BITIS_SAAT).localeCompare(String(b.MKD_BITIS_SAAT));
        },
        render: (text) => formatTime(text),
      },
      {
        title: t("sureDakika"),
        dataIndex: "MKD_SURE",
        key: "MKD_SURE",
        width: 120,
        ellipsis: true,
        visible: true,
        sorter: (a, b) => {
          if (a.MKD_SURE === null) return -1;
          if (b.MKD_SURE === null) return 1;
          return Number(a.MKD_SURE) - Number(b.MKD_SURE);
        },
      },

      {
        title: t("planli"),
        dataIndex: "MKD_PLANLI",
        key: "MKD_PLANLI",
        width: 110,
        ellipsis: true,
        visible: true,
        render: (val) =>
          val ? (
            <Tag color="green">
              <CheckOutlined />
            </Tag>
          ) : (
            <Tag color="red">
              <CloseOutlined />
            </Tag>
          ),
        sorter: (a, b) => {
          if (a.MKD_PLANLI === null) return -1;
          if (b.MKD_PLANLI === null) return 1;
          return Number(a.MKD_PLANLI) - Number(b.MKD_PLANLI);
        },
      },
      {
        title: t("durusMaliyeti"),
        dataIndex: "MKD_SAAT_MALIYET",
        key: "MKD_SAAT_MALIYET",
        width: 140,
        ellipsis: true,
        visible: true,
        render: (text) => <span>{Number(text || 0).toFixed(2)}</span>,
        sorter: (a, b) => {
          if (a.MKD_SAAT_MALIYET === null) return -1;
          if (b.MKD_SAAT_MALIYET === null) return 1;
          return Number(a.MKD_SAAT_MALIYET) - Number(b.MKD_SAAT_MALIYET);
        },
      },
      {
        title: t("toplamMaliyet"),
        dataIndex: "MKD_TOPLAM_MALIYET",
        key: "MKD_TOPLAM_MALIYET",
        width: 160,
        ellipsis: true,
        visible: true,
        render: (text) => <span>{Number(text || 0).toFixed(2)}</span>,
        sorter: (a, b) => {
          if (a.MKD_TOPLAM_MALIYET === null) return -1;
          if (b.MKD_TOPLAM_MALIYET === null) return 1;
          return Number(a.MKD_TOPLAM_MALIYET) - Number(b.MKD_TOPLAM_MALIYET);
        },
      },
      {
        title: t("aciklama"),
        dataIndex: "MKD_ACIKLAMA",
        key: "MKD_ACIKLAMA",
        width: 140,
        ellipsis: true,
        visible: true,
        render: (text) => <span>{text}</span>,
        sorter: (a, b) => {
          const aciklamaA = a.MKD_ACIKLAMA ? a.MKD_ACIKLAMA.toLowerCase() : "";
          const aciklamaB = b.MKD_ACIKLAMA ? b.MKD_ACIKLAMA.toLowerCase() : "";
          if (aciklamaA < aciklamaB) return -1;
          if (aciklamaA > aciklamaB) return 1;
          return 0;
        },
      },
    ],
    [formatDate, formatTime]
  );

  // tarihleri kullanıcının local ayarlarına bakarak formatlayıp ekrana o şekilde yazdırmak için sonu

  // Manage columns from localStorage or default
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderDurusTakibi");
    const savedVisibility = localStorage.getItem("columnVisibilityDurusTakibi");
    const savedWidths = localStorage.getItem("columnWidthsDurusTakibi");

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

    localStorage.setItem("columnOrderDurusTakibi", JSON.stringify(order));
    localStorage.setItem("columnVisibilityDurusTakibi", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsDurusTakibi", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  // Save columns to localStorage
  useEffect(() => {
    localStorage.setItem("columnOrderDurusTakibi", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityDurusTakibi",
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
      "columnWidthsDurusTakibi",
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
    localStorage.removeItem("columnOrderDurusTakibi");
    localStorage.removeItem("columnVisibilityDurusTakibi");
    localStorage.removeItem("columnWidthsDurusTakibi");
    window.location.reload();
  };

  // Kullanıcının dilini localStorage'den alın
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const currentLocale = localeMap[currentLang] || enUS;

  // Date/time formats are handled by Intl automatically

  // filtreleme işlemi için kullanılan useEffect
  const handleBodyChange = useCallback((type, newBody) => {
    setBody((prevBody) => {
      if (type === "filters") {
        // If newBody is a function, call it with previous filters
        const updatedFilters =
          typeof newBody === "function"
            ? newBody(prevBody.filters)
            : {
                ...prevBody.filters,
                ...newBody,
              };

        return {
          ...prevBody,
          filters: updatedFilters,
        };
      }
      return {
        ...prevBody,
        [type]: newBody,
      };
    });
    setCurrentPage(1);
  }, []);
  // filtreleme işlemi için kullanılan useEffect son

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
                  width: "100%",
                  maxWidth: "935px",
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={handleSearch}
                  // prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
                  suffix={<SearchOutlined style={{ color: "#0091ff" }} onClick={handleSearch} />}
                />

                <Filters onChange={handleBodyChange} />
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
                  current: currentPage,
                  total: totalCount,
                  pageSize: pageSize,
                  showTotal: (total) => `Toplam ${total}`,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showQuickJumper: true,
                  onChange: handleTableChange,
                  onShowSizeChange: (current, size) => {
                    setPageSize(size);
                    fetchData(1, size);
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

const MemoizedDurusTakibi = memo(DurusTakibi);
export default MemoizedDurusTakibi;
