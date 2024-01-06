import React, { useEffect, useState } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input, Table, Spin } from "antd";
import AxiosInstance from "../../../../api/http";
import CreateDrawer from "../Insert/CreateDrawer";
import { SearchOutlined } from "@ant-design/icons";

export default function MainTable() {
  const { watch, control, setValue } = useFormContext();
  const { fields, append, replace } = useFieldArray({
    control,
    name: "lokasyon", // Name of the field array
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // arama işlevi için

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1000 ms gecikme

    return () => clearTimeout(timerId); // Kullanıcı yazmaya devam ederse timeout'u iptal et
  }, [searchTerm]);

  const toLowerTurkish = (str) => {
    return str.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  };

  const filterTree = (nodeList, searchTerm, path = []) => {
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
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      const result = filterTree(fields, debouncedSearchTerm);
      setFilteredData(result.filtered);
      setExpandedRowKeys([...new Set(result.expandedKeys)]);
    } else {
      setFilteredData(fields);
      setExpandedRowKeys([]);
    }
  }, [debouncedSearchTerm, fields]);

  const onTableRowExpand = (expanded, record) => {
    const keys = expanded ? [...expandedRowKeys, record.key] : expandedRowKeys.filter((k) => k !== record.key);

    setExpandedRowKeys(keys);
  };

  // arama işlevi için son

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      setLoading(true); // Yükleme başladığında
      const response = await AxiosInstance.get("Lokasyon?ID=30");
      if (response) {
        const formattedData = formatDataForTable(response);
        replace(formattedData); // Populate the field array
        setLoading(false); // Yükleme bittiğinde
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Error in API request:", error);
      setLoading(false); // Hata durumunda da yükleme bitti
    }
  };

  const formatDataForTable = (data) => {
    let nodes = {};
    let tree = [];

    // Her bir lokasyonu bir node olarak hazırlayın
    data.forEach((item) => {
      nodes[item.TB_LOKASYON_ID] = {
        ...item,
        key: item.TB_LOKASYON_ID,
        children: [],
      };
    });

    // Lokasyonlar arasındaki ilişkileri kurun
    data.forEach((item) => {
      if (item.LOK_ANA_LOKASYON_ID && nodes[item.LOK_ANA_LOKASYON_ID]) {
        // Çocuk düğümleri burada oluşturun
        nodes[item.LOK_ANA_LOKASYON_ID].children.push(nodes[item.TB_LOKASYON_ID]);
      } else {
        // Eğer üst düzey bir lokasyon ise, ağacın köküne ekleyin
        tree.push(nodes[item.TB_LOKASYON_ID]);
      }
    });

    // Çocukları olmayan düğümlerde children alanını silin
    Object.values(nodes).forEach((node) => {
      if (node.children.length === 0) {
        delete node.children;
      }
    });

    return tree;
  };

  const columns = [
    // {
    //   title: "",
    //   key: "key",
    //   dataIndex: "key",
    //   width: 150,
    //   render: (text, record) => <div style={{ marginTop: "6px" }}>{record.key}</div>,
    // },
    {
      title: "",
      key: "lokasyonBilgisi",
      render: (text, record) => <div style={{ marginTop: "6px" }}>{record.LOK_TANIM}</div>,
    },
    // Other columns...
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    // Seçilen satırın ID'sini formun bir alanına yazdır
    if (newSelectedRowKeys.length > 0) {
      setValue("selectedLokasyonId", newSelectedRowKeys[0]);
    } else {
      setValue("selectedLokasyonId", null);
    }
  };

  const rowSelection = {
    type: "radio", // Radio tipi seçim kutuları kullan
    selectedRowKeys,
    onChange: onSelectChange,
    // You can add more configuration here if needed
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", marginBottom: "20px" }}>
        <Input
          style={{ width: "250px" }}
          type="text"
          placeholder="Arama yap..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#0091ff" }} />} // Arama ikonunu ekle
        />
        <CreateDrawer selectedLokasyonId={selectedRowKeys[0]} />
      </div>
      <Spin spinning={loading}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={debouncedSearchTerm ? filteredData : fields}
          pagination={false}
          scroll={{ y: "calc(100vh - 300px)" }}
          expandedRowKeys={expandedRowKeys}
          onExpand={onTableRowExpand} // Elle genişletme/küçültme işlemlerini takip et
        />
      </Spin>
    </div>
  );
}
