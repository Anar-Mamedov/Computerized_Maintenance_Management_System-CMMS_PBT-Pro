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

  // 1) Boş children'ları tamamen kaldıran helper fonksiyon
  function removeEmptyChildren(dataArray) {
    return dataArray.map((item) => {
      // Eğer çocukları varsa (ve sayıları > 0 ise), onları da özyinelemeli (recursive) kontrol edelim
      if (item.children && item.children.length > 0) {
        item.children = removeEmptyChildren(item.children);
      } else {
        // children var ama boşsa -> property'yi tamamen sil
        if (item.children) {
          delete item.children;
        }
      }
      return item;
    });
  }

  // 2) Veriyi çeken ve buildTree ile işleyen fonksiyon
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get(`GetLokasyonYetki?id=${currentUserId}`);
      if (response) {
        // Transform the flat data into a tree structure
        let treeData = buildTree(response);

        // Boş children'ları sil => alt dalı olmayan node'lardan children property kalksın
        treeData = removeEmptyChildren(treeData);

        setData(treeData);
        setFilteredData(treeData);
        setExpandedKeys([]);
      } else {
        console.error("API response is not in expected format");
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3) Ağaç yapısını oluşturan fonksiyon
  function buildTree(flatData) {
    // 3.1) Her kaydı "harita" benzeri bir yapıya atıyoruz
    const recordMap = flatData.reduce((acc, item) => {
      acc[item.KLT_LOKASYON_ID] = { ...item, children: [] };
      return acc;
    }, {});

    // 3.2) Root olanları tutacağımız dizi
    const rootList = [];

    // 3.3) Tüm kayıtların parent/child ilişkisini kuralım
    flatData.forEach((item) => {
      const parentId = item.KLT_ANA_LOKASYON_ID;
      const currentId = item.KLT_LOKASYON_ID;

      if (parentId === 0) {
        rootList.push(recordMap[currentId]);
      } else {
        const parentNode = recordMap[parentId];
        if (parentNode) {
          parentNode.children.push(recordMap[currentId]);
        } else {
          console.warn(`Parent (ID: ${parentId}) bulunamadı, bu kaydı root’a ekliyoruz:`, item);
          rootList.push(recordMap[currentId]);
        }
      }
    });

    // 3.4) Root listesini döndür (iç içe children dizileriyle birlikte)
    return rootList;
  }

  // 4) KLT_GOR güncelleme fonksiyonları
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

  const updateDataKLT_GORAll = (dataArray, newKLT_GOR) => {
    return dataArray.map((item) => {
      const updatedItem = { ...item, KLT_GOR: newKLT_GOR };
      if (item.children) {
        updatedItem.children = updateDataKLT_GORAll(item.children, newKLT_GOR);
      }
      return updatedItem;
    });
  };

  // 5) Bir record'un tüm alt dallarını (descendants) getiren fonksiyon
  const getAllDescendants = (record) => {
    let descendants = [record];
    if (record.children) {
      record.children.forEach((child) => {
        descendants = descendants.concat(getAllDescendants(child));
      });
    }
    return descendants;
  };

  // 6) KLT_GOR toggle handler
  const handleToggleKLT_GOR = async (record) => {
    const newKLT_GOR = !record.KLT_GOR;
    const recordsToUpdate = getAllDescendants(record);

    try {
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

      // State'i güncelle
      const updatedData = updateDataKLT_GOR(data, record.KLT_LOKASYON_ID, newKLT_GOR);
      setData(updatedData);

      const updatedFilteredData = updateDataKLT_GOR(filteredData, record.KLT_LOKASYON_ID, newKLT_GOR);
      setFilteredData(updatedFilteredData);
    } catch (error) {
      console.error("Error updating KLT_GOR:", error);
    }
  };

  // 7) Tüm node ID'lerini toplayan fonksiyon
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

  // 8) Arama (search) işlemi
  const handleSearch = () => {
    if (!searchValue) {
      setFilteredData(data);
      setExpandedKeys([]);
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

    const allKeys = getAllKeys(filtered);
    setExpandedKeys(allKeys);
  };

  // 9) Input değişim ve Enter ile arama
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 10) Satır expand/collapse handler
  const handleExpand = (expanded, record) => {
    const key = record.KLT_LOKASYON_ID;
    let newExpandedKeys = [...expandedKeys];

    if (expanded) {
      newExpandedKeys.push(key);
    } else {
      newExpandedKeys = newExpandedKeys.filter((k) => k !== key);
    }

    setExpandedKeys(newExpandedKeys);
  };

  // 11) Sayfa ilk yüklendiğinde / currentUserId değiştiğinde veriyi çek
  useEffect(() => {
    if (currentUserId) {
      fetchData();
    }
  }, [currentUserId]);

  // 12) Tablonun kolonları
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
  ];

  // 13) Render
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
        expandedRowKeys={expandedKeys}
        onExpand={handleExpand}
      />
    </div>
  );
}

export default LokasyonYetkiler1;
