import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import CreateModal from "./Insert/CreateModal";
import EditModal from "./Update/EditModal";
import ContextMenu from "./components/ContextMenu/ContextMenu.jsx";

export default function EkipmanListesiTablo({ isActive }) {
  const [loading, setLoading] = useState(false);
  const { control, watch, setValue } = useFormContext();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const kapali = watch("kapali");

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

  const formatTime = (time) => {
    if (!time || time.trim() === "") return "";
    try {
      const [hours, minutes] = time
        .trim()
        .split(":")
        .map((part) => part.trim());
      const hoursInt = parseInt(hours, 10);
      const minutesInt = parseInt(minutes, 10);
      if (isNaN(hoursInt) || isNaN(minutesInt) || hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
        console.error("Invalid time format:", time);
        return "";
      }
      const date = new Date();
      date.setHours(hoursInt, minutesInt, 0);
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        hour: "numeric",
        minute: "2-digit",
      });
      return formatter.format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const columns = [
    {
      title: "Personel Adı",
      dataIndex: "IDK_ISIM",
      key: "IDK_ISIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Vardiya",
      dataIndex: "IDK_VARDIYA_TANIM",
      key: "IDK_VARDIYA_TANIM",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Çalışma Süresi (dk.)",
      dataIndex: "IDK_SURE",
      key: "IDK_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Saat Ücreti",
      dataIndex: "IDK_SAAT_UCRETI",
      key: "IDK_SAAT_UCRETI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Fazla Mesai",
      dataIndex: "IDK_FAZLA_MESAI_VAR",
      key: "IDK_FAZLA_MESAI_VAR",
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        return record.IDK_FAZLA_MESAI_VAR ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckOutlined style={{ color: "green" }} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseOutlined style={{ color: "red" }} />
          </div>
        );
      },
    },
    {
      title: "Mesai Süresi (dk.)",
      dataIndex: "IDK_FAZLA_MESAI_SURE",
      key: "IDK_FAZLA_MESAI_SURE",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mesai Ücreti",
      dataIndex: "IDK_FAZLA_MESAI_SAAT_UCRETI",
      key: "IDK_FAZLA_MESAI_SAAT_UCRETI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Çalışma Zamanı",
      dataIndex: "",
      key: "IDK_TARIH",
      width: 200,
      ellipsis: true,
      render: (text, record) => {
        const tarih = formatDate(record.IDK_TARIH);
        const saat = formatTime(record.IDK_SAAT);
        return `${tarih} - ${saat}`;
      },
    },
    {
      title: "Maliyet",
      dataIndex: "IDK_MALIYET",
      key: "IDK_MALIYET",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Masraf Merkezi",
      dataIndex: "IDK_MASRAF_MERKEZI",
      key: "IDK_MASRAF_MERKEZI",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Açıklama",
      dataIndex: "IDK_ACIKLAMA",
      key: "IDK_ACIKLAMA",
      width: 300,
      ellipsis: true,
    },
  ];

  const secilenIsEmriID = watch("secilenMakineID");

  const fetch = useCallback(
    (page = 1, pageSize = 10) => {
      if (isActive) {
        setLoading(true);
        AxiosInstance.get(`GetEkipmanMakineListWeb?parametre=&pagingDeger=${page}&pageSize=${pageSize}&MakineID=${secilenIsEmriID}`)
          .then((response) => {
            const fetchedData = response.list.map((item) => ({
              ...item,
              key: item.TB_EKIPMAN_ID,
            }));
            setData(fetchedData);
            setPagination({ current: page, pageSize, total: response.kayit_sayisi });
          })
          .catch((error) => {
            console.error("API isteği sırasında hata oluştu:", error);
          })
          .finally(() => setLoading(false));
      }
    },
    [secilenIsEmriID, isActive]
  );

  useEffect(() => {
    if (isActive) {
      fetch();
    }
  }, [isActive, fetch]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
    const selectedData = selectedKeys.map((key) => data.find((item) => item.key === key));
    setSelectedRows(selectedData);
  };

  const onRowClick = (record) => {
    setSelectedRow(record);
    setIsModalVisible(true);
  };

  const refreshTable = useCallback(() => {
    fetch(pagination.current, pagination.pageSize);
  }, [fetch, pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    fetch(pagination.current, pagination.pageSize);
  };

  return (
    <div style={{ marginBottom: "25px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ContextMenu selectedRows={selectedRows} refreshTableData={refreshTable} />
        <CreateModal kapali={kapali} onRefresh={refreshTable} secilenIsEmriID={secilenIsEmriID} />
      </div>

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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={handleTableChange}
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
