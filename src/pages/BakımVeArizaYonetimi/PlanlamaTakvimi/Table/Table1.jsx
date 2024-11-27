// Table1.jsx

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Button, Checkbox, Spin, message, Popover, Pagination, Typography } from "antd";
import AxiosInstance from "../../../../api/http";
import Filters from "./filter/Filters";
import { useFormContext } from "react-hook-form";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import dayjs from "dayjs";
import "dayjs/locale/tr";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { FcOk, FcLeave, FcHighPriority, FcExpired, FcCancel, FcFlashAuto, FcPlanner, FcDisclaimer } from "react-icons/fc";
import { VariableSizeGrid as Grid } from "react-window";
import "./MainTable.css"; // CSS dosyanız

const { Text } = Typography;

// Extend dayjs with necessary plugins
dayjs.locale("tr");
dayjs.extend(weekOfYear);

// Icon mapping
const icons = {
  Planlanan: <FcPlanner style={{ fontSize: "20px" }} />,
  Yaklaşan: <FcExpired style={{ fontSize: "20px" }} />,
  "Süresi Geçmiş": <FcHighPriority style={{ fontSize: "20px" }} />,
  Yapılmadı: <FcCancel style={{ fontSize: "20px" }} />,
  "Devam Eden": <FcFlashAuto style={{ fontSize: "20px" }} />,
  "Zamanında Yapılan": <FcOk style={{ fontSize: "20px" }} />,
  "Gecikmeli Yapılan": <FcLeave style={{ fontSize: "20px" }} />,
  "İptal Edilen": <FcDisclaimer style={{ fontSize: "20px" }} />,
};

// Helper function to get icons
const getIconForValue = (value) => {
  return icons[value] || value;
};

// Helper function to generate columns and monthWeekDayMap
const generateColumns = (startDate, endDate) => {
  const columns = [
    {
      title: "Makine",
      dataIndex: "machine",
      key: "machine",
      width: 200, // Sabit genişlik
      fixed: "left",
    },
  ];

  const monthWeekDayMap = []; // Ay ve hafta bilgilerini tutacağımız dizi

  let currentDay = dayjs(startDate);
  while (currentDay <= dayjs(endDate)) {
    const month = currentDay.format("MMMM YYYY");
    const week = `Hafta ${currentDay.week()}`;
    const day = currentDay.format("dddd");
    const formattedDay = currentDay.format("YYYY-MM-DD");

    columns.push({
      title: day,
      dataIndex: formattedDay,
      key: formattedDay,
      width: 100, // Kolon genişliği sabit
    });

    monthWeekDayMap.push({
      month,
      week,
      day,
      dataIndex: formattedDay,
    });

    currentDay = currentDay.add(1, "day");
  }

  return { columns, monthWeekDayMap };
};

