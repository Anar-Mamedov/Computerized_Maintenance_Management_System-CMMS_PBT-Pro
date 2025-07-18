import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function FixTarihlerTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "",
      dataIndex: "PBF_FIX_GUN",
      key: "PBF_FIX_GUN",
      width: 15,
      ellipsis: true,
    },
    {
      title: "",
      dataIndex: "PBF_FIX_AY",
      key: "PBF_FIX_AY",
      width: 40,
      ellipsis: true,
      render: (text, record) => {
        const months = [
          "Ocak",
          "Şubat",
          "Mart",
          "Nisan",
          "Mayıs",
          "Haziran",
          "Temmuz",
          "Ağustos",
          "Eylül",
          "Ekim",
          "Kasım",
          "Aralık",
        ];
        return months[text - 1];
      },
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
      width: 20,
      render: (text, record) => (
        <Button
          danger
          type="link"
          onClick={(event) => {
            event.stopPropagation(); // Tablo satırının tıklanmasını engelle
            AxiosInstance.post(
              `PeriyodikBakimFixTarihSil?FixTarihID=${record.key}`
            )
              .then((response) => {
                // Silme işlemi başarılı olduğunda bir mesaj göster
                message.success("Kayıt başarıyla silindi.");
                fetch(); // Tabloyu yenile
              })
              .catch((error) => {
                // Hata işleme
                console.error("API isteği sırasında hata oluştu:", error);
                message.error("Kayıt silinirken bir hata oluştu.");
              });
          }}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(
      `PeriyodikBakimGetFixTarihById?FixBakimID=${secilenBakimID}`
    )
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_PERIYODIK_BAKIM_FIX_DEGER_ID,
          PBF_FIX_GUN: item.PBF_FIX_GUN,
          PBF_FIX_AY: item.PBF_FIX_AY,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        // Hata işleme
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]); // secilenBakimID değiştiğinde fetch fonksiyonunu güncelle

  useEffect(() => {
    if (secilenBakimID) {
      // secilenBakimID'nin varlığını ve geçerliliğini kontrol edin
      fetch(); // fetch fonksiyonunu çağırın
    }
  }, [secilenBakimID, fetch]); // secilenBakimID veya fetch fonksiyonu değiştiğinde useEffect'i tetikle

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div style={{ width: "300px" }}>
      <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
      <Table
        // rowSelection={{
        //   type: "radio",
        //   selectedRowKeys,
        //   onChange: onRowSelectChange,
        // }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
      {isModalVisible && (
        <EditModal
          selectedRow={selectedRow}
          isModalVisible={isModalVisible}
          onModalClose={() => {
            setIsModalVisible(false);
            setSelectedRow(null);
          }}
          onRefresh={refreshTable}
          secilenBakimID={secilenBakimID}
        />
      )}
    </div>
  );
}
