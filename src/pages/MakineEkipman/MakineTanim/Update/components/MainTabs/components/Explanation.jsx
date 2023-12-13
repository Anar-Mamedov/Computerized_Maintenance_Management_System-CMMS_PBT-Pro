import { Col, Input, TreeSelect, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import styled, { keyframes } from "styled-components";

const { Text } = Typography;

const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const BlinkingText = styled(Text)`
  animation: ${blinkAnimation} 2s infinite;
`;

export default function Explanation({ machineWarranty, machineWarrantyStatus }) {
  const { control, watch } = useFormContext();
  // Determine the warranty status text
  const warrantyStatusText = machineWarrantyStatus === 1 ? "Garantisi Devam Etmektedir!" : "";
  // Determine the machine warranty value
  const displayMachineWarranty = machineWarranty !== "01.01.0001" ? machineWarranty : "";
  return (
    <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "775px" }}>
      <Text style={{ fontSize: "14px" }}>Garanti Bitis:</Text>
      <div style={{ display: "flex", gap: "10px" }}>
        <Controller
          name="warranty_end"
          control={control}
          render={({ field }) => (
            <Input {...field} style={{ width: "300px" }} disabled={true} value={displayMachineWarranty} />
          )}
        />
        <div style={{ width: "350px", display: "flex", alignItems: "center" }}>
          <BlinkingText style={{ fontSize: "14px", color: "red" }}>{warrantyStatusText}</BlinkingText>
        </div>
        {/* <Input style={{ width: "350px", color: "red" }} disabled={true} value={warrantyStatusText} /> */}
      </div>
    </Col>
  );
}
