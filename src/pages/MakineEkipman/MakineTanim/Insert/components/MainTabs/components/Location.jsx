import { Col, Input, Spin, TreeSelect, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

const { Text } = Typography;

export default function Location({ setLocationId, locationValue, machineLocationId, fullLocationValue }) {
  const { control, setValue, watch } = useFormContext();
  // api call

  const [treeData, setTreeData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(undefined); // Track selected value
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state
  const [selectedYol, setSelectedYol] = useState(""); // Input value for LOK_TUM_YOL
  const [lastSelectedForInput, setLastSelectedForInput] = useState();
  const [lastSelectedForTreeSelect, setLastSelectedForTreeSelect] = useState();

  const fetchData = () => {
    setIsLoading(true);
    AxiosInstance.get("Lokasyon?ID=30")
      .then((response) => {
        // Convert API response to treeData format
        const data = response; // Access the data property of the response

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

        const tree = constructTree(data);

        setTreeData(tree);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("API Error:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // Fetch data when the dropdown is opened
    if (isDropdownOpen) {
      fetchData();
    }
  }, [isDropdownOpen]);

  // Handle TreeSelect value change
  const handleTreeSelectChange = (newValue) => {
    if (newValue === null || newValue === undefined) {
      // Reset the location values
      setLocationId(null);
      setSelectedValue(null);
      setSelectedYol("");

      // Reset the lastSelected values when allowClear is triggered
      setLastSelectedForTreeSelect(null);
      setLastSelectedForInput("");
      return;
    }
    setLocationId(newValue);
    setSelectedValue(newValue); // Update selectedValue
    // Find the selected yol (LOK_TUM_YOL) based on the newValue in treeData
    const selectedNode = findNodeByValue(treeData, newValue);
    if (selectedNode) {
      setSelectedYol(selectedNode.yol || ""); // Update selectedYol with LOK_TUM_YOL
    } else {
      setSelectedYol("");
    }
  };

  // Helper function to find a node by its value
  const findNodeByValue = (nodes, targetValue) => {
    for (const node of nodes) {
      if (node.value === targetValue) {
        return node;
      }
      if (node.children) {
        const foundInChildren = findNodeByValue(node.children, targetValue);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
    return null;
  };

  // api call end

  useEffect(() => {
    const currentValue = watch("location"); // Get current value of 'location' field from React Hook Form

    // If there's no current value and machineLocationId is defined, then initialize the form value
    if (!currentValue && machineLocationId) {
      setValue("location", machineLocationId);
    }
  }, [machineLocationId, setValue, watch]);

  useEffect(() => {
    // For the Input:
    if (selectedYol) {
      setLastSelectedForInput(selectedYol);
    } else {
      setLastSelectedForInput(fullLocationValue);
    }

    // For the TreeSelect:
    if (selectedValue) {
      setLastSelectedForTreeSelect(selectedValue);
    } else {
      setLastSelectedForTreeSelect(locationValue);
    }
  }, [selectedYol, fullLocationValue, selectedValue, locationValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "415px" }}>
        <Text style={{ fontSize: "14px" }}>Lokasyon:</Text>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <TreeSelect
              {...field}
              style={{ width: "300px" }}
              value={lastSelectedForTreeSelect}
              onChange={(value) => {
                // If no value is selected, fallback to machineLocationId
                if (value === null || value === undefined) {
                  value = machineLocationId;
                }
                handleTreeSelectChange(value);
                field.onChange(value); // Update React Hook Form value
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
          )}
        />
      </Col>
      <Col style={{ display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
        <Controller
          name="plkLocation"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              variant="outlined"
              style={{ width: "350px" }}
              value={lastSelectedForInput}
              disabled={true}
            />
          )}
        />
      </Col>
    </div>
  );
}
