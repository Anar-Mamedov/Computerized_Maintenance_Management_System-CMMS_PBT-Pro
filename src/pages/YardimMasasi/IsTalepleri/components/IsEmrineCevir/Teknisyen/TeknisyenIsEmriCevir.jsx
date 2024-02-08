import React from "react";
import {
  Drawer,
  Typography,
  Button,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Checkbox,
  ColorPicker,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import PersonelTablo from "./components/PersonelTablo";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledInput = styled(Input)`
  @media (min-width: 600px) {
    max-width: 300px;
  }
  @media (max-width: 600px) {
    max-width: 300px;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
  @media (max-width: 600px) {
    width: 100%;
    max-width: 300px;
  }
`;

const StyledDivBottomLine = styled.div`
  @media (min-width: 600px) {
    align-items: center;
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

export default function TeknisyenIsEmriCevir() {
  const { control, watch, setValue } = useFormContext();

  const handlePersonelMinusClick = () => {
    setValue("personelTanim", "");
    setValue("personelID", "");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        width: "100%",
        maxWidth: "385px",
      }}>
      <StyledDivBottomLine
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "385px",
        }}>
        <Text style={{ fontSize: "14px" }}>Teknisyen:</Text>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "300px",
          }}>
          <Controller
            name="personelTanim"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ width: "215px" }}
                disabled
              />
            )}
          />
          <Controller
            name="personelID"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text" // Set the type to "text" for name input
                style={{ display: "none" }}
              />
            )}
          />
          <PersonelTablo
            onSubmit={(selectedData) => {
              // Seçilen personellerin key ve subject değerlerini virgülle birleştir
              const keys = selectedData.map((data) => data.key).join(", ");
              const subjects = selectedData.map((data) => data.subject).join(", ");

              setValue("personelTanim", subjects);
              setValue("personelID", keys);
            }}
          />
          <Button onClick={handlePersonelMinusClick}> - </Button>
        </div>
      </StyledDivBottomLine>
    </div>
  );
}
