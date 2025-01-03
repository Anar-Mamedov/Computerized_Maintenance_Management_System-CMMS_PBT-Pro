import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table, message } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons";
import ModelSelectEkle from "./ModelSelectEkle";

export default function ModelEkle({ workshopSelectedId, onSubmit }) {
  // useFormContext is replaced with useForm for local form state management
  const { control, reset, getValues } = useForm({
    defaultValues: {
      modelEkle: "",
    },
  });
  const { watch } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMarkaEkleModalVisible, setIsMarkaEkleModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Marka", dataIndex: "subject", key: "subject" },
  ];

  const selectedMarkaModelEkleID = watch("MakineMarkaModelEkleID");

  // API'den veri çeken fonksiyon
  const fetchData = async () => {
    // Eğer selectedMarkaModelEkleID geçerli bir değer değilse, tabloyu temizle ve fonksiyondan çık
    if (!selectedMarkaModelEkleID) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${selectedMarkaModelEkleID}`);
      const fetchedData = response.Makine_Model_List.map((item) => ({
        key: item.TB_MODEL_ID,
        subject: item.MDL_MODEL,
      }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // selectedMarkaModelEkleID değiştiğinde veri çekme işlemini tetikle
  useEffect(() => {
    fetchData();
  }, [selectedMarkaModelEkleID]);

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
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
      fetchData(); // Modal kapatıldığında tabloyu güncelle
    }
  };

  const handleMarkaEkleModalOk = () => {
    const values = getValues();
    onSubmited(values);
    setIsMarkaEkleModalVisible(false);
    fetchData(); // Modal kapatıldıktan sonra tabloyu güncelle
  };

  const onSubmited = (data) => {
    const Body = {
      MDL_MARKA_ID: selectedMarkaModelEkleID,
      MDL_MODEL: data.modelEkle,
    };

    AxiosInstance.post("AddMakineModel", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          fetchData();
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

  return (
    <div>
      <Button onClick={handleModalToggle}>+</Button>
      <Modal width="1200px" centered title="Model Ekle" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "10px",
            justifyContent: "space-between",
          }}
        >
          <ModelSelectEkle />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Button
              type="primary"
              onClick={handleMarkaEkleModalToggle}
              disabled={!selectedMarkaModelEkleID} // selectedMarkaModelEkleID yoksa düğmeyi devre dışı bırak
            >
              + Model Ekle
            </Button>
            <Button type="primary" danger>
              <DeleteOutlined />
              Sil
            </Button>
          </div>
          <Modal title="Model Ekle" centered open={isMarkaEkleModalVisible} onOk={handleMarkaEkleModalOk} onCancel={handleMarkaEkleModalToggle}>
            <Controller name="modelEkle" control={control} render={({ field }) => <Input {...field} />} />
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
