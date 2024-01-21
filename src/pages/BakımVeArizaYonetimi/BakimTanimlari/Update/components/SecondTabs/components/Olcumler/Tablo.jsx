import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../../api/http";
import dayjs from "dayjs";
import CreateModal from "./Insert/CreateModal";
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
      dataIndex: "IOC_SIRA_NO",
      key: "IOC_SIRA_NO",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Tanım",
      dataIndex: "IOC_TANIM",
      key: "IOC_TANIM",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "left" }}>{text}</div>,
    },
    {
      title: "Hedef Değer",
      dataIndex: "IOC_HEDEF_DEGER",
      key: "IOC_HEDEF_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Ondalık",
      dataIndex: "IOC_FORMAT",
      key: "IOC_FORMAT",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Limit",
      dataIndex: "IOC_MIN_MAX_DEGER",
      key: "IOC_MIN_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Min Değer",
      dataIndex: "IOC_MIN_DEGER",
      key: "IOC_MIN_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
    {
      title: "Max Değer",
      dataIndex: "IOC_MAX_DEGER",
      key: "IOC_MAX_DEGER",
      width: 200,
      ellipsis: true,
      align: "center",
      render: (text) => <div style={{ textAlign: "right" }}>{text}</div>,
    },
  ];

  const secilenBakimID = watch("secilenBakimID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTanimOlcum?isTanimID=${secilenBakimID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_IS_TANIM_OLCUM_PARAMETRE_ID,
          IOC_IS_TANIM_ID: item.IOC_IS_TANIM_ID,
          IOC_SIRA_NO: item.IOC_SIRA_NO,
          IOC_TANIM: item.IOC_TANIM,
          IOC_BIRIM_KOD_ID: item.IOC_BIRIM_KOD_ID,
          IOC_BIRIM: item.IOC_BIRIM,
          IOC_HEDEF_DEGER: item.IOC_HEDEF_DEGER,
          IOC_MIN_MAX_DEGER: item.IOC_MIN_MAX_DEGER,
          IOC_MIN_DEGER: item.IOC_MIN_DEGER,
          IOC_MAX_DEGER: item.IOC_MAX_DEGER,
          IOC_FORMAT: item.IOC_FORMAT,
          IOC_OLUSTURAN_ID: item.IOC_OLUSTURAN_ID,
          IOC_OLUSTURMA_TARIH: item.IOC_OLUSTURMA_TARIH,
          IOC_DEGISTIREN_ID: item.IOC_DEGISTIREN_ID,
          IOC_DEGISTIRME_TARIH: item.IOC_DEGISTIRME_TARIH,
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
    <div>
      <CreateModal onRefresh={refreshTable} secilenBakimID={secilenBakimID} />
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
