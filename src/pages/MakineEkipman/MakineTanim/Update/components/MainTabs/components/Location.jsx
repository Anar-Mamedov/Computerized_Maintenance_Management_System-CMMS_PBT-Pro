import { Input, Spin, TreeSelect, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

const { Text } = Typography;

export default function Location() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // API'den gelen verileri TreeSelect için uygun formata dönüştüren fonksiyon
  const constructTree = (locations, parentId = 0) => {
    const tree = [];
    locations.forEach((location) => {
      if (location.LOK_ANA_LOKASYON_ID === parentId) {
        const children = constructTree(locations, location.TB_LOKASYON_ID);
        const node = {
          value: location.TB_LOKASYON_ID,
          title: location.LOK_TANIM,
          yol: location.LOK_TUM_YOL, // Add yol property
        };
        if (children.length > 0) {
          node.children = children;
        }
        tree.push(node);
      }
    });
    return tree;
  };

  const fetchData = () => {
    setIsLoading(true);
    AxiosInstance.get("Lokasyon")
      .then((response) => {
        setTreeData(constructTree(response)); // API'den gelen veriyi işle
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isDropdownOpen) {
      fetchData();
    }
  }, [isDropdownOpen]);

  const handleTreeSelectChange = (value) => {
    setValue("location", value); // TreeSelect'ten gelen değeri doğrudan set et
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <Text style={{ fontSize: "14px", fontWeight: 600 }}>Lokasyon:</Text>
      <Controller
        name="location"
        control={control}
        rules={{ required: "Alan Boş Bırakılamaz!" }}
        render={({ field, fieldState: { error } }) => (
          <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", maxWidth: "300px" }}>
            <TreeSelect
              {...field}
              status={error ? "error" : ""}
              style={{ width: "300px" }}
              onChange={(value) => {
                setValue("locationID", value);
                handleTreeSelectChange(value);
                field.onChange(value); // React Hook Form değerini güncelle
              }}
              treeData={treeData}
              placeholder={isLoading ? "Yükleniyor..." : "Seçim Yapınız"}
              onDropdownVisibleChange={(open) => setIsDropdownOpen(open)}
              showSearch
              loading={isLoading}
              allowClear
              treeLine="title"
              filterTreeNode={(input, node) => node.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              dropdownRender={(menu) => <Spin spinning={isLoading}>{menu}</Spin>}
            />
            {error && <div style={{ color: "red" }}>{error.message}</div>}
          </div>
        )}
      />
      <Controller
        name="locationID"
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
  );
}
