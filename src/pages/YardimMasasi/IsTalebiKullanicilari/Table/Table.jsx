import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, message } from "antd";
import { HolderOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove, useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css"; // Ensure styles are imported
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import EditDrawer from "../Update/EditDrawer";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import EditDrawer1 from "../../../YardimMasasi/IsTalepleri/Update/EditDrawer";
import { useFormContext } from "react-hook-form";

const { Text } = Typography;

// Resizable Title Component
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  const handleStyle = {
    position: "absolute",
    bottom: 0,
    right: "-5px",
    width: "10px",
    height: "100%",
    zIndex: 2,
    cursor: "col-resize",
    padding: "0px",
    backgroundColor: "transparent",
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
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// Draggable Row Component
const DraggableRow = ({ id, text }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const styleWithTransform = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    backgroundColor: isDragging ? "#f0f0f0" : "white",
    borderBottom: "1px solid #f0f0f0",
  };

  return (
    <div ref={setNodeRef} style={styleWithTransform} {...attributes}>
      <HolderOutlined style={{ cursor: "grab" }} {...listeners} />
      <Text>{text}</Text>
    </div>
  );
};

const MainTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]); // Store all data for frontend operations
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [label, setLabel] = useState("Yükleniyor...");
  const [editDrawer1Visible, setEditDrawer1Visible] = useState(false);
  const [editDrawer1Data, setEditDrawer1Data] = useState(null);

  // Drawer State
  const [drawer, setDrawer] = useState({
    visible: false,
    data: null,
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const initialColumns = [
    {
      title: "Kullanıcı Kodu",
      dataIndex: "ISK_KOD",
      key: "ISK_KOD",
      width: 120,
      ellipsis: true,
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
      sorter: (a, b) => {
        if (a.ISK_KOD === null) return -1;
        if (b.ISK_KOD === null) return 1;
        return a.ISK_KOD.localeCompare(b.ISK_KOD);
      },
    },

    {
      title: "Kullanıcı Adı",
      dataIndex: "ISK_ISIM",
      key: "ISK_ISIM",
      width: 250,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.ISK_ISIM === null) return -1;
        if (b.ISK_ISIM === null) return 1;
        return a.ISK_ISIM.localeCompare(b.ISK_ISIM);
      },
      visible: true, // Varsayılan olarak açık
      render: (text, record) => (
        <a onClick={() => onRowClick(record)}>{text}</a> // Updated this line
      ),
    },

    {
      title: "Ünvan",
      dataIndex: "ISK_UNVAN",
      key: "ISK_UNVAN",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.ISK_UNVAN === null) return -1;
        if (b.ISK_UNVAN === null) return 1;
        return a.ISK_UNVAN.localeCompare(b.ISK_UNVAN);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Kullanıcı Tipi",
      dataIndex: "ISK_KULLANICI_TIP",
      key: "ISK_KULLANICI_TIP",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.ISK_KULLANICI_TIP === null) return -1;
        if (b.ISK_KULLANICI_TIP === null) return 1;
        return a.ISK_KULLANICI_TIP.localeCompare(b.ISK_KULLANICI_TIP);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Departman",
      dataIndex: "ISK_DEPARTMAN",
      key: "ISK_DEPARTMAN",
      width: 150,
      ellipsis: true,
      sorter: (a, b) => {
        if (a.ISK_DEPARTMAN === null) return -1;
        if (b.ISK_DEPARTMAN === null) return 1;
        return a.ISK_DEPARTMAN.localeCompare(b.ISK_DEPARTMAN);
      },
      visible: true, // Varsayılan olarak açık
    },

    {
      title: "Lokasyon",
      dataIndex: "ISK_LOKASYON",
      key: "ISK_LOKASYON",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_LOKASYON === null && b.ISK_LOKASYON === null) return 0;
        if (a.ISK_LOKASYON === null) return 1;
        if (b.ISK_LOKASYON === null) return -1;
        return a.ISK_LOKASYON.localeCompare(b.ISK_LOKASYON);
      },
    },

    {
      title: "Telefon",
      dataIndex: "ISK_TELEFON_1",
      key: "ISK_TELEFON_1",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_TELEFON_1 === null && b.ISK_TELEFON_1 === null) return 0;
        if (a.ISK_TELEFON_1 === null) return 1;
        if (b.ISK_TELEFON_1 === null) return -1;
        return a.ISK_TELEFON_1.localeCompare(b.ISK_TELEFON_1);
      },
    },

    {
      title: "Dahili",
      dataIndex: "ISK_DAHILI",
      key: "ISK_DAHILI",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_DAHILI === null && b.ISK_DAHILI === null) return 0;
        if (a.ISK_DAHILI === null) return 1;
        if (b.ISK_DAHILI === null) return -1;
        return a.ISK_DAHILI.localeCompare(b.ISK_DAHILI);
      },
    },

    {
      title: "GSM",
      dataIndex: "ISK_GSM",
      key: "ISK_GSM",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_GSM === null && b.ISK_GSM === null) return 0;
        if (a.ISK_GSM === null) return 1;
        if (b.ISK_GSM === null) return -1;
        return a.ISK_GSM.localeCompare(b.ISK_GSM);
      },
    },

    {
      title: "E-Mail",
      dataIndex: "ISK_MAIL",
      key: "ISK_MAIL",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_MAIL === null && b.ISK_MAIL === null) return 0;
        if (a.ISK_MAIL === null) return 1;
        if (b.ISK_MAIL === null) return -1;
        return a.ISK_MAIL.localeCompare(b.ISK_MAIL);
      },
    },

    {
      title: "Personel Adı",
      dataIndex: "ISK_PERSONEL_ISIM",
      key: "ISK_PERSONEL_ISIM",
      width: 150,
      ellipsis: true,

      visible: true, // Varsayılan olarak açık
      sorter: (a, b) => {
        if (a.ISK_PERSONEL_ISIM === null && b.ISK_PERSONEL_ISIM === null) return 0;
        if (a.ISK_PERSONEL_ISIM === null) return 1;
        if (b.ISK_PERSONEL_ISIM === null) return -1;
        return a.ISK_PERSONEL_ISIM.localeCompare(b.ISK_PERSONEL_ISIM);
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

  // Fetch All Data Once
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get("GetIsTalepKullaniciList");
      if (response && Array.isArray(response)) {
        const formattedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TALEBI_KULLANICI_ID,
        }));
        setAllData(formattedData);
        setData(formattedData); // Initialize with all data
        setLoading(false);
      } else {
        console.error("API response is not an array");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const filteredData = allData.filter((item) => Object.values(item).join(" ").toLowerCase().includes(searchTerm.toLowerCase()));
      setData(filteredData);
      setCurrentPage(1); // Reset to first page on search
    }, 300); // Debounce time

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchTerm, allData]);

  // Handle Pagination
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Handle Row Selection
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setValue("selectedLokasyonId", newSelectedRowKeys.length > 0 ? newSelectedRowKeys[0] : null);
    const newSelectedRows = allData.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Handle Row Click
  const onRowClick = (record) => {
    setDrawer({ visible: true, data: record });
  };

  // Refresh Table Data
  const refreshTableData = useCallback(() => {
    fetchAllData();
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  // Columns State Management
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem("columnOrderIsTalebiKullanicilari");
    const savedVisibility = localStorage.getItem("columnVisibilityIsTalebiKullanicilari");
    const savedWidths = localStorage.getItem("columnWidthsIsTalebiKullanicilari");

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

    localStorage.setItem("columnOrderIsTalebiKullanicilari", JSON.stringify(order));
    localStorage.setItem("columnVisibilityIsTalebiKullanicilari", JSON.stringify(visibility));
    localStorage.setItem("columnWidthsIsTalebiKullanicilari", JSON.stringify(widths));

    return order.map((key) => {
      const column = initialColumns.find((col) => col.key === key);
      return { ...column, visible: visibility[key], width: widths[key] };
    });
  });

  // Save Columns to Local Storage
  useEffect(() => {
    localStorage.setItem("columnOrderIsTalebiKullanicilari", JSON.stringify(columns.map((col) => col.key)));
    localStorage.setItem(
      "columnVisibilityIsTalebiKullanicilari",
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
      "columnWidthsIsTalebiKullanicilari",
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

  // Handle Column Resize
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

  // Filter Visible Columns
  const filteredColumns = mergedColumns.filter((col) => col.visible);

  // Handle Column Drag End
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.key === active.id);
      const newIndex = columns.findIndex((col) => col.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
      } else {
        console.error(`Column with key ${active.id} or ${over.id} does not exist.`);
      }
    }
  };

  // Toggle Column Visibility
  const toggleVisibility = (key, checked) => {
    setColumns((prev) => prev.map((col) => (col.key === key ? { ...col, visible: checked } : col)));
  };

  // Reset Columns to Default
  const resetColumns = () => {
    localStorage.removeItem("columnOrderIsTalebiKullanicilari");
    localStorage.removeItem("columnVisibilityIsTalebiKullanicilari");
    localStorage.removeItem("columnWidthsIsTalebiKullanicilari");
    window.location.reload();
  };

  return (
    <>
      {/* Column Management Modal */}
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
          {/* Toggle Column Visibility */}
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
            <div style={{ maxHeight: "400px", overflow: "auto" }}>
              {initialColumns.map((col) => (
                <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }} key={col.key}>
                  <Checkbox checked={columns.find((column) => column.key === col.key)?.visible || false} onChange={(e) => toggleVisibility(col.key, e.target.checked)} />
                  <Text>{col.title}</Text>
                </div>
              ))}
            </div>
          </div>

          {/* Drag and Drop Column Ordering */}
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
              <div style={{ maxHeight: "400px", overflow: "auto" }}>
                <SortableContext items={filteredColumns.map((col) => col.key)} strategy={verticalListSortingStrategy}>
                  {filteredColumns.map((col) => (
                    <DraggableRow key={col.key} id={col.key} text={col.title} />
                  ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </div>
      </Modal>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
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
            maxWidth: "935px",
            width: "100%",
          }}
        >
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0px 8px",
              height: "32px",
            }}
            onClick={() => setIsModalVisible(true)}
          >
            <MenuOutlined />
          </Button>
          <Input
            style={{ width: "250px" }}
            type="text"
            placeholder="Arama yap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
            allowClear
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu
            selectedRows={selectedRows}
            refreshTableData={refreshTableData}
            // Assuming 'onayCheck' is needed here
          />
          <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} onRefresh={refreshTableData} />
        </div>
      </div>

      {/* Table */}
      <Spin spinning={loading}>
        <Table
          components={components}
          rowSelection={rowSelection}
          columns={filteredColumns}
          dataSource={data}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `Toplam ${total} kayıt`,
            showQuickJumper: true,
            onChange: handleTableChange,
          }}
          scroll={{ y: "calc(100vh - 370px)" }}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
          rowClassName={(record) => (record.ISK_ACILIS_DURUM === 0 ? "boldRow" : "")}
        />
      </Spin>

      {/* Drawers */}
      <EditDrawer selectedRow={drawer.data} onDrawerClose={() => setDrawer({ ...drawer, visible: false })} drawerVisible={drawer.visible} onRefresh={refreshTableData} />

      {editDrawer1Visible && (
        <EditDrawer1 selectedRow={editDrawer1Data} onDrawerClose={() => setEditDrawer1Visible(false)} drawerVisible={editDrawer1Visible} onRefresh={refreshTableData} />
      )}
    </>
  );
};

export default MainTable;
