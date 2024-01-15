import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

const { Text, Link } = Typography;
const { TextArea } = Input;

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }
`;

//styled components end

export default function CreateModal({ workshopSelectedId, onSubmit, onRefresh }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { control, reset, getValues } = useForm({
    defaultValues: {
      siraNo: "",
      secilenID: "",
      isTanimi: "",
      aciklama: "",
    },
  });

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />
      ),
    },
    {
      key: "2",
      label: "Resimler",
      children: "test",
    },
  ];

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi

  const onSubmited = (data) => {
    const Body = {
      MRK_MARKA: data.siraNo,
      MRK_TANIM: data.isTanimi,
      MKR_ACIKLAMA: data.aciklama,
    };

    AxiosInstance.post("AddMakineMarkaTest", Body)
      .then((response) => {
        console.log("Data sent successfully:", response.data);
        reset();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });

    console.log({ Body });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      reset();
    }
  };

  const handleModalOk = () => {
    const values = getValues();
    onSubmited(values);
    setIsModalVisible(false);
    onRefresh();
  };

  // Aşğaıdaki form elemanlarını eklemek üçün API ye gönderilme işlemi sonu

  return (
    <div>
      <div style={{ display: "flex", width: "100%", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button type="link" onClick={handleModalToggle}>
          <PlusOutlined /> Yeni Kayıt
        </Button>
      </div>

      <Modal
        width="1200px"
        title="Kontrol Listesi Ekle"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "400px",
              gap: "10px",
              rowGap: "0px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px" }}>Sira no:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="siraNo"
                control={control}
                render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
              />
              <Controller
                name="secilenID"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    style={{ display: "none" }}
                  />
                )}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: "400px",
              gap: "10px",
              rowGap: "0px",
              marginBottom: "10px",
            }}>
            <Text style={{ fontSize: "14px" }}>İş Tanımı:</Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "300px",
                minWidth: "300px",
                gap: "10px",
                width: "100%",
              }}>
              <Controller
                name="isTanimi"
                control={control}
                render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
              />
            </div>
          </div>
          <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </Modal>
    </div>
  );
}
