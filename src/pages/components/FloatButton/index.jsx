import React, { useState, useEffect } from "react";
import { Button, Input, Popover, message, Typography } from "antd";
import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import { FaQuestion } from "react-icons/fa";
import html2canvas from "html2canvas";
import axios from "axios";
import styled from "styled-components";

const { Text } = Typography;

const FloatButton = () => {
  const [imageData, setImageData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [visible, setVisible] = useState(false);

  const handleScreenshot = () => {
    html2canvas(document.body, {
      scale: 2,
      useCORS: true,
      logging: true,
      width: window.innerWidth,
      height: window.innerHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      setImageData(imgData);
      setVisible(true);
    });
  };

  const handleSend = async () => {
    try {
      await axios.post("YOUR_API_ENDPOINT", {
        image: imageData,
        input: inputValue,
        text: textValue,
      });
      message.success("Veriler başarıyla gönderildi!");
      setVisible(false);
    } catch (error) {
      message.error("Verileri gönderirken bir hata oluştu.");
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleVisibleChange = (vis) => {
    if (vis) {
      handleScreenshot();
      setTimeout(() => {
        const popoverElements = document.getElementsByClassName("ant-popover");
        if (popoverElements.length > 0) {
          const popover = popoverElements[0];
          popover.style.zIndex = "100000";
          popover.style.position = "fixed";
          popover.style.bottom = "70px";
          popover.style.right = "0";
        }
      }, 100); // Popover'un render edilmesi için kısa bir gecikme
    }
  };

  const popoverContent = (
    <div style={{ maxWidth: "300px", position: "relative" }}>
      <Button
        type="primary"
        danger
        icon={<CloseOutlined />}
        style={{ position: "absolute", top: "-30px", right: "0px", width: "20px", height: "20px", padding: "10px" }}
        onClick={handleClose}
      />
      <img src={imageData} alt="Screenshot" style={{ width: "100%", marginBottom: "10px" }} />
      <Text>Talep Nedeni:</Text>
      <Input placeholder="Başlık" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ marginBottom: "10px" }} />
      <Text>Açıklama:</Text>
      <Input.TextArea placeholder="Açıklama" value={textValue} onChange={(e) => setTextValue(e.target.value)} rows={4} style={{ marginBottom: "10px" }} />
      <Button type="primary" onClick={handleSend} block>
        Gönder
      </Button>
    </div>
  );

  return (
    <Popover content={popoverContent} title="Talep Detayları" trigger="click" open={visible} onOpenChange={handleVisibleChange} destroyTooltipOnHide={true}>
      <Button
        type="primary"
        shape="circle"
        icon={<FaQuestion />}
        size="large"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={() => setVisible(true)}
      />
    </Popover>
  );
};

export default FloatButton;