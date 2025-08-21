import { Space, Tabs } from "antd";
import React, { useEffect } from "react";
import styled from "styled-components";
import FinancialDetailsTable from "./FinancialDetailsTable";
import RequisiteTable from "./RequisiteTable";
import DetailsTable from "./DetailsTable";
import DeliveryTable from "./DeliveryTable";
import CustomFields from "./CustomFields";
import Notes from "./Notes";

//styled components
const StyledTabs = styled(Tabs)`
  //border-radius: 20px;
  .ant-tabs-nav-list {
    border-top-right-radius: 10px;
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
    border-radius: 10px 10px 0 0;
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
    color: rgba(0, 0, 0, 0.88);
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-ink-bar {
    background-color: #2bc770;
  }
`;

//styled components end

// tab
const { TabPane } = Tabs;

// Tab end

export default function ContractTabs() {
  return (
    <Space
      style={{
        display: "block",
        // flexDirection: "column",
        alignItems: "flex-start",
      }}>
      {/* tab */}

      <StyledTabs
        style={{
          maxWidth: "100%",
        }}>
        <TabPane tab="Detay Bilgiler" key="1">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <FinancialDetailsTable />
          </div>
        </TabPane>
        <TabPane tab="Kontrol Listesi" key="2">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <RequisiteTable />
          </div>
        </TabPane>
        <TabPane tab="Personel" key="3">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Malzemeler" key="4">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Duruşlar" key="5">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Süre Bilgileri" key="6">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <DetailsTable />
          </div>
        </TabPane>
        <TabPane tab="Maliyetler" key="7">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <DeliveryTable />
          </div>
        </TabPane>
        <TabPane tab="Ekipman İşlemleri" key="8">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Ölçüm Değerleri" key="9">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Araç & Gereçler" key="10">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}></div>
        </TabPane>
        <TabPane tab="Özel Alanlar" key="11">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <CustomFields />
          </div>
        </TabPane>

        <TabPane tab="Notlar" key="12">
          <div
            style={{
              // display: "flex",
              // flexFlow: "row wrap",
              gap: "15px",
            }}>
            <Notes />
          </div>
        </TabPane>
      </StyledTabs>
      {/* <Tabs defaultActiveKey="1" items={items} onChangeTab={onChangeTab} /> */}
    </Space>
  );
}
