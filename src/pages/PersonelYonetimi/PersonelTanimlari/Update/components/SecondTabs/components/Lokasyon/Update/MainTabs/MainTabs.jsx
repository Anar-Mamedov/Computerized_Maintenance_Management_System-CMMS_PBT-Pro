import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import AyrilmaNedeni from "./components/AyrilmaNedeni";
import LokasyonTablo from "./components/LokasyonTablo";

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

const StyledDivMedia = styled.div`
  .anar {
    @media (min-width: 600px) {
      max-width: 300px;
      width: 100%;
    }
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }
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

  const handleLokasyonMinusClick = () => {
    setValue("lokasyonTanim", "");
    setValue("lokasyonID", "");
  };

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />
      ),
    },
  ];

  return (
    <div>
      <StyledDivMedia
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "420px",
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
        <div
          className="anar"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
            gap: "3px",
          }}>
          <Controller
            name="lokasyonTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "100%", maxWidth: "630px" }}
                disabled
              />
            )}
          />
          <Controller
            name="lokasyonID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <LokasyonTablo
            onSubmit={(selectedData) => {
              setValue("lokasyonTanim", selectedData.LOK_TANIM);
              setValue("lokasyonID", selectedData.key);
            }}
          />
          <Button onClick={handleLokasyonMinusClick}> - </Button>
        </div>
      </StyledDivMedia>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "420px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px" }}>Ayrılma Nedeni:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "300px",
            minWidth: "300px",
            gap: "10px",
            width: "100%",
          }}>
          <AyrilmaNedeni />
        </div>
      </div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
