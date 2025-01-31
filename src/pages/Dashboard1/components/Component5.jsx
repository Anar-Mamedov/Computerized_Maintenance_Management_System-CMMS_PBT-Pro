import React, { useEffect, useState } from "react";
import { Modal, Typography, Spin } from "antd";
import AxiosInstance from "../../../api/http.jsx";
import ModalTablo from "../../YardimMasasi/IsTalepleri/Table/ModalTablo/ModalTablo.jsx";
import MakineTablo from "./../../MakineEkipman/MakineTanim/Table/Table.jsx";
import AcikIsEmrirleri from "../../BakımVeArizaYonetimi/IsEmri/Table/ModalTable/ModalTable.jsx";

const { Text } = Typography;

function Component5(updateApi) {
  const [data, setData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
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
    fetchData();
  }, []);

  const showModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
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
        borderRadius: "5px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #f0f0f0",
      }}
    >
      <div style={{ padding: "10px" }}>
        <Text style={{ fontWeight: "500", fontSize: "17px" }}>Özet Durum</Text>
      </div>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            overflow: "auto",
            height: "100vh",
          }}
        >
          <div
            onClick={() => showModal("Devam Eden İş Talepleri", <ModalTablo />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "blue",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Devam Eden İş Talepleri </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "rgb(0 0 255 / 35%)", // blue with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "blue",
              }}
            >
              {data?.DEVAM_EDEN_IS_TALEPLERI !== undefined ? data.DEVAM_EDEN_IS_TALEPLERI : ""}
            </Text>
          </div>
          <div
            onClick={() => showModal("Açık İş Emirleri", <AcikIsEmrirleri />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Açık İş Emirleri </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "#C8F4DD", // green with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "green",
              }}
            >
              {data?.ACIK_IS_EMIRLERI !== undefined ? data.ACIK_IS_EMIRLERI : ""}
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Düşük Stoklu Malzemeler </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "#ff000078", // red with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "red",
              }}
            >
              {data?.DUSUK_STOKLU_MALZEMELER !== undefined ? data.DUSUK_STOKLU_MALZEMELER : ""}
            </Text>
          </div>
          <div
            onClick={() => showModal("Makineler", <MakineTablo />)}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 10px 5px 10px",
              borderBottom: "1px solid #f0f0f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "orange",
                  borderRadius: "50%",
                }}
              ></div>
              <Text> Toplam Makine Sayısı </Text>
            </div>

            <Text
              style={{
                borderRadius: "10px 10px 10px 10px",
                backgroundColor: "rgba(255, 165, 0, 0.35)", // orange with 50% opacity
                padding: "0px 5px 0px 5px",
                color: "#b57500",
              }}
            >
              {data?.MAKINE_SAYISI !== undefined ? data.MAKINE_SAYISI : ""}
            </Text>
          </div>
        </div>
      )}
      <Modal width="90%" centered destroyOnClose title={modalTitle} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div>{modalContent}</div>
      </Modal>
    </div>
  );
}

export default Component5;
