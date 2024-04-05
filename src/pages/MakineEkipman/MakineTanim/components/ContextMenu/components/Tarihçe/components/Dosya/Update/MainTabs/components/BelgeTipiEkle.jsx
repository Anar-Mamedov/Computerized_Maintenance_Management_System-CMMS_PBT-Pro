import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table, message, Typography } from "antd";
import AxiosInstance from "../../../../../../../../../../../../api/http";
import { Controller, useForm } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons";
import EditModal from "./EditModal";

const { Text, Link } = Typography;
const { TextArea } = Input;

export default function BelgeTipiEkle({ workshopSelectedId, onSubmit }) {
  // useFormContext is replaced with useForm for local form state management
  const { control, reset, getValues, handleSubmit } = useForm({
    defaultValues: {
      tipTanim: "",
      tipAciklama: "",
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMarkaEkleModalVisible, setIsMarkaEkleModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // EditModal için yeni state

  const columns = [
    { title: "Belge Tipi", dataIndex: "DST_TANIM", key: "DST_TANIM" },
    { title: "Açıklama", dataIndex: "DST_ACIKLAMA", key: "DST_ACIKLAMA" },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    AxiosInstance.get("GetDosyaTipleri")
      .then((response) => {
        const fetchedData = response.map((item) => ({
          ...item,
          key: item.TB_DOSYA_TIP_ID,
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

  const handleMarkaEkleModalOk = handleSubmit((values) => {
    onSubmited(values);
    setIsMarkaEkleModalVisible(false);
  });

  const onSubmited = (data) => {
    const Body = {
      DST_TANIM: data.tipTanim,
      DST_ACIKLAMA: data.tipAciklama,
    };

    AxiosInstance.post("AddDosyaTip", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
        fetch();
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        // Handle errors here, e.g.:
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });

    console.log({ Body });
  };

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const handleEditModalToggle = () => {
    setIsEditModalVisible((prev) => !prev);
  };

  const onRowClick = (record) => {
    return {
      onClick: () => {
        setSelectedRow(record); // Set the selected file state
        handleEditModalToggle(); // Bu fonksiyon artık EditModal'ı açıp kapatacak
      },
    };
  };

  const refreshData = () => {
    // Veri yenileme işlemleri
    fetch();
  };

  return (
    <div>
      <Button onClick={handleModalToggle}>+</Button>
      <Modal
        width="1200px"
        centered
        title="Belge Tipi Ekle"
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
              + Tip Ekle
            </Button>
            <Button type="primary" danger>
              <DeleteOutlined />
              Sil
            </Button>
          </div>

          <Modal
            title="Tip Ekle"
            centered
            open={isMarkaEkleModalVisible}
            onOk={handleMarkaEkleModalOk}
            onCancel={handleMarkaEkleModalToggle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "400px",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text style={{ fontWeight: "600" }}>Belge Tipi</Text>
              <Controller
                name="tipTanim"
                control={control}
                rules={{ required: "Alan Boş Bırakılamaz!" }}
                render={({ field, fieldState: { error } }) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                      maxWidth: "300px",
                      minWidth: "300px",
                    }}>
                    <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                    {error && <div style={{ color: "red" }}>{error.message}</div>}
                  </div>
                )}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                flexWrap: "wrap",
                width: "100%",
                maxWidth: "400px",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}>
              <Text>Açıklama</Text>
              <Controller
                name="tipAciklama"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      width: "100%",
                      maxWidth: "300px",
                      minWidth: "300px",
                    }}
                    rows={4}
                  />
                )}
              />
            </div>
          </Modal>
        </div>

        <Table
          rowSelection={{
            type: "radio",
            selectedRowKeys,
            onChange: onRowSelectChange,
          }}
          onRow={onRowClick}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          columns={columns}
          dataSource={data}
          loading={loading}
        />
        <EditModal
          onRefresh={refreshData}
          isModalVisible={isEditModalVisible} // Bu satırı değiştirdik
          onModalClose={() => {
            setIsEditModalVisible(false); // Bu satırı değiştirdik
            setSelectedRow(null);
          }}
          selectedRow={selectedRow}
        />
      </Modal>
    </div>
  );
}
