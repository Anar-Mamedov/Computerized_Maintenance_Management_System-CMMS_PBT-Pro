import React, { useState, useEffect } from "react";
import {
  Button,
  Popover,
  Spin,
  Typography,
  Modal,
  DatePicker,
  Checkbox,
  Input,
  Popconfirm,
} from "antd";
import { CaretDownOutlined, DeleteOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";

const { Text } = Typography;

function CustomDashboards(props) {
  const [header, setHeader] = useState("Dashboard"); // Header of the table
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [dashboards, setDashboards] = useState([]);
  const {
    control,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Set the default value for selectedDashboard when the component mounts
  useEffect(() => {
    const loadedDashboards =
      JSON.parse(localStorage.getItem("customDashboard")) || [];
    setDashboards(loadedDashboards);

    const currentSelectedDashboard = getValues("selectedDashboard");
    if (!currentSelectedDashboard) {
      setValue("selectedDashboard", "Dashboard", { shouldValidate: true });
    }
  }, [setValue, getValues]);

  const handleDashboardClick = (dashboardName) => {
    // Update the header with the clicked dashboard name
    setHeader(dashboardName);
    // Set the value of the 'selectedDashboard' field in the form

    setValue("selectedDashboard", dashboardName);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const updatedDashboards = [...dashboards, newDashboardName];
    localStorage.setItem("customDashboard", JSON.stringify(updatedDashboards));
    setDashboards(updatedDashboards); // Update state with new list
    setIsModalVisible(false);
    setNewDashboardName(""); // Reset input field after saving
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteDashboard = (dashboardName) => {
    const currentSelectedDashboard = getValues("selectedDashboard");
    if (currentSelectedDashboard === dashboardName) {
      setValue("selectedDashboard", "Dashboard", { shouldValidate: true });
      setHeader("Dashboard");
    }
    const updatedDashboards = dashboards.filter(
      (dashboard) => dashboard !== dashboardName
    );
    localStorage.setItem("customDashboard", JSON.stringify(updatedDashboards));
    setDashboards(updatedDashboards);
  };

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <div
        key="defaultDashboard"
        style={{ padding: "5px 0", cursor: "pointer" }}
        onClick={() => handleDashboardClick("Dashboard")}
      >
        Dashboard
      </div>
      {dashboards.map((dashboard) => (
        <div
          key={dashboard}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 0",
            cursor: "pointer",
          }}
        >
          <div onClick={() => handleDashboardClick(dashboard)}>{dashboard}</div>
          <Popconfirm
            title="Silmek istediğinize emin misiniz?"
            onConfirm={() => handleDeleteDashboard(dashboard)}
            onCancel={() => ""}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
              Sil
            </Button>
          </Popconfirm>
        </div>
      ))}
      <Button type="dashed" onClick={showModal}>
        Yeni Dashboard Ekle
      </Button>
    </div>
  );

  return (
    <div style={{ cursor: "pointer" }}>
      <Popover
        content={content}
        title="Özel Dashboardlar"
        trigger="click"
        placement="bottomLeft"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Text style={{ fontWeight: "600", fontSize: "24px" }}>{header}</Text>
          <CaretDownOutlined />
        </div>
      </Popover>
      <Modal
        title="Yeni Özel Dashboard Ekle"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Input
          value={newDashboardName}
          onChange={(e) => setNewDashboardName(e.target.value)}
          placeholder="Dashboard İsmi"
        />
      </Modal>
    </div>
  );
}

export default CustomDashboards;
