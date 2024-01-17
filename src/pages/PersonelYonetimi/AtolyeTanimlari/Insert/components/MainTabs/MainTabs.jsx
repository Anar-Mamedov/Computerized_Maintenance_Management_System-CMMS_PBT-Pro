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
import AtolyeGrubu from "./components/AtolyeGrubu";
import styled from "styled-components";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

const { Text, Link } = Typography;
const { TextArea } = Input;

dayjs.extend(customParseFormat);

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

export default function MainTabs() {
  const { control, watch, setValue } = useFormContext();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: "15px",
        gap: "10px",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: "10px",
            rowGap: "0px",
          }}>
          <Text style={{ fontSize: "14px" }}>Atölye Kodu:</Text>
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
              name="atolyeKodu"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
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
            <Controller
              name="atolyeAktif"
              control={control}
              defaultValue={true} // or true if you want it checked by default
              render={({ field }) => (
                <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)}>
                  Aktif
                </Checkbox>
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}>
          <Text style={{ fontSize: "14px" }}>Atölye Tanımı:</Text>
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
              name="atolyeTanimi"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
          }}>
          <AtolyeGrubu />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: "15px",
          flexDirection: "column",
          gap: "10px",
          width: "100%",
          maxWidth: "450px",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            maxWidth: "450px",
            gap: "10px",
            width: "100%",
            justifyContent: "space-between",
          }}>
          <Text style={{ fontSize: "14px" }}>Telefon:</Text>
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
              name="atolyeTelefon"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  style={{ flex: 1 }}
                  onKeyPress={(e) => {
                    const value = field.value;
                    // Rakam veya bir virgül olup olmadığını kontrol et
                    if (!/[0-9]/.test(e.key) && (e.key !== "," || value.includes(","))) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Yetkili:</Text>
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
              name="yetkili"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
            />
          </div>
        </StyledDivBottomLine>
        <StyledDivBottomLine
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Text style={{ fontSize: "14px" }}>Yetkili E-Mail:</Text>
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
              name="yetkiliEmail"
              control={control}
              render={({ field }) => <Input {...field} style={{ flex: 1 }} />}
            />
          </div>
        </StyledDivBottomLine>
      </div>
    </div>
  );
}
