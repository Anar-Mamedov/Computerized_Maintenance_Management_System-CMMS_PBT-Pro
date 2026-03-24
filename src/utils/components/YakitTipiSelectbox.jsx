import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, Spin, Input } from "antd";
import AxiosInstance from "../../api/http";
import styled from "styled-components";
import { t } from "i18next";

const StyledSelect = styled(Select)`
  @media (min-width: 600px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const StyledDiv = styled.div`
  @media (min-width: 600px) {
    align-items: center;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export default function YakitTipiSelectbox({ name1, isRequired, disabled = false, style = {}, placeholder = "Seçim Yapınız" }) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get("GetYakitList?aktif=true");
      if (response) {
        setOptions(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDiv
      style={{
        display: "flex",
        gap: "10px",
        justifyContent: "space-between",
        width: "100%",
        flexWrap: "wrap",
        rowGap: "0px",
      }}
    >
      <Controller
        name={name1}
        control={control}
        rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
        render={({ field }) => (
          <StyledSelect
            {...field}
            status={errors[name1] ? "error" : ""}
            disabled={disabled}
            style={{ ...style }}
            showSearch
            allowClear
            placeholder={placeholder}
            optionFilterProp="children"
            filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
            onDropdownVisibleChange={(open) => {
              if (open) {
                fetchData();
              }
            }}
            dropdownRender={(menu) => <Spin spinning={loading}>{menu}</Spin>}
            options={options.map((item) => ({
              value: item.TB_STOK_ID,
              label: item.YAKIT_TANIM,
            }))}
            onChange={(value) => {
              setValue(`${name1}ID`, value);
              field.onChange(value);
            }}
          />
        )}
      />
      {errors[name1] && <div style={{ color: "red", marginTop: "5px" }}>{errors[name1].message}</div>}
      <Controller
        name={`${name1}ID`}
        control={control}
        render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />}
      />
    </StyledDiv>
  );
}
