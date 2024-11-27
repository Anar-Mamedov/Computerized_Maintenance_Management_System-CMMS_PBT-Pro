// Table1.jsx

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { Button, Checkbox, Spin, message, Popover, Pagination } from "antd";
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

dayjs.locale("tr");
dayjs.extend(weekOfYear);

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

const getIconForValue = (value) => {
  return icons[value] || value;
};

// Custom Cell component
const Cell = React.memo(function Cell({ columnIndex, rowIndex, style, data }) {
  const { checkedState, handleCheckboxChange, getIconForValue, columns, dataToRender, flattenedData } = data;

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

  return (
    <div style={style} className={cellClassNames}>
      {dataIndex === "machine" ? (
        <div style={{ padding: "0 8px", width: "100%" }}>{record.machine}</div>
      ) : text ? (
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
            style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleCheckboxChange(key, text, record, column)}
          >
            <Checkbox checked={isChecked} style={{ position: "absolute", top: 5, left: 5, zIndex: 1, opacity: 0 }} />
            {getIconForValue(text)}
          </div>
        </Popover>
      ) : null}
    </div>
  );
});

// Header Component
const Header = ({ columns, monthWeekDayMap, getColumnWidth }) => {
  // Ayları gruplandırma
  const monthGroups = [];
  let currentMonth = null;
  let currentMonthStartIndex = 1; // İlk kolon makine adı olduğu için 1'den başlıyoruz
  monthWeekDayMap.forEach((item, index) => {
    const columnIndex = index + 1; // Çünkü columns[0] 'machine' kolonudur
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

  return (
    <div className="header-container">
      {/* Ay satırı */}
      <div className="header-row">
        <div className="header-cell" style={{ width: getColumnWidth(0) }}>
          {/* Boş hücre */}
        </div>
        {monthGroups.map((group, index) => {
          const { startIndex, endIndex } = group;

          let width = 0;
          for (let i = startIndex; i <= endIndex; i++) {
            width += getColumnWidth(i);
          }

          return (
            <div key={index} className="header-cell" style={{ width }}>
              {group.month}
            </div>
          );
        })}
      </div>
      {/* Hafta satırı */}
      <div className="header-row">
        <div className="header-cell" style={{ width: getColumnWidth(0) }}>
          {/* Boş hücre */}
        </div>
        {weekGroups.map((group, index) => {
          const { startIndex, endIndex } = group;

          let width = 0;
          for (let i = startIndex; i <= endIndex; i++) {
            width += getColumnWidth(i);
          }

          return (
            <div key={index} className="header-cell" style={{ width }}>
              {group.week}
            </div>
          );
        })}
      </div>
      {/* Gün satırı */}
      <div className="header-row">
        <div className="header-cell" style={{ width: getColumnWidth(0) }}>
          Makine
        </div>
        {monthWeekDayMap.map((item, index) => (
          <div key={index} className="header-cell" style={{ width: getColumnWidth(index + 1) }}>
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
};

const VirtualTable = ({ columns, dataSource, width, height, checkedState, handleCheckboxChange, flattenedData, currentPageData, monthWeekDayMap, totalTableWidth }) => {
  const gridRef = useRef();

  const columnCount = columns.length;
  const rowCount = currentPageData.length;

  const getColumnWidth = (index) => {
    if (index < 0 || index >= columns.length) {
      console.warn(`Index ${index} is out of bounds for columns array of length ${columns.length}`);
      return 100; // Varsayılan genişlik
    }
    const { width } = columns[index];
    return width || 100;
  };

  const getRowHeight = (index) => {
    return 54; // Satır yüksekliği
  };

  const itemData = {
    columns,
    checkedState,
    handleCheckboxChange,
    getIconForValue,
    flattenedData,
    dataToRender: currentPageData,
  };

  // Başlık yüksekliği (3 satır)
  const headerHeight = 54 * 3;

  // Tablo genişliğini hesaplıyoruz
  const tableWidth = columns.reduce((total, column, index) => total + getColumnWidth(index), 0);

  return (
    <div style={{ width: "100%", height: "100%", overflowX: "auto" }}>
      <div style={{ width: tableWidth, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "0 0 auto" }}>
          <Header columns={columns} monthWeekDayMap={monthWeekDayMap} getColumnWidth={getColumnWidth} />
        </div>
        <div style={{ flex: "1 1 auto" }}>
          <Grid
            className="VirtualizedGrid"
            ref={gridRef}
            columnCount={columnCount}
            columnWidth={getColumnWidth}
            height={height - headerHeight}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            width={tableWidth}
            itemData={itemData}
          >
            {Cell}
          </Grid>
        </div>
      </div>
    </div>
  );
};

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
    return columns.reduce((total, column, index) => total + (column.width || 100), 0);
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
          if (!acc[item.MAKINE_ID].children) {
            acc[item.MAKINE_ID].children = [];
          }
          acc[item.MAKINE_ID].children.push(child);
          return acc;
        }, {});
        const newData = Object.values(groupedData);
        setData(newData);
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

  const handleBodyChange = useCallback((type, newBody) => {
    setStartDate(newBody.baslamaTarihi);
    setEndDate(newBody.bitisTarihi);
    setBody((state) => ({
      ...state,
      [type]: newBody,
    }));
  }, []);

  const downloadCSV = () => {
    // CSV indirme fonksiyonunuz
  };

  // Veriyi düzleştirme
  const flattenedData = useMemo(() => {
    if (!data) return [];
    const result = [];
    data.forEach((parent) => {
      if (parent) {
        result.push({ ...parent });
        if (parent.children && parent.children.length > 0) {
          parent.children.forEach((child) => {
            if (child) {
              result.push({ ...child });
            }
          });
        }
      }
    });
    return result;
  }, [data]);

  // Sayfalı veriyi hesapla
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return flattenedData.slice(startIndex, startIndex + pageSize);
  }, [flattenedData, currentPage, pageSize]);

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(flattenedData.length / pageSize);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 170px)" }}>
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
      <div style={{ overflow: "hidden" }}>
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

const generateColumns = (startDate, endDate) => {
  const columns = [
    {
      title: "",
      dataIndex: "machine",
      key: "machine",
      width: 200,
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
      width: 100, // Kolon genişliğini ayarlayabilirsiniz
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
