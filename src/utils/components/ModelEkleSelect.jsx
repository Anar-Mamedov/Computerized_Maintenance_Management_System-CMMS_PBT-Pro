import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Table, message, Select, Spin, Popconfirm } from "antd";
import AxiosInstance from "../../api/http";
import { useFormContext, Controller } from "react-hook-form";
import { DeleteOutlined } from "@ant-design/icons";

export default function ModelEkleSelect({ workshopSelectedId, onSubmit }) {
  // useFormContext is replaced with useForm for local form state management
  const { control, setValue, watch } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMarkaEkleModalVisible, setIsMarkaEkleModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [yeniMarka, setYeniMarka] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const selectedMarkaID = watch("MakineMarkaID");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${selectedMarkaID}`);
      if (response && response.Makine_Model_List) {
        setOptions(response.Makine_Model_List);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "#", dataIndex: "TB_MODEL_ID", key: "TB_MODEL_ID" },
    { title: "Marka", dataIndex: "MDL_MODEL", key: "MDL_MODEL" },
  ];

  const fetch = useCallback(() => {
    setLoading(true);
    setSelectedRow(null);
    AxiosInstance.get(`GetMakineModelByMarkaId?markaId=${selectedMarkaID}`)
      .then((response) => {
        const fetchedData = response.Makine_Model_List.map((item) => ({
          ...item,
          key: item.TB_MODEL_ID,
        }));
        setData(fetchedData);
      })
      .finally(() => setLoading(false));
  }, [selectedMarkaID]);

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
      setYeniMarka(""); // Reset input when opening modal
    }
  };

  const handleMarkaEkleModalOk = () => {
    if (!yeniMarka.trim()) {
      message.warning("Lütfen model adı giriniz.");
      return;
    }

    const Body = {
      MDL_MARKA_ID: selectedMarkaID,
      MDL_MODEL: yeniMarka,
    };

    AxiosInstance.post("AddMakineModel", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Ekleme Başarılı.");
          fetch(); // Refresh the data
          setYeniMarka(""); // Clear input
          setIsMarkaEkleModalVisible(false);
        } else if (response.status_code === 401) {
          message.error("Bu işlemi yapmaya yetkiniz bulunmamaktadır.");
        } else {
          message.error("Ekleme Başarısız.");
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        message.error("Başarısız Olundu.");
      });
  };

  const handleDelete = async () => {
    if (selectedRow) {
      try {
        const response = await AxiosInstance.post(`DeleteModel?TB_MODEL_ID=${selectedRow.TB_MODEL_ID}`);
        if (response.status_code === 200 || response.status_code === 201) {
          message.success("Silme Başarılı.");
          fetch();
        } else {
          message.error("Silme Başarısız.");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        message.error("Silme Başarısız.");
      }
    }
  };

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
    // Seçilen satırın verisini bulup state'e kaydediyoruz
    const selected = data.find((item) => item.key === selectedKeys[0]);
    setSelectedRow(selected);
  };

  useEffect(() => {
    setValue("MakineModel", null);
    setValue("MakineModelID", null);
    setOptions([]); // Also reset options
  }, [selectedMarkaID, setValue]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name="MakineModel"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              style={{ width: "100%" }}
              disabled={!selectedMarkaID}
              showSearch
              allowClear
              placeholder="Seçim Yapınız"
              optionFilterProp="children"
              filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
              onDropdownVisibleChange={(open) => {
                if (open) {
                  fetchData(); // Fetch data when the dropdown is opened
                }
              }}
              dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
              options={options.map((item) => ({
                value: item.TB_MODEL_ID, // Use the ID as the value
                label: item.MDL_MODEL, // Display the name in the dropdown
              }))}
              onChange={(value) => {
                // Seçilen değerin ID'sini NedeniID alanına set et
                setValue("MakineModelID", value);
                field.onChange(value);
              }}
            />
          )}
        />
        <Controller
          name="MakineModelID"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              style={{ display: "none" }}
            />
          )}
        />
        <Button onClick={handleModalToggle} disabled={!selectedMarkaID}>
          +
        </Button>
      </div>

      <Modal width="1200px" centered title="Model Ekle" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle} footer={null}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "10px",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Button type="primary" onClick={handleMarkaEkleModalToggle}>
              + Model Ekle
            </Button>
            <Popconfirm title="Silme İşlemi" description="Silmek istediğinizden emin misiniz?" onConfirm={handleDelete} okText="Evet" cancelText="Hayır">
              <Button type="primary" danger disabled={!selectedRow}>
                <DeleteOutlined />
                Sil
              </Button>
            </Popconfirm>
          </div>

          <Modal title="Model Ekle" centered open={isMarkaEkleModalVisible} onOk={handleMarkaEkleModalOk} onCancel={handleMarkaEkleModalToggle}>
            <Input value={yeniMarka} onChange={(e) => setYeniMarka(e.target.value)} placeholder="Model adı giriniz" />
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
