import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Input, message } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import AxiosInstance from "../../api/http";

export default function MasrafMerkeziTablo({
  workshopSelectedId,
  onSubmit,
  onClear,
  disabled,
  masrafMerkeziFieldName = "masrafMerkeziTanim",
  masrafMerkeziIdFieldName = "masrafMerkeziID",
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Full tree data from API
  const [treeData, setTreeData] = useState([]);
  // What user types in search box
  const [searchTerm, setSearchTerm] = useState("");
  // Debounced or immediate “searchTerm” that triggers actual filtering
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // The final, filtered tree we pass to the table
  const [filteredData, setFilteredData] = useState([]);
  // Keys of rows that are expanded
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Define the columns in the table
  const columns = [
    {
      title: "Masraf Yolu",
      dataIndex: "MAM_KOD",
      key: "MAM_KOD",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Masraf Tanımı",
      dataIndex: "MAM_TANIM",
      key: "MAM_TANIM",
      width: 300,
      ellipsis: true,
    },
  ];

  // 1) Format raw data from your API into a "tree" structure
  const formatDataForTable = (data) => {
    if (!Array.isArray(data)) return [];
    const nodes = {};
    const tree = [];

    // First pass: create a map of ID -> node
    data.forEach((item) => {
      nodes[item.TB_MASRAF_MERKEZ_ID] = {
        ...item,
        key: item.TB_MASRAF_MERKEZ_ID, // crucial for AntD
        children: [],
      };
    });

    // Second pass: set up parent/child relationships
    data.forEach((item) => {
      const nodeId = item.TB_MASRAF_MERKEZ_ID;
      const parentId = item.MAM_USTGRUP_ID;
      if (parentId && parentId !== 0 && nodes[parentId]) {
        // It's a child of some other node
        nodes[parentId].children.push(nodes[nodeId]);
      } else {
        // It's a root-level node
        tree.push(nodes[nodeId]);
      }
    });

    // Optional: if a node has 0 children, you can remove the array so
    // it doesn't show an expand icon. Not strictly required:
    Object.values(nodes).forEach((n) => {
      if (n.children.length === 0) {
        delete n.children;
      }
    });

    return tree;
  };

  // 2) toLowerTurkish for case-insensitive matching in Turkish
  const toLowerTurkish = (str) => {
    if (!str) return "";
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  };

  // 3) Recursive tree filter function
  const filterTree = (nodeList, searchTerm, ancestors = []) => {
    let matchFoundInThisLevel = false;
    let localExpandedKeys = [];
    const lowerSearchTerm = toLowerTurkish(searchTerm);

    // Filter the current level
    const filteredNodes = nodeList
      .map((node) => {
        const kod = node.MAM_KOD || "";
        const tanim = node.MAM_TANIM || "";

        // Does the current node text match the search?
        const nodeMatch = toLowerTurkish(kod).includes(lowerSearchTerm) || toLowerTurkish(tanim).includes(lowerSearchTerm);

        // Recurse on children
        let childrenMatch = false;
        let filteredChildren = [];
        if (node.children && node.children.length > 0) {
          const childResult = filterTree(node.children, searchTerm, [...ancestors, node.key]);
          childrenMatch = childResult.isMatch;
          filteredChildren = childResult.filtered; // The children that matched (or their children did)

          // Also gather up expanded keys from deeper levels
          localExpandedKeys = localExpandedKeys.concat(childResult.expandedKeys);
        }

        // If the current node itself matches OR any of its descendants match,
        // we keep this node in the filtered result
        if (nodeMatch || childrenMatch) {
          matchFoundInThisLevel = true;
          // If there's a match deeper, we also want to expand the ancestors
          // so the user can see the children. We add the ancestor keys to the expanded set:
          localExpandedKeys = localExpandedKeys.concat(ancestors);

          return {
            ...node,
            // If children matched, show only those matched children
            children: childrenMatch ? filteredChildren : node.children,
          };
        }

        // If node does not match and no children matched, remove this node
        return null;
      })
      .filter(Boolean);

    return {
      filtered: filteredNodes,
      isMatch: matchFoundInThisLevel,
      expandedKeys: localExpandedKeys,
    };
  };

  // 4) Debounce the `searchTerm` input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 5) Actually filter the tree when `debouncedSearchTerm` or `treeData` changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      const result = filterTree(treeData, debouncedSearchTerm.trim());
      setFilteredData(result.filtered);
      setExpandedRowKeys([...new Set(result.expandedKeys)]);

      // Debug logs
      /*  console.log("Searching for:", debouncedSearchTerm);
      console.log("Filtered result:", result.filtered);
      console.log("Expanded keys from search:", result.expandedKeys); */
    } else {
      // If search is empty, just show the whole tree
      setFilteredData(treeData);
      setExpandedRowKeys([]);
    }
  }, [debouncedSearchTerm, treeData]);

  // 6) Expand/collapse handler
  const onTableRowExpand = (expanded, record) => {
    const newKeys = expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter((k) => k !== record.key);
    setExpandedRowKeys(newKeys);
  };

  // 7) Fetch data from API
  const fetchData = () => {
    setLoading(true);
    AxiosInstance.get("MasrafMerkeziList")
      .then((response) => {
        const raw = Array.isArray(response.data) ? response.data : response;
        const tree = formatDataForTable(raw);
        setTreeData(tree);
        setFilteredData(tree); // show entire tree until we search
      })
      .catch((error) => {
        console.error("API Error:", error);
        if (navigator.onLine) {
          message.error("Hata Mesajı: " + error.message);
        } else {
          message.error("Internet Bağlantısı Mevcut Değil.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 8) Helper to find selected node in the tree
  const findItemInTree = (key, nodeList) => {
    for (const node of nodeList) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findItemInTree(key, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  // 9) When the modal opens, fetch fresh data; reset states
  const handleModalToggle = () => {
    setIsModalVisible((prev) => !prev);

    // If about to open the modal
    if (!isModalVisible) {
      fetchData();
      setSelectedRowKeys([]);
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setExpandedRowKeys([]);
    }
  };

  // 10) On modal OK, set the form fields
  const handleModalOk = () => {
    const pickedKey = selectedRowKeys[0];
    const selectedData = findItemInTree(pickedKey, treeData);
    if (selectedData) {
      setValue(masrafMerkeziFieldName, selectedData.MAM_KOD);
      setValue(masrafMerkeziIdFieldName, selectedData.key);
      onSubmit?.(selectedData);
    }
    setIsModalVisible(false);
  };

  // 11) If `workshopSelectedId` changes, reflect that in local state
  useEffect(() => {
    if (workshopSelectedId) {
      setSelectedRowKeys([workshopSelectedId]);
    } else {
      setSelectedRowKeys([]);
    }
  }, [workshopSelectedId]);

  // 12) Single-select row
  const onRowSelectChange = (newSelectedKeys) => {
    setSelectedRowKeys(newSelectedKeys.length ? [newSelectedKeys[0]] : []);
  };

  const rowSelection = {
    type: "radio",
    selectedRowKeys,
    onChange: onRowSelectChange,
  };

  // 13) Clear the selected masraf merkezi fields
  const handleMasrafMerkeziMinusClick = () => {
    setValue(masrafMerkeziFieldName, "");
    setValue(masrafMerkeziIdFieldName, "");
    onClear && onClear();
  };

  return (
    <div style={{ width: "100%" }}>
      {/* The two form inputs: one visible (the code) and one hidden (the ID) */}
      <div style={{ display: "flex", gap: "5px", width: "100%" }}>
        <Controller
          name={masrafMerkeziFieldName}
          control={control}
          render={({ field }) => <Input {...field} status={errors[masrafMerkeziFieldName] ? "error" : ""} style={{ width: "100%", maxWidth: "630px" }} disabled />}
        />
        <Controller name={masrafMerkeziIdFieldName} control={control} render={({ field }) => <Input {...field} type="text" style={{ display: "none" }} />} />
        {/* Buttons to open modal / clear field */}
        <div style={{ display: "flex", gap: "5px" }}>
          <Button disabled={disabled} onClick={handleModalToggle}>
            +
          </Button>
          <Button onClick={handleMasrafMerkeziMinusClick}>-</Button>
        </div>
      </div>

      {/* The modal with search + table */}
      <Modal width="1200px" title="Masraf Merkezi" open={isModalVisible} onOk={handleModalOk} onCancel={handleModalToggle}>
        {/* Search input */}
        <Input
          style={{ width: "250px", marginBottom: "10px" }}
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />}
        />

        {/* The tree table */}
        <Table
          rowKey="key"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData} // show filtered data
          loading={loading}
          scroll={{ y: "calc(100vh - 400px)" }}
          // Must use `expandable` for tree expansion
          expandable={{
            expandedRowKeys,
            onExpand: onTableRowExpand,
            // For debugging, you could enable this:
            // defaultExpandAllRows: true,
          }}
        />
      </Modal>
    </div>
  );
}
