import React, { useState, useEffect } from "react";
import bg from "../../../assets/images/bg-card.png";
import { Modal, Spin, Typography } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../api/http.jsx";
import ModalTablo from "../../BakımVeArizaYonetimi/IsEmri/Table/Table.jsx";

const { Text } = Typography;

function Component2(props) {
  const { watch, setValue } = useFormContext();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const updateApi = watch("updateApi");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("GetDashboardCards?ID=2");
      setData(response);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Spin size="large" style={{ color: "#fff" }} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text style={{ fontWeight: "500", fontSize: "35px", color: "white" }}>{data?.ACIK_IS_EMIRLERI !== undefined ? data.ACIK_IS_EMIRLERI : ""}</Text>
            <Text style={{ color: "white", fontSize: "15px", fontWeight: "400" }}>Açık İş Emirleri</Text>
          </div>
          <FormOutlined style={{ fontSize: "60px", color: "rgba(255,255,255,.8)" }} />
        </div>
      )}

      <Modal width={1400} centered title="Açık İş Emirleri" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <ModalTablo />
        </div>
      </Modal>
    </div>
  );
}

export default Component2;
