import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Input, Modal, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function FixTarihler1(props) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Düzenlenen satırın indeksini tutar
  const fixTarihlerFromApi = watch("fixTarihlerFromApi") || [];
  const fixTarihlerFromModal = watch("fixTarihlerFromModal") || [];

  const handleDelete = (index) => {
    if (index < fixTarihlerFromApi.length) {
      // fixTarihlerFromApi dizisindeki bir öğeyi siliyoruz
      const updatedApiData = fixTarihlerFromApi.filter((_, i) => i !== index);
      setValue("fixTarihlerFromApi", updatedApiData);
    } else {
      // fixTarihlerFromModal dizisindeki bir öğeyi siliyoruz
      const updatedModalData = fixTarihlerFromModal.filter(
        (_, i) => i !== index - fixTarihlerFromApi.length
      );
      setValue("fixTarihlerFromModal", updatedModalData);
    }
  };

  const columns = [
    {
      title: "",
      dataIndex: "day",
      key: "day",
      width: 20,
      render: (text, record, index) => (
        <a onClick={() => handleEdit(index)}>{text}</a>
      ),
    },
    {
      title: "",
      dataIndex: "mounth",
      key: "mounth",
      render: (text, record, index) => (
        <a onClick={() => handleEdit(index)}>{text}</a>
      ),
    },
    {
      title: "",
      key: "delete",
      width: 15,
      render: (text, record, index) => (
        <Button danger onClick={() => handleDelete(index)}>
          <DeleteOutlined />
        </Button>
      ),
    },
    // Diğer kolonlar buraya eklenebilir
  ];

  const handleAdd = () => {
    setValue("day", "");
    setValue("mounth", "");
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const dayValue = watch("day");
    const mounthValue = watch("mounth");

    if (editingIndex !== null) {
      if (editingIndex < fixTarihlerFromApi.length) {
        // fixTarihlerFromApi dizisindeki bir öğeyi güncelliyoruz
        const updatedItem = {
          id: fixTarihlerFromApi[editingIndex].id,
          day: dayValue,
          mounth: mounthValue,
        };

        // Güncellenmiş öğeyi fixTarihlerFromModal dizisine ekliyoruz
        setValue("fixTarihlerFromModal", [
          ...fixTarihlerFromModal,
          updatedItem,
        ]);

        // Güncellenmiş öğeyi fixTarihlerFromApi dizisinden siliyoruz
        const updatedApiData = fixTarihlerFromApi.filter(
          (_, index) => index !== editingIndex
        );
        setValue("fixTarihlerFromApi", updatedApiData);
      } else {
        // fixTarihlerFromModal dizisindeki bir öğeyi güncelliyoruz
        const updatedData = [...fixTarihlerFromModal];
        updatedData[editingIndex - fixTarihlerFromApi.length] = {
          id: updatedData[editingIndex - fixTarihlerFromApi.length].id,
          day: dayValue,
          mounth: mounthValue,
        };
        setValue("fixTarihlerFromModal", updatedData);
      }
    } else {
      // Yeni bir satır ekliyoruz
      setValue("fixTarihlerFromModal", [
        ...fixTarihlerFromModal,
        {
          id: Math.random(),
          day: dayValue,
          mounth: mounthValue,
        },
      ]);
    }

    setIsModalVisible(false);
    setValue("day", "");
    setValue("mounth", "");
    setEditingIndex(null); // Düzenleme modunu sıfırlar
  };

  const handleEdit = (index) => {
    let rowData;
    if (index < fixTarihlerFromApi.length) {
      // fixTarihlerFromApi dizisindeki bir öğeyi düzenliyoruz
      rowData = fixTarihlerFromApi[index];
    } else {
      // fixTarihlerFromModal dizisindeki bir öğeyi düzenliyoruz
      rowData = fixTarihlerFromModal[index - fixTarihlerFromApi.length];
    }

    setValue("day", rowData.day);
    setValue("mounth", rowData.mounth);
    setEditingIndex(index);
    setIsModalVisible(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button type="primary" onClick={handleAdd}>
          Ekle
        </Button>
      </div>

      <Table
        dataSource={fixTarihlerFromApi.concat(fixTarihlerFromModal)}
        columns={columns}
        rowKey="id"
      />
      <Modal
        title={"Tarih Ekle"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          setValue("day", "");
          setValue("mounth", "");
        }}
      >
        <ModalForm />
      </Modal>
    </div>
  );
}

const ModalForm = () => {
  const { control } = useFormContext();
  return (
    <form
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <label>Gün</label>
      <Controller
        name="day"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <label>Ay</label>
      <Controller
        name="mounth"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
    </form>
  );
};

export default FixTarihler1;
