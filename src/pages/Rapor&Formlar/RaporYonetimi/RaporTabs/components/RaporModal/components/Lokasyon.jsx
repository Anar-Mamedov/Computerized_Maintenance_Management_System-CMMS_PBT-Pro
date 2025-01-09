import React, { useState, useEffect } from "react";
import { Select, Spin, Input, Divider, Space, Button } from "antd";
import AxiosInstance from "../../../../../../../api/http";
import { useFormContext, Controller } from "react-hook-form";

const { Option } = Select;

const LocationFilter = ({ filtersLabel, setLokasyonID1, lokasyonID1 }) => {
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
    AxiosInstance.get("GetLokasyonList")
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
    if (filtersLabel?.LokasyonName && filtersLabel?.LokasyonID && options.length > 0) {
      const lokasyonIDs = filtersLabel.LokasyonID.split(",");

      setSelectedIds(lokasyonIDs);
    }
  }, [filtersLabel, options]);

  return (
    <>
      <Controller
        name="lokasyon"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            mode="multiple"
            style={{ width: "250px" }}
            showSearch
            allowClear
            loading={loading}
            placeholder="Seçim Yapınız"
            optionFilterProp="children"
            filterOption={(input, option) => (option.label ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
            options={options.map((item) => ({
              value: item.TB_LOKASYON_ID.toString(),
              label: item.LOK_TANIM,
            }))}
            value={loading ? [] : selectedIds}
            onChange={(value) => {
              setValue("lokasyonID", value);
              setSelectedIds(value);
              field.onChange(value);
            }}
          />
        )}
      />
      <Controller name="lokasyonID" control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
    </>
  );
};

export default LocationFilter;
