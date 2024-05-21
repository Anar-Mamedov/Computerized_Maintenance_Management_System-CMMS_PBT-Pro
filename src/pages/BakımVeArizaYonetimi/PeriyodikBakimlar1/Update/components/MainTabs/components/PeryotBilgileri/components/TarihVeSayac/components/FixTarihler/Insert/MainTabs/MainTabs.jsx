import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Modal,
  Input,
  Typography,
  Tabs,
  InputNumber,
  Select,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
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

const options = [
  { label: "Ocak", value: "1" },
  { label: "Şubat", value: "2" },
  { label: "Mart", value: "3" },
  { label: "Nisan", value: "4" },
  { label: "Mayıs", value: "5" },
  { label: "Haziran", value: "6" },
  { label: "Temmuz", value: "7" },
  { label: "Ağustos", value: "8" },
  { label: "Eylül", value: "9" },
  { label: "Ekim", value: "10" },
  { label: "Kasım", value: "11" },
  { label: "Aralık", value: "12" },
];

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller
          name="aciklama"
          control={control}
          render={({ field }) => <TextArea {...field} rows={4} />}
        />
      ),
    },
    {
      key: "2",
      label: "Resimler",
      children: "test",
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <Text style={{ fontSize: "14px" }}>Gün:</Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "140px",
          gap: "10px",
          width: "100%",
        }}
      >
        <Controller
          name="gun"
          control={control}
          render={({ field }) => (
            <InputNumber {...field} min={1} max={31} style={{ flex: 1 }} />
          )}
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

      <Text style={{ fontSize: "14px" }}>Ay:</Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          maxWidth: "140px",
          gap: "10px",
          width: "100%",
        }}
      >
        <Controller
          name="ay"
          control={control}
          render={({ field }) => (
            <Select {...field} options={options} style={{ flex: 1 }} />
          )}
        />
      </div>
      {/*<StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />*/}
    </div>
  );
}
