import { Col, Input, Spin, TreeSelect, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import AxiosInstance from "../../../../../../../api/http";

const { Text } = Typography;

export default function Equipment({ selectedMachineId, locationId }) {
  const { control, watch } = useFormContext();
  // api call

  const [treeData, setTreeData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(undefined); // Track selected value
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state
  const [selectedYol, setSelectedYol] = useState(""); // Input value for yol

  const fetchData = () => {
    if (!selectedMachineId) {
      // If selectedMachineId is not provided
      setTreeData([]); // Clear tree data
      setSelectedValue(undefined); // Reset the selected value
      setSelectedYol(""); // Reset the yol value
      return; // Exit the function early
    }
    setIsLoading(true);
    AxiosInstance.get(`Ekipman?MakineID=${selectedMachineId}`)
      .then((response) => {
        const data = response;

        // Check if an equipment is a root node
        const isRootNode = (equipment) => {
          return !data.some((e) => e.TB_EKIPMAN_ID === equipment.EKP_REF_ID);
        };

        const constructTree = (equipments, parentId = null) => {
          const tree = [];
          for (let i = 0; i < equipments.length; i++) {
            const equipment = equipments[i];
            if ((parentId === null && isRootNode(equipment)) || equipment.EKP_REF_ID === parentId) {
              const children = constructTree(equipments, equipment.TB_EKIPMAN_ID);
              const node = {
                value: equipment.TB_EKIPMAN_ID,
                title: `${equipment.EKP_KOD} - ${equipment.EKP_TANIM}`,
                yol: `${equipment.EKP_KOD} - ${equipment.EKP_TANIM}`, // Combination for the other input
                disabled: children.length > 0, // Disable node if it has children
              };
              if (children.length > 0) {
                node.children = children;
              }
              tree.push(node);
            }
          }
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
  }, [isDropdownOpen, selectedMachineId]);

  useEffect(() => {
    if (!selectedMachineId) {
      setSelectedValue(undefined);
      setSelectedYol("");
    }
  }, [selectedMachineId]);

  // Handle TreeSelect value change
  const handleTreeSelectChange = (newValue) => {
    // console.log("newValue", newValue);
    // setEquipmentId(newValue);
    setSelectedValue(newValue);
    const selectedNode = findNodeByValue(treeData, newValue);
    setSelectedYol(selectedNode?.yol || "");
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
  const formValues = watch();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "415px" }}>
        <Text style={{ fontSize: "14px" }}>Ekipman:</Text>
        <Controller
          name="equipment"
          control={control}
          render={({ field }) => (
            <TreeSelect
              {...field}
              style={{ width: "300px" }}
              value={field.value}
              onChange={(value) => {
                handleTreeSelectChange(value);
                field.onChange(value);
              }}
              treeData={treeData}
              placeholder={isLoading ? "Yükleniyor..." : "Seçim Yapınız"}
              onDropdownVisibleChange={(open) => setIsDropdownOpen(open)}
              showSearch
              loading={isLoading}
              allowClear
              treeLine={true}
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
              value={selectedYol}
              disabled={true}
            />
          )}
        />
      </Col>
    </div>
  );
}
