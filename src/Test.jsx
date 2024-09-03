import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../api/http.jsx";
import CreateModal from "../Insert/CreateModal.jsx";
import EditModal from "../Update/EditModal.jsx";
import ContextMenu from "../components/ContextMenu/ContextMenu.jsx";

export default function MainTable({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]); // New state for selected rows
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    const sampleDate = new Date(2021, 0, 21);
    const sampleFormatted = new Intl.DateTimeFormat(navigator.language).format(sampleDate);
    let monthFormat;
    if (sampleFormatted.includes("January")) {
      monthFormat = "long";
    } else if (sampleFormatted.includes("Jan")) {
      monthFormat = "short";
    } else {
      monthFormat = "2-digit";
    }
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: monthFormat,
      day: "2-digit",
    });
    return formatter.format(new Date(date));
  };

  const columns = [
    {
      title: "İş Tanımı",
      dataIndex: "ROL_TANIM",
      key: "ROL_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Oluşturma Tarihi",
      dataIndex: "ROL_OLUSTURMA_TAR",
      key: "ROL_OLUSTURMA_TAR",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Değiştirme Tarihi",
      dataIndex: "ROL_DEGISTIRME_TAR",
      key: "ROL_DEGISTIRME_TAR",
      width: 200,
      ellipsis: true,
      render: (text) => formatDate(text),
    },
  ];

  const secilenIsEmriID = watch("secilenIsEmriID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.post(`GetOnayRolTanim`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_ROL_ID,
        }));
        setData(fetchedData);
      })
      .catch((error) => {
        console.error("API isteği sırasında hata oluştu:", error);
      })
      .finally(() => setLoading(false));
  }, [secilenIsEmriID]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const onRowSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((row) => newSelectedRowKeys.includes(row.key));
    setSelectedRows(newSelectedRows); // Update selected rows data
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch();
  }, [fetch]);

  return (
    <div style={{ marginBottom: "25px" }}>
      <ContextMenu selectedRows={selectedRows} onRefresh={refreshTable} />
      <CreateModal onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      <Table
        rowSelection={{
          type: "radio",
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
          secilenIsEmriID={secilenIsEmriID}
        />
      )}
    </div>
  );
}
