import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";
import PropTypes from "prop-types";
import { t } from "i18next";

export default function DepoLokasyon({
  depoId,
  onSubmit,
  onClear,
  disabled,
  lokasyonFieldName = "stkDepoLokasyon",
  lokasyonIdFieldName = "stkDepoLokasyonID",
  isRequired = false,
}) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const columns = [
    {
      title: "Lokasyon",
      key: "lokasyonBilgisi",
      render: (text, record) => <div>{record.LKY_TANIM}</div>,
    },
  ];

  // Tree yapısını oluştur
  const formatDataForTree = (data) => {
    let nodes = {};
    let tree = [];

    data.forEach((item) => {
      nodes[item.TB_DEPO_LOKASYON_ID] = {
        ...item,
        key: item.TB_DEPO_LOKASYON_ID,
        children: [],
      };
    });

    data.forEach((item) => {
      if (item.LKY_PARENT_ID && item.LKY_PARENT_ID !== 0 && nodes[item.LKY_PARENT_ID]) {
        nodes[item.LKY_PARENT_ID].children.push(nodes[item.TB_DEPO_LOKASYON_ID]);
      } else {
        tree.push(nodes[item.TB_DEPO_LOKASYON_ID]);
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

  // Tree'de arama
  const filterTree = useCallback((nodeList, searchTerm, path = []) => {
    let isMatchFound = false;
    let expandedKeys = [];

    const lowerSearchTerm = toLowerTurkish(searchTerm);

    const filtered = nodeList
      .map((node) => {
        let nodeMatch = toLowerTurkish(node.LKY_TANIM || "").includes(lowerSearchTerm);
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
  }, []);

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
      setExpandedRowKeys(result.expandedKeys);
    } else {
      setFilteredData(treeData);
      setExpandedRowKeys([]);
    }
  }, [debouncedSearchTerm, treeData, filterTree]);

  const fetchData = () => {
    if (!depoId) {
      message.warning("Lütfen önce bir depo seçiniz.");
      return;
    }

    setLoading(true);
    AxiosInstance.get(`GetDepoLokasyonByDepoId?depoId=${depoId}`)
      .then((response) => {
        const dataArray = Array.isArray(response) ? response : response.data || [];
        const formattedData = dataArray.map((item) => ({
          ...item,
          key: item.TB_DEPO_LOKASYON_ID || item.key,
        }));
        setData(formattedData);

        // Tree yapısını oluştur
        const tree = formatDataForTree(formattedData);
        setTreeData(tree);
        setFilteredData(tree);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      });
  };

  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);
    if (!isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
      setSearchTerm("");
      setDebouncedSearchTerm("");
    }
  };

  const handleModalOk = () => {
    const selectedData = data.find((item) => item.key === selectedRowKeys[0]);
    if (selectedData) {
      setValue(lokasyonFieldName, selectedData.LKY_TUM_YOL || selectedData.LKY_TANIM);
      setValue(lokasyonIdFieldName, selectedData.key);
      onSubmit && onSubmit(selectedData);
    }
    setIsModalVisible(false);
  };

  const onRowSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys.length ? [selectedKeys[0]] : []);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  const handleLokasyonMinusClick = () => {
    setValue(lokasyonFieldName, "");
    setValue(lokasyonIdFieldName, "");
    onClear && onClear();
  };

  const lokasyonValue = watch(lokasyonFieldName);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={lokasyonFieldName}
          control={control}
          rules={{ required: isRequired ? t("alanBosBirakilamaz") : false }}
          render={({ field }) => (
            <Input
              {...field}
              status={errors[lokasyonFieldName] ? "error" : ""}
              type="text"
              style={{ width: "100%" }}
              readOnly
              suffix={
                lokasyonValue ? (
                  <CloseOutlined
                    style={{ color: "#8c8c8c", cursor: "pointer", fontSize: "12px" }}
                    onClick={handleLokasyonMinusClick}
                  />
                ) : (
                  <PlusOutlined
                    style={{ color: disabled ? "#d9d9d9" : "#0091ff", cursor: disabled ? "not-allowed" : "pointer", fontSize: "12px" }}
                    onClick={disabled ? undefined : handleModalToggle}
                  />
                )
              }
            />
          )}
        />

        <Controller
          name={lokasyonIdFieldName}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              style={{ display: "none" }}
            />
          )}
        />
      </div>
      {errors[lokasyonFieldName] && <div style={{ color: "red", marginTop: "5px" }}>{errors[lokasyonFieldName].message}</div>}

      <Modal width="1200px" title="Depo Lokasyonu" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          expandable={{
            expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys([...expandedRowKeys, record.key]);
              } else {
                setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.key));
              }
            },
          }}
          scroll={{
            y: "calc(100vh - 400px)",
          }}
        />
      </Modal>
    </div>
  );
}

DepoLokasyon.propTypes = {
  depoId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  lokasyonFieldName: PropTypes.string,
  lokasyonIdFieldName: PropTypes.string,
  isRequired: PropTypes.bool,
};
