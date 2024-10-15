import { Checkbox, Space, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components";
import FinancialDetailsTable from "./components/FinancialDetailsTable";
import RequisiteTable from "./components/RequisiteTable";
import DetailsTable from "./components/DetailsTable";
import DeliveryTable from "./components/DeliveryTable";
import CustomFields from "./components/OzelAlanlar/CustomFields";
import Notes from "./components/Notes";
import ThirdTab from "../../components/secondTabs/components/ThirdTab/ThirdTab";
import FifthTab from "./components/FifthTab/FifthTab";
import NinthTab from "./components/NinthTab/NinthTab";
import FourthTab from "./components/FourthTab/FourthTab";
import TenthTab from "./components/TenthTab/TenthTab";

//styled components
const StyledTabs = styled(Tabs)`
  ${"" /* border-radius: 20px; */}
  .ant-tabs-nav-list {
    ${"" /* border-top-right-radius: 10px; */}
    background-color: rgba(230, 230, 230, 0.3);
    overflow: hidden;
  }
  .ant-tabs-tab {
    /* background-color: rgba(230, 230, 230, 0.3); */
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
  }

  .ant-tabs-nav-wrap {
    ${"" /* border-radius: 10px 10px 0 0; */}
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }
  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab-disabled,
  .ant-tabs-tab-disabled:hover .ant-tabs-tab-btn {
    color: grey !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background-color: #2bc770;
  }
`;

//styled components end

// tab
const { TabPane } = Tabs;

// Tab end

export default function SecondTabs() {
  const { watch } = useFormContext();
  const showYakitTab = watch("makineYakitKullanim");
  const showOtonomTab = watch("makineOtonomBakim");

  return (
    <Space
      style={{
        display: "block",
        // flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* tab */}

      <StyledTabs
        defaultActiveKey="3"
        style={{
          maxWidth: "100%",
          marginBottom: "40px",
        }}
      >
        {/* <TabPane tab="Analiz" key="1" disabled>
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <FinancialDetailsTable />
          </div>
        </TabPane> */}
        {/* <TabPane tab="Ekipman Ağacı" key="2" disabled>
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <RequisiteTable />
          </div>
        </TabPane> */}
        <TabPane tab="Detay Bilgi" key="3">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            <ThirdTab />
          </div>
        </TabPane>
        <TabPane tab="Finansal Bilgiler" key="4">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            <FourthTab />
          </div>
        </TabPane>
        {/* <TabPane tab="Sayaçlar" key="5" disabled>
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <FifthTab />
          </div>
        </TabPane> */}
        {/* <TabPane tab="Periyodik Bakımlar" key="6" disabled>
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <DetailsTable />
          </div>
        </TabPane> */}
        {/* {showOtonomTab && (
          <TabPane tab="Otonom Bakımlar" key="7" disabled>
            <div
              style={{
                // display: "flex",
                // flexFlow: "row wrap",
                gap: "15px",
              }}>
              <DeliveryTable />
            </div>
          </TabPane>
        )} */}
        {/* {showYakitTab && (
          <TabPane tab="Yakıt Bilgileri" key="10">
            <div
              style={{
                // display: "flex",
                // flexFlow: "row wrap",
                gap: "15px",
              }}>
              <TenthTab />
            </div>
          </TabPane>
        )} */}
        <TabPane tab="Özel Alanlar" key="11">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            <CustomFields />
          </div>
        </TabPane>
        <TabPane tab="Notlar" key="12">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            <Notes />
          </div>
        </TabPane>
        <TabPane tab="Ekli Belgeler" key="9">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            <NinthTab />
          </div>
        </TabPane>
        <TabPane tab="Resimler" key="13">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}
          >
            {/* <NinthTab /> */}
          </div>
        </TabPane>
      </StyledTabs>
      {/* <Tabs defaultActiveKey="1" items={items} onChangeTab={onChangeTab} /> */}
    </Space>
  );
}
