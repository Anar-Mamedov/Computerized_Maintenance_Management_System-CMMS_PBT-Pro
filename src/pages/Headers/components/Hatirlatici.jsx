import React, { useEffect, useState } from "react";
import { Button, Collapse, Popover, Badge, Spin, Modal } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { FaRegCalendarAlt } from "react-icons/fa";
import styled from "styled-components";
import YaklasanPeriyodikBakimlar from "./Tables/YaklasanPeriyodikBakimlar/PeryodikBakimlar.jsx";

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

export default function HatirlaticiPopover({ hatirlaticiData, loading, open, setOpen }) {
  const [hatirlaticiDataCount, setHatirlaticiDataCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    if (hatirlaticiData) {
      const total = Object.values(hatirlaticiData).reduce((acc, value) => {
        if (typeof value === "number") {
          return acc + value;
        }
        return acc;
      }, 0);
      setHatirlaticiDataCount(total);
    }
  }, [hatirlaticiData]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleItemClick = (title, contentComponent) => {
    setModalTitle(title);
    setModalContent(contentComponent);
    setIsModalOpen(true);
    setOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const content = (
    <div
      style={{
        display: "flex",
        maxHeight: "calc(100vh - 100px)",
        maxWidth: "350px",
        width: "100%",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#80808051",
          borderRadius: "5px",
          padding: "10px 0",
        }}
      >
        Hatırlatıcı1
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          overflow: "auto",
          padding: "5px",
        }}
      >
        {loading ? (
          <div style={{ display: "flex", width: "250px", alignItems: "center", justifyContent: "center" }}>
            <Spin />
          </div>
        ) : (
          <>
            <StyledCollapse
              size="small"
              collapsible="header"
              defaultActiveKey={["1"]}
              items={[
                {
                  key: "1",
                  label: "Ajanda",
                  // children: <div>Ajanda</div>,
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
                  // children: <FirmaVeSozlesme />,
                  children: (
                    <div>
                      <div
                        style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", cursor: "pointer" }}
                        onClick={() => handleItemClick("Yaklaşan Periyodik Bakımlar", <YaklasanPeriyodikBakimlar />)}
                      >
                        <div>Yaklaşan Periyodik Bakımlar</div>
                        {/*{hatirlaticiData?.TotalYaklasanSure}*/}
                        <Badge size="small" color="blue" count={hatirlaticiData?.TotalYaklasanSure} showZero={false} />
                      </div>
                    </div>
                  ),
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
                  label: "Doküman Yönetimi",
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
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
                  // children: <FirmaVeSozlesme />,
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
  return (
    <>
      <Popover content={content} trigger="click" open={open} onOpenChange={handleOpenChange}>
        <Badge size="small" count={hatirlaticiDataCount}>
          {/*<Button type="succes" shape="circle" icon={<FaRegCalendarAlt style={{ fontSize: "22px" }} />}></Button>*/}
          {loading ? <Spin /> : <FaRegCalendarAlt style={{ fontSize: "22px", cursor: "pointer" }} />}
        </Badge>
      </Popover>
      <Modal title={modalTitle} open={isModalOpen} width={1300} onCancel={handleModalClose} footer={null}>
        {modalContent}
      </Modal>
    </>
  );
}
