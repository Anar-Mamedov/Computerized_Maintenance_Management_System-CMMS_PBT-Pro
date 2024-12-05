import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../../../api/http";
import { Table, Tag, Input, Button } from "antd";
import { useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";

function LokasyonYetkiler1() {
  const { watch } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const currentUserId = watch("siraNo");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetLokasyonYetki?id=${currentUserId}`);
      if (response) {
        // Transform the flat data into a tree structure
        const treeData = buildTree(response);
        setData(treeData);
        setFilteredData(treeData); // Initialize filteredData with full data
        setExpandedKeys([]); // Initialize expandedKeys as empty
        setLoading(false);
      } else {
        console.error("API response is not in expected format");
        setLoading(false);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      setLoading(false);
    }
  };

  // Function to build the tree structure
  const buildTree = (flatData) => {
    const idMapping = flatData.reduce((acc, el, i) => {
      acc[el.KLT_LOKASYON_ID] = i;
      return acc;
    }, {});

    let root = [];
    flatData.forEach((el) => {
      // Handle the root element
      if (el.KLT_ANA_LOKASYON_ID === 0) {
        root.push(el);
        return;
      }
      // Use our mapping to locate the parent element in our data array
      const parentEl = flatData[idMapping[el.KLT_ANA_LOKASYON_ID]];
      // Add our current el to its parent's `children` array
      parentEl.children = [...(parentEl.children || []), el];
    });
    return root;
  };

  // Function to update KLT_GOR value in the data tree for the clicked node and its descendants
  const updateDataKLT_GOR = (dataArray, KLT_LOKASYON_ID, newKLT_GOR) => {
    return dataArray.map((item) => {
      if (item.KLT_LOKASYON_ID === KLT_LOKASYON_ID) {
        const updatedItem = { ...item, KLT_GOR: newKLT_GOR };
        if (item.children) {
          updatedItem.children = updateDataKLT_GORAll(item.children, newKLT_GOR);
        }
        return updatedItem;
      } else if (item.children) {
        return { ...item, children: updateDataKLT_GOR(item.children, KLT_LOKASYON_ID, newKLT_GOR) };
      } else {
        return item;
      }
    });
  };

  // Helper function to update KLT_GOR for all descendants
  const updateDataKLT_GORAll = (dataArray, newKLT_GOR) => {
    return dataArray.map((item) => {
      const updatedItem = { ...item, KLT_GOR: newKLT_GOR };
      if (item.children) {
        updatedItem.children = updateDataKLT_GORAll(item.children, newKLT_GOR);
      }
      return updatedItem;
    });
  };

  // Function to get all descendants of a record, including the record itself
  const getAllDescendants = (record) => {
    let descendants = [record];
    if (record.children) {
      record.children.forEach((child) => {
        descendants = descendants.concat(getAllDescendants(child));
      });
    }
    return descendants;
  };

  // Handler for toggling KLT_GOR for the record and its descendants
  const handleToggleKLT_GOR = async (record) => {
    const newKLT_GOR = !record.KLT_GOR;
    const recordsToUpdate = getAllDescendants(record);

    try {
      // Send API requests for each record and update the KLT_GOR value
      await Promise.all(
        recordsToUpdate.map((rec) => {
          const requestData = {
            KLT_KULLANICI_ID: rec.KLT_KULLANICI_ID,
            KLT_LOKASYON_ID: rec.KLT_LOKASYON_ID,
            KLT_GOR: newKLT_GOR,
          };
          return AxiosInstance.post("UpdateLokasyonYetki", requestData);
        })
      );

      // Update the state to reflect the changes
      const updatedData = updateDataKLT_GOR(data, record.KLT_LOKASYON_ID, newKLT_GOR);
      setData(updatedData);
      // Also update filteredData in case the data is filtered
      const updatedFilteredData = updateDataKLT_GOR(filteredData, record.KLT_LOKASYON_ID, newKLT_GOR);
      setFilteredData(updatedFilteredData);
    } catch (error) {
      console.error("Error updating KLT_GOR:", error);
    }
  };

  // Helper function to collect all keys from the tree data
  const getAllKeys = (nodes) => {
    let keys = [];
    nodes.forEach((node) => {
      keys.push(node.KLT_LOKASYON_ID);
      if (node.children) {
        keys = keys.concat(getAllKeys(node.children));
      }
    });
    return keys;
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchValue) {
      setFilteredData(data);
      setExpandedKeys([]); // Collapse all nodes when search is cleared
      return;
    }
    const filterTree = (nodes) => {
      return nodes
        .map((node) => {
          const children = node.children ? filterTree(node.children) : [];
          if (node.KLT_TANIM.toLowerCase().includes(searchValue.toLowerCase()) || children.length) {
            return { ...node, children };
          }
          return null;
        })
        .filter((node) => node);
    };
    const filtered = filterTree(data);
    setFilteredData(filtered);

    // Collect all keys from the filtered data to expand all nodes
    const allKeys = getAllKeys(filtered);
    setExpandedKeys(allKeys);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // New handler for expand/collapse events
  const handleExpand = (expanded, record) => {
    const key = record.KLT_LOKASYON_ID;
    let newExpandedKeys = [...expandedKeys];

    if (expanded) {
      // If the row is expanded, add it to the expandedKeys array
      newExpandedKeys.push(key);
    } else {
      // If the row is collapsed, remove it from the expandedKeys array
      newExpandedKeys = newExpandedKeys.filter((k) => k !== key);
    }

    setExpandedKeys(newExpandedKeys);
  };

  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId]);

  const columns = [
    {
      title: "Lokasyon",
      dataIndex: "KLT_TANIM",
      key: "KLT_TANIM",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Gör",
      dataIndex: "KLT_GOR",
      key: "KLT_GOR",
      width: 80,
      ellipsis: true,
      render: (text, record) => (
        <Tag color={record.KLT_GOR ? "red" : "gray"} onClick={() => handleToggleKLT_GOR(record)} style={{ cursor: "pointer" }}>
          {record.KLT_GOR ? "Gör" : "Görme"}
        </Tag>
      ),
    },
    // Add more columns if needed
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Ara" value={searchValue} onChange={handleInputChange} onKeyPress={handleKeyPress} style={{ width: 200, marginRight: 8 }} />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Ara
        </Button>
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        scroll={{ y: "calc(100vh - 300px)" }}
        rowKey="KLT_LOKASYON_ID"
        pagination={false}
        expandedRowKeys={expandedKeys} // Pass expanded row keys to expand the tree
        onExpand={handleExpand} // Add the onExpand handler
      />
    </div>
  );
}

export default LokasyonYetkiler1;
