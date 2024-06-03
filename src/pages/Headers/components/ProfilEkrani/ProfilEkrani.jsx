import React, { useEffect, useState } from "react";
import { Tabs, Typography } from "antd";
import styled from "styled-components";
import { useForm, FormProvider } from "react-hook-form";
import HesapBilgilerim from "./components/HesapBilgilerim.jsx";

const { Text } = Typography;

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: 100% !important;
    padding: 10px 15px;
    background-color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: flex-start;
    border-left: 1px solid #ffffff !important;
  }

  .ant-tabs-tab-active {
    background-color: #4096ff0f;
    border-bottom: 1px solid #4096ff !important;
    border-top: 1px solid #4096ff !important;

    .ant-typography {
      background-color: #4096ff !important;
      color: #ffffff;
    }
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn,
  .ant-tabs-nav .ant-tabs-tab-active:hover .ant-tabs-tab-btn {
    color: #4096ff !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: rgba(43, 199, 112, 0);
  }

  .ant-tabs-tab-btn {
    width: 100%;
  }
`;

//styled components end

export default function ProfilEkrani() {
  const methods = useForm();
  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginRight: "10px" }}>Hesap Bilgilerim</div>
        </div>
      ),
      children: (
        <FormProvider {...methods}>
          <HesapBilgilerim />
        </FormProvider>
      ),
    },
    {
      key: "2",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ marginRight: "10px" }}>Güvenlik</div>
        </div>
      ),
      children: <div>Test</div>,
    },
  ];

  return (
    <div>
      <StyledTabs
        tabPosition="left"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
