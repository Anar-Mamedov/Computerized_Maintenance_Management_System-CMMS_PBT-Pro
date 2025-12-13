import React, { useRef } from "react";
import { Modal, Button, QRCode, Typography } from "antd";
import PropTypes from "prop-types";
import pbtLogo from "../../assets/images/logo.png";
import omegaLogo from "../../assets/images/omega-logo.png";

const { Text } = Typography;

const QR_SIZE = 300;
const LOGO_MAX_WIDTH = QR_SIZE * 0.3;
const LOGO_MAX_HEIGHT = QR_SIZE * 0.18;
const PBT_LOGO = { width: 142, height: 43, src: pbtLogo };
const OMEGA_LOGO = { width: 553, height: 148, src: omegaLogo };

const scaleLogoSize = (originalWidth, originalHeight) => {
  const aspect = originalWidth / originalHeight;
  let width = LOGO_MAX_WIDTH;
  let height = width / aspect;

  if (height > LOGO_MAX_HEIGHT) {
    height = LOGO_MAX_HEIGHT;
    width = height * aspect;
  }

  return { width, height };
};

export default function QRCodeGenerator({ visible, onClose, value, fileName = "QR-Code", title = "QR Kodu" }) {
  const qrRef = useRef(null);

  const isOmegaDomain = typeof window !== "undefined" && window.location.hostname === "omegaerp.net";
  const selectedLogo = isOmegaDomain ? OMEGA_LOGO : PBT_LOGO;
  const iconSize = scaleLogoSize(selectedLogo.width, selectedLogo.height);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = exportCanvas.toDataURL("image/png", 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Kapat
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload}>
          İndir
        </Button>,
      ]}
      centered
      width={400}
    >
      <div ref={qrRef} style={{ display: "flex", justifyContent: "center", padding: "20px", backgroundColor: "#ffffff" }}>
        <QRCode
          value={value}
          size={QR_SIZE}
          errorLevel="H"
          bordered={false}
          color="#000000"
          bgColor="#ffffff"
          icon={selectedLogo.src}
          iconSize={iconSize}
          type="canvas"
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Text type="secondary">{value}</Text>
      </div>
    </Modal>
  );
}

QRCodeGenerator.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  title: PropTypes.string,
};
