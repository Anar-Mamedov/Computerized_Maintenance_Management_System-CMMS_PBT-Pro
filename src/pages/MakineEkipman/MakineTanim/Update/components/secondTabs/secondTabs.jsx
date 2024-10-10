import { Checkbox, Space, Tabs } from "antd";
import React, { useEffect, useState, useCallback } from "react";
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
import ResimUpload from "./components/Resim/ResimUpload";
import DosyaUpload from "./components/Dosya/DosyaUpload";
import Ekipman from "./components/Ekipman/EkipmanListesiTablo.jsx";

//styled components
const StyledTabs = styled(Tabs)`
  // styled components code
`;

//styled components end

// tab
const { TabPane } = Tabs;

// Tab end

export default function SecondTabs() {
  const { watch } = useFormContext();
  const showYakitTab = watch("makineYakitKullanim");
  const showOtonomTab = watch("makineOtonomBakim");
  const [activeTabKey, setActiveTabKey] = useState("3");

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <Space
      style={{
        display: "block",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <StyledTabs
        defaultActiveKey="3"
        activeKey={activeTabKey}
        onChange={handleTabChange}
        style={{
          maxWidth: "100%",
          marginBottom: "40px",
        }}
      >
        <TabPane tab="Ekipman Listesi" key="2">
          <div style={{ gap: "15px" }}>
            <Ekipman isActive={activeTabKey === "2"} />
          </div>
        </TabPane>
        <TabPane tab="Detay Bilgi" key="3">
          <div style={{ gap: "15px" }}>
            <ThirdTab />
          </div>
        </TabPane>
        <TabPane tab="Finansal Bilgiler" key="4">
          <div style={{ gap: "15px" }}>
            <FourthTab />
          </div>
        </TabPane>
        <TabPane tab="Sayaçlar" key="5">
          <div style={{ gap: "15px" }}>
            <FifthTab />
          </div>
        </TabPane>
        <TabPane tab="Periyodik Bakımlar" key="6">
          <div style={{ gap: "15px" }}>
            <DetailsTable />
          </div>
        </TabPane>
        {showOtonomTab && (
          <TabPane tab="Otonom Bakımlar" key="7">
            <div style={{ gap: "15px" }}>
              <DeliveryTable />
            </div>
          </TabPane>
        )}
        <TabPane tab="Özel Alanlar" key="11">
          <div style={{ gap: "15px" }}>
            <CustomFields />
          </div>
        </TabPane>
        <TabPane tab="Notlar" key="12">
          <div style={{ gap: "15px" }}>
            <Notes />
          </div>
        </TabPane>
        <TabPane tab="Ekli Belgeler" key="9">
          <div style={{ gap: "15px" }}>
            <DosyaUpload />
          </div>
        </TabPane>
        <TabPane tab="Resimler" key="13">
          <div style={{ gap: "15px" }}>
            <ResimUpload />
          </div>
        </TabPane>
      </StyledTabs>
    </Space>
  );
}
