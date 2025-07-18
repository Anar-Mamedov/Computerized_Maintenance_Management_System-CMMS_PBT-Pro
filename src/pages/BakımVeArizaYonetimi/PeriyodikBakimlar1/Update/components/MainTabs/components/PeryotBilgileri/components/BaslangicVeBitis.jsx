import React from "react";
import { Input, Radio, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import ComponentsOfBaslangicBitis from "./ComponentsOfBaslangicBitis/ComponentsOfBaslangicBitis.jsx";

const { Text, Link } = Typography;
const { TextArea } = Input;

function BaslangicVeBitis(props) {
  const { control, watch, setValue } = useFormContext();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        marginBottom: "10px",
      }}
    >
      <Text
        style={{
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
          backgroundColor: "rgba(230,230,230,0.84)",
          textAlign: "center",
        }}
      >
        Başlangıç ve Bitiş
      </Text>
      <ComponentsOfBaslangicBitis />
    </div>
  );
}

export default BaslangicVeBitis;
