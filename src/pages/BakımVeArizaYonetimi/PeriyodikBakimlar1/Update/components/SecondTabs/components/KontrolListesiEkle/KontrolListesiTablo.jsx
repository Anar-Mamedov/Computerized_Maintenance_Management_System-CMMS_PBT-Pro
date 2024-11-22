import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";

export default function KontrolListesiTablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Sıra No",
      dataIndex: "PKN_SIRANO",
      key: "PKN_SIRANO",
      width: 40,
      ellipsis: true,
    },
    {
      title: "Tanım",
      dataIndex: "PKN_TANIM",
      key: "PKN_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "PKN_ACIKLAMA",
      key: "PKN_ACIKLAMA",
      width: 200,
      ellipsis: true,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetPBakimKontrolList?bakimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_KONTROLLIST_ID,
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
    setSelectedRowKeys(selectedKeys);
  };

  // Seçilen satır objelerini içeren bir dizi oluşturun
  const selectedRows = data.filter((row) => selectedRowKeys.includes(row.key));

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(); // fetch fonksiyonu tabloyu yeniler
  }, [fetch]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px", justifyContent: "flex-end" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />
        <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
      </div>

      <Table
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
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
        />
      )}
    </div>
  );
}
