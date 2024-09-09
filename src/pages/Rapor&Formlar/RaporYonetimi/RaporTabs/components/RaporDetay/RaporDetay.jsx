import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../api/http.jsx";
import { Table, Spin } from "antd";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

function RaporDetay({ selectedRowData }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setValue, watch } = useFormContext();

  const LokasyonId = watch("locationIds");
  const AtolyeId = watch("atolyeIds");
  const BaslangicTarih = watch("baslangicTarihi");
  const BitisTarih = watch("bitisTarihi");

  const currentYear = dayjs().year();
  const startOfYear = dayjs().startOf("year").format("YYYY-MM-DD");
  const endOfYear = dayjs().endOf("year").format("YYYY-MM-DD");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.post(`RaporGetirBy?pagingDeger=1&pageSize=10`, {
        TB_RAPOR_ID: selectedRowData.TB_RAPOR_ID,
        RPR_RAPOR_GRUP_ID: selectedRowData.RPR_RAPOR_GRUP_ID,
        LokasyonId: LokasyonId,
        AtolyeId: AtolyeId,
        BaslangicTarih: BaslangicTarih ? dayjs(BaslangicTarih).format("YYYY-MM-DD") : startOfYear,
        BitisTarih: BitisTarih ? dayjs(BitisTarih).format("YYYY-MM-DD") : endOfYear,
      });

      if (response && response.length > 0) {
        const firstItem = response[0];
        const dynamicColumns = Object.keys(firstItem).map((key) => ({
          title: key,
          dataIndex: key,
          key: key,
          width: 150,
          ellipsis: true,
        }));

        const formattedData = response.map((item) => ({
          ...item,
          key: item.RowIndex, // Assuming 'RowIndex' is a unique identifier for each item
        }));

        setColumns(dynamicColumns);
        setData(formattedData);
      } else {
        console.error("API response is not in expected format");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          position: ["bottomRight"],
          showTotal: (total, range) => `Toplam ${total}`,
          showQuickJumper: true,
        }}
        scroll={{ y: "calc(100vh - 380px)" }}
      />
    </Spin>
  );
}

export default RaporDetay;
