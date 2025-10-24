import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Table, Select, message, DatePicker, Button } from "antd";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import "./TableSummary.css";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";
import i18n from "i18next";

const { Option } = Select;

const ACIKLAMA_SUTUN_OPTIONS = [
  { value: "ISM_TIP", label: "İş Emri Tipi" },
  { value: "MKN_TANIM", label: "Makine Tanımı" },
  { value: "MKN_TIP", label: "Makine Tipi" },
  { value: "ISM_LOKASYON", label: "Lokasyon" },
  { value: "ISM_PROJE", label: "Proje" },
  { value: "ISM_ATOLYE", label: "Atölye" },
];

const SUMMARY_TOTAL_COLUMN_KEY = "__summaryGrandTotal";
const SUMMARY_TOTAL_COLUMN_TITLE = "Toplam";
const DEFAULT_NUMBER_FORMATTER = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const DEFAULT_EXPORT_COLUMN_WIDTH = 120;
const MIN_EXPORT_COLUMN_WIDTH = 60;
const EXPORT_COLUMN_WIDTH_SCALING_FACTOR = 0.85;

const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(",", ".");
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const normalizeNumericValue = (value) => {
  const numeric = parseNumericValue(value);
  return numeric === null ? Number.NEGATIVE_INFINITY : numeric;
};

const getStringSorter = (dataIndex) => (rowA, rowB) => {
  const valueA = rowA?.[dataIndex];
  const valueB = rowB?.[dataIndex];
  const textA = valueA === null || valueA === undefined ? "" : valueA.toString();
  const textB = valueB === null || valueB === undefined ? "" : valueB.toString();
  return textA.localeCompare(textB, "tr", { sensitivity: "base" });
};

const getNumericSorter = (dataIndex) => (rowA, rowB) => {
  const numA = normalizeNumericValue(rowA?.[dataIndex]);
  const numB = normalizeNumericValue(rowB?.[dataIndex]);
  return numA - numB;
};

const resolveColumnTitle = (column, columnIndex) => {
  if (column?.title === null || column?.title === undefined) {
    return column?.key ?? `Sütun ${columnIndex + 1}`;
  }
  if (typeof column.title === "string" || typeof column.title === "number") {
    return String(column.title);
  }
  if (React.isValidElement(column.title)) {
    const childText = React.Children.toArray(column.title.props?.children)
      .filter((child) => typeof child === "string")
      .join(" ")
      .trim();
    if (childText) {
      return childText;
    }
  }
  return column?.key ?? `Sütun ${columnIndex + 1}`;
};

const computeExportColumnWidth = (width) => {
  if (typeof width !== "number" || Number.isNaN(width) || width <= 0) {
    return DEFAULT_EXPORT_COLUMN_WIDTH;
  }
  return Math.max(MIN_EXPORT_COLUMN_WIDTH, Math.round(width * EXPORT_COLUMN_WIDTH_SCALING_FACTOR));
};

