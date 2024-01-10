import { Collapse } from "antd";
import React from "react";
import FirmaVeSozlesme from "./components/FirmaVeSozlesme/FirmaVeSozlesme";
import styled from "styled-components";

const StyledCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0px 10px !important;
  }
  .ant-collapse-header {
    padding: 5px 10px !important;
  }
  .ant-collapse-header-text {
    color: #0239de !important;
  }
`;

export default function Hatirlatici() {
  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 190px)",
        maxWidth: "350px",
        width: "100%",
        flexDirection: "column",
        gap: "5px",
        border: "1px solid rgba(128, 128, 128, 0.27)",
        borderRadius: "10px",
        marginTop: "-20px",
        marginRight: "-20px",
        paddingTop: "45px",
      }}>
      <div
        style={{
          display: "flex",
          position: "fixed",
          alignItems: "center",
          justifyContent: "center",
          background: "rgb(230, 230, 230)",
          width: "100%",
          maxWidth: "348px",
          height: "40px",
          borderTopLeftRadius: "9px",
          borderTopRightRadius: "9px",
          marginTop: "-45px",
          fontWeight: 500,
        }}>
        Hatırlatıcı
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          overflow: "auto",
          padding: "5px",
        }}>
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Ajanda",
              children: <div>Ajanda</div>,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Bakım Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Dökuman Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Firma ve Sözleşme Yöntemi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Makine ve Ekipman Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Malzeme ve Depo Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Proje Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Satınalma Yönetimi",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
        <StyledCollapse
          size="small"
          collapsible="header"
          defaultActiveKey={["1"]}
          items={[
            {
              key: "1",
              label: "Transfer Onayları",
              children: <FirmaVeSozlesme />,
            },
          ]}
        />
      </div>
    </div>
  );
}