// Header Component
const Header = ({ columns, monthWeekDayMap }) => {
  // Ayları gruplandırma
  const monthGroups = [];
  let currentMonth = null;
  let currentMonthStartIndex = 1; // İlk kolon makine adı olduğu için 1'den başlıyoruz
  monthWeekDayMap.forEach((item, index) => {
    const columnIndex = index + 1; // columns[0] 'machine' kolonudur
    if (item.month !== currentMonth) {
      if (currentMonth !== null) {
        // Önceki ay grubunu ekle
        monthGroups.push({
          month: currentMonth,
          startIndex: currentMonthStartIndex,
          endIndex: columnIndex - 1,
        });
      }
      currentMonth = item.month;
      currentMonthStartIndex = columnIndex;
    }
  });
  // Son ayı ekleme
  if (currentMonth !== null) {
    monthGroups.push({
      month: currentMonth,
      startIndex: currentMonthStartIndex,
      endIndex: columns.length - 1,
    });
  }

  // Haftaları gruplandırma
  const weekGroups = [];
  let currentWeek = null;
  let currentWeekStartIndex = 1;
  monthWeekDayMap.forEach((item, index) => {
    const columnIndex = index + 1;
    if (item.week !== currentWeek) {
      if (currentWeek !== null) {
        weekGroups.push({
          week: currentWeek,
          startIndex: currentWeekStartIndex,
          endIndex: columnIndex - 1,
        });
      }
      currentWeek = item.week;
      currentWeekStartIndex = columnIndex;
    }
  });
  // Son haftayı ekleme
  if (currentWeek !== null) {
    weekGroups.push({
      week: currentWeek,
      startIndex: currentWeekStartIndex,
      endIndex: columns.length - 1,
    });
  }

  // Build gridTemplateColumns with safe access
  const gridTemplateColumns =
    columns.length > 0
      ? `${columns[0].width}px ${columns
          .slice(1)
          .map((col) => `${col.width}px`)
          .join(" ")}`
      : "auto";

  return (
    <div
      className="header-container"
      style={{
        display: "grid",
        gridTemplateRows: "35px 35px 35px", // üç satır
        gridTemplateColumns: gridTemplateColumns,
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      {/* Makine Header Spanning Three Rows */}
      <div
        className="header-cell"
        style={{
          gridRow: "1 / span 3",
          gridColumn: "1 / 2",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        Makine
      </div>

      {/* Ay satırı */}
      {monthGroups.map((group, index) => (
        <div
          key={`month-${index}`}
          className="header-cell"
          style={{
            gridRow: "1 / 2",
            gridColumn: `${group.startIndex + 1} / ${group.endIndex + 2}`,
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {group.month}
        </div>
      ))}

      {/* Haftalar satırı */}
      {weekGroups.map((group, index) => (
        <div
          key={`week-${index}`}
          className="header-cell"
          style={{
            gridRow: "2 / 3",
            gridColumn: `${group.startIndex + 1} / ${group.endIndex + 2}`,
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {group.week}
        </div>
      ))}

      {/* Gün satırı */}
      {monthWeekDayMap.map((item, index) => (
        <div
          key={`day-${index}`}
          className="header-cell"
          style={{
            gridRow: "3 / 4",
            gridColumn: `${index + 2} / ${index + 3}`,
            borderRight: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {item.day}
        </div>
      ))}
    </div>
  );
};

// VirtualTable Component
const VirtualTable = ({
  columns,
  dataSource,
  width,
  height,
  checkedState,
  handleCheckboxChange,
  flattenedData,
  currentPageData,
  monthWeekDayMap,
  totalTableWidth,
  expandedKeys,
  toggleExpand,
}) => {
  const gridRef = useRef();

  const columnCount = columns.length;
  const rowCount = currentPageData.length;

  const getColumnWidthInternal = useCallback(
    (index) => {
      if (index < 0 || index >= columns.length) {
        console.warn(`Index ${index} is out of bounds for columns array of length ${columns.length}`);
        return 100; // Varsayılan genişlik
      }
      const { width } = columns[index];
      return width || 100;
    },
    [columns]
  );

  const getRowHeight = useCallback(() => {
    return 54; // Satır yüksekliği
  }, []);

  const itemData = useMemo(() => {
    return {
      columns,
      checkedState,
      handleCheckboxChange,
      getIconForValue,
      flattenedData,
      dataToRender: currentPageData,
      expandedKeys,
      toggleExpand,
    };
  }, [columns, checkedState, handleCheckboxChange, flattenedData, currentPageData, expandedKeys, toggleExpand]);

  // Header yüksekliği (3 satır)
  const headerHeight = 35 * 3; // CSS'deki header satır yüksekliğine uyacak şekilde ayarlandı

  // Tablo genişliğini hesaplıyoruz
  const tableWidth = useMemo(() => {
    return columns.reduce((total, column) => total + (column.width || 100), 0);
  }, [columns]);

  return (
    <div style={{ width: "100%", height: "100%", overflowX: "auto" }}>
      <div
        style={{
          width: tableWidth,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        {columns.length > 0 && monthWeekDayMap.length > 0 && <Header columns={columns} monthWeekDayMap={monthWeekDayMap} />}

        {/* Grid */}
        <Grid
          className="VirtualizedGrid"
          ref={gridRef}
          columnCount={columnCount}
          columnWidth={getColumnWidthInternal}
          height={height - headerHeight}
          rowCount={rowCount}
          rowHeight={getRowHeight}
          width={tableWidth}
          itemData={itemData}
        >
          {CellComponent}
        </Grid>
      </div>
    </div>
  );
};

// MainTable Component
const MainTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]); // Tablo verileri
  const [checkedState, setCheckedState] = useState({}); // Checkbox durumları
  const [selectedCells, setSelectedCells] = useState([]); // Seçili hücre bilgileri
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState({
    keyword: "",
    filters: {},
  });

  // Genişletilmiş satırları tutan durum
  const [expandedKeys, setExpandedKeys] = useState({}); // Başlangıçta boş

  const toggleExpand = useCallback((key) => {
    setExpandedKeys((prevExpandedKeys) => ({
      ...prevExpandedKeys,
      [key]: !prevExpandedKeys[key],
    }));
  }, []);

  // Sayfalama için durumlar
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Sayfa başına satır sayısı

  // Table height state
  const [tableHeight, setTableHeight] = useState(window.innerHeight - 200); // Düzeninize göre ayarlayın

  // Ekran boyutu değiştiğinde tablo yüksekliğini güncelle
  useEffect(() => {
    const handleResize = () => {
      setTableHeight(window.innerHeight - 200); // Düzeninize göre ayarlayın
    };

    window.addEventListener("resize", handleResize);

    // Temizlik
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Checkbox değişimini yönetme fonksiyonu
  const handleCheckboxChange = useCallback(
    (key, text, record, column) => {
      setCheckedState((prevCheckedState) => {
        const isSelected = prevCheckedState[key] || false;
        const newCheckedState = {
          ...prevCheckedState,
          [key]: !isSelected,
        };

        // Seçili hücreleri güncelle
        setSelectedCells((prevCells) => {
          const makineID = record.key ? record.key.split("-").shift() : null;
          const bakimID = record.key ? record.key.split("-")[1] : null;

          // Makine değeri
          const parentRecord = data.find((item) => item.key === record.parentKey);
          const machineValue = record.isParent ? record.machine : parentRecord?.machine || "Kayıt bulunamadı";

          // Tarih
          const date = dayjs(column.dataIndex, "YYYY-MM-DD").format("DD.MM.YYYY");

          const cellInfo = {
            key,
            machineValue,
            recordMachine: record.machine,
            status: text,
            date,
            makineID,
            bakimID,
          };

          if (isSelected) {
            // Hücreyi seçili hücrelerden çıkar
            return prevCells.filter((cell) => cell.key !== key);
          } else {
            // Hücreyi seçili hücrelere ekle
            return [...prevCells, cellInfo];
          }
        });

        return newCheckedState;
      });
    },
    [data]
  );

  // Kolonları oluştur
  const { columns, monthWeekDayMap } = useMemo(() => {
    return startDate && endDate ? generateColumns(startDate, endDate) : { columns: [], monthWeekDayMap: [] };
  }, [startDate, endDate]);

  const totalTableWidth = useMemo(() => {
    return columns.reduce((total, column) => total + (column.width || 100), 0);
  }, [columns]);

  const { setValue } = useFormContext();

  // Veri çekme işlemi
  useEffect(() => {
    fetchEquipmentData(body);
  }, [body]);

  const fetchEquipmentData = async (body) => {
    const { filters = {} } = body || {};

    setLoading(true);

    if (Object.keys(filters).length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await AxiosInstance.post(`PeriyodikBakimPlanlamaTakvimi`, filters);
      if (response) {
        const responseObject = JSON.parse(response);

        const groupedData = responseObject.reduce((acc, item) => {
          if (!acc[item.MAKINE_ID]) {
            acc[item.MAKINE_ID] = {
              key: item.MAKINE_ID ? item.MAKINE_ID.toString() : `makine-${item.MAKINE_TANIM}`,
              machine: item.MAKINE_TANIM,
              isParent: true,
              children: [],
            };
          }
          let child = {
            key: `${item.MAKINE_ID}-${item.PBAKIM_ID}`,
            machine: item.BAKIM_TANIM,
            parentKey: item.MAKINE_ID ? item.MAKINE_ID.toString() : `makine-${item.MAKINE_TANIM}`,
            isParent: false,
          };
          const startDateDayjs = dayjs(startDate);
          const endDateDayjs = dayjs(endDate);
          const daysDiff = endDateDayjs.diff(startDateDayjs, "day");

          let currentDay = startDateDayjs;
          for (let i = 1; i <= daysDiff + 1; i++) {
            const day = currentDay.format("YYYY-MM-DD");
            child[day] = item[i];
            currentDay = currentDay.add(1, "day");
          }
          acc[item.MAKINE_ID].children.push(child);
          return acc;
        }, {});
        const newData = Object.values(groupedData);
        setData(newData);

        // Initialize all parent rows as expanded
        const allParentKeys = newData.map((item) => item.key);
        const initialExpandedKeys = {};
        allParentKeys.forEach((key) => {
          initialExpandedKeys[key] = true;
        });
        setExpandedKeys(initialExpandedKeys);

        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
      if (navigator.onLine) {
        message.error("Hata Mesajı: " + error.message);
      } else {
        message.error("Internet Bağlantısı Mevcut Değil.");
      }
    }
  };

  // Handle body changes from filters
  const handleBodyChange = useCallback((type, newBody) => {
    setStartDate(newBody.baslamaTarihi);
    setEndDate(newBody.bitisTarihi);
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
  }, []);

  // CSV indirme fonksiyonu
  const downloadCSV = () => {
    // CSV indirme fonksiyonunuz
    // Örnek olarak:
    const headers = columns.map((col) => `"${col.title}"`).join(",");
    const rows = data
      .flatMap((item) => {
        if (item.isParent && item.children) {
          return item.children.map((child) => {
            const row = [`"${item.machine}"`, ...columns.slice(1).map((col) => `"${child[col.dataIndex] || ""}"`)];
            return row.join(",");
          });
        }
        return [];
      })
      .join("\n");

    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Flatten data based on expanded keys
  const flattenedData = useMemo(() => {
    if (!data) return [];
    const flatten = (nodes) => {
      let result = [];
      nodes.forEach((node) => {
        result.push({ ...node, depth: 0 });
        if (node.isParent && expandedKeys[node.key] && node.children && node.children.length > 0) {
          node.children.forEach((child) => {
            result.push({ ...child, depth: 1 });
          });
        }
      });
      return result;
    };
    return flatten(data);
  }, [data, expandedKeys]);

  // Paginate data
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return flattenedData.slice(startIndex, startIndex + pageSize);
  }, [flattenedData, currentPage, pageSize]);

  // Cell component
  const CellComponent = React.memo(function Cell({ columnIndex, rowIndex, style, data }) {
    const { checkedState, handleCheckboxChange, getIconForValue, columns, dataToRender, flattenedData, expandedKeys, toggleExpand } = data;

    const record = dataToRender[rowIndex];
    if (!record) {
      console.error(`No record found at rowIndex ${rowIndex}`);
      return null;
    }

    const column = columns[columnIndex];
    if (!column) {
      console.error(`No column found at columnIndex ${columnIndex}`);
      return null;
    }

    const dataIndex = column.dataIndex;
    const text = record[dataIndex];

    const key = record.key ? `${record.key}-${dataIndex}` : `row-${rowIndex}-col-${columnIndex}`;
    const isChecked = checkedState[key] || false;

    // Get machine value
    const parentRecord = flattenedData.find((item) => item.key === record.parentKey);
    const machineValue = record.isParent ? record.machine : parentRecord?.machine || "Kayıt bulunamadı";

    const date = dayjs(dataIndex, "YYYY-MM-DD").format("DD.MM.YYYY");

    // Apply class names based on conditions
    const cellClassNames = ["virtual-table-cell", record.isParent ? "virtual-table-row-parent" : "virtual-table-row-child", isChecked ? "virtual-table-cell-checked" : ""]
      .filter(Boolean)
      .join(" ");

    if (dataIndex === "machine") {
      const indentation = (record.depth || 0) * 40; // Her derinlik için 40px girinti
      return (
        <div
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingLeft: indentation,
            boxSizing: "border-box",
            borderBottom: "1px solid #f0f0f0",
            borderRight: "1px solid #f0f0f0",
            backgroundColor: record.isParent ? "#fafafa" : "white",
            fontWeight: record.isParent ? "600" : "normal",
          }}
          className={cellClassNames}
        >
          {record.isParent && (
            <div
              onClick={() => toggleExpand(record.key)}
              style={{
                marginRight: 8,
                marginLeft: 8,
                border: "1px solid #80808091",
                borderRadius: "5px",
                padding: "0px 3px",
                fontWeight: "300",
                cursor: "pointer",
              }}
            >
              {expandedKeys[record.key] ? "-" : "+"}
            </div>
          )}
          <Text style={{ whiteSpace: "nowrap" }}>{record.machine}</Text>
        </div>
      );
    } else if (text) {
      return (
        <div
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
            borderRight: "1px solid #f0f0f0",
            backgroundColor: isChecked ? "#188fff1d" : "white",
          }}
          className={cellClassNames}
        >
          <Popover
            content={
              <div>
                {`Makine: ${machineValue}`}
                <br />
                {`Bakım: ${record.machine}`}
                <br />
                {`Durum: ${text}`}
                <br />
                {`Tarih: ${date}`}
              </div>
            }
            title="Hücre Detayı"
            trigger="hover"
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => handleCheckboxChange(key, text, record, column)}
            >
              <Checkbox
                checked={isChecked}
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  zIndex: 1,
                  opacity: 0,
                }}
              />
              {getIconForValue(text)}
            </div>
          </Popover>
        </div>
      );
    } else {
      return <div style={style} className={cellClassNames}></div>;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 170px)",
      }}
    >
      {/* Üstteki diğer bileşenler (filtreler, butonlar vs.) */}
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
        <Filters onChange={handleBodyChange} />
        <div style={{ display: "flex", gap: "10px" }}>
          <ContextMenu selectedCells={selectedCells} />
          <Button onClick={downloadCSV} type="primary" style={{ marginBottom: "10px" }} disabled={!data || data.length === 0}>
            CSV İndir
          </Button>
        </div>
      </div>

      {/* Tabloyu saran kapsayıcı */}
      <div style={{ overflow: "hidden", flex: "1 1 auto" }}>
        <Spin spinning={loading}>
          <VirtualTable
            columns={columns}
            dataSource={flattenedData}
            width={totalTableWidth}
            height={tableHeight}
            checkedState={checkedState}
            handleCheckboxChange={handleCheckboxChange}
            flattenedData={flattenedData}
            currentPageData={currentPageData}
            monthWeekDayMap={monthWeekDayMap}
            totalTableWidth={totalTableWidth}
            expandedKeys={expandedKeys}
            toggleExpand={toggleExpand}
          />
        </Spin>
      </div>

      {/* Sayfalama bileşeni */}
      <Pagination
        current={currentPage}
        total={flattenedData.length}
        pageSize={pageSize}
        onChange={(page, newPageSize) => {
          setCurrentPage(page);
          if (newPageSize !== pageSize) {
            setPageSize(newPageSize);
          }
        }}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
        onShowSizeChange={(current, size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        style={{ marginTop: "10px", textAlign: "right", flexShrink: 0 }}
      />
    </div>
  );
};

export default MainTable;

// Cell Component
const CellComponent = React.memo(function Cell({ columnIndex, rowIndex, style, data }) {
  const { checkedState, handleCheckboxChange, getIconForValue, columns, dataToRender, flattenedData, expandedKeys, toggleExpand } = data;

  const record = dataToRender[rowIndex];
  if (!record) {
    console.error(`No record found at rowIndex ${rowIndex}`);
    return null;
  }

  const column = columns[columnIndex];
  if (!column) {
    console.error(`No column found at columnIndex ${columnIndex}`);
    return null;
  }

  const dataIndex = column.dataIndex;
  const text = record[dataIndex];

  const key = record.key ? `${record.key}-${dataIndex}` : `row-${rowIndex}-col-${columnIndex}`;
  const isChecked = checkedState[key] || false;

  // Get machine value
  const parentRecord = flattenedData.find((item) => item.key === record.parentKey);
  const machineValue = record.isParent ? record.machine : parentRecord?.machine || "Kayıt bulunamadı";

  const date = dayjs(dataIndex, "YYYY-MM-DD").format("DD.MM.YYYY");

  // Apply class names based on conditions
  const cellClassNames = ["virtual-table-cell", record.isParent ? "virtual-table-row-parent" : "virtual-table-row-child", isChecked ? "virtual-table-cell-checked" : ""]
    .filter(Boolean)
    .join(" ");

  if (dataIndex === "machine") {
    const indentation = (record.depth || 0) * 40; // Her derinlik için 40px girinti
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: indentation,
          boxSizing: "border-box",
          borderBottom: "1px solid #f0f0f0",
          borderRight: "1px solid #f0f0f0",
          backgroundColor: record.isParent ? "#fafafa" : "white",
          fontWeight: record.isParent ? "600" : "normal",
        }}
        className={cellClassNames}
      >
        {record.isParent && (
          <div
            onClick={() => toggleExpand(record.key)}
            style={{
              marginRight: 8,
              marginLeft: 8,
              border: "1px solid #80808091",
              borderRadius: "5px",
              padding: "0px 3px",
              fontWeight: "300",
              cursor: "pointer",
            }}
          >
            {expandedKeys[record.key] ? "-" : "+"}
          </div>
        )}
        <Text style={{ whiteSpace: "nowrap" }}>{record.machine}</Text>
      </div>
    );
  } else if (text) {
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #f0f0f0",
          borderRight: "1px solid #f0f0f0",
          backgroundColor: isChecked ? "#188fff1d" : "white",
        }}
        className={cellClassNames}
      >
        <Popover
          content={
            <div>
              {`Makine: ${machineValue}`}
              <br />
              {`Bakım: ${record.machine}`}
              <br />
              {`Durum: ${text}`}
              <br />
              {`Tarih: ${date}`}
            </div>
          }
          title="Hücre Detayı"
          trigger="hover"
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => handleCheckboxChange(key, text, record, column)}
          >
            <Checkbox
              checked={isChecked}
              style={{
                position: "absolute",
                top: 5,
                left: 5,
                zIndex: 1,
                opacity: 0,
              }}
            />
            {getIconForValue(text)}
          </div>
        </Popover>
      </div>
    );
  } else {
    return <div style={style} className={cellClassNames}></div>;
  }
});
