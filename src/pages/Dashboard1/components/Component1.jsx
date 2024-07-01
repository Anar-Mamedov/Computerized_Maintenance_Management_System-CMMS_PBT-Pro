import React, { useState, useEffect } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../api/http.jsx";
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";

const { Text } = Typography;

function Component1({ updateApi }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("GetDashboardCards?ID=1");
      setData(response);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [updateApi]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `url(${bg}), linear-gradient(rgb(27 17 92), #7A6FBE)`,
        backgroundPosition: "inherit",
        backgroundSize: "cover",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      {isLoading ? (
        // isLoading durumu true olduğunda bu kod bloğu çalışır
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#fff" }}></Spin>
        </div>
      ) : (
        // isLoading durumu false olduğunda bu kod bloğu çalışır
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text
              style={{ fontWeight: "500", fontSize: "35px", color: "white" }}
            >
              {data?.DEVAM_EDEN_IS_TALEPLERI !== undefined
                ? data.DEVAM_EDEN_IS_TALEPLERI
                : ""}
            </Text>
            <Text
              style={{ color: "white", fontSize: "15px", fontWeight: "400" }}
            >
              Devam Eden İş Talepleri
            </Text>
          </div>
          <ClockCircleOutlined
            style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }}
          />
        </div>
      )}

      <Modal
        width={1400}
        centered
        title="Devam Eden İş Talepleri"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <ModalTablo />
        </div>
      </Modal>
    </div>
  );
}

export default Component1;
