import { Input, Typography } from "antd";
import React from "react";
import CagrilacakProsedurSelect from "./CagrilacakProsedurSelect";
const { Text, Link } = Typography;
const { TextArea } = Input;

export default function CagrilacakProsedur() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid gray", width: "300px", marginBottom: "10px", paddingBottom: "5px" }}>
        <Text style={{ fontSize: "14px", color: "blue" }}>Çağrılacak Prosedur:</Text>
      </div>
      <CagrilacakProsedurSelect />
    </div>
  );
}
