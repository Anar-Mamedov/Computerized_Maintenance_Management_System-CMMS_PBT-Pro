import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../../../api/http";
import styled from "styled-components";
import { Controller, useFormContext } from "react-hook-form";

export default function EkipmanTablo({ workshopSelectedId, onSubmit }) {
  const { control, watch, setValue } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const columns = [
    // {
    //   title: "",
    //   key: "key",
    //   dataIndex: "key",
    //   width: 150,
    //   render: (text, record) => <div >{record.key}</div>,
    // },
    {
      title: "",
      key: "ekipmanBilgisi",
      render: (text, record) => (
        <div>
          {record.EKP_KOD} - {record.EKP_TANIM}
        </div>
      ),
    },
    // Other columns...
  ];

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    data.forEach((item) => {
      nodes[item.TB_EKIPMAN_ID] = {
        ...item,
        key: item.TB_EKIPMAN_ID,
        children: [],
      };
    });

    data.forEach((item) => {
      if (item.EKP_REF_ID && nodes[item.EKP_REF_ID]) {
        nodes[item.EKP_REF_ID].children.push(nodes[item.TB_EKIPMAN_ID]);
      } else {
        tree.push(nodes[item.TB_EKIPMAN_ID]);
      }
    });

    Object.values(nodes).forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  // Arama işlevi için

  const toLowerTurkish = (str) => {
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  };

  const filterTree = (nodeList, searchTerm, path = []) => {
    let isMatchFound = false;
    let expandedKeys = [];

    const lowerSearchTerm = toLowerTurkish(searchTerm);

    const filtered = nodeList
      .map((node) => {
        let nodeMatch = toLowerTurkish(node.EKP_TANIM).includes(lowerSearchTerm);
        let childrenMatch = false;
        let filteredChildren = [];

        if (node.children) {
          const result = filterTree(node.children, lowerSearchTerm, path.concat(node.key));
          childrenMatch = result.isMatch;
          filteredChildren = result.filtered;
          expandedKeys = expandedKeys.concat(result.expandedKeys);
        }

        if (nodeMatch || childrenMatch) {
          isMatchFound = true;
          expandedKeys = expandedKeys.concat(path);
          // Eğer düğüm eşleşirse, tüm çocuklarını da dahil et
          return { ...node, children: childrenMatch ? filteredChildren : node.children };
        }

        return null;
      })
      .filter((node) => node !== null);

    return { filtered, isMatch: isMatchFound, expandedKeys };
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const result = filterTree(treeData, debouncedSearchTerm);
      setFilteredData(result.filtered);
      setExpandedRowKeys([...new Set(result.expandedKeys)]);
    } else {
      setFilteredData(treeData);
      setExpandedRowKeys([]);
    }
  }, [debouncedSearchTerm, treeData]);

  const onTableRowExpand = (expanded, record) => {
    const keys = expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter((k) => k !== record.key);
    setExpandedRowKeys(keys);
  };

  // arama işlevi için son

  const fetchData = useCallback(() => {
    const makineID = watch("makineID"); // useFormContext'ten gelen watch fonksiyonu ile makineID'yi izle
    if (makineID) {
      // makineID'nin varlığını kontrol et
      setLoading(true);
      AxiosInstance.get(`Ekipman?MakineID=${makineID}`) // Template literal kullanarak makineID'yi dinamik olarak ekle
        .then((response) => {
          const tree = formatDataForTable(response.data || response);
          setTreeData(tree);
          setLoading(false);
        })
        .catch((error) => {
          console.error("API Error:", error);
          setLoading(false);
        });
    }
  }, [watch]); // Bağımlılıklar listesine watch fonksiyonunu ekle

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

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData fonksiyonunu bağımlılıklar listesine ekle

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
      setSearchTerm(""); // Modal kapandığında arama alanını sıfırla
      setDebouncedSearchTerm(""); // Debounced arama terimini de sıfırla
      setFilteredData(treeData); // Filtrelenmiş veriyi orijinal ağaç verisine döndür
      setExpandedRowKeys([]); // Genişletilmiş satırları sıfırla
    }
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], treeData);
    if (selectedData) {
      onSubmit && onSubmit(selectedData); // This should handle both parents and children
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
  };

  // parentler seçilemesin diye end

  return (
    <div>
      <Button onClick={handleModalToggle}> + </Button>
      <Modal
        width="1200px"
        title="Ekipman Listesi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalToggle}>
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />} // Arama ikonunu ekle
        />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={debouncedSearchTerm ? filteredData : treeData}
          loading={loading}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
          expandedRowKeys={expandedRowKeys}
          onExpand={onTableRowExpand}
        />
      </Modal>
    </div>
  );
}
