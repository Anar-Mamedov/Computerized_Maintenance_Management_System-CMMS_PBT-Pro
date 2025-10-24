import React, { useState, useEffect } from "react";
import { Table, Select, Spin, message, Button } from "antd";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import "./TableSummary.css";
import * as XLSX from "xlsx";
import { SiMicrosoftexcel } from "react-icons/si";

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

export const Yillik = ({ body }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aciklamaSutun, setAciklamaSutun] = useState("ISM_TIP");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });
  const [xlsxLoading, setXlsxLoading] = useState(false);

  // Fetch data whenever filters, keyword, or aciklamaSutun changes
  useEffect(() => {
    fetchPivotData();
  }, [aciklamaSutun, body]);

  const fetchPivotData = async () => {
    setLoading(true);
    try {
      // Always use last 10 full years relative to today
      const today = dayjs();
      const formattedStartDate = today.subtract(10, "year").startOf("year").format("YYYY-MM-DD");
      const formattedEndDate = today.endOf("year").format("YYYY-MM-DD");

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

      const response = await AxiosInstance.post("GetIsEmriYillikPivot", requestBody);

      if (response) {
        if (response.status_code === 401) {
          message.error("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
          return;
        }

        // Transform the response data into table format
        const transformedData = transformPivotData(response.data);
        setData(transformedData.data);
        setColumns(transformedData.columns);
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
    const monthKeys = Object.keys(firstRow)
      .filter((key) => key !== "ACIKLAMA" && key !== "Toplam")
      .sort((a, b) => {
        const aNum = Number(a);
        const bNum = Number(b);

        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return bNum - aNum; // newest year first
        }

        return a.localeCompare(b);
      });
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

  const getCurrentPageData = () => {
    if (!pagination?.pageSize || !pagination?.current) {
      return data;
    }

    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return data.slice(startIndex, endIndex);
  };

  const buildExportMatrix = () => {
    const visibleColumns = columns
      .filter((column) => column && (column.dataIndex || column.key))
      .map((column, columnIndex) => ({
        header: resolveColumnTitle(column, columnIndex),
        key: column.dataIndex ?? column.key,
        width: column.width,
      }));
    const currentPageRows = getCurrentPageData();

    const headers = visibleColumns.map(({ header }) => header);

    const exportRows = currentPageRows.map((row) => {
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

    if (currentPageRows.length) {
      const summaryRow = visibleColumns.map(({ key }, columnIndex) => {
        if (columnIndex === 0) {
          return "Toplam";
        }

        if (!key) {
          return "";
        }

        const numericValues = currentPageRows.map((row) => parseNumericValue(row?.[key])).filter((value) => value !== null);
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Yıllık Analiz");

      const timestamp = dayjs().format("YYYY-MM-DD_HH-mm");
      const fileName = `is_emri_yillik_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      message.success("Excel dosyası indirildi.");
    } catch (error) {
      console.error("Excel indirme hatası:", error);
      message.error("Excel indirme sırasında bir hata oluştu.");
    } finally {
      setXlsxLoading(false);
    }
  };

  const handleTableChange = (nextPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: nextPagination.current,
      pageSize: nextPagination.pageSize,
    }));
  };

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
        <Select value={aciklamaSutun} onChange={(value) => setAciklamaSutun(value)} style={{ width: 200 }} placeholder="Açıklama Sütunu Seçin">
          {ACIKLAMA_SUTUN_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
        <Button icon={<SiMicrosoftexcel />} onClick={handleDownloadXLSX} loading={xlsxLoading}>
          İndir
        </Button>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          showSorterTooltip={false}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          onChange={handleTableChange}
          summary={renderSummaryRow}
          /*  scroll={{ x: 1500, y: 600 }} */
          scroll={{ y: "calc(100vh - 400px)" }}
          bordered
          size="small"
        />
      </Spin>
    </div>
  );
};

export default Yillik;
