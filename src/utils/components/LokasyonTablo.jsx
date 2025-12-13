import React, { useCallback, useEffect, useState } from "react";
import { Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";
import PropTypes from "prop-types";
import { t } from "i18next";

export default function LokasyonTablo({
  workshopSelectedId,
  onSubmit,
  onClear,
  disabled,
  lokasyonFieldName = "lokasyonTanim",
  lokasyonIdFieldName = "lokasyonID",
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
      key: "lokasyonBilgisi",
      render: (text, record) => <div>{record.LOK_TANIM}</div>,
    },
    // Other columns...
  ];

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    data.forEach((item) => {
      nodes[item.TB_LOKASYON_ID] = {
        ...item,
        key: item.TB_LOKASYON_ID,
        children: [],
      };
    });

    data.forEach((item) => {
      if (item.LOK_ANA_LOKASYON_ID && nodes[item.LOK_ANA_LOKASYON_ID]) {
        nodes[item.LOK_ANA_LOKASYON_ID].children.push(nodes[item.TB_LOKASYON_ID]);
      } else {
        tree.push(nodes[item.TB_LOKASYON_ID]);
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

  const filterTree = useCallback((nodeList, searchTerm, path = []) => {
    let isMatchFound = false;
    let expandedKeys = [];

    const lowerSearchTerm = toLowerTurkish(searchTerm);

    const filtered = nodeList
      .map((node) => {
        let nodeMatch = toLowerTurkish(node.LOK_TANIM).includes(lowerSearchTerm);
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
      setExpandedRowKeys([...new Set(result.expandedKeys)]);
    } else {
      setFilteredData(treeData);
      setExpandedRowKeys([]);
    }
  }, [debouncedSearchTerm, treeData, filterTree]);

  const onTableRowExpand = (expanded, record) => {
    const keys = expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter((k) => k !== record.key);
    setExpandedRowKeys(keys);
  };

  // arama işlevi için son

  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get("GetLokasyonList")
      .then((response) => {
        const tree = formatDataForTable(response.data || response);
        setTreeData(tree);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
        if (navigator.onLine) {
          // İnternet bağlantısı var
          message.error("Hata Mesajı: " + error.message);
        } else {
          // İnternet bağlantısı yok
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
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
      setSearchTerm(""); // Modal kapandığında arama alanını sıfırla
      setDebouncedSearchTerm(""); // Debounced arama terimini de sıfırla
      setFilteredData(treeData); // Filtrelenmiş veriyi orijinal ağaç verisine döndür
      setExpandedRowKeys([]); // Genişletilmiş satırları sıfırla
    }
  };

  const handleModalOk = () => {
    const selectedData = findItemInTree(selectedRowKeys[0], treeData);
    if (selectedData) {
      setValue(lokasyonFieldName, selectedData.LOK_TANIM);
      setValue(lokasyonIdFieldName, selectedData.key);
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

  // parentler seçilemesin diye

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  // parentler seçilemesin diye end

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

      <Modal width="1200px" title="Lokasyon" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
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

LokasyonTablo.propTypes = {
  workshopSelectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  disabled: PropTypes.bool,
  lokasyonFieldName: PropTypes.string,
  lokasyonIdFieldName: PropTypes.string,
  isRequired: PropTypes.bool,
};
