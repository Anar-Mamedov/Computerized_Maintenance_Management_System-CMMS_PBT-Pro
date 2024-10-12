import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Typography,
  Checkbox,
  DatePicker,
  TimePicker,
  Select,
  Table,
  Dropdown,
  Space,
  Menu,
} from "antd";
import { useFormContext, Controller } from "react-hook-form";
import AxiosInstance from "../../../../../../../../../api/http";
import styled from "styled-components";
import MaterialCode from "./materialCode";
import dayjs from "dayjs";
import MaterialType from "./MaterialType";
import MaterialBrand from "./MaterialBrand";
import Company from "../../../DetailedInformationFields/company";
import CostCenter from "../../../DetailedInformationFields/CostCenter";

const { Text, Link } = Typography;
const { TextArea } = Input;

const StyledTable = styled(Table)`
  .ant-pagination {
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  &.custom-table .ant-table-thead > tr > th {
    height: 10px; // Adjust this value to your desired height
    line-height: 2px; // Adjust this value to vertically center the text
  }
`;

export default function Stockless() {
  const { control, setValue, watch } = useFormContext();
  const inputOne = watch("inputOne");
  const inputTwo = watch("inputTwo");

  // Calculate the product whenever inputOne or inputTwo changes
  React.useEffect(() => {
    if (inputOne && inputTwo) {
      const product = Number(inputOne) * Number(inputTwo);
      setValue("product", product);
    } else {
      setValue("product", "");
    }
  }, [inputOne, inputTwo, setValue]);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          border: "1px solid #80808068",
          padding: "10px",
          borderRadius: "5px",
          alignItems: "center",
          marginBottom: "10px",
          justifyContent: "center",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "500px",
          }}>
          <div style={{ width: "140px" }}>
            <Controller
              name="stockMaterialCheckbox"
              control={control}
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Checkbox
                  disabled
                  onChange={(e) => onChange(e.target.checked)}
                  onBlur={onBlur}
                  checked={value}
                  ref={ref}>
                  Stoklu Malzeme
                </Checkbox>
              )}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <Text>Depo</Text>
            <Controller
              name="depo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "290px" }}
                  disabled
                  placeholder="Select a option and change input text above"
                  allowClear>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              )}
            />
          </div>
          <div>
            <MaterialCode />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
            <Text>Barkod / Alternativ Malzeme</Text>
            <Controller
              name="barcode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "290px" }}
                  disabled
                  placeholder="Select a option and change input text above"
                  allowClear>
                  <Select.Option value="demo">Demo</Select.Option>
                </Select>
              )}
            />
          </div>
        </div>
        <div
          style={{
            display: "grid",
            placeItems: "center",
            width: "200px",
            height: "200px",
            backgroundColor: "#80808065",
          }}>
          <Text>Resim Yok</Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          border: "1px solid #80808068",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          flexDirection: "column",
          justifyContent: "center",
        }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "490px",
          }}>
          <Text>Tarih / Saat</Text>
          <div style={{ display: "flex", gap: "10px", width: "290px" }}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} format="DD-MM-YYYY" onChange={(date) => field.onChange(date)} />
              )}
            />
            <Controller
              name="time"
              control={control}
              render={({ field }) => <TimePicker {...field}
                                                 changeOnScroll needConfirm={false} format="HH:mm" onChange={(time) => field.onChange(time)} />}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <Text>Malzeme Tanımı</Text>
          <Controller
            name="materialDescription"
            control={control}
            defaultValue=""
            render={({ field }) => <Input {...field} placeholder="" style={{ width: "510px" }} />}
          />
        </div>
        <div>
          <MaterialType />
        </div>
        <div>
          <MaterialBrand />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "486px" }}>
          <Text>Garanti Başlama / Bitiş Tarihi</Text>
          <div style={{ display: "flex", gap: "10px", width: "286px" }}>
            <Controller
              name="warrantyStartDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} format="DD-MM-YYYY" onChange={(date, dateString) => field.onChange(date)} />
              )}
            />
            <Controller
              name="warrantyEndDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} format="DD-MM-YYYY" onChange={(date, dateString) => field.onChange(date)} />
              )}
            />
          </div>
        </div>
        <div style={{ width: "550px" }}>
          <Company />
        </div>
        <div style={{ width: "500px" }}>
          <CostCenter />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text>Açıklama</Text>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => <TextArea {...field} placeholder="" style={{ width: "510px" }} />}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          border: "1px solid #80808068",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
          flexDirection: "column",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
          <Text>Miktar</Text>
          <Controller
            name="inputOne"
            control={control}
            render={({ field }) => (
              <Input {...field} style={{ width: "200px" }} type="number" placeholder="Input One" />
            )}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
          <Text>Fiyat</Text>
          <Controller
            name="inputTwo"
            control={control}
            render={({ field }) => (
              <Input {...field} style={{ width: "200px" }} type="number" placeholder="Input Two" />
            )}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "400px" }}>
          <Text>Maliyet</Text>
          <Controller
            name="product"
            control={control}
            render={({ field }) => <Input {...field} style={{ width: "200px" }} type="number" placeholder="Product" />}
          />
        </div>
      </div>
    </div>
  );
}
