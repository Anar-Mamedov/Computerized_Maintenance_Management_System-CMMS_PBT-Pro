import React, { useState, useEffect } from "react";
import { Table, Select, Spin, message } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http";
import dayjs from "dayjs";

const { Option } = Select;

const ACIKLAMA_SUTUN_OPTIONS = [
  { value: "ISM_TIP", label: "İş Emri Tipi" },
  { value: "MKN_TANIM", label: "Makine Tanımı" },
  { value: "MKN_TIP", label: "Makine Tipi" },
  { value: "ISM_LOKASYON", label: "Lokasyon" },
  { value: "ISM_PROJE", label: "Proje" },
  { value: "ISM_ATOLYE", label: "Atölye" },
];

export const Aylik = ({ body }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [aciklamaSutun, setAciklamaSutun] = useState("ISM_TIP");

  // Fetch data whenever filters, keyword, or aciklamaSutun changes
  useEffect(() => {
    fetchPivotData();
  }, [aciklamaSutun, body]);

  const fetchPivotData = async () => {
    setLoading(true);
    try {
      // Get dates from body.filters.customfilter
      const customFilter = body?.filters?.customfilter || {};
      const startDate = customFilter.startDate;
      const endDate = customFilter.endDate;

      // Format dates
      const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : dayjs().startOf("year").format("YYYY-MM-DD");
      const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : dayjs().endOf("year").format("YYYY-MM-DD");

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
        fixed: "right",
        render: (value) => (value !== null && value !== undefined ? value : "-"),
      });
    }

    // Transform data rows - use the response data directly with a key added
    const tableData = responseData.map((row, index) => ({
      key: index,
      ...row,
    }));

    return { data: tableData, columns: cols };
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Select value={aciklamaSutun} onChange={(value) => setAciklamaSutun(value)} style={{ width: 200 }} placeholder="Açıklama Sütunu Seçin">
          {ACIKLAMA_SUTUN_OPTIONS.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          /*  scroll={{ x: 1500, y: 600 }} */
          scroll={{ y: "calc(100vh - 470px)" }}
          bordered
          size="small"
        />
      </Spin>
    </div>
  );
};

export default Aylik;
