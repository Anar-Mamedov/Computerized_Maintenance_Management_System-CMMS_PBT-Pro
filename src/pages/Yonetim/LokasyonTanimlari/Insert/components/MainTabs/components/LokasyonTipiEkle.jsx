import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { Controller, useForm } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons";

export default function LokasyonTipiEkle({ workshopSelectedId, onSubmit }) {
  // useFormContext is replaced with useForm for local form state management
  const { control, reset, getValues } = useForm({
    defaultValues: {
      markaEkle: "",
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMarkaEkleModalVisible, setIsMarkaEkleModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Marka", dataIndex: "subject", key: "subject" },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetLokasyonTipleri")
      .then((response) => {
        const fetchedData = response.map((item) => ({
          key: item.TB_LOKASYON_TIP_ID,
          subject: item.LOT_TANIM,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

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

  // yeni marka ekleme modalı

  const handleMarkaEkleModalToggle = () => {
    setIsMarkaEkleModalVisible((prev) => !prev);
    if (!isMarkaEkleModalVisible) {
      reset();
    }
  };

  const handleMarkaEkleModalOk = () => {
    const values = getValues();
    onSubmited(values);
    setIsMarkaEkleModalVisible(false);
  };

  const onSubmited = (data) => {
    const Body = {
      LOT_TANIM: data.markaEkle,
      LOT_VARSAYILAN: false,
      LOT_ICON_ID: 0,
    };

    AxiosInstance.post("AddLokasyonTip", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
        fetch();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  return (
    <div>
      <Button onClick={handleModalToggle}>+</Button>
      <Modal
        width="1200px"
        centered
        title="Lokasyon Tip Ekle"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "10px",
            justifyContent: "flex-end",
          }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Button type="primary" onClick={handleMarkaEkleModalToggle}>
              + Ekle
            </Button>
            <Button type="primary" danger>
              <DeleteOutlined />
              Sil
            </Button>
          </div>

          <Modal
            title="Lokasyon Tip Ekle"
            centered
            open={isMarkaEkleModalVisible}
            onOk={handleMarkaEkleModalOk}
            onCancel={handleMarkaEkleModalToggle}>
            <Controller name="markaEkle" control={control} render={({ field }) => <Input {...field} />} />
          </Modal>
        </div>

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          columns={columns}
          dataSource={data}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
