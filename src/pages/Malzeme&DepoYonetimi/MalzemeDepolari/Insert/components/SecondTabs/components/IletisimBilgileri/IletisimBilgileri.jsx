import React from "react";
import { Drawer, Typography, Button, Input, Select, DatePicker, TimePicker, Row, Col, Checkbox, InputNumber, Radio, message, Tabs } from "antd";
import TextInput from "../../../../../../../../utils/components/Form/TextInput";
import TextAreaInput from "../../../../../../../../utils/components/Form/Textarea";
import { t } from "i18next";
const { Text, Link } = Typography;
const { TextArea } = Input;

export function IletisimBilgileri() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", maxWidth: "615px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "300px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("telefon")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <TextInput name="telefon" required="false" placeholder={t("telefon")} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "300px",
            gap: "10px",
            flexDirection: "row",
          }}
        >
          <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("fax")}</Text>
          <div
            style={{
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "flex-start",
              width: "100%",
              maxWidth: "220px",
            }}
          >
            <TextInput name="fax" required="false" placeholder={t("fax")} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "615px",
          gap: "10px",
          flexDirection: "row",
        }}
      >
        <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("e-mail")}</Text>
        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "535px",
          }}
        >
          <TextInput name="email" required="false" placeholder={t("e-mail")} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "start",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "615px",
          gap: "10px",
          flexDirection: "row",
        }}
      >
        <Text style={{ display: "flex", fontSize: "14px", flexDirection: "row" }}>{t("adres")}</Text>
        <div
          style={{
            display: "flex",
            flexFlow: "column wrap",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "535px",
          }}
        >
          <TextAreaInput name="adres" required="false" placeholder={t("adres")} />
        </div>
      </div>
    </div>
  );
}
