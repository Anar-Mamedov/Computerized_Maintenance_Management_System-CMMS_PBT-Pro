import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Modal, Typography, Table } from "antd";
import AxiosInstance from "../../../../../../../../api/http";
import styled from "styled-components";
import { useFormContext, Controller } from "react-hook-form";

const { Text } = Typography;

const StyledTable = styled(Table)`
  .ant-pagination {
    margin-right: 0px !important;
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
  }
  &.custom-table .ant-table-thead > tr > th {
    height: 10px; // Adjust this value to your desired height
    line-height: 10px; // Adjust this value to vertically center the text
  }
`;

export default function CostCenter({ onSubmit }) {
  const { control, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]); // New state for tree data

  const columns = [
    {
      title: "Masraf Yolu",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => (
        <div
          style={{
            marginTop: "6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Masraf Tanımı",
      dataIndex: "age",
      key: "age",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Masraf Tipi",
      dataIndex: "workdays",
      key: "workdays",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Lokasyon",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
    {
      title: "Proje",
      dataIndex: "fifthColumn",
      key: "fifthColumn",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {text}
        </div>
      ),
    },
  ];

  const convertToTree = (data, parentId = 0) => {
    return data
      .filter((item) => item.MAM_USTGRUP_ID === parentId)
      .map((item) => {
        const children = convertToTree(data, item.TB_MASRAF_MERKEZ_ID);
        return {
          key: item.TB_MASRAF_MERKEZ_ID,
          name: item.MAM_KOD,
          age: item.MAM_TANIM, // You can adjust this based on your actual data
          address: item.MAM_ACIKLAMA, // You can adjust this based on your actual data
          children: children.length > 0 ? children : undefined,
        };
      });
  };

  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get(`MasrafMerkeziList`)
      .then((response) => {
        const tree = convertToTree(response.data || response);
        setTreeData(tree);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  };

  const findItemInTree = (key, tree) => {
    for (const item of tree) {
      if (item.key === key) return item;
      if (item.children) {
        const found = findItemInTree(key, item.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handlePlusClick = () => {
    setIsModalVisible(true);
    fetchData();
  };

  const handleMinusClick = () => {
    setInputValue("");
    setSelectedRowKeys([]);
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], treeData);
    if (selectedData && !selectedData.children) {
      setInputValue(selectedData.age); // "age" is mapped to "MAM_TANIM" in the treeData
      // setValue("costcenter", selectedData.age);
      // setValue("costcenterSelectedId", selectedData.key);
      onSubmit && onSubmit(selectedData); // Call the onSubmit callback with the selected data
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const rowSelection = {
    type: "checkbox",
    selectedRowKeys,
    hideSelectAll: true, // Hide the select all checkbox
    onChange: (selectedKeys) => {
      const lastSelectedKey = selectedKeys[selectedKeys.length - 1];
      const lastSelectedItem = findItemInTree(lastSelectedKey, treeData);
      if (lastSelectedItem && !lastSelectedItem.children) {
        setSelectedRowKeys([lastSelectedKey]);
      } else {
        // Remove the last selected key if it's a parent
        setSelectedRowKeys(selectedKeys.slice(0, -1));
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.children, // Disable checkbox for rows that have children
    }),
  };
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için
  const totalTableWidth = columns.reduce((acc, column) => acc + (parseInt(column.width, 10) || 0), 0);
  // tabloyu sağa sola kaydıra bilme özelliği eklemek için son

  useEffect(() => {
    setValue("costcenter", inputValue);
  }, [inputValue, setValue]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <Text style={{ fontSize: "14px" }}>Masraf Merkezi:</Text>
      <div style={{ display: "flex", alignItems: "center", width: "300px", gap: "5px" }}>
        <Controller
          name="costcenter"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              // value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                field.onChange(e.target.value);
              }}
              disabled
            />
          )}
        />
        <Controller
          name="costcenterSelectedIdDetailsTab"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text" // Set the type to "text" for name input
              style={{ display: "none" }}
            />
          )}
        />

        <Button onClick={handlePlusClick}> + </Button>
        <Button onClick={handleMinusClick}> - </Button>
        <Modal
          centered
          width="1200px"
          title="Masraf Merkezi"
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}>
          <StyledTable
            className="custom-table"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={treeData}
            loading={loading}
            scroll={{ x: totalTableWidth, y: "500px" }}
          />
        </Modal>
      </div>
    </div>
  );
}
