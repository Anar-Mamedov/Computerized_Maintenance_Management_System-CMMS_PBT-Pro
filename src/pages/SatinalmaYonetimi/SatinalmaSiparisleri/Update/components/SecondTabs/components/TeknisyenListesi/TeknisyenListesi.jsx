import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../api/http";
import { useFormContext } from "react-hook-form";

export default function TeknisyenListesi({ workshopSelectedId, onSubmit }) {
  const { control, watch, setValue } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Personel Adı",
      dataIndex: "code",
      key: "code",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Vardiya",
      dataIndex: "subject",
      key: "subject",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Çalışma Süresi",
      dataIndex: "workdays",
      key: "workdays",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Saat Ücreti",
      dataIndex: "description",
      key: "description",
      width: "150px",
      ellipsis: true,
    },

    {
      title: "Fazla Mesai",
      dataIndex: "fifthcolumn",
      key: "fifthcolumn",
      width: "150px",
      ellipsis: true,
      render: (value) => {
        if (value) {
          // Değer true ise yeşil tik ikonu göster
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CheckOutlined style={{ color: "green" }} />
            </div>
          );
        } else {
          // Değer false ise kırmızı çarpı ikonu göster
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CloseOutlined style={{ color: "red" }} />
            </div>
          );
        }
      },
    },
    {
      title: "Mesai Süresi",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Mesai Ücreti",
      dataIndex: "sixthcolumn",
      key: "sixthcolumn",
      width: "150px",
      ellipsis: true,
    },
    {
      title: "Maliyet",
      dataIndex: "ITK_MALIYET",
      key: "ITK_MALIYET",
      width: "150px",
      ellipsis: true,
    },
  ];

  const secilenTalepID = watch("secilenTalepID");

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get(`GetIsTalepTeknisyenList?isTalepId=${secilenTalepID}`)
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_IS_TALEBI_TEKNISYEN_ID,
          code: item.ITK_PERSONEL_ISIM,
          subject: item.ITK_VARDIYA_TANIM,
          workdays: item.ITK_SURE,
          description: item.ITK_SAAT_UCRETI,
          fifthcolumn: item.ITK_FAZLA_MESAI_VAR,
          sixthcolumn: item.ITK_FAZLA_MESAI_SURE,
          ITK_MALIYET: item.ITK_MALIYET,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [secilenTalepID]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetch();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };
  return (
    <div>
      <Table
        rowSelection={{
          type: "radio",
          selectedRowKeys,
          onChange: onRowSelectChange,
        }}
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{
          // x: "auto",
          y: "calc(100vh - 360px)",
        }}
      />
    </div>
  );
}
