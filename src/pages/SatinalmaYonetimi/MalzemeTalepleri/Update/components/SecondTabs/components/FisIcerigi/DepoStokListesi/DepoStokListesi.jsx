import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Table, Button, Modal, Checkbox, Input, Spin, Typography, Tag, Progress, message } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";
import dayjs from "dayjs";
import { t } from "i18next";

const { Text } = Typography;

const MainTable = ({ selectedRowId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
  {
    title: "Depo Tanımı",
    dataIndex: "depoTanim",
    key: "depoTanim",
    width: 200,  // 200px genişlik
    ellipsis: { showTitle: true },
  },
  {
    title: "Üretici Kodu",
    dataIndex: "ureticiKod",
    key: "ureticiKod",
    width: 125,  // 200px genişlik
    ellipsis: { showTitle: true },
  },
  {
    title: "Giren Miktar",
    dataIndex: "girenMiktar",
    key: "girenMiktar",
  },
  {
    title: "Çıkan Miktar",
    dataIndex: "cikanMiktar",
    key: "cikanMiktar",
  },
  {
    title: "Stok Miktarı",
    dataIndex: "stokMiktar",
    key: "stokMiktar",
  },
  {
    title: "Birim",
    dataIndex: "birim",
    key: "birim",
  },
];

  const fetchDepoStokListesi = async () => {

  try {
    setLoading(true);

    // API isteği (filters burada aslında requestBody olmalı)
    const response = await AxiosInstance.get(
      `GetMalzemeDepoDurumlari?stokId=${selectedRowId}`,
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
    fetchDepoStokListesi();
  }, [selectedRowId]);

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>Depo Stok Durumları</Button>
      <Modal
        title="Depo Stok Durumları"
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
