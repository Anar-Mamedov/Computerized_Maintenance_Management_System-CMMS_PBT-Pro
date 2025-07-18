import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table } from "antd";
import AxiosInstance from "../../../../../../../../../api/http";

export default function MasrafMerkeziTablo({ workshopSelectedId, onSubmit }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]); // New state for tree data

  const columns = [
    {
      title: "Masraf Yolu",
      dataIndex: "name",
      key: "name",
      width: 300,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Masraf Tanımı",
      dataIndex: "age",
      key: "age",
      width: 300,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Masraf Tipi",
      dataIndex: "workdays",
      key: "workdays",
      width: 300,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Lokasyon",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Proje",
      dataIndex: "fifthColumn",
      key: "fifthColumn",
      width: 300,
      ellipsis: true,
      render: (text) => <div>{text}</div>,
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

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], treeData);
    if (selectedData && !selectedData.children) {
      onSubmit && onSubmit(selectedData); // Call the onSubmit callback with the selected data
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  // parentler seçilemesin diye

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
    getCheckboxProps: (record) => ({
      // Disable checkbox if the record is a parent (has children)
      disabled: record.children && record.children.length > 0,
    }),
  };

  // parentler seçilemesin diye end

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width="1200px"
        title="Masraf Merkezi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={treeData}
          loading={loading}
          scroll={{
            // x: "auto",
            y: "calc(100vh - 360px)",
          }}
        />
      </Modal>
    </div>
  );
}
