import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import AxiosInstance from "../../../../../../../../../../../../../../api/http";
import dayjs from "dayjs";
import { t } from "i18next";

const { Text } = Typography;

const MainTable = ({ selectedRowId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
  {
    title: "Tedarikçi Adı",
    dataIndex: "tedarikcAdi",
    key: "tedarikcAdi",
    width: 200,  // 200px genişlik
    ellipsis: { showTitle: true },
  },
  {
    title: "Son Alış Tarihi",
    dataIndex: "sonAlisTarihi",
    key: "sonAlisTarihi",
    render: (date) => dayjs(date).format("DD.MM.YYYY"),
  },
  {
    title: "Miktar",
    dataIndex: "miktar",
    key: "miktar",
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
  },
  {
    title: "Birim Fiyat",
    dataIndex: "birimFiyat",
    key: "birimFiyat",
  },
  {
    title: "Toplam",
    dataIndex: "toplam",
    key: "toplam",
  },
];

  const fetchTedarikciler = async () => {

  try {
    setLoading(true);

    // API isteği (filters burada aslında requestBody olmalı)
    const response = await AxiosInstance.get(
      `GetTedarikcilerBy?stokId=${selectedRowId}`,
    );

    if (response.status_code === 401) {
      message.error(t("buSayfayaErisimYetkinizBulunmamaktadir"));
      return;
    }

    // Listeyi talep_listesi olarak çek
    const list = Array.isArray(response?.data) ? response.data : [];

    if (!Array.isArray(list)) {
      console.error("data array değil!", list);
    }

    const formattedData = list.map((item) => ({
      ...item,
      key: item.tedarikcId,
    }));

    setData(formattedData);
    setLoading(false);
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

  useEffect(() => {
    fetchTedarikciler();
  }, [selectedRowId]);

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Tedarikçi Listesi</Button>
      <Modal
        title="Tedarikçi Listesi"
        centered
        width={800}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Spin spinning={loading}>
          <Table
                    dataSource={data}
                    columns={columns}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ["10", "20", "50", "100"],
                      position: ["bottomRight"],
                      showTotal: (total) => `Toplam ${total}`, // Burada 'total' parametresi doğru kayıt sayısını yansıtacaktır
                      showQuickJumper: true,
                    }}
                    // onRow={onRowClick}
                    scroll={{ y: "calc(100vh - 370px)" }}
                    rowClassName={(record) => (record.SFS_TALEP_DURUM_ID === 0 ? "boldRow" : "")}
                  />
        </Spin>
      </Modal>
    </>
  );
};

export default MainTable;
