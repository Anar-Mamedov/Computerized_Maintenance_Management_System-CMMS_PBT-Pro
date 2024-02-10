import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";

export default function PersonelTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Seçilen satır anahtarlarını tutacak state'i güncelle
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Personel Kodu",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Adı",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Ünvan",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Personel Tipi",
      dataIndex: "description",
      key: "description",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Departman",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Lokasyon",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      ellipsis: true,
    },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`Personel`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_PERSONEL_ID,
          code: item.PRS_PERSONEL_KOD,
          subject: item.PRS_ISIM,
          workdays: item.PRS_UNVAN,
          description: item.PRS_TIP,
          fifthcolumn: item.PRS_DEPARTMAN,
          sixthcolumn: item.PRS_LOKASYON,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      // Modal açıldığında seçimleri sıfırla
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    // Seçilen tüm verileri onSubmit fonksiyonuna gönder
    const selectedData = data.filter((item) => selectedRowKeys.includes(item.key));
    if (selectedData.length > 0) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    // workshopSelectedId bir dizi olduğunda, setSelectedRowKeys'i güncelle
    setSelectedRowKeys(workshopSelectedId ? [...workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    // Birden fazla seçime izin ver
    setSelectedRowKeys(selectedKeys);
  };

  return (
    <div>
      <Button
        style={{
          padding: "0px 0px",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={handleModalToggle}>
        {" "}
        +{" "}
      </Button>
      <Modal
        width={1200}
        centered
        title="Personel"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Table
          rowSelection={{
            type: "checkbox", // Birden fazla seçime izin vermek için 'checkbox' olarak ayarla
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{
            y: "calc(100vh - 360px)",
          }}
        />
      </Modal>
    </div>
  );
}
