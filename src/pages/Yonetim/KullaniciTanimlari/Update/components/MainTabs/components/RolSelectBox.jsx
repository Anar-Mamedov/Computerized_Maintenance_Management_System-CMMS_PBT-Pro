import React, { useEffect, useState } from "react";
import { message, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";
import { t } from "i18next";

function RolSelectBox() {
  const { control, setValue, watch } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await AxiosInstance.get(`GetRoles`);
      if (response) {
        // Format the data to match the expected structure
        const formattedData = response.map((item) => ({
          value: item.TB_KULLANICI_ID,
          label: item.KLL_TANIM,
        }));
        setOptions(formattedData);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Controller
        name="rolSelect"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            onClick={fetchData}
            showSearch
            allowClear
            loading={loading}
            style={{ width: "100%" }}
            placeholder={t("secimYapin")}
            options={options}
            onChange={(value) => {
              field.onChange(value); // Update 'rolSelect' field
              setValue("rolSelectID", value); // Set the additional field
            }}
            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
          />
        )}
      />
    </>
  );
}

export default RolSelectBox;
