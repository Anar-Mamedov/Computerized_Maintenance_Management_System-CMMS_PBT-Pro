import {
  Drawer,
  Typography,
  Space,
  Button,
  Divider,
  Input,
  Select,
  TreeSelect,
  DatePicker,
  TimePicker,
  Row,
  Col,
} from "antd";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";
import "../../../components/styled.css";
import download from "../../../../../assets/images/download.jpg";
import download1 from "../../../../../assets/images/download-1.jpg";
import download2 from "../../../../../assets/images/download-2.jpg";
import download3 from "../../../../../assets/images/download-3.jpg";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

// import required modules
import { Pagination } from "swiper/modules";
import ContractTabs from "../../Tabs/ContractTabs";

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

let index = 0;

const treeData = [
  {
    value: "Lokasyonlar",
    title: "Lokasyonlar",
    children: [
      {
        value: "Istanbul",
        title: "Istanbul",
        children: [
          {
            value: "Pendik",
            title: "Pendik",
          },
          {
            value: "Tuzla",
            title: "Tuzla",
          },
        ],
      },
      {
        value: "Bursa",
        title: "Bursa",
        children: [
          {
            value: "Nilufer",
            title: "Nilufer",
          },
        ],
      },
    ],
  },
];

const WorkOrder = ({ onDrawerClose, drawerVisible, selectedRow }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  function handleImageClick(event, image) {
    console.log("handleImageClick called");
    setSelectedImage(image);
    setModalVisible(true);
  }

  function handleModalClose() {
    setSelectedImage(null);
    setModalVisible(false);
  }

  useEffect(() => {
    console.log("modalVisible:", modalVisible);
  }, [modalVisible]);

  //* use
  const { control, watch } = useFormContext();

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const inputStyle = {
    height: "15px", // Set the desired height here
  };

  const currencies = [
    {
      value: "1",
      label: "Baski Makinesi",
    },
    {
      value: "2",
      label: "Baski Makinesi",
    },
    {
      value: "3",
      label: "Kagit Makinesi",
    },
    {
      value: "4",
      label: "Axygen",
    },
  ];

  const [items, setItems] = useState(["Bakım", "Çalışıyor"]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const [plkLocationValue, setPlkLocationValue] = useState("");

  const [value, setValue] = useState();
  const onChange = (newValue, label, extra) => {
    setValue(newValue);
    const fullPath = extra.triggerValue ? `${extra.triggerValue}/${label}` : label;

    setPlkLocationValue(fullPath);
  };
  // datepicker
  const onChangeDatePicker = (date, dateString) => {
    console.log(date, dateString);
  };
  //datepicker end
  //selectbox
  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const [options, setOptions] = useState([]);
  //selectbox end
  // treeselect de sadece ilk elemanı açık bırakmak için
  const defaultExpandedKeys = treeData.length > 0 ? [treeData[0].value] : [];

  const [plkMachineValue, setPlkMachineValue] = useState("");

  const machineValue = watch("machine");

  useEffect(() => {
    setPlkMachineValue(machineValue);
  }, [machineValue]);

  return (
    <Row style={{ display: "flex", gap: "20px", marginTop: "5px", marginBottom: "100px" }}>
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
              render={({ field }) => (
                <Input
                  {...field}
                  type="text" // Set the type to "text" for name input
                  variant="outlined"
                  style={{ width: "300px" }}
                />
              )}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>Düzenleme Tarihi:</Text>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  onChange={onChangeDatePicker}
                  {...field}
                  style={{ width: "168px" }}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
            <Controller
              name="time"
              control={control}
              render={({ field }) => <TimePicker format="HH:mm" {...field} placeholder="saat seçiniz" />}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>İş Emri Tipi:</Text>
            <Controller
              name="machine_type"
              control={control}
              render={({ field }) => (
                <Controller
                  name="machine_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Select a person"
                      optionFilterProp="children"
                      onChange={onChangeSelect}
                      onSearch={onSearch}
                      style={{ width: "300px" }}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      value={field.value}>
                      {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              )}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>Durum:</Text>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChangeSelect}
                  onSearch={onSearch}
                  style={{ width: "300px" }}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  value={field.value}>
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Col>
          <Col style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <Text style={{ fontSize: "14px" }}>Bağlı İş Emri:</Text>
            <Controller
              name="brand"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChangeSelect}
                  onSearch={onSearch}
                  style={{ width: "300px" }}
                  filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                  value={field.value}>
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Col>
        </Col>

        <Col style={{ display: "flex", maxWidth: "840px" }}>
          <Col style={{ display: "flex", flexDirection: "column", maxWidth: "420px", gap: "5px" }}>
            <Col style={{ borderBottom: "1px solid gray", width: "100%" }}>
              <Text style={{ color: "#0084ff", fontWeight: "500" }}>Makine / Lokasyon Bilgileri</Text>{" "}
            </Col>
            <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TreeSelect
                    {...field}
                    showSearch
                    style={{
                      width: "300px",
                    }}
                    value={value}
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: "auto",
                    }}
                    placeholder=""
                    allowClear
                    treeDefaultExpandedKeys={defaultExpandedKeys}
                    onChange={onChange}
                    treeData={treeData}
                  />
                )}
              />
            </Col>
            <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: "14px" }}>Makine:</Text>
              <Controller
                name="machine"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={onChangeSelect}
                    onSearch={onSearch}
                    style={{ width: "300px" }}
                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                    value={field.value}>
                    {options.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Col>
            <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: "14px" }}>Garanti Bitis:</Text>
              <Controller
                name="warranty_end"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text" // Set the type to "text" for name input
                    variant="outlined"
                    style={{ width: "300px" }}
                    disabled={true}
                  />
                )}
              />
            </Col>
            <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: "14px" }}>Ekipman:</Text>
              <Controller
                name="equipment"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={onChangeSelect}
                    onSearch={onSearch}
                    style={{ width: "300px" }}
                    filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                    value={field.value}>
                    {options.map((option) => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Col>
            <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontSize: "14px" }}>Makine Durumu:</Text>
              <Controller
                name="machine_status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    style={{
                      width: 300,
                    }}
                    placeholder=""
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider
                          style={{
                            margin: "8px 0",
                          }}
                        />
                        <Space
                          style={{
                            padding: "0 8px 4px",
                          }}>
                          <Input placeholder="" ref={inputRef} value={name} onChange={onNameChange} />
                          <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            Ekle
                          </Button>
                        </Space>
                      </>
                    )}
                    options={items.map((item) => ({
                      label: item,
                      value: item,
                    }))}
                  />
                )}
              />
            </Col>
          </Col>
          <Col style={{ display: "flex", flexDirection: "column", maxWidth: "420px", gap: "5px" }}>
            <Col style={{ borderBottom: "1px solid gray", width: "100%" }}>
              <Text style={{ color: "#333333", fontWeight: "500" }}>Plaka:</Text>{" "}
            </Col>

            <Col style={{ display: "flex", flexDirection: "column", gap: "5px", paddingLeft: "10px" }}>
              <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
                <Controller
                  name="plkLocation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      variant="outlined"
                      style={{ width: "300px" }}
                      value={plkLocationValue}
                      disabled={true}
                    />
                  )}
                />
              </Col>
              <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px" }}>Makine:</Text>
                <Controller
                  name="plkMachine"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      name="user_name"
                      variant="outlined"
                      style={{ width: "300px" }}
                      value={plkMachineValue}
                      disabled={true}
                    />
                  )}
                />
              </Col>
              <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px" }}>Garanti Bitis:</Text>
                <Controller
                  name="plkWarranty_end"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      variant="outlined"
                      style={{ width: "300px" }}
                      disabled={true}
                    />
                  )}
                />
              </Col>
              <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px" }}>Ekipman:</Text>
                <Controller
                  name="equipment"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text" // Set the type to "text" for name input
                      variant="outlined"
                      style={{ width: "300px" }}
                      disabled={true}
                    />
                  )}
                />
              </Col>
              <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: "14px" }}>Sayaç Değeri:</Text>
                <Controller
                  name="counter_value"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder="Select a person"
                      optionFilterProp="children"
                      onChange={onChangeSelect}
                      onSearch={onSearch}
                      style={{ width: "300px" }}
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                      value={field.value}>
                      {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  )}
                />
              </Col>
            </Col>
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
                  />
                  <div
                    className="modal"
                    style={{
                      zIndex: 2000,
                      display: "flex",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}>
                    <div
                      className="modal-content"
                      style={{
                        margin: "auto",
                        width: "800px",
                        backgroundColor: "#fff0",
                        border: "1px solid #fff0",
                        position: "relative",
                      }}>
                      <img src={selectedImage} alt="" style={{ maxWidth: "100%", maxHeight: "100%" }} />
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
      <ContractTabs />
    </Row>
  );
};

export default WorkOrder;
