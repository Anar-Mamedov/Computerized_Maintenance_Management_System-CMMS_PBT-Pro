// lokasyon verilerinin hepsi çekilip front entde ağaç yapısı yapılıyor ve arama işlemide front end de yapılıyor

import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Table, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../../../../../../api/http.jsx";
import styled from "styled-components";
import { t } from "i18next";

export default function LokasyonTablo({ workshopSelectedId, onSubmit, currentUserId, setRefreshKey }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const columns = [
    {
      title: "",
      key: "lokasyonBilgisi",
      render: (text, record) => <div>{record.lokasyonTanim}</div>,
    },
    // Other columns...
  ];

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    data.forEach((item) => {
      nodes[item.lokasyonId] = {
        ...item,
        key: item.lokasyonId,
        children: [],
      };
    });

    data.forEach((item) => {
      if (item.anaLokasyonId && nodes[item.anaLokasyonId]) {
        nodes[item.anaLokasyonId].children.push(nodes[item.lokasyonId]);
      } else {
        tree.push(nodes[item.lokasyonId]);
      }
    });

    Object.values(nodes).forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  const toLowerTurkish = (str) => {
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  };

  const filterTree = (nodeList, searchTerm, path = []) => {
    let isMatchFound = false;
    let expandedKeys = [];

    const lowerSearchTerm = toLowerTurkish(searchTerm);

    const filtered = nodeList
      .map((node) => {
        let nodeMatch = toLowerTurkish(node.lokasyonTanim).includes(lowerSearchTerm);
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

  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get("Location/GetLocationList")
      .then((response) => {
        const tree = formatDataForTable(response.data);
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
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setFilteredData(treeData);
      setExpandedRowKeys([]);
    }
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], treeData);
    if (selectedData) {
      const body = {
        lokasyonId: selectedData.lokasyonId,
        kullaniciId: currentUserId,
      };

      AxiosInstance.post("UserLocation/AddUserLocationItem", body)
        .then((response) => {
          console.log("API Response:", response);
          if (response.data.statusCode == 201 || response.data.statusCode == 200 || response.data.statusCode == 202) {
            message.success(t("islemBasarili"));
            setRefreshKey((prev) => prev + 1); // Trigger data refresh
          }
          // Handle success as needed
        })
        .catch((error) => {
          console.error("API Error:", error);
          // Handle error as needed
        });

      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  useEffect(() => {
    setSelectedRowKeys(workshopSelectedId ? [workshopSelectedId] : []);
  }, [workshopSelectedId]);

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  return (
    <div>
      <Button type="primary" onClick={handleModalToggle}>
        {t("lokasyonEkle")}{" "}
      </Button>
      <Modal width="1200px" title={t("lokasyon")} open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          type="text"
          placeholder={t("aramaYap")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
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
