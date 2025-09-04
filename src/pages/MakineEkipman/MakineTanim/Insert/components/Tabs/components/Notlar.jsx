import React from "react";
import { Typography } from "antd";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import Textarea from "../../../../../../../utils/components/Form/Textarea";

const { Text } = Typography;

function Notlar() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
      <div
        style={{
          backgroundColor: "#ffffffff",
          padding: "10px",
          border: "1px solid #80808068",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "563.5px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("genelNot")}</Text>
          <Text type="secondary">{t("makineHakkindaGenelNotlar")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <Textarea name="makineGenelNot" required={true} styles={{ minHeight: "200px" }} />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#ffffffff",
          padding: "10px",
          border: "1px solid #80808068",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          width: "100%",
          maxWidth: "563.5px",
        }}
      >
        <div style={{ paddingBottom: "10px", display: "inline-flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Text style={{ fontSize: "16px", fontWeight: "600" }}>{t("guvenlikNotu")}</Text>
          <Text type="secondary">{t("makineHakkindaGüvenlikNotları")}</Text>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <Textarea name="makineGuvenlikNotu" required={true} styles={{ minHeight: "200px" }} />
        </div>
      </div>
    </div>
  );
}

export default Notlar;
