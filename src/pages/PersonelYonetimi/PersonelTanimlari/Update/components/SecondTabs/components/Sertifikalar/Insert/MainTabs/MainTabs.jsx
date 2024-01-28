import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Input, Typography, Tabs, DatePicker } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import SertifikaTipi from "./components/SertifikaTipi";

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
  const [localeDateFormat, setLocaleDateFormat] = useState("DD/MM/YYYY"); // Varsayılan format
  const { control, watch, setValue } = useFormContext();

  const items = [
    {
      key: "1",
      label: "Açıklama",
      children: (
        <Controller name="aciklama" control={control} render={({ field }) => <TextArea {...field} rows={4} />} />
      ),
    },
  ];

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın

  useEffect(() => {
    // Kullanıcının yerel tarih formatını almak için Intl.DateTimeFormat kullanın
    const formatter = new Intl.DateTimeFormat(navigator.language);
    const sampleDate = new Date(2021, 10, 21);
    const formattedSample = formatter.format(sampleDate);

    // Kullanıcının yerel formatını DD/MM/YYYY formatına dönüştürün
    setLocaleDateFormat(formattedSample.replace("2021", "YYYY").replace("21", "DD").replace("11", "MM"));
  }, []);

  // tarih formatlamasını kullanıcının yerel tarih formatına göre ayarlayın sonu

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "400px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Belge no:</Text>
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
          <Controller
            name="belgeNo"
            control={control}
            rules={{ required: "Alan Boş Bırakılamaz!" }}
            render={({ field, fieldState: { error } }) => (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                <Input {...field} status={error ? "error" : ""} style={{ flex: 1 }} />
                {error && <div style={{ color: "red" }}>{error.message}</div>}
              </div>
            )}
          />
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
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "400px",
          gap: "10px",
          rowGap: "0px",
          marginBottom: "10px",
        }}>
        <Text style={{ fontSize: "14px", fontWeight: "600" }}>Sertifika Tipi:</Text>
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
          <SertifikaTipi />
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: "400px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Veriliş Tarihi:</Text>
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
            <Controller
              name="verilisTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "200px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <div style={{ width: "100%", maxWidth: "400px", marginBottom: "10px" }}>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Bitiş Tarihi:</Text>
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
            <Controller
              name="bitisTarihi"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{ width: "200px" }}
                  format={localeDateFormat}
                  placeholder="Tarih seçiniz"
                />
              )}
            />
          </div>
        </StyledDivBottomLine>
      </div>
      <StyledTabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
