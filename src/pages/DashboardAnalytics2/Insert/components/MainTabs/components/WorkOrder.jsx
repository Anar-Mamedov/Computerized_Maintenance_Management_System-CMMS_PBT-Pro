import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col } from "antd";
import styled from "styled-components";
import React, { useEffect, useState, useRef, createRef } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import "../../../../components/styled.css";
import download from "../../../../../../assets/images/download.jpg";
import download1 from "../../../../../../assets/images/download-1.jpg";
import download2 from "../../../../../../assets/images/download-2.jpg";
import download3 from "../../../../../../assets/images/download-3.jpg";
import AxiosInstance from "../../../../../../api/http";
import LinkedWorkOrder from "./LinkedWorkOrder";
import Status from "./Status";
import WorkOrderType from "./WorkOrderType";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import { Pagination } from "swiper/modules";
import SecondTabs from "../../secondTabs/secondTabs";
import Machine from "./Machine";
import Location from "./Location";
import MachineStatus from "./MachineStatus";
import Equipment from "./Equipment";
import Explanation from "./Explanation";

const { Text } = Typography;

// options for selectbox
const { Option } = Select;
// options for selectbox end

const StyledDrawer = styled(Drawer)`
  & .ant-drawer-header {
    border-bottom: none;
  }

  .ant-drawer-close {
    display: none;
  }
`;

const WorkOrder = ({ onDrawerClose, drawerVisible, selectedRow }) => {
  const [locationId, setLocationId] = React.useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);

  const [locationValue, setLocationValue] = useState("");
  const [machineLocationId, setMachineLocationId] = useState("");
  const [fullLocationValue, setFullLocationValue] = useState("");
  const [machineWarranty, setMachineWarranty] = useState("");
  const [machineWarrantyStatus, setMachineWarrantyStatus] = useState("");

  function handleImageClick(event, image) {
    setSelectedImage(image);
    setModalVisible(true);
  }

  function handleModalClose() {
    setSelectedImage(null);
    setModalVisible(false);
  }

  useEffect(() => {}, [modalVisible]);

  //* use
  const { control, watch, setValue } = useFormContext();

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  // datepicker
  const onChangeDatePicker = (date, dateString) => {};

  //datepicker end
  //selectbox
  const onChangeSelect = (value) => {};
  const onSearch = (value) => {};
  const [options, setOptions] = useState([]);
  //selectbox end

  useEffect(() => {
    // Fetch data when the component mounts
    AxiosInstance.get("IsEmriKodGetir") // replace with your actual endpoint
      .then((response) => {
        const tanimValue = response.Tanim; // adjust this based on your API response structure
        setValue("work_order_no", tanimValue);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [setValue]);

  return (
    <Row style={{ display: "flex", gap: "20px", marginTop: "5px" }}>
      <Col
        style={{
          maxWidth: "1276px",
          gap: "10px",
          height: "220px",
          display: "flex",
          justifyContent: "flex-start",
        }}>
        <Col style={{ display: "flex", flexDirection: "column", maxWidth: "430px", gap: "5px" }}>
          <Col style={{ borderBottom: "1px solid gray", width: "100%" }}>
            <Text style={{ color: "#0084ff", fontWeight: "500" }}>Genel Bilgiler</Text>{" "}
          </Col>
          <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: "14px" }}>İş Emri No:</Text>
            <Controller
              name="work_order_no"
              control={control}
              render={({ field }) => <Input {...field} type="text" variant="outlined" style={{ width: "300px" }} />}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "426px" }}>
            <Text style={{ fontSize: "14px" }}>Düzenleme Tarihi:</Text>
            <div style={{ display: "flex", gap: "10px", width: "300px" }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format="DD-MM-YYYY"
                    onChange={(date) => {
                      field.onChange(date); // Update form's field value
                    }}
                    style={{ width: "168px" }}
                    placeholder="Tarih seçiniz"
                  />
                )}
              />
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    onChange={(time) => {
                      field.onChange(time); // Update form's field value
                    }}
                    format="HH:mm:ss"
                    placeholder="saat seçiniz"
                  />
                )}
              />
            </div>
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <WorkOrderType />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Status />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <LinkedWorkOrder />
          </Col>
        </Col>

        <Col style={{ display: "flex", maxWidth: "840px" }}>
          <Col style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Col style={{ borderBottom: "1px solid gray", width: "100%", display: "flex", alignItems: "center" }}>
              <div style={{ width: "425px" }}>
                <Text style={{ color: "#0084ff", fontWeight: "500" }}>Makine / Lokasyon Bilgileri</Text>{" "}
              </div>
              <div style={{ width: "350px" }}>{/* <Text style={{ fontWeight: "500" }}>Plaka:</Text> */}</div>
            </Col>
            <Location
              setLocationId={setLocationId}
              locationValue={locationValue}
              machineLocationId={machineLocationId}
              fullLocationValue={fullLocationValue}
              selectedMachineId={selectedMachineId}
            />
            <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Machine
                locationId={locationId}
                setSelectedMachineId={setSelectedMachineId}
                setLocationValue={setLocationValue}
                setMachineLocationId={setMachineLocationId}
                setFullLocationValue={setFullLocationValue}
                setMachineWarranty={setMachineWarranty}
                setMachineWarrantyStatus={setMachineWarrantyStatus}
              />
            </Col>
            <Col>
              <Equipment selectedMachineId={selectedMachineId} locationId={locationId} />
            </Col>
            <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Explanation machineWarranty={machineWarranty} machineWarrantyStatus={machineWarrantyStatus} />
            </Col>
            <MachineStatus />
          </Col>
        </Col>
      </Col>

      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "250px",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <div
              {...field}
              style={{
                width: "250px",
                height: "220px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "#b4b3b3",
                alignItems: "center",
              }}>
              <Swiper
                pagination={{
                  dynamicBullets: true,
                }}
                modules={[Pagination]}
                className="mySwiper">
                <SwiperSlide>
                  <img src={download} alt="" onClick={(event) => handleImageClick(event, download)} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={download1} alt="" onClick={(event) => handleImageClick(event, download1)} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={download2} alt="" onClick={(event) => handleImageClick(event, download2)} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={download3} alt="" onClick={(event) => handleImageClick(event, download3)} />
                </SwiperSlide>
                <SwiperSlide>Resim Yok 5</SwiperSlide>
                <SwiperSlide>Resim Yok 6</SwiperSlide>
                <SwiperSlide>Resim Yok 7</SwiperSlide>
                <SwiperSlide>Resim Yok 8</SwiperSlide>
                <SwiperSlide>Resim Yok 9</SwiperSlide>
              </Swiper>
              {modalVisible && (
                <>
                  <div
                    className="modal-overlay"
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      zIndex: 1000,
                    }}
                    onClick={handleModalClose}
                  />
                  <div
                    className="modal"
                    style={{
                      zIndex: 2000,
                      display: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}>
                    <div
                      className="modal-content"
                      style={{
                        margin: "auto",
                        width: "45%",
                        backgroundColor: "#fff0",
                        border: "1px solid #fff0",
                        position: "fixed",
                        transform: "translate(-50%, -50%)",
                        left: "50%",
                        top: "50%",
                      }}>
                      <img src={selectedImage} alt="" style={{ width: "100%", maxHeight: "100%" }} />
                      <Button
                        onClick={handleModalClose}
                        shape="circle"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          top: "0",
                          right: "0",
                          backgroundColor: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          transform: "translate(50%, -50%)",
                          filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                        }}>
                        <CloseOutlined />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        />
      </Col>
      <SecondTabs />
    </Row>
  );
};

export default WorkOrder;
