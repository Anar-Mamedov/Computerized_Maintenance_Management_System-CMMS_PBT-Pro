import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import EditModal from "./Update/EditModal";

export default function Tablo() {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "Sira No",
      dataIndex: "PBC_SIRA_NO",
      key: "PBC_SIRA_NO",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Tanım",
      dataIndex: "PBC_TANIM",
      key: "PBC_TANIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Hedef Değer",
      dataIndex: "PBC_HEDEF_DEGER",
      key: "PBC_HEDEF_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Ondalık",
      dataIndex: "PBC_FORMAT",
      key: "PBC_FORMAT",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Limit",
      dataIndex: "PBC_MIN_MAX_DEGER",
      key: "PBC_MIN_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Min Değer",
      dataIndex: "PBC_MIN_DEGER",
      key: "PBC_MIN_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Max Değer",
      dataIndex: "PBC_MAX_DEGER",
      key: "PBC_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetPBakimOlcumDegeri?TB_PERIYODIK_BAKIM_ID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.listem.map((item) => ({
          ...item,
          key: item.TB_PERIYODIK_BAKIM_OLCUM_PARAMETRE_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [secilenBakimID]);

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
