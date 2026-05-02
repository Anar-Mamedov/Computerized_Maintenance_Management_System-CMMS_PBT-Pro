import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker, TimePicker, InputNumber, Checkbox } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import dayjs from "dayjs";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center !important;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const onChange = (key) => {
  // console.log(key);
};

//styled components
const StyledTabs = styled(Tabs)`
  .ant-tabs-tab {
    margin: 0 !important;
    width: fit-content;
    padding: 10px 15px;
    justify-content: center;
    background-color: rgba(230, 230, 230, 0.3);
  }

  .ant-tabs-tab-active {
    background-color: #2bc77135;
  }

  .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:hover .ant-tabs-tab-btn {
    color: rgba(0, 0, 0, 0.88) !important;
  }

  .ant-tabs-tab:not(:first-child) {
    border-left: 1px solid #80808024;
  }

  .ant-tabs-ink-bar {
    background: #2bc770;
  }
`;

//styled components end
export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div style={{ marginTop: "20px" }}>
      <Controller
        name="secilenID"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="text" // Set the type to "text" for name input
            style={{ display: "none" }}
          />
        )}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "400px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}>
        <Text style={{ fontWeight: "600" }}>Belge Tipi</Text>
        <Controller
          name="tipTanim"
          control={control}
          rules={{ required: "Alan Boş Bırakılamaz!" }}
          render={({ field, fieldState: { error } }) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
                maxWidth: "300px",
                minWidth: "300px",
              }}>
              <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
              {error && <div style={{ color: "red" }}>{error.message}</div>}
            </div>
          )}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: "400px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}>
        <Text>Açıklama</Text>
        <Controller
          name="tipAciklama"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "100%",
                maxWidth: "300px",
                minWidth: "300px",
              }}
              rows={4}
            />
          )}
        />
      </div>
    </div>
  );
}