export const Aylik = ({ body }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aciklamaSutun, setAciklamaSutun] = useState("ISM_TIP");
  const [selectedYear, setSelectedYear] = useState(() => dayjs());
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [isScrollPageEnabled, setIsScrollPageEnabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    try {
      return localStorage.getItem("scroolPage") === "true";
    } catch (error) {
      return false;
    }
  });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [currentScrollPage, setCurrentScrollPage] = useState(1);
  const isFetchingMoreRef = useRef(false);
  const tableWrapperRef = useRef(null);
  const [xlsxLoading, setXlsxLoading] = useState(false);

  const formattedTotalCount = useMemo(() => {
    const locale = i18n?.language || (typeof navigator !== "undefined" ? navigator.language : undefined);
    try {
      return new Intl.NumberFormat(locale).format(totalCount);
    } catch (error) {
      return (Number(totalCount) || 0).toLocaleString();
    }
  }, [totalCount, i18n.language]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (event) => {
      if (event.key === "scroolPage") {
        setIsScrollPageEnabled(event.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setCurrentScrollPage(1);
    setVisibleData([]);
    setHasMoreData(true);
    isFetchingMoreRef.current = false;
    setIsFetchingMore(false);
  }, [isScrollPageEnabled]);

  useEffect(() => {
    if (!isScrollPageEnabled) {
      setVisibleData(data);
      setHasMoreData(false);
      isFetchingMoreRef.current = false;
      setIsFetchingMore(false);
      return;
    }

    const sliceSize = currentScrollPage * pageSize;
    const nextVisible = data.slice(0, sliceSize);
    setVisibleData(nextVisible);
    const moreAvailable = nextVisible.length < data.length;
    setHasMoreData(moreAvailable);
    isFetchingMoreRef.current = false;
    setIsFetchingMore(false);
  }, [data, isScrollPageEnabled, currentScrollPage, pageSize]);

  useEffect(() => {
    setTotalCount(data.length);
  }, [data]);

  // Fetch data whenever filters, keyword, or aciklamaSutun changes
  useEffect(() => {
    fetchPivotData();
  }, [aciklamaSutun, body, selectedYear]);

  const fetchPivotData = async () => {
    setLoading(true);
    try {
      // Determine the selected year (default to current year)
      const yearValue = selectedYear || dayjs();
      const formattedStartDate = yearValue.startOf("year").format("YYYY-MM-DD");
      const formattedEndDate = yearValue.endOf("year").format("YYYY-MM-DD");

      // Clean filters: remove startDate and endDate from customfilter
      const cleanedFilters = { ...(body?.filters || {}) };
      if (cleanedFilters.customfilter) {
        const { startDate: _, endDate: __, ...restCustomFilter } = cleanedFilters.customfilter;
        cleanedFilters.customfilter = restCustomFilter;
      }

      // Prepare request body
      const requestBody = {
        AciklamaSutun: aciklamaSutun,
        StartDate: formattedStartDate,
        EndDate: formattedEndDate,
        Parametre: body?.keyword || "",
        Filtreler: cleanedFilters,
      };

      const response = await AxiosInstance.post("GetIsEmriAylikPivot", requestBody);

      if (response) {
        if (response.status_code === 401) {
          message.error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
          return;
        }

        // Transform the response data into table format
        const transformedData = transformPivotData(response.data);
        setData(transformedData.data);
        setColumns(transformedData.columns);
        setTotalCount(transformedData.data.length);
        if (isScrollPageEnabled) {
          setCurrentScrollPage(1);
        } else {
          setVisibleData(transformedData.data);
        }
        setPagination((prev) => ({ ...prev, current: 1 }));
      }
    } catch (error) {
      console.error("Error fetching pivot data:", error);
      message.error("Veri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const transformPivotData = (responseData) => {
    if (!responseData || !Array.isArray(responseData) || responseData.length === 0) {
      return { data: [], columns: [] };
    }

    // Create columns based on the first row
    const firstRow = responseData[0];
    const cols = [
      {
        title: ACIKLAMA_SUTUN_OPTIONS.find((opt) => opt.value === aciklamaSutun)?.label || "Açıklama",
        dataIndex: "ACIKLAMA",
        key: "ACIKLAMA",
        fixed: "left",
        width: 200,
        ellipsis: true,
        sorter: getStringSorter("ACIKLAMA"),
        sortDirections: ["ascend", "descend"],
      },
    ];

    // Extract month columns from the first row (excluding ACIKLAMA and Toplam fields)
    const monthKeys = Object.keys(firstRow).filter((key) => key !== "ACIKLAMA" && key !== "Toplam");
    monthKeys.forEach((month) => {
      cols.push({
        title: month,
        dataIndex: month,
        key: month,
        width: 100,
        align: "right",
        sorter: getNumericSorter(month),
        sortDirections: ["descend", "ascend"],
        render: (value) => (value !== null && value !== undefined ? value : "-"),
      });
    });

    // Add total column if exists
    if (Object.prototype.hasOwnProperty.call(firstRow, "Toplam")) {
      cols.push({
        title: "Toplam",
        dataIndex: "Toplam",
        key: "Toplam",
        width: 100,
        align: "right",
        sorter: getNumericSorter("Toplam"),
        sortDirections: ["descend", "ascend"],
        fixed: "right",
        render: (value) => (value !== null && value !== undefined ? value : "-"),
      });
    }

    cols.push({
      title: SUMMARY_TOTAL_COLUMN_TITLE,
      dataIndex: SUMMARY_TOTAL_COLUMN_KEY,
      key: SUMMARY_TOTAL_COLUMN_KEY,
      width: 120,
      align: "right",
      fixed: "right",
      sorter: getNumericSorter(SUMMARY_TOTAL_COLUMN_KEY),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        const numericValue = parseNumericValue(value);
        return numericValue !== null ? DEFAULT_NUMBER_FORMATTER.format(numericValue) : "-";
      },
    });

    // Transform data rows - use the response data directly with a key added
    const numericKeysForRowTotal = monthKeys.length > 0 ? monthKeys : Object.prototype.hasOwnProperty.call(firstRow, "Toplam") ? ["Toplam"] : [];
    const tableData = responseData.map((row, index) => {
      const hasNumericValue = numericKeysForRowTotal.some((key) => parseNumericValue(row?.[key]) !== null);
      const calculatedTotal = numericKeysForRowTotal.reduce((acc, key) => {
        const numericValue = parseNumericValue(row?.[key]);
        return numericValue !== null ? acc + numericValue : acc;
      }, 0);
      const fallbackToplam = parseNumericValue(row?.Toplam);

      let grandTotal = null;
      if (numericKeysForRowTotal.length > 0 && hasNumericValue) {
        grandTotal = calculatedTotal;
      }
      if (grandTotal === null && fallbackToplam !== null) {
        grandTotal = fallbackToplam;
      }

      return {
        key: index,
        ...row,
        [SUMMARY_TOTAL_COLUMN_KEY]: grandTotal,
      };
    });

    return { data: tableData, columns: cols };
  };

  const buildExportMatrix = () => {
    const visibleColumns = columns
      .filter((column) => column && (column.dataIndex || column.key))
      .map((column, columnIndex) => ({
        header: resolveColumnTitle(column, columnIndex),
        key: column.dataIndex ?? column.key,
        width: column.width,
      }));
    const exportRowsSource = data;

    const headers = visibleColumns.map(({ header }) => header);

    const exportRows = exportRowsSource.map((row) => {
      const cells = visibleColumns.map(({ key }) => {
        if (!key) {
          return "";
        }

        const rawValue = row?.[key];
        let value = rawValue;

        if (rawValue === null || rawValue === undefined || rawValue === Number.NEGATIVE_INFINITY) {
          value = "";
        } else if (typeof rawValue === "string") {
          const numericValue = parseNumericValue(rawValue);
          value = numericValue !== null ? numericValue : rawValue;
        }

        return value;
      });

      return cells;
    });

    if (exportRowsSource.length) {
      const summaryRow = visibleColumns.map(({ key }, columnIndex) => {
        if (columnIndex === 0) {
          return "Toplam";
        }

        if (!key) {
          return "";
        }

        const numericValues = exportRowsSource.map((row) => parseNumericValue(row?.[key])).filter((value) => value !== null);
        const total = numericValues.reduce((acc, val) => acc + val, 0);
        return numericValues.length ? total : "";
      });
      exportRows.push(summaryRow);
    }

    return { headers, exportRows, visibleColumns };
  };

  const handleDownloadXLSX = () => {
    if (!columns.length || !data.length) {
      message.warning("İndirilecek veri bulunmuyor.");
      return;
    }

    try {
      setXlsxLoading(true);
      const { headers, exportRows, visibleColumns } = buildExportMatrix();
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exportRows]);
      worksheet["!cols"] = visibleColumns.map(({ width }) => ({
        wpx: computeExportColumnWidth(width),
      }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Aylık Analiz");

      const timestamp = dayjs().format("YYYY-MM-DD_HH-mm");
      const fileName = `is_emri_aylik_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success("Excel dosyası indirildi.");
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      message.error("Excel indirme sırasında bir hata oluştu.");
    } finally {
      setXlsxLoading(false);
    }
  };

  const handleTableChange = (nextPagination, filters, sorter) => {
    if (isScrollPageEnabled) {
      applySorterToData(Array.isArray(sorter) ? sorter[0] : sorter);
      return;
    }

    setPagination((prev) => ({
      ...prev,
      current: nextPagination.current,
      pageSize: nextPagination.pageSize,
    }));
    setPageSize(nextPagination.pageSize);
    applySorterToData(Array.isArray(sorter) ? sorter[0] : sorter);
  };

  const handleScrollPageSizeChange = useCallback((value) => {
    const numericValue = Number(value);
    if (!numericValue || Number.isNaN(numericValue)) {
      return;
    }
    setPageSize(numericValue);
    setPagination((prev) => ({
      ...prev,
      current: 1,
      pageSize: numericValue,
    }));
    setCurrentScrollPage(1);
    setVisibleData([]);
    setHasMoreData(true);
    isFetchingMoreRef.current = false;
    setIsFetchingMore(false);
  }, []);

  const requestLoadMore = useCallback(() => {
    if (!isScrollPageEnabled) {
      return;
    }
    if (!hasMoreData || loading || isFetchingMoreRef.current) {
      return;
    }
    if (currentScrollPage * pageSize >= data.length) {
      setHasMoreData(false);
      return;
    }
    isFetchingMoreRef.current = true;
    setIsFetchingMore(true);
    setCurrentScrollPage((prev) => prev + 1);
  }, [currentScrollPage, data.length, hasMoreData, isScrollPageEnabled, loading, pageSize]);

  const applySorterToData = useCallback(
    (sorter) => {
      if (!Array.isArray(data) || data.length === 0) {
        return;
      }

      const { field, order } = sorter || {};
      if (!field || !order) {
        return;
      }

      const targetColumn = columns.find((column) => column.dataIndex === field || column.key === field);
      const sorterFn = targetColumn?.sorter;
      if (typeof sorterFn !== "function") {
        return;
      }

      const sortedData = [...data].sort((a, b) => sorterFn(a, b));
      if (order === "descend") {
        sortedData.reverse();
      }
      setData(sortedData);
      setCurrentScrollPage(1);
      setVisibleData([]);
      setHasMoreData(true);
      isFetchingMoreRef.current = false;
      setIsFetchingMore(false);
    },
    [columns, data]
  );

  useEffect(() => {
    if (!isScrollPageEnabled) {
      return;
    }

    const wrapper = tableWrapperRef.current;
    if (!wrapper) {
      return;
    }

    const tableBody = wrapper.querySelector(".ant-table-body");
    if (!tableBody) {
      return;
    }

    const handleScroll = () => {
      const remainingScroll = tableBody.scrollHeight - tableBody.scrollTop - tableBody.clientHeight;
      if (remainingScroll < 100) {
        requestLoadMore();
      }
    };

    tableBody.addEventListener("scroll", handleScroll);
    return () => {
      tableBody.removeEventListener("scroll", handleScroll);
    };
  }, [isScrollPageEnabled, requestLoadMore, visibleData.length]);

  const renderSummaryRow = () => {
    if (!columns.length || !data.length) {
      return null;
    }

    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="table-summary-row">
          {columns.map((column, columnIndex) => {
            const columnKey = column.dataIndex ?? column.key ?? columnIndex;

            if (columnIndex === 0) {
              return (
                <Table.Summary.Cell key={columnKey} index={columnIndex}>
                  Toplam
                </Table.Summary.Cell>
              );
            }

            if (columnKey === SUMMARY_TOTAL_COLUMN_KEY) {
              const numericValues = data.map((row) => parseNumericValue(row?.[SUMMARY_TOTAL_COLUMN_KEY])).filter((value) => value !== null);
              const total = numericValues.reduce((acc, val) => acc + val, 0);
              const displayValue = numericValues.length ? DEFAULT_NUMBER_FORMATTER.format(total) : "-";

              return (
                <Table.Summary.Cell key={columnKey} index={columnIndex} style={{ textAlign: column.align || "left" }}>
                  {displayValue}
                </Table.Summary.Cell>
              );
            }

            const numericValues = data.map((row) => parseNumericValue(row?.[columnKey])).filter((value) => value !== null);

            const total = numericValues.reduce((acc, val) => acc + val, 0);
            const displayValue = numericValues.length ? DEFAULT_NUMBER_FORMATTER.format(total) : "-";

            return (
              <Table.Summary.Cell key={columnKey} index={columnIndex} style={{ textAlign: column.align || "left" }}>
                {displayValue}
              </Table.Summary.Cell>
            );
          })}
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Select value={aciklamaSutun} onChange={(value) => setAciklamaSutun(value)} style={{ width: 200 }} placeholder="Açıklama Sütunu Seçin">
            {ACIKLAMA_SUTUN_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <DatePicker
            picker="year"
            allowClear={false}
            value={selectedYear}
            onChange={(value) => setSelectedYear(value || dayjs())}
            format="YYYY"
            style={{ width: 120 }}
            placeholder="Yıl seçin"
          />
        </div>
        <Button icon={<SiMicrosoftexcel />} onClick={handleDownloadXLSX} loading={xlsxLoading}>
          İndir
        </Button>
      </div>

      <div ref={tableWrapperRef}>
        <Table
          columns={columns}
          dataSource={isScrollPageEnabled ? visibleData : data}
          showSorterTooltip={false}
          pagination={
            isScrollPageEnabled
              ? false
              : {
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total) => `Toplam ${total} kayıt`,
                }
          }
          loading={loading || (isScrollPageEnabled && isFetchingMore)}
          onChange={handleTableChange}
          summary={renderSummaryRow}
          scroll={{ y: "calc(100vh - 400px)" }}
          bordered
          size="small"
        />
        {isScrollPageEnabled && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "8px 0" }}>
            <div style={{ color: "rgba(0,0,0,0.45)" }}>{!hasMoreData && visibleData.length === data.length && data.length > 0 ? "Tüm kayıtlar yüklendi" : ""}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "rgba(0,0,0,0.65)" }}>Toplam {formattedTotalCount}</span>
              <span style={{ fontWeight: 600 }}>Sayfa başına</span>
              <Select
                value={pageSize}
                style={{ width: 120 }}
                onChange={handleScrollPageSizeChange}
                options={[
                  { value: 20, label: "20" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" },
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Aylik;
