import React, { useState, useEffect } from "react";
import { Select, Spin, Input, Divider, Space, Button } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useFormContext, Controller } from "react-hook-form";

const { Option } = Select;

const AtolyeSelect = ({ filtersLabel }) => {
  const [options, setOptions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  // Önce options'ları yükle
  useEffect(() => {
    setLoading(true);
    AxiosInstance.get("AtolyeList")
      .then((response) => {
        setOptions(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setLoading(false);
      });
  }, []);

  // Options yüklendikten sonra filtersLabel değerlerini set et
  useEffect(() => {
    if (filtersLabel?.AtolyeName && filtersLabel?.AtolyeID && options.length > 0) {
      const atolyeIDs = filtersLabel.AtolyeID.split(",");
      console.log("AtolyeSelect.jsx - Setting atolye IDs from filtersLabel:", atolyeIDs);
      console.log("AtolyeSelect.jsx - Original filtersLabel.AtolyeID:", filtersLabel.AtolyeID);

      setSelectedIds(atolyeIDs);

      // Ensure atolyeID form value is set
      setValue("atolyeID", atolyeIDs);
    }
  }, [filtersLabel, options, setValue]);

  return (
    <>
      <Controller
        name="atolye"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            mode="multiple"
            style={{ width: "250px" }}
            showSearch
            allowClear
            loading={loading}
            placeholder="Atölye Seçiniz"
            optionFilterProp="children"
            filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
            options={options.map((item) => ({
              value: item.TB_ATOLYE_ID.toString(),
              label: item.ATL_TANIM,
            }))}
            value={loading ? [] : selectedIds}
            onChange={(value) => {
              console.log("AtolyeSelect.jsx - Select onChange, new value:", value);
              setValue("atolyeID", value);
              setSelectedIds(value);
              field.onChange(value);

              // Log current form values after update
              setTimeout(() => {
                console.log("AtolyeSelect.jsx - Current form values after update:", {
                  atolye: getValues("atolye"),
                  atolyeID: getValues("atolyeID"),
                });
              }, 0);
            }}
          />
        )}
      />
      <Controller name="atolyeID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
    </>
  );
};

export default AtolyeSelect;
