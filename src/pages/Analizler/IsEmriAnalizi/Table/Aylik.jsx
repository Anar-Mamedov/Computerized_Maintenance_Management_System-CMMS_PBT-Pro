import React, { useState, useEffect } from "react";
import { Table, Select, Spin, message, DatePicker } from "antd";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";
import "./TableSummary.css";

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

export const Aylik = ({ body }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aciklamaSutun, setAciklamaSutun] = useState("ISM_TIP");
  const [selectedYear, setSelectedYear] = useState(() => dayjs());
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

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
      <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
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

export default Aylik;
