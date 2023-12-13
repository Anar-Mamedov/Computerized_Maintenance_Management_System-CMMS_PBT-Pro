import React, { useState } from "react";
import { Button, Input, Modal, Typography, Checkbox, DatePicker, TimePicker, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const { Text, Link } = Typography;

const onChangeSelect = (value) => {};
const onSearch = (value) => {};

// Filter `option.label` match the user type `input`
const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function Checklist() {
  const [isDisabled, setIsDisabled] = useState(true); // State to manage the disabled state of the fields
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCheckboxChange = (e) => {
    setIsDisabled(!e.target.checked); // Toggle the isDisabled state based on the checkbox value
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (e) => {};
  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "auto",
          marginTop: "-10px",
          marginBottom: "10px",
        }}>
        <PlusOutlined />
        Yeni Kayıt
      </Button>
      <Modal width="701px" title="Kontrol Listesi" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "21px" }}>
            <Text>Sira no</Text>
            <Input style={{ width: "100px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Text>Iş Tanımı</Text>
            <Input style={{ width: "300px" }} />
          </div>
          <Checkbox onChange={onCheckboxChange}>Yapildi</Checkbox>
          <div style={{ border: "1px solid #8080806e ", padding: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                <Text>Atölye</Text>
                <Input disabled={isDisabled} style={{ width: "507px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                <Text>Personel</Text>
                <Input disabled={isDisabled} style={{ width: "507px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                <Text>Başlangıç Zamanı</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "507px",
                    justifyContent: "space-between",
                  }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <DatePicker disabled={isDisabled} onChange={onChange} />
                    <TimePicker disabled={isDisabled} format="HH:mm" placeholder="saat seçiniz" />
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Text>Vardiya</Text>
                    <Select
                      disabled={isDisabled}
                      style={{ width: "141px" }}
                      allowClear
                      showSearch
                      placeholder="Seçim Yap"
                      optionFilterProp="children"
                      onChange={onChangeSelect}
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "jack",
                          label: "Jack",
                        },
                        {
                          value: "lucy",
                          label: "Lucy",
                        },
                        {
                          value: "tom",
                          label: "Tom",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
                <Text>Bitiş Zamanı</Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "507px",
                    justifyContent: "space-between",
                  }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <DatePicker disabled={isDisabled} onChange={onChange} />
                    <TimePicker disabled={isDisabled} format="HH:mm" placeholder="saat seçiniz" />
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Text>Süre(dk)</Text>
                    <Input disabled={isDisabled} style={{ width: "141px" }} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Açıklama</Text>
                <TextArea disabled={isDisabled} style={{ width: "507px" }} rows={3} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
